import type { CompletedWorkday, DomainResult, Workday } from "../types";

export const FinishWorkdayFailureReasons = {
  WorkdayEndedIsPreviousOrEqualToStarted:
    "workdayEndedIsPreviousOrEqualToStarted",
  WorkdayAlreadyCompleted: "workdayAlreadyCompleted",
} as const;

type FinishWorkdayFailureReason =
  (typeof FinishWorkdayFailureReasons)[keyof typeof FinishWorkdayFailureReasons];

type FinishWorkdaySuccessPayload = { workday: CompletedWorkday };

type FinishWorkdayResult = DomainResult<
  FinishWorkdaySuccessPayload,
  FinishWorkdayFailureReason
>;

export function finishWorkday(
  workday: Workday,
  finishInstant: Date,
): FinishWorkdayResult {
  if (workday.endedAt !== null) {
    return {
      success: false,
      reason: FinishWorkdayFailureReasons.WorkdayAlreadyCompleted,
    };
  }
  const startedAtInstant = new Date(workday.startedAt);
  if (finishInstant <= startedAtInstant) {
    return {
      success: false,
      reason:
        FinishWorkdayFailureReasons.WorkdayEndedIsPreviousOrEqualToStarted,
    };
  }
  return {
    success: true,
    workday: {
      ...workday,
      endedAt: finishInstant.toISOString(),
    },
  };
}
