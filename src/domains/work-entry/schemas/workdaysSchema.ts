import { z } from "zod";
import { workdaySchema } from "./workdaySchema";

export const workdaysSchema = z
  .array(workdaySchema)
  .superRefine((workdays, context) => {
    const seenIds = new Set<string>();
    const seenDateKeys = new Set<string>();
    let hasActiveWorkday = false;

    workdays.forEach((workday, index) => {
      if (seenIds.has(workday.id)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate workday ID",
          path: [index, "id"],
        });
      } else {
        seenIds.add(workday.id);
      }
      if (seenDateKeys.has(workday.dateKey)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate dateKey",
          path: [index, "dateKey"],
        });
      } else {
        seenDateKeys.add(workday.dateKey);
      }
      if (workday.endedAt === null) {
        if (hasActiveWorkday) {
          context.addIssue({
            code: "custom",
            message: "Active workday already in progress",
            path: [index, "endedAt"],
          });
        } else {
          hasActiveWorkday = true;
        }
      }
    });
  });
