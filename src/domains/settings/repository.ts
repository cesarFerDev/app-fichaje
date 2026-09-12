import type { Settings } from "./types";

export type SettingsRepository = {
  getSettings: () => Promise<Settings | null>;
  saveSettings: (settings: Settings) => Promise<void>;
};
