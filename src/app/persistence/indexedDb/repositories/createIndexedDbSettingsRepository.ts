import {
  settingsSchema,
  type Settings,
  type SettingsRepository,
} from "../../../../domains/settings";
import {
  normalizePersistenceError,
  PersistenceOperations,
} from "../../PersistenceError";
import { ObjectStoreNames, SettingsKeys } from "../databaseSchema";

export function createIndexedDbSettingsRepository(
  database: IDBDatabase,
): SettingsRepository {
  function getSettings(): Promise<Settings | null> {
    return new Promise<Settings | null>((resolve, reject) => {
      let rawValue: unknown;
      const transaction = database.transaction(
        ObjectStoreNames.Settings,
        "readonly",
      );
      const store = transaction.objectStore(ObjectStoreNames.Settings);
      const request = store.get(SettingsKeys.Current);
      request.addEventListener("success", () => {
        rawValue = request.result;
      });
      request.addEventListener("error", () => {
        reject(request.error ?? new Error("Error getting settings"));
      });
      transaction.addEventListener("complete", () => {
        if (rawValue === undefined) {
          resolve(null);
          return;
        }
        const validation = settingsSchema.safeParse(rawValue);
        if (!validation.success) {
          reject(validation.error);
          return;
        }
        resolve(validation.data);
      });
      transaction.addEventListener("abort", () => {
        reject(
          transaction.error ?? new Error("Settings transaction was aborted"),
        );
      });

      transaction.addEventListener("error", () => {
        reject(transaction.error ?? new Error("Settings transaction failed"));
      });
    }).catch((cause: unknown) => {
      throw normalizePersistenceError(PersistenceOperations.Read, cause);
    });
  }

  function saveSettings(newSettings: Settings): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        ObjectStoreNames.Settings,
        "readwrite",
      );
      const store = transaction.objectStore(ObjectStoreNames.Settings);
      const request = store.put(newSettings, SettingsKeys.Current);

      request.addEventListener("error", () =>
        reject(request.error ?? new Error("Settings write failed")),
      );
      transaction.addEventListener("complete", () => {
        resolve();
      });
      transaction.addEventListener("abort", () => {
        reject(
          transaction.error ?? new Error("Settings transaction was aborted"),
        );
      });

      transaction.addEventListener("error", () => {
        reject(transaction.error ?? new Error("Settings transaction failed"));
      });
    }).catch((cause: unknown) => {
      throw normalizePersistenceError(PersistenceOperations.Write, cause);
    });
  }

  return {
    getSettings,
    saveSettings,
  };
}
