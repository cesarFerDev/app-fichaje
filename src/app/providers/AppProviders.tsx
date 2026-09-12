import type { i18n as I18nInstance } from "i18next";
import type { PropsWithChildren } from "react";
import { i18n } from "../i18n/i18n";
import { I18nProvider } from "./I18nProvider";
import { ThemeProvider } from "./ThemeProvider";

type Props = PropsWithChildren<{
  i18nInstance?: I18nInstance;
}>;

export function AppProviders({ children, i18nInstance = i18n }: Props) {
  return (
    <ThemeProvider>
      <I18nProvider instance={i18nInstance}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
