import type { AppData } from "../domain/work";

const databaseName = "app-fichaje";
const storeName = "app-data";
const key = "snapshot";

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const loadSnapshot = async (): Promise<AppData | undefined> => {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction(storeName, "readonly")
      .objectStore(storeName)
      .get(key);
    request.onsuccess = () => resolve(request.result as AppData | undefined);
    request.onerror = () => reject(request.error);
  });
};

export const saveSnapshot = async (data: AppData) => {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database
      .transaction(storeName, "readwrite")
      .objectStore(storeName)
      .put(data, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
