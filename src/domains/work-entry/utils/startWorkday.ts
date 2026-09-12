import type { Settings } from "../../settings";
import type { ActiveWorkday, DomainResult, Workday } from "../types";
import { createLocalDateKey } from "./createLocalDateKey";

type StartWorkdayParams = {
  uuid: string;
  startInstant: Date;
  settings: Settings;
  existingWorkdays: readonly Workday[];
};

export const StartWorkdayFailureReasons = {
  ActiveWorkdayExists: "activeWorkdayExists",
  TodayWorkdayExists: "todayWorkdayExists",
} as const;

type StartWorkdayFailureReason =
  (typeof StartWorkdayFailureReasons)[keyof typeof StartWorkdayFailureReasons];

type StartWorkdaySuccessPayload = { workday: ActiveWorkday };

type StartWorkdayResult = DomainResult<
  StartWorkdaySuccessPayload,
  StartWorkdayFailureReason
>;

export function startWorkday({
  uuid,
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
      uuid,
      dateKey,
      startedAt: startInstant.toISOString(),
      endedAt: null,
      hourlyRateMinorUnits: settings.defaultHourlyRateMinorUnits,
      currency: settings.defaultCurrency,
    },
  };
}
