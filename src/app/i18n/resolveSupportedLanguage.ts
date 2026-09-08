import {
  SupportedLanguage,
  type SupportedLanguage as SupportedLanguageValue,
} from "./supportedLanguages";

export function resolveSupportedLanguage(
  deviceLanguages: readonly string[],
): SupportedLanguageValue {
  for (const deviceLanguage of deviceLanguages) {
    const language = deviceLanguage.trim().toLowerCase().split(/[-_]/)[0];

    if (language === SupportedLanguage.English) {
      return SupportedLanguage.English;
    }

    if (language === SupportedLanguage.Spanish) {
      return SupportedLanguage.Spanish;
    }
  }

  return SupportedLanguage.Spanish;
}
