import {
  workdaysSchema,
  type ActiveWorkday,
  type CompletedWorkday,
  type Workday,
  type WorkdayRepository,
} from "../../../../domains/work-entry";
import {
  normalizePersistenceError,
  PersistenceOperations,
} from "../../PersistenceError";
import { ObjectStoreNames } from "../databaseSchema";

export function createIndexedDbWorkdayRepository(
  database: IDBDatabase,
): WorkdayRepository {
  function getWorkdays(): Promise<readonly Workday[]> {
    return new Promise<readonly Workday[]>((resolve, reject) => {
      let rawValue: unknown;
      const transaction = database.transaction(
        ObjectStoreNames.Workdays,
        "readonly",
      );
      const store = transaction.objectStore(ObjectStoreNames.Workdays);
      const request = store.getAll(); //returns [] if there is no data
      request.addEventListener("success", () => {
        rawValue = request.result;
      });
      request.addEventListener("error", () => {
        reject(request.error ?? new Error("Error getting workdays"));
      });
      transaction.addEventListener("complete", () => {
        const validation = workdaysSchema.safeParse(rawValue);
        if (!validation.success) {
          reject(validation.error);
          return;
        }
        resolve(validation.data);
      });
      transaction.addEventListener("abort", () => {
        reject(
          transaction.error ?? new Error("Workdays transaction was aborted"),
        );
      });

      transaction.addEventListener("error", () => {
        reject(transaction.error ?? new Error("Workdays transaction failed"));
      });
    }).catch((cause: unknown) => {
      throw normalizePersistenceError(PersistenceOperations.Read, cause);
    });
  }

  function addWorkday(newWorkday: ActiveWorkday): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        ObjectStoreNames.Workdays,
        "readwrite",
      );
      const store = transaction.objectStore(ObjectStoreNames.Workdays);

      // The collection check and the insert must share one readwrite
      // transaction. IndexedDB serializes overlapping readwrite transactions,
      // so another caller cannot commit a second active workday between them.
      const readRequest = store.getAll();

      readRequest.addEventListener("success", () => {
        const candidateCollection = [...readRequest.result, newWorkday];
        const validation = workdaysSchema.safeParse(candidateCollection);

        if (!validation.success) {
          reject(validation.error);
          transaction.abort();
          return;
        }

        // IndexedDB keeps this transaction active while handling one of its
        // request events. Queueing add here keeps it in the same atomic
        // transaction as getAll; unrelated async work could let it auto-commit.
        const addRequest = store.add(newWorkday);

        addRequest.addEventListener("error", () => {
          reject(addRequest.error ?? new Error("Workday addition failed"));
        });
      });
      readRequest.addEventListener("error", () => {
        reject(
          readRequest.error ?? new Error("Workday collection read failed"),
        );
      });

      // A successful add request is still provisional. Only transaction
      // completion confirms that IndexedDB committed the workday.
      transaction.addEventListener("complete", () => {
        resolve();
      });
      transaction.addEventListener("abort", () => {
        reject(
          transaction.error ??
            new Error("Workday addition transaction was aborted"),
        );
      });

      transaction.addEventListener("error", () => {
        reject(
          transaction.error ?? new Error("Workday addition transaction failed"),
        );
      });
    }).catch((cause: unknown) => {
      throw normalizePersistenceError(PersistenceOperations.Write, cause);
    });
  }

  function updateWorkday(updatedWorkday: CompletedWorkday): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(
        ObjectStoreNames.Workdays,
        "readwrite",
      );
      const store = transaction.objectStore(ObjectStoreNames.Workdays);

      // put is an upsert in IndexedDB. Looking up the UUID first preserves the
      // repository contract that update must not insert a missing workday.
      const findRequest = store.get(updatedWorkday.uuid);

      findRequest.addEventListener("success", () => {
        if (findRequest.result === undefined) {
          reject(new Error("Workday does not exist"));
          transaction.abort();
          return;
        }

        // Queue put from the request event so the existence check and update
        // remain in the same active, atomic IndexedDB transaction.
        const updateRequest = store.put(updatedWorkday);

        updateRequest.addEventListener("error", () => {
          reject(updateRequest.error ?? new Error("Workday update failed"));
        });
      });
      findRequest.addEventListener("error", () => {
        reject(findRequest.error ?? new Error("Workday search failed"));
        transaction.abort();
      });
      transaction.addEventListener("complete", () => {
        resolve();
      });
      transaction.addEventListener("abort", () => {
        reject(
          transaction.error ??
            new Error("Workday update transaction was aborted"),
        );
      });

      transaction.addEventListener("error", () => {
        reject(
          transaction.error ?? new Error("Workday update transaction failed"),
        );
      });
    }).catch((cause: unknown) => {
      throw normalizePersistenceError(PersistenceOperations.Write, cause);
    });
  }

  return {
    getWorkdays,
    addWorkday,
    updateWorkday,
  };
}
