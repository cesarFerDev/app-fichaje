export const DATABASE_NAME = "app-fichaje";
export const DATABASE_VERSION = 1;

export const ObjectStoreNames = {
  Settings: "settings",
  Workdays: "workdays",
} as const;

export const SettingsKeys = {
  Current: "current",
} as const;

export const WorkdayIndexNames = {
  DateKey: "dateKey",
} as const;
