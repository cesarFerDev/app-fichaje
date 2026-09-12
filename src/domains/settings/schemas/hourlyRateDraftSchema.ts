import { z } from "zod";
import { convertRateToMinorUnits } from "../utils/convertRateToMinorUnits";

export const hourlyRateDraftSchema = z
  .string()
  .trim()
  .regex(/^\d+(?:[.,]\d{1,2})?$/)
  .transform(convertRateToMinorUnits)
  .refine((minorUnits) => minorUnits > 0)
  .refine((minorUnits) => Number.isSafeInteger(minorUnits));
