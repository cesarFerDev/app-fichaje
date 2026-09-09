import { describe, expect, it } from "vitest";
import { hourlyRateDraftSchema } from "./schemas/hourlyRateDraftSchema";

describe("settings domain", () => {
  describe("rate conversor", () => {
    it.each([
      ["9", 900],
      ["9,5", 950],
      ["9,50", 950],
      ["9.5", 950],
      ["   9,50   ", 950],
    ])("converts %s into %i minor units", (input, expected) => {
      const result = hourlyRateDraftSchema.safeParse(input);

      expect(result).toMatchObject({
        success: true,
        data: expected,
      });
    });
    it.each(["0", "0,00", "0.00"])(
      "rejects the non-positive rate %s",
      (input) => {
        const result = hourlyRateDraftSchema.safeParse(input);

        expect(result.success).toBe(false);
      },
    );
    it.each(["", "   ", "-9", "texto", "NaN", "Infinity", "9,999", "1.234,56"])(
      "rejects the invalid rate draft %j",
      (input) => {
        const result = hourlyRateDraftSchema.safeParse(input);

        expect(result.success).toBe(false);
      },
    );
    it("accepts the largest safely representable rate", () => {
      const result = hourlyRateDraftSchema.safeParse("90071992547409,91");

      expect(result).toMatchObject({
        success: true,
        data: Number.MAX_SAFE_INTEGER,
      });
    });

    it("rejects a rate above the safe integer limit", () => {
      const result = hourlyRateDraftSchema.safeParse("90071992547409,92");

      expect(result.success).toBe(false);
    });
  });
});
