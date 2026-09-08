import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import workEntryEn from "../../domains/work-entry/i18n/en.json";
import workEntryEs from "../../domains/work-entry/i18n/es.json";

export const defaultNamespace = "workEntry";

export const resources = {
  en: {
    workEntry: workEntryEn,
  },
  es: {
    workEntry: workEntryEs,
  },
} as const;

export const i18n = createInstance();

await i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
  lng: "es",
  resources,
  supportedLngs: ["es", "en"],
});
