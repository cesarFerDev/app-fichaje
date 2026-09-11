import {
  DATABASE_NAME,
  DATABASE_VERSION,
  ObjectStoreNames,
  WorkdayIndexNames,
} from "./databaseSchema";

export function openDatabase(
  databaseName: string = DATABASE_NAME,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, DATABASE_VERSION);
    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      database.createObjectStore(ObjectStoreNames.Settings);
      const workdaysStore = database.createObjectStore(
        ObjectStoreNames.Workdays,
        { keyPath: "uuid" },
      );
      workdaysStore.createIndex(WorkdayIndexNames.DateKey, "dateKey", {
        unique: true,
      });
    });
    request.addEventListener("success", () => {
      resolve(request.result);
    });

    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    });
  });
}
