import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  createTestDatabaseName,
  deleteTestDatabase,
} from "../../../tests/indexedDbTestUtils";
import {
  DATABASE_VERSION,
  ObjectStoreNames,
  WorkdayIndexNames,
} from "./databaseSchema";
import { openDatabase } from "./openDatabase";

describe("IndexedDB schema", () => {
  let databaseName: string;
  let database: IDBDatabase | undefined;

  beforeEach(() => {
    databaseName = createTestDatabaseName();
  });

  afterEach(async () => {
    database?.close();
    await deleteTestDatabase(databaseName);
  });

  it("gives every test an isolated database name", () => {
    expect(createTestDatabaseName()).not.toBe(databaseName);
  });

  it("opens a new database at version 1 with only the required stores", async () => {
    database = await openDatabase(databaseName);

    expect(database.version).toBe(DATABASE_VERSION);
    expect(Array.from(database.objectStoreNames)).toEqual([
      ObjectStoreNames.Settings,
      ObjectStoreNames.Workdays,
    ]);
  });

  it("reopens an existing database at the same version without recreating its schema", async () => {
    database = await openDatabase(databaseName);
    database.close();

    database = await openDatabase(databaseName);

    expect(database.version).toBe(DATABASE_VERSION);
    expect(Array.from(database.objectStoreNames)).toEqual([
      ObjectStoreNames.Settings,
      ObjectStoreNames.Workdays,
    ]);
  });

  it("configures settings as a singleton value with an external key", async () => {
    database = await openDatabase(databaseName);
    const transaction = database.transaction(
      ObjectStoreNames.Settings,
      "readonly",
    );
    const settingsStore = transaction.objectStore(ObjectStoreNames.Settings);

    expect(settingsStore.keyPath).toBeNull();
    expect(settingsStore.autoIncrement).toBe(false);
  });

  it("configures workdays by UUID with a unique local-date index", async () => {
    database = await openDatabase(databaseName);
    const transaction = database.transaction(
      ObjectStoreNames.Workdays,
      "readonly",
    );
    const workdaysStore = transaction.objectStore(ObjectStoreNames.Workdays);
    const dateKeyIndex = workdaysStore.index(WorkdayIndexNames.DateKey);

    expect(workdaysStore.keyPath).toBe("uuid");
    expect(workdaysStore.autoIncrement).toBe(false);
    expect(dateKeyIndex.keyPath).toBe("dateKey");
    expect(dateKeyIndex.unique).toBe(true);
  });
});
