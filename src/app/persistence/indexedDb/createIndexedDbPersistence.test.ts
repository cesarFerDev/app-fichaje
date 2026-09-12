import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Settings } from "../../../domains/settings";
import type { ActiveWorkday } from "../../../domains/work-entry";
import { CurrencyCodes } from "../../../shared/types/currency";
import {
  createTestDatabaseName,
  deleteTestDatabase,
} from "../../../tests/indexedDbTestUtils";
import { PersistenceError, PersistenceOperations } from "../PersistenceError";
import {
  createIndexedDbPersistence,
  type IndexedDbPersistence,
} from "./createIndexedDbPersistence";

const settings: Settings = {
  defaultHourlyRateMinorUnits: 950,
  defaultCurrency: CurrencyCodes.EUR,
};

const activeWorkday: ActiveWorkday = {
  uuid: "00000000-0000-4000-8000-000000000001",
  dateKey: "2026-09-12",
  startedAt: "2026-09-12T07:00:00.000Z",
  endedAt: null,
  hourlyRateMinorUnits: 950,
  currency: CurrencyCodes.EUR,
};

describe("IndexedDB persistence composition", () => {
  let databaseName: string;
  let persistence: IndexedDbPersistence | undefined;

  beforeEach(() => {
    databaseName = createTestDatabaseName();
  });

  afterEach(async () => {
    persistence?.close();
    await deleteTestDatabase(databaseName);
  });

  it("creates usable settings and workday repositories", async () => {
    persistence = await createIndexedDbPersistence(databaseName);

    await persistence.settingsRepository.saveSettings(settings);
    await persistence.workdayRepository.addWorkday(activeWorkday);

    await expect(persistence.settingsRepository.getSettings()).resolves.toEqual(
      settings,
    );
    await expect(persistence.workdayRepository.getWorkdays()).resolves.toEqual([
      activeWorkday,
    ]);
  });

  it("keeps the raw database connection private", async () => {
    persistence = await createIndexedDbPersistence(databaseName);

    expect(persistence).not.toHaveProperty("database");
  });

  it("closes the shared connection for both repositories", async () => {
    persistence = await createIndexedDbPersistence(databaseName);

    persistence.close();

    await expect(
      persistence.settingsRepository.getSettings(),
    ).rejects.toMatchObject({ operation: PersistenceOperations.Read });
    await expect(
      persistence.workdayRepository.getWorkdays(),
    ).rejects.toMatchObject({ operation: PersistenceOperations.Read });
  });

  it("preserves a normalized database opening failure", async () => {
    const cause = new DOMException("Database unavailable", "UnknownError");
    vi.spyOn(indexedDB, "open").mockImplementation(() => {
      throw cause;
    });

    const creationPromise = createIndexedDbPersistence(databaseName);

    await expect(creationPromise).rejects.toBeInstanceOf(PersistenceError);
    await expect(creationPromise).rejects.toMatchObject({
      operation: PersistenceOperations.Open,
      cause,
    });
  });
});
