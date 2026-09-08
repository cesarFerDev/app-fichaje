import { render as testingLibraryRender } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { AppProviders } from "../app/providers/AppProviders";

export { screen, waitFor, within } from "@testing-library/react";

export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return testingLibraryRender(ui, { wrapper: AppProviders, ...options });
}
