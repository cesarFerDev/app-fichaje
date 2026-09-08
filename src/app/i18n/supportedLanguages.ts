export const SupportedLanguage = {
  English: "en",
  Spanish: "es",
} as const;

export type SupportedLanguage =
  (typeof SupportedLanguage)[keyof typeof SupportedLanguage];
