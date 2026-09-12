import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SupportedLanguage } from "../../../../app/i18n/supportedLanguages";
import { render, screen } from "../../../../tests/test-utils";
import { FinishWorkdayButton } from "./FinishWorkdayButton";

describe("FinishWorkdayButton", () => {
  it("communicates the finish intention when it is available", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<FinishWorkdayButton isPending={false} onClick={onClick} />, {
      language: SupportedLanguage.Spanish,
    });

    await user.click(screen.getByRole("button", { name: "Finalizar jornada" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("prevents repeated interaction while the workday is being saved", () => {
    const onClick = vi.fn();

    render(<FinishWorkdayButton isPending onClick={onClick} />, {
      language: SupportedLanguage.Spanish,
    });

    const button = screen.getByRole("button", { name: "Guardando jornada" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(onClick).not.toHaveBeenCalled();
  });
});
