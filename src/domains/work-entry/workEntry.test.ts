import { describe, expect, it, vi } from "vitest";
import { createLocalDateKey } from "./utils/createLocalDateKey";

/*
 * Phase 1 learning path
 *
 * Turn one todo at a time into a real test. Before importing production code,
 * decide what the smallest public input and output of that behavior should be.
 * Keep every clock value, generated ID, and timezone assumption controlled by
 * the test instead of reading the developer machine implicitly.
 *
 * These scenarios intentionally do not prescribe function names or file
 * boundaries. Defining that domain API is part of the learning checkpoint.
 */

describe("work-entry domain", () => {
  describe("trusted settings", () => {
    it.todo(
      "represents a confirmed hourly rate as positive integer minor units and EUR",
    );

    it.todo("converts the suggested 9,00 EUR draft into 900 minor units");

    it.todo(
      "converts another valid draft without losing one or two decimal places",
    );

    it.todo(
      "rejects an empty, zero, negative, textual, non-finite, or over-precise rate draft",
    );
  });

  describe("local workday date", () => {
    it("builds a YYYY-MM-DD key from the local calendar date", () => {
      const date = new Date(2026, 0, 1, 12, 0, 0);
      const dateKey = createLocalDateKey(date);
      expect(dateKey).toBe("2026-01-01");
    });
    it("rejects an invalid date", () => {
      const invalidDate = new Date("invalid");

      expect(() => createLocalDateKey(invalidDate)).toThrow(RangeError);
    });
    it("keeps the local date correct when the corresponding UTC day is different", () => {
      vi.stubEnv("TZ", "Europe/Madrid");

      try {
        const date = new Date("2026-09-07T22:30:00.000Z");

        expect(date.toISOString().slice(0, 10)).toBe("2026-09-07");
        expect(createLocalDateKey(date)).toBe("2026-09-08");
      } finally {
        vi.unstubAllEnvs();
      }
    });
  });

  describe("starting a workday", () => {
    it.todo(
      "creates one active workday with a stable ID, local date key, ISO start instant, and rate snapshot",
    );

    it.todo("rejects starting while any earlier workday is still active");

    it.todo("rejects starting when today's workday is already completed");
  });

  describe("finishing a workday", () => {
    it.todo("finishes an active workday with a later ISO instant");

    it.todo("rejects a finish instant equal to its start instant");

    it.todo("rejects a finish instant earlier than its start instant");

    it.todo("rejects finishing a workday that is already completed");
  });

  describe("derived duration and recovery", () => {
    it.todo(
      "derives an active duration from the persisted start instant and an injected current instant",
    );

    it.todo(
      "derives a completed duration from persisted start and finish instants",
    );

    it.todo(
      "preserves the original start instant when deriving state from a recovered active workday",
    );
  });
});
