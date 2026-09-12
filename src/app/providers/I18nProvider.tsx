import type { i18n as I18nInstance } from "i18next";
import type { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";

type Props = PropsWithChildren<{
  instance: I18nInstance;
}>;

export function I18nProvider({ children, instance }: Props) {
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
