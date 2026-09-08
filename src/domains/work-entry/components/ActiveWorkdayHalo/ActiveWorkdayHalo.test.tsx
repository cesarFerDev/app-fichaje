import { describe, expect, it } from "vitest";
import { SupportedLanguage } from "../../../../app/i18n/supportedLanguages";
import { render, screen } from "../../../../tests/test-utils";
import { ActiveWorkdayHalo } from "./ActiveWorkdayHalo";

describe("ActiveWorkdayHalo", () => {
  it("shows the active workday information without progress semantics", () => {
    render(<ActiveWorkdayHalo duration="03:42" startTime="08:32" />, {
      language: SupportedLanguage.Spanish,
    });

    expect(
      screen.getByRole("heading", { name: "Jornada en curso" }),
    ).toBeInTheDocument();
    expect(screen.getByText("03:42")).toBeInTheDocument();
    expect(screen.getByText("Entrada · 08:32")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
