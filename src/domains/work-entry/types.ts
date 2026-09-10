import type { CurrencyCode } from "../../shared/types/currency";

export type WorkdayBase = {
  id: string;
  dateKey: string;
  startedAt: string;
  hourlyRateMinorUnits: number;
  currency: CurrencyCode;
};

export type ActiveWorkday = WorkdayBase & {
  endedAt: null;
};

export type CompletedWorkday = WorkdayBase & {
  endedAt: string;
};

export type Workday = ActiveWorkday | CompletedWorkday;
