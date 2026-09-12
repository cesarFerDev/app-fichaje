import type { SettingsRepository } from "../../../domains/settings";
import type { WorkdayRepository } from "../../../domains/work-entry";
import { DATABASE_NAME } from "./databaseSchema";
import { openDatabase } from "./openDatabase";
import { createIndexedDbSettingsRepository } from "./repositories/createIndexedDbSettingsRepository";
import { createIndexedDbWorkdayRepository } from "./repositories/createIndexedDbWorkdayRepository";

export type IndexedDbPersistence = {
  settingsRepository: SettingsRepository;
  workdayRepository: WorkdayRepository;
  close: () => void;
};

export async function createIndexedDbPersistence(
  databaseName: string = DATABASE_NAME,
): Promise<IndexedDbPersistence> {
  const database = await openDatabase(databaseName);
  const settingsRepository = createIndexedDbSettingsRepository(database);
  const workdayRepository = createIndexedDbWorkdayRepository(database);
  return {
    settingsRepository,
    workdayRepository,
    close: () => database.close(),
  };
}
