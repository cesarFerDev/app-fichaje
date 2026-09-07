# Engineering profile — App Fichaje

This file records deliberate local choices that differ from, or experiment with,
the global defaults. It is not a backlog.

## Playbook alignment

- Canonical playbook: `cesarFerDev/software-engineering-playbook`
- Last reviewed against version: `0.2.1`
- Last review date: `2026-09-07`
- Aligned foundations: React, TypeScript strict mode, Vite, MUI, pnpm, Zod,
  local-first simplicity, minimal dependencies, and no v1 backend.

## Defaults overridden

| Global default                                  | Local choice                                | Rationale                                                                                                             | Status    |
| ----------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------- |
| Domain-owned modules normally use `src/domains` | Retain the existing `src/features` boundary | Renaming an empty foundation would be aesthetic churn; ownership can be reassessed from real modules and dependencies | temporary |

## Temporary deviations

| Deviation                                                                             | Why accepted                                                                                                      | Review trigger                                                         |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Deterministic test scripts use `--passWithNoTests`                                    | The project shell has no implemented behavior or meaningful suite yet, while CI still needs a stable test command | Remove it when the first meaningful suite is added                     |
| `BrowserRouter` is active although `HashRouter` is planned for packaged static assets | Native packaging is not implemented and this adoption intentionally avoids production changes                     | Decide and test routing before adding the Capacitor Android project    |
| `src/app/App.tsx` uses a default export                                               | It is isolated scaffold debt, not the project-wide convention                                                     | Convert when the application shell receives substantive implementation |

## Active experiments

| Experiment                                      | What we want to learn                                                                                                         | Evaluation point                                               |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Raw IndexedDB behind a persistence adapter      | Learn browser database APIs, transactions, schema upgrades, and failure behavior without leaking storage mechanics into React | After implementing and testing one migration or atomic restore |
| `noUncheckedIndexedAccess` in strict TypeScript | Assess whether the additional safety remains useful and ergonomic in real domain and persistence code                         | After representative domain and adapter implementation         |

## Clarifications

- React context for hydrated offline data does not conflict with the playbook's
  TanStack Query guidance: v1 has no server state and TanStack Query is not
  installed.
- `eslint.config.js` is the canonical ESLint configuration. The redundant
  `eslint.config.ts` is retained unchanged in intent for this minimal adoption;
  removal is a separate cleanup decision.
- The project-facing university interface
  `academic/learning-progress.md` was absent from the available committed v0.2.1
  university snapshot during this review. No competency state was inferred or
  copied from deeper files.

## Pending playbook-version review

- None.

Learning observations belong in [`learning-evidence.md`](learning-evidence.md);
global competency and progression belong to `software-engineering-university`.
