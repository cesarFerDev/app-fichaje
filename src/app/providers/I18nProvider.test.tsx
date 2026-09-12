import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { SupportedLanguage } from "../i18n/supportedLanguages";
import { render, screen } from "../../tests/test-utils";

function TranslationProbe() {
  const { t } = useTranslation("workEntry");

  return <p>{t("onboarding.title")}</p>;
}

describe("I18nProvider", () => {
  it("provides Spanish domain translations", () => {
    render(<TranslationProbe />, { language: SupportedLanguage.Spanish });

    expect(screen.getByText("Configura tu tarifa")).toBeInTheDocument();
  });

  it("provides English domain translations in an isolated render", () => {
    render(<TranslationProbe />, { language: SupportedLanguage.English });

    expect(screen.getByText("Set your hourly rate")).toBeInTheDocument();
  });
});
