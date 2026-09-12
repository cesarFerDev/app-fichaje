import { createInstance } from "i18next";
import type { i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import workEntryEn from "../../domains/work-entry/i18n/en.json";
import workEntryEs from "../../domains/work-entry/i18n/es.json";
import { resolveSupportedLanguage } from "./resolveSupportedLanguage";
import {
  SupportedLanguage,
  type SupportedLanguage as SupportedLanguageValue,
} from "./supportedLanguages";

export const defaultNamespace = "workEntry";

export const resources = {
  en: {
    workEntry: workEntryEn,
  },
  es: {
    workEntry: workEntryEs,
  },
} as const;

export function createI18n(language: SupportedLanguageValue): I18nInstance {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
    defaultNS: defaultNamespace,
    fallbackLng: SupportedLanguage.Spanish,
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    lng: language,
    resources,
    supportedLngs: [SupportedLanguage.Spanish, SupportedLanguage.English],
  });

  return instance;
}

const deviceLanguages =
  typeof navigator === "undefined"
    ? []
    : navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

export const i18n = createI18n(resolveSupportedLanguage(deviceLanguages));
