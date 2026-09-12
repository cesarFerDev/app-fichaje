export const PersistenceOperations = {
  Open: "open",
  Read: "read",
  Write: "write",
} as const;

export type PersistenceOperation =
  (typeof PersistenceOperations)[keyof typeof PersistenceOperations];

export class PersistenceError extends Error {
  readonly operation: PersistenceOperation;

  constructor(operation: PersistenceOperation, cause: unknown) {
    super(`Persistence ${operation} operation failed`, { cause });
    this.name = "PersistenceError";
    this.operation = operation;
  }
}

export function normalizePersistenceError(
  operation: PersistenceOperation,
  cause: unknown,
): PersistenceError {
  if (cause instanceof PersistenceError) {
    return cause;
  }

  return new PersistenceError(operation, cause);
}
