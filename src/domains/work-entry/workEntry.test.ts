import { describe, expect, it, vi } from "vitest";
import { CurrencyCodes } from "../../shared/types/currency";
import type { Workday } from "./types";
import {
  calculateWorkdayDuration,
  CalculateWorkdayDurationFailureReasons,
} from "./utils/calculateWorkdayDuration";
import { createLocalDateKey } from "./utils/createLocalDateKey";
import {
  finishWorkday,
  FinishWorkdayFailureReasons,
} from "./utils/finishWorkday";
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

      const expectedWorkday: Workday = {
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
      const existingWorkday: Workday = {
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

      const completedWorkday: Workday = {
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
    const workday: Workday = {
      id: "active-workday-id",
      dateKey: "2026-01-01",
      startedAt: "2026-01-01T08:30:00.000Z",
      endedAt: null,
      hourlyRateMinorUnits: 950,
      currency: CurrencyCodes.EUR,
    };
    it("finishes an active workday with a later ISO instant", () => {
      const endWorkdayDate = new Date("2026-01-01T17:30:00.000Z");
      expect(finishWorkday(workday, endWorkdayDate)).toEqual({
        success: true,
        workday: {
          ...workday,
          endedAt: endWorkdayDate.toISOString(),
        },
      });
    });

    it.each([
      ["equal", new Date("2026-01-01T08:30:00.000Z")],
      ["earlier", new Date("2026-01-01T07:30:00.000Z")],
    ])(
      "rejects a finish instant %s to its start instant",
      (_relation, finishInstant) => {
        const result = finishWorkday(workday, finishInstant);

        expect(result).toEqual({
          success: false,
          reason:
            FinishWorkdayFailureReasons.WorkdayEndedIsPreviousOrEqualToStarted,
        });
      },
    );

    it("rejects finishing a workday that is already completed", () => {
      const completedWorkday: Workday = {
        ...workday,
        endedAt: "2026-01-01T17:30:00.000Z",
      };
      const finishInstant = new Date("2026-01-01T18:30:00.000Z");
      expect(finishWorkday(completedWorkday, finishInstant)).toEqual({
        success: false,
        reason: FinishWorkdayFailureReasons.WorkdayAlreadyCompleted,
      });
    });
  });

  describe("derived duration and recovery", () => {
    const workday: Workday = {
      id: "active-workday-id",
      dateKey: "2026-01-01",
      startedAt: "2026-01-01T08:30:00.000Z",
      endedAt: null,
      hourlyRateMinorUnits: 950,
      currency: CurrencyCodes.EUR,
    };
    it("derives an active duration from the persisted start instant and an injected current instant", () => {
      const currentInstant = new Date("2026-01-01T12:30:00.000Z");
      const expectedDurationInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      expect(calculateWorkdayDuration(workday, currentInstant)).toEqual({
        success: true,
        durationMs: expectedDurationInMs,
      });
    });

    it.each([
      ["before its start", new Date("2026-01-01T07:30:00.000Z")],
      ["after its end", new Date("2026-01-01T18:30:00.000Z")],
    ])(
      "derives a completed duration when current instant is %s",
      (_position, currentInstant) => {
        const completedWorkday: Workday = {
          ...workday,
          endedAt: "2026-01-01T17:30:00.000Z",
        };
        const expectedDurationInMs = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
        expect(
          calculateWorkdayDuration(completedWorkday, currentInstant),
        ).toEqual({
          success: true,
          durationMs: expectedDurationInMs,
        });
      },
    );
    it("rejects a current instant that is previous to the persisted start instant", () => {
      const currentInstant = new Date("2026-01-01T07:30:00.000Z");
      expect(calculateWorkdayDuration(workday, currentInstant)).toEqual({
        success: false,
        reason:
          CalculateWorkdayDurationFailureReasons.CurrentInstantIsPreviousToWorkdayStarted,
      });
    });
  });
});
