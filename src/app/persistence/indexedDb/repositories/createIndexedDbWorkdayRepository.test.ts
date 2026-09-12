import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  ActiveWorkday,
  CompletedWorkday,
} from "../../../../domains/work-entry";
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
import { ObjectStoreNames } from "../databaseSchema";
import { openDatabase } from "../openDatabase";
import { createIndexedDbWorkdayRepository } from "./createIndexedDbWorkdayRepository";

const completedWorkday: CompletedWorkday = {
  uuid: "00000000-0000-4000-8000-000000000001",
  dateKey: "2026-09-10",
  startedAt: "2026-09-10T07:00:00.000Z",
  endedAt: "2026-09-10T15:00:00.000Z",
  hourlyRateMinorUnits: 950,
  currency: CurrencyCodes.EUR,
};

const activeWorkday: ActiveWorkday = {
  uuid: "00000000-0000-4000-8000-000000000002",
  dateKey: "2026-09-11",
  startedAt: "2026-09-11T07:00:00.000Z",
  endedAt: null,
  hourlyRateMinorUnits: 950,
  currency: CurrencyCodes.EUR,
};

const anotherActiveWorkday: ActiveWorkday = {
  ...activeWorkday,
  uuid: "00000000-0000-4000-8000-000000000003",
  dateKey: "2026-09-12",
  startedAt: "2026-09-12T07:00:00.000Z",
};

describe("IndexedDB workday repository reads", () => {
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

  it("returns an empty collection when no workdays have been stored", async () => {
    const repository = createIndexedDbWorkdayRepository(database!);

    await expect(repository.getWorkdays()).resolves.toEqual([]);
  });

  it("returns a valid stored workday collection", async () => {
    await seedRawWorkdays(database!, [completedWorkday, activeWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);

    const workdays = await repository.getWorkdays();

    expect(workdays).toHaveLength(2);
    expect(workdays).toEqual(
      expect.arrayContaining([completedWorkday, activeWorkday]),
    );
  });

  it("rejects a collection containing a malformed workday", async () => {
    await seedRawWorkdays(database!, [
      {
        ...activeWorkday,
        startedAt: "not-an-iso-instant",
      },
    ]);
    const repository = createIndexedDbWorkdayRepository(database!);

    const readPromise = repository.getWorkdays();

    await expect(readPromise).rejects.toBeInstanceOf(PersistenceError);
    await expect(readPromise).rejects.toMatchObject({
      operation: PersistenceOperations.Read,
      cause: expect.any(Error),
    });
  });

  it("rejects individually valid workdays when more than one is active", async () => {
    await seedRawWorkdays(database!, [activeWorkday, anotherActiveWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);

    await expect(repository.getWorkdays()).rejects.toBeDefined();
  });
});

describe("IndexedDB workday repository writes", () => {
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

  it("adds an active workday", async () => {
    const repository = createIndexedDbWorkdayRepository(database!);

    await repository.addWorkday(activeWorkday);

    await expect(repository.getWorkdays()).resolves.toEqual([activeWorkday]);
  });

  it("rejects a duplicate UUID and preserves the stored workday", async () => {
    await seedRawWorkdays(database!, [completedWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);
    const duplicateUuid: ActiveWorkday = {
      ...activeWorkday,
      uuid: completedWorkday.uuid,
    };

    await expect(repository.addWorkday(duplicateUuid)).rejects.toBeDefined();
    await expect(repository.getWorkdays()).resolves.toEqual([completedWorkday]);
  });

  it("rejects a duplicate date and preserves the stored workday", async () => {
    await seedRawWorkdays(database!, [completedWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);
    const duplicateDate: ActiveWorkday = {
      ...activeWorkday,
      dateKey: completedWorkday.dateKey,
    };

    await expect(repository.addWorkday(duplicateDate)).rejects.toBeDefined();
    await expect(repository.getWorkdays()).resolves.toEqual([completedWorkday]);
  });

  it("rejects a second active workday with another UUID and date", async () => {
    await seedRawWorkdays(database!, [activeWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);

    await expect(
      repository.addWorkday(anotherActiveWorkday),
    ).rejects.toBeDefined();
    await expect(repository.getWorkdays()).resolves.toEqual([activeWorkday]);
  });

  it("rejects and rolls back when the transaction aborts after add succeeds", async () => {
    abortTransactionAfterSuccessfulAdd();
    const repository = createIndexedDbWorkdayRepository(database!);

    await expect(repository.addWorkday(activeWorkday)).rejects.toBeDefined();
    await expect(repository.getWorkdays()).resolves.toEqual([]);
  });

  it("updates an existing active workday without adding another record", async () => {
    await seedRawWorkdays(database!, [activeWorkday]);
    const repository = createIndexedDbWorkdayRepository(database!);
    const completedUpdate: CompletedWorkday = {
      ...activeWorkday,
      endedAt: "2026-09-11T15:00:00.000Z",
    };

    await repository.updateWorkday(completedUpdate);

    await expect(repository.getWorkdays()).resolves.toEqual([completedUpdate]);
  });

  it("rejects an update for a missing UUID without inserting it", async () => {
    const repository = createIndexedDbWorkdayRepository(database!);

    const updatePromise = repository.updateWorkday(completedWorkday);

    await expect(updatePromise).rejects.toBeInstanceOf(PersistenceError);
    await expect(updatePromise).rejects.toMatchObject({
      operation: PersistenceOperations.Write,
      cause: expect.any(Error),
    });
    await expect(repository.getWorkdays()).resolves.toEqual([]);
  });

  it("rejects and rolls back when the transaction aborts after put succeeds", async () => {
    await seedRawWorkdays(database!, [activeWorkday]);
    abortTransactionAfterSuccessfulPut();
    const repository = createIndexedDbWorkdayRepository(database!);
    const completedUpdate: CompletedWorkday = {
      ...activeWorkday,
      endedAt: "2026-09-11T15:00:00.000Z",
    };

    await expect(
      repository.updateWorkday(completedUpdate),
    ).rejects.toBeDefined();
    await expect(repository.getWorkdays()).resolves.toEqual([activeWorkday]);
  });
});

async function seedRawWorkdays(
  database: IDBDatabase,
  values: readonly unknown[],
): Promise<void> {
  const transaction = database.transaction(
    ObjectStoreNames.Workdays,
    "readwrite",
  );
  const store = transaction.objectStore(ObjectStoreNames.Workdays);

  values.forEach((value) => store.put(value));

  await waitForTransaction(transaction);
}

function abortTransactionAfterSuccessfulAdd(): void {
  const originalAdd = IDBObjectStore.prototype.add;

  vi.spyOn(IDBObjectStore.prototype, "add").mockImplementation(function (
    this: IDBObjectStore,
    value: unknown,
    key?: IDBValidKey,
  ) {
    const request =
      key === undefined
        ? originalAdd.call(this, value)
        : originalAdd.call(this, value, key);

    request.addEventListener("success", () => request.transaction?.abort());
    return request;
  });
}

function abortTransactionAfterSuccessfulPut(): void {
  const originalPut = IDBObjectStore.prototype.put;

  vi.spyOn(IDBObjectStore.prototype, "put").mockImplementation(function (
    this: IDBObjectStore,
    value: unknown,
    key?: IDBValidKey,
  ) {
    const request =
      key === undefined
        ? originalPut.call(this, value)
        : originalPut.call(this, value, key);

    request.addEventListener("success", () => request.transaction?.abort());
    return request;
  });
}
