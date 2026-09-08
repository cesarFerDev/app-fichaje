import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../tests/test-utils";

function TranslationProbe() {
  const { t } = useTranslation("workEntry");

  return <p>{t("onboarding.title")}</p>;
}

describe("I18nProvider", () => {
  it("provides the default Spanish domain translations", () => {
    render(<TranslationProbe />);

    expect(screen.getByText("Configura tu tarifa")).toBeInTheDocument();
  });
});
