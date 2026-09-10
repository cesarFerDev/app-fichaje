import type { DomainResult, Workday } from "../types";

export const CalculateWorkdayDurationFailureReasons = {
  CurrentInstantIsPreviousToWorkdayStarted:
    "currentInstantIsPreviousToWorkdayStarted",
} as const;

type CalculateWorkdayDurationFailureReason =
  (typeof CalculateWorkdayDurationFailureReasons)[keyof typeof CalculateWorkdayDurationFailureReasons];

type CalculateWorkdayDurationSuccessPayload = { durationMs: number };

type CalculateWorkdayDurationResult = DomainResult<
  CalculateWorkdayDurationSuccessPayload,
  CalculateWorkdayDurationFailureReason
>;

export function calculateWorkdayDuration(
  workday: Workday,
  currentInstant: Date,
): CalculateWorkdayDurationResult {
  const startedAtInstant = new Date(workday.startedAt);
  const referenceInstant =
    workday.endedAt !== null ? new Date(workday.endedAt) : currentInstant;
  if (workday.endedAt === null && currentInstant < startedAtInstant) {
    return {
      success: false,
      reason:
        CalculateWorkdayDurationFailureReasons.CurrentInstantIsPreviousToWorkdayStarted,
    };
  }
  return {
    success: true,
    durationMs: referenceInstant.getTime() - startedAtInstant.getTime(),
  };
}
