import { z, ZodType } from "zod";
import { CurrencyCodes } from "../../../shared/types/currency";
import type { Settings } from "../types";

export const settingsSchema: ZodType<Settings> = z.strictObject({
  defaultHourlyRateMinorUnits: z.number().int().positive(),
  defaultCurrency: z.enum(CurrencyCodes),
});
