import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Settings } from "../../../../domains/settings";
import { CurrencyCodes } from "../../../../shared/types/currency";
import {
  createTestDatabaseName,
  deleteTestDatabase,
  waitForTransaction,
} from "../../../../tests/indexedDbTestUtils";
import {
  PersistenceError,
  PersistenceOperations,
} from "../../PersistenceError";
import { ObjectStoreNames, SettingsKeys } from "../databaseSchema";
import { openDatabase } from "../openDatabase";
import { createIndexedDbSettingsRepository } from "./createIndexedDbSettingsRepository";

const validSettings: Settings = {
  defaultHourlyRateMinorUnits: 950,
  defaultCurrency: CurrencyCodes.EUR,
};

describe("IndexedDB settings repository reads", () => {
  let databaseName: string;
  let database: IDBDatabase | undefined;

  beforeEach(async () => {
    databaseName = createTestDatabaseName();
    database = await openDatabase(databaseName);
  });

  afterEach(async () => {
    database?.close();
    await deleteTestDatabase(databaseName);
  });

  it("returns null when settings have not been stored", async () => {
    const repository = createIndexedDbSettingsRepository(database!);

    await expect(repository.getSettings()).resolves.toBeNull();
  });

  it("returns valid stored settings", async () => {
    await seedRawSettings(database!, validSettings);
    const repository = createIndexedDbSettingsRepository(database!);

    await expect(repository.getSettings()).resolves.toEqual(validSettings);
  });

  it("rejects settings that fail runtime validation", async () => {
    await seedRawSettings(database!, {
      defaultHourlyRateMinorUnits: 0,
      defaultCurrency: CurrencyCodes.EUR,
    });
    const repository = createIndexedDbSettingsRepository(database!);

    const readPromise = repository.getSettings();

    await expect(readPromise).rejects.toBeInstanceOf(PersistenceError);
    await expect(readPromise).rejects.toMatchObject({
      operation: PersistenceOperations.Read,
      cause: expect.any(Error),
    });
  });
});

describe("IndexedDB settings repository writes", () => {
  let databaseName: string;
  let database: IDBDatabase | undefined;

  beforeEach(async () => {
    databaseName = createTestDatabaseName();
    database = await openDatabase(databaseName);
  });

  afterEach(async () => {
    database?.close();
    await deleteTestDatabase(databaseName);
  });

  it("stores settings and makes them available to later reads", async () => {
    const repository = createIndexedDbSettingsRepository(database!);

    await repository.saveSettings(validSettings);

    await expect(repository.getSettings()).resolves.toEqual(validSettings);
  });

  it("replaces the current settings instead of adding another record", async () => {
    const repository = createIndexedDbSettingsRepository(database!);
    const updatedSettings: Settings = {
      defaultHourlyRateMinorUnits: 1_250,
      defaultCurrency: CurrencyCodes.EUR,
    };

    await repository.saveSettings(validSettings);
    await repository.saveSettings(updatedSettings);

    await expect(repository.getSettings()).resolves.toEqual(updatedSettings);
    await expect(countRawSettings(database!)).resolves.toBe(1);
  });

  it("rejects and rolls back when the transaction aborts after put succeeds", async () => {
    const putSpy = vi.spyOn(IDBObjectStore.prototype, "put");
    const repository = createIndexedDbSettingsRepository(database!);

    const savePromise = repository.saveSettings(validSettings);
    const observedSavePromise = savePromise.then(
      () => "resolved" as const,
      () => "rejected" as const,
    );

    expect(putSpy).toHaveBeenCalledOnce();
    const request = putSpy.mock.results[0]?.value;
    expect(request).toBeInstanceOf(IDBRequest);
    request?.addEventListener("success", () => request.transaction?.abort());

    await expect(observedSavePromise).resolves.toBe("rejected");
    await expect(repository.getSettings()).resolves.toBeNull();
  });

  it("normalizes a native IndexedDB write failure", async () => {
    const repository = createIndexedDbSettingsRepository(database!);
    database!.close();

    const savePromise = repository.saveSettings(validSettings);

    await expect(savePromise).rejects.toBeInstanceOf(PersistenceError);
    await expect(savePromise).rejects.toMatchObject({
      operation: PersistenceOperations.Write,
      cause: expect.any(DOMException),
    });
  });
});

async function seedRawSettings(
  database: IDBDatabase,
  value: unknown,
): Promise<void> {
  const transaction = database.transaction(
    ObjectStoreNames.Settings,
    "readwrite",
  );
  transaction
    .objectStore(ObjectStoreNames.Settings)
    .put(value, SettingsKeys.Current);

  await waitForTransaction(transaction);
}

async function countRawSettings(database: IDBDatabase): Promise<number> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(
      ObjectStoreNames.Settings,
      "readonly",
    );
    const request = transaction.objectStore(ObjectStoreNames.Settings).count();

    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to count stored settings"));
    });
  });
}
