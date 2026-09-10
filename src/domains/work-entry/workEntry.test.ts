import { describe, expect, it, vi } from "vitest";
import { CurrencyCodes } from "../../shared/types/currency";
import { createLocalDateKey } from "./utils/createLocalDateKey";
import { startWorkday, StartWorkdayFailureReasons } from "./utils/startWorkday";

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
    const settings = {
      defaultHourlyRateMinorUnits: 950,
      defaultCurrency: CurrencyCodes.EUR,
    };
    const id = "new-workday-id";
    it("creates one active workday with a stable ID, local date key, ISO start instant, and rate snapshot", () => {
      const startInstant = new Date(2026, 0, 1, 12, 0, 0);

      const expectedWorkday = {
        id,
        dateKey: "2026-01-01",
        startedAt: startInstant.toISOString(),
        endedAt: null,
        hourlyRateMinorUnits: settings.defaultHourlyRateMinorUnits,
        currency: settings.defaultCurrency,
      };
      expect(
        startWorkday({
          id,
          startInstant,
          settings,
          existingWorkdays: [],
        }),
      ).toEqual({
        success: true,
        workday: expectedWorkday,
      });
    });

    it("rejects starting while any earlier workday is still active", () => {
      const candidateStartInstant = new Date(2026, 0, 2, 12, 0, 0);
      const existingStartInstant = new Date(2026, 0, 1, 12, 0, 0);
      const existingWorkday = {
        id: "existing-workday-id",
        dateKey: "2026-01-01",
        startedAt: existingStartInstant.toISOString(),
        endedAt: null,
        hourlyRateMinorUnits: settings.defaultHourlyRateMinorUnits,
        currency: settings.defaultCurrency,
      };
      expect(
        startWorkday({
          id,
          startInstant: candidateStartInstant,
          settings,
          existingWorkdays: [existingWorkday],
        }),
      ).toEqual({
        success: false,
        reason: StartWorkdayFailureReasons.ActiveWorkdayExists,
      });
    });

    it("rejects starting when today's workday is already completed", () => {
      const existingStartInstant = new Date(2026, 0, 1, 12, 0, 0);
      const existingEndInstant = new Date(2026, 0, 1, 20, 0, 0);
      const candidateStartInstant = new Date(2026, 0, 1, 21, 0, 0);

      const completedWorkday = {
        id: "today-ended-workday-id",
        dateKey: "2026-01-01",
        startedAt: existingStartInstant.toISOString(),
        endedAt: existingEndInstant.toISOString(),
        hourlyRateMinorUnits: settings.defaultHourlyRateMinorUnits,
        currency: settings.defaultCurrency,
      };
      expect(
        startWorkday({
          id,
          startInstant: candidateStartInstant,
          settings,
          existingWorkdays: [completedWorkday],
        }),
      ).toEqual({
        success: false,
        reason: StartWorkdayFailureReasons.TodayWorkdayExists,
      });
    });
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
