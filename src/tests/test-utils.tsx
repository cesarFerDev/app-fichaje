import { render as testingLibraryRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { createI18n } from "../app/i18n/i18n";
import {
  SupportedLanguage,
  type SupportedLanguage as SupportedLanguageValue,
} from "../app/i18n/supportedLanguages";
import { AppProviders } from "../app/providers/AppProviders";

export { screen, waitFor, within } from "@testing-library/react";

type Options = Omit<RenderOptions, "wrapper"> & {
  language?: SupportedLanguageValue;
};

export function render(
  ui: ReactElement,
  { language = SupportedLanguage.Spanish, ...options }: Options = {},
) {
  const i18nInstance = createI18n(language);

  function TestProviders({ children }: PropsWithChildren) {
    return <AppProviders i18nInstance={i18nInstance}>{children}</AppProviders>;
  }

  return testingLibraryRender(ui, { wrapper: TestProviders, ...options });
}
