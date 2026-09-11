import { z } from "zod";
import { CurrencyCodes } from "../../../shared/types/currency";
import type { Workday } from "../types";

const workdayBaseShape = {
  uuid: z.uuid(),
  dateKey: z.iso.date(),
  startedAt: z.iso.datetime(),
  hourlyRateMinorUnits: z.number().int().positive(),
  currency: z.enum(CurrencyCodes),
};

const activeWorkdaySchema = z.strictObject({
  ...workdayBaseShape,
  endedAt: z.null(),
});

const completedWorkdaySchema = z
  .strictObject({
    ...workdayBaseShape,
    endedAt: z.iso.datetime(),
  })
  .refine(
    (workday) => Date.parse(workday.endedAt) > Date.parse(workday.startedAt),
    {
      path: ["endedAt"],
      message: "End instant must be after start instant",
    },
  );

export const workdaySchema: z.ZodType<Workday> = z.union([
  activeWorkdaySchema,
  completedWorkdaySchema,
]);
