import type { Settings } from "../../settings";
import type { ActiveWorkday, Workday } from "../types";
import { createLocalDateKey } from "./createLocalDateKey";

type StartWorkdayParams = {
  id: string;
  startInstant: Date;
  settings: Settings;
  existingWorkdays: readonly Workday[];
};

type StartWorkdayResult =
  | { success: true; workday: ActiveWorkday }
  | { success: false; reason: StartWorkdayFailureReason };

export const StartWorkdayFailureReasons = {
  ActiveWorkdayExists: "activeWorkdayExists",
  TodayWorkdayExists: "todayWorkdayExists",
} as const;

type StartWorkdayFailureReason =
  (typeof StartWorkdayFailureReasons)[keyof typeof StartWorkdayFailureReasons];

export function startWorkday({
  id,
  startInstant,
  settings,
  existingWorkdays,
}: StartWorkdayParams): StartWorkdayResult {
  const dateKey = createLocalDateKey(startInstant);
  const hasActiveWorkday = existingWorkdays.some(
    (workday) => workday.endedAt === null,
  );
  if (hasActiveWorkday) {
    return {
      success: false,
      reason: StartWorkdayFailureReasons.ActiveWorkdayExists,
    };
  }
  const hasCompletedWorkdayForToday = existingWorkdays.some(
    (workday) => workday.dateKey === dateKey && workday.endedAt !== null,
  );
  if (hasCompletedWorkdayForToday) {
    return {
      success: false,
      reason: StartWorkdayFailureReasons.TodayWorkdayExists,
    };
  }
  return {
    success: true,
    workday: {
      id,
      dateKey,
      startedAt: startInstant.toISOString(),
      endedAt: null,
      hourlyRateMinorUnits: settings.defaultHourlyRateMinorUnits,
      currency: settings.defaultCurrency,
    },
  };
}
