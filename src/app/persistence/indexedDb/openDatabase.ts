import { DATABASE_NAME } from "./databaseSchema";

export function openDatabase(
  databaseName: string = DATABASE_NAME,
): Promise<IDBDatabase> {
  void databaseName;
  return Promise.reject(new Error("openDatabase is not implemented"));
}
