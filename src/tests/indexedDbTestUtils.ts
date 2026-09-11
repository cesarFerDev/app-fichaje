const TEST_DATABASE_PREFIX = "app-fichaje-test";

export function createTestDatabaseName(): string {
  return `${TEST_DATABASE_PREFIX}-${crypto.randomUUID()}`;
}

export function deleteTestDatabase(databaseName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(databaseName);

    request.addEventListener("success", () => resolve());
    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to delete test database"));
    });
    request.addEventListener("blocked", () => {
      reject(new Error(`Test database deletion was blocked: ${databaseName}`));
    });
  });
}

export function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.addEventListener("complete", () => resolve());
    transaction.addEventListener("abort", () => {
      reject(transaction.error ?? new Error("Test transaction was aborted"));
    });
    transaction.addEventListener("error", () => {
      reject(transaction.error ?? new Error("Test transaction failed"));
    });
  });
}
