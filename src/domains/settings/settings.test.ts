import { describe, expect, it } from "vitest";
import { settingsSchema } from ".";
import { CurrencyCodes } from "../../shared/types/currency";
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
  describe("persisted settings", () => {
    it("accepts a valid settings object", () => {
      const validSettings = {
        defaultHourlyRateMinorUnits: 900,
        defaultCurrency: CurrencyCodes.EUR,
      };
      const result = settingsSchema.safeParse(validSettings);

      expect(result).toEqual({
        success: true,
        data: validSettings,
      });
    });
    it.each([
      { description: "null", input: null },
      { description: "invalid data structure", input: [] },
      {
        description: "missing currency",
        input: { defaultHourlyRateMinorUnits: 900 },
      },
      {
        description: "missing rate",
        input: { defaultCurrency: CurrencyCodes.EUR },
      },
      {
        description: "a zero rate",
        input: {
          defaultHourlyRateMinorUnits: 0,
          defaultCurrency: CurrencyCodes.EUR,
        },
      },
      {
        description: "a negative rate",
        input: {
          defaultHourlyRateMinorUnits: -900,
          defaultCurrency: CurrencyCodes.EUR,
        },
      },
      {
        description: "a rate with a decimal part",
        input: {
          defaultHourlyRateMinorUnits: 9.5,
          defaultCurrency: CurrencyCodes.EUR,
        },
      },
      {
        description: "a non finite rate",
        input: {
          defaultHourlyRateMinorUnits: NaN,
          defaultCurrency: CurrencyCodes.EUR,
        },
      },
      {
        description: "a superior rate than the maximum safe integer",
        input: {
          defaultHourlyRateMinorUnits: Number.MAX_SAFE_INTEGER + 1,
          defaultCurrency: CurrencyCodes.EUR,
        },
      },
      {
        description: "an invalid currency code",
        input: {
          defaultHourlyRateMinorUnits: 900,
          defaultCurrency: "BTC",
        },
      },
      {
        description: "an invalid currency code format",
        input: {
          defaultHourlyRateMinorUnits: 900,
          defaultCurrency: 999,
        },
      },
      {
        description: "an object with extra properties",
        input: {
          defaultHourlyRateMinorUnits: 900,
          defaultCurrency: CurrencyCodes.EUR,
          extraProperty: "not allowed",
        },
      },
    ])("rejects $description", ({ input }) => {
      const result = settingsSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });
});
