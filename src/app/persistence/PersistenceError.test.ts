import { describe, expect, it } from "vitest";
import {
  normalizePersistenceError,
  PersistenceError,
  PersistenceOperations,
} from "./PersistenceError";

describe("PersistenceError", () => {
  it("retains the generic operation and original cause", () => {
    const cause = new DOMException("Database unavailable", "UnknownError");

    const error = new PersistenceError(PersistenceOperations.Open, cause);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PersistenceError");
    expect(error.operation).toBe(PersistenceOperations.Open);
    expect(error.cause).toBe(cause);
  });

  it("does not wrap an already normalized persistence error", () => {
    const originalError = new PersistenceError(
      PersistenceOperations.Read,
      new Error("Stored data is invalid"),
    );

    const normalizedError = normalizePersistenceError(
      PersistenceOperations.Write,
      originalError,
    );

    expect(normalizedError).toBe(originalError);
  });
});
