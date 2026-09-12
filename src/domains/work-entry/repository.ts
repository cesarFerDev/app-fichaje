import type { ActiveWorkday, CompletedWorkday, Workday } from "./types";

export type WorkdayRepository = {
  getWorkdays: () => Promise<readonly Workday[]>;
  addWorkday: (workday: ActiveWorkday) => Promise<void>;
  updateWorkday: (workday: CompletedWorkday) => Promise<void>;
};
