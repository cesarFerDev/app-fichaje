import { describe, expect, it } from "vitest";
import { resolveSupportedLanguage } from "./resolveSupportedLanguage";
import { SupportedLanguage } from "./supportedLanguages";

describe("resolveSupportedLanguage", () => {
  it("uses a supported device language without its regional suffix", () => {
    expect(resolveSupportedLanguage(["en-GB"])).toBe(SupportedLanguage.English);
  });

  it("uses the first supported language from the device preferences", () => {
    expect(resolveSupportedLanguage(["fr-FR", "en-US", "es-ES"])).toBe(
      SupportedLanguage.English,
    );
  });

  it("falls back to Spanish when the device languages are unsupported", () => {
    expect(resolveSupportedLanguage(["fr-FR", "de-DE"])).toBe(
      SupportedLanguage.Spanish,
    );
  });
});
