import type { PropsWithChildren } from "react";
import { I18nProvider } from "./I18nProvider";
import { ThemeProvider } from "./ThemeProvider";

type Props = PropsWithChildren;

export function AppProviders({ children }: Props) {
  return (
    <ThemeProvider>
      <I18nProvider>{children}</I18nProvider>
    </ThemeProvider>
  );
}
