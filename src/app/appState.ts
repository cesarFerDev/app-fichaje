import { createContext } from "react";
import type {
  AppData,
  DayException,
  Settings,
  WorkRecord,
} from "../domain/work";

export type AppContextValue = {
  data: AppData;
  loading: boolean;
  createRecord: (date: string, start?: string) => void;
  updateRecord: (record: WorkRecord) => void;
  deleteRecord: (id: string) => void;
  updateSettings: (settings: Settings) => void;
  setExceptions: (exceptions: DayException[]) => void;
  restore: (data: AppData) => void;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);
