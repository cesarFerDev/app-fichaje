export const CurrencyCodes = {
  EUR: "EUR",
} as const;

export type CurrencyCode = (typeof CurrencyCodes)[keyof typeof CurrencyCodes];
