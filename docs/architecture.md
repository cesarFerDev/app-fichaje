# Architecture — App Fichaje

**Last reviewed:** 2026-09-07  
**Playbook version:** 0.2.1

## Context and boundaries

App Fichaje is an offline-first, mobile-focused application for one person to
record work time and estimate income. The React web application is the product
core and is intended to be packaged for Android with Capacitor.

V1 has no accounts, backend, or cloud synchronization. IndexedDB will be the
local source of truth, and user-created exports will be the only other copies of
records. Domain behavior must remain independent of browser/native file APIs and
must work without a network connection.

Product intent is in [`product.md`](product.md); exact lifecycle, date, money,
report, and restore rules are in [`domain.md`](domain.md).

## Current implementation state

The current repository is a foundation, not the system described in the planned
sections below.

- `src/main.tsx` mounts an empty `App` inside `BrowserRouter`.
- `src/app/App.tsx` renders an empty fragment; `src/app/Router.tsx` is empty.
- Feature, page, shared, provider, persistence, report, export, localization,
  and native adapter modules do not exist yet.
- No IndexedDB database or application state store has been implemented.
- Vitest is installed, but there are no automated tests yet.
- Capacitor Core is installed, but the CLI, Android project, and native plugins
  are not.

Installed technology is listed in the repository [`README`](../README.md). An
installed package is not evidence that its planned boundary already exists.

## Architecture goals

- Keep product behavior usable offline and recoverable after suspension or
  termination.
- Make persisted records and timestamps the single source of truth.
- Keep domain calculations pure and shared by UI and exports.
- Isolate IndexedDB, browser file APIs, and Capacitor behind explicit adapters.
- Preserve a simple dependency direction and small feature public APIs.
- Validate untrusted storage, form, and import data at their boundaries.

## Non-goals

- Backend, authentication, multi-user, or sync architecture in v1.
- Ceremonial layers, speculative shared abstractions, or generic plugin systems.
- An IndexedDB wrapper while direct API learning remains an explicit experiment.
- Native-only domain behavior or an iOS package in v1.

## Intended system overview

The following diagram is the agreed v1 design target, not current implementation:

```text
User
  |
  v
React application (MUI, feature modules, local app state)
  |                         |
  v                         v
Persistence adapter     Export adapters
  |                      JSON / CSV / PDF
  v                           |
Raw IndexedDB                 v
(local source of truth)  Browser download or
                         Capacitor Filesystem/Share
```

Native adapters may improve file handling and sharing, but neither domain logic
nor report calculations may depend on Capacitor.

## Intended modules and ownership

The project retains the existing `features` naming while implementation evidence
is still too small to justify a migration to the playbook's `domains` default.

```text
src/
  app/                 composition, providers, and router
    providers/
  pages/               route-level feature composition
  features/
    calendar/
    work-entry/
    reports/
    settings/
  shared/              reusable, domain-neutral building blocks
    components/
    constants/
    hooks/
    types/
    utils/
  tests/
    integration/
    e2e/
```

The intended dependency direction is:

```text
app -> pages -> features -> shared
```

- `shared` does not import features or pages.
- Features do not import pages or application-composition modules.
- Cross-feature imports use the target feature's `index.ts` public API.
- Pages compose feature APIs and contain no business calculations.
- Feature-specific code does not move into `shared` merely to bypass a boundary.
- Only the persistence adapter calls raw IndexedDB.

Directories should be added as behavior is implemented, not pre-created for
architectural appearance.

## Navigation and composition target

V1 plans three persistent destinations:

- Calendar (`/`): month calendar and controls/editor for a selected date.
- Reports (`/reports`): monthly summaries, details, and exports.
- Settings (`/settings`): rate, currency, language, theme, and backups.

Hash-based routing is the current design target for packaged static Capacitor
assets, but the scaffold currently uses `BrowserRouter`. This must be decided and
tested before native packaging rather than changed as documentation-only churn.

The planned provider order is:

```text
Error boundary
  Theme and localization
    Persistence bootstrap
      App state and commands
        Router
```

Bootstrap UI must distinguish loading, recoverable storage failure, and ready
states. A storage failure must not appear as empty history.

## State and data flow target

Raw IndexedDB is an intentional learning constraint and will be hidden behind
typed repositories that own opening, upgrades, requests, transaction completion,
and error normalization.

The current intended flow is:

```text
UI event -> feature command -> runtime/domain validation
         -> repository transaction -> local state update
         -> derived selector -> UI
```

Mutations are persist-first: visible local state changes only after IndexedDB
confirms transaction completion. Actions that could submit a transition twice
remain disabled while persistence is pending.

A local React context/reducer is the current target for hydrated offline data and
commands. This is not server-state redistribution: v1 has no server or TanStack
Query. Reassess the state shape from actual implementation and keep only minimum
mutable state.

Lifecycle state, elapsed duration, and report totals are derived. An active
workday or break survives reload because timestamps are persisted; interval
counters are never persisted as truth.

## Domain and persistence contracts

Domain calculations stay independent of React, IndexedDB, translation, clocks,
and platform adapters. Inject `now` where time affects a calculation or command.

The persistence design must enforce these architectural invariants:

- a local date contains at most one workday or one absence;
- only one workday or break is active across the application;
- event timestamps are ISO instants and the local start-date key is stored
  separately;
- money is stored as integer minor units;
- workdays retain their captured rate and currency;
- report screens and exporters consume the same report view models.

Storage reads and migrations are untrusted boundaries and require runtime
validation before values become domain data.

## Reports and platform boundaries

The reports feature will produce simplified and extended monthly view models.
Those same models feed the screen, PDF, and CSV renderers so totals cannot drift.
Mixed currencies remain separate rather than being converted without a rate
source.

Browser builds download generated files. Capacitor builds will write temporary
files and open the native share sheet. Platform behavior stays behind export and
share adapters; feature/domain code depends only on their contracts.

## Backup and restore target

A backup is a versioned JSON envelope containing settings and all restorable
records, not derived totals or transient UI state.

Restore must follow one trust-boundary flow:

1. Read and parse without changing local data.
2. Validate the entire schema with Zod and reject unsupported future versions.
3. Validate cross-record domain invariants.
4. Show a replacement summary and require explicit confirmation.
5. Replace settings and records in one read-write transaction.
6. Rehydrate state and report success only after the transaction commits.

Parse, validation, cancellation, or transaction failure leaves existing data
unchanged.

## Localization, theme, and accessibility

V1 supports Spanish and English and `light`, `dark`, and `system` themes. MUI
owns theme tokens, breakpoints, defaults, and accessible contrast. The calendar
feature wraps and styles `react-datepicker` so the external widget does not leak
throughout the app.

All visible strings, validation messages, report labels, and accessibility names
use translation keys once localization is implemented. Touch targets, keyboard
operation, visible focus, dialog focus, error announcements, and date-picker
behavior are acceptance concerns rather than optional polish.

## External boundaries

| Boundary                   | Current state     | Intended contract and validation                                                                    |
| -------------------------- | ----------------- | --------------------------------------------------------------------------------------------------- |
| IndexedDB                  | Not implemented   | Typed repository/adapter; Zod validation for stored and migrated data; await transaction completion |
| JSON import/export         | Not implemented   | Versioned envelope; validate complete import before confirmed atomic replacement                    |
| CSV/PDF export             | Not implemented   | Render the shared report view model; keep browser/native delivery separate                          |
| Capacitor filesystem/share | Core package only | Platform adapter; domain and feature code remain platform-neutral                                   |
| Device locale/theme        | Not implemented   | Read at presentation/bootstrap boundary; persisted user choice takes precedence                     |

Planned but currently uninstalled capabilities include Capacitor CLI/Android and
file-sharing plugins, localization libraries, PDF/CSV generation, React DOM test
utilities, and Playwright. New libraries require a concrete need, compatibility
review, and an architecture update.

## Security and privacy

There is no remote authentication or authorization boundary in v1. Records stay
on the device unless the user explicitly exports or shares them. Untrusted
imports and stored/migrated data still require validation. Destructive backup
replacement requires explicit confirmation and atomic persistence.

No secrets or credentials belong in the repository. If a backend is introduced,
server-side validation and authorization become authoritative; frontend checks
remain user experience only.

## Deployment

No deployment pipeline or Android package exists yet. GitHub CI validates pull
requests and pushes to `main` with the repository quality gate and build. Before
native delivery, document reproducible Android setup, signing-secret handling,
artifact generation, and rollback/release strategy.

## Temporary decisions and review triggers

| Decision                                                | Why now                                                      | Revisit when                                                                      |
| ------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Keep `src/features` rather than rename to `src/domains` | Avoid aesthetic restructuring before domain ownership exists | Multiple implemented modules expose real ownership or cross-feature dependencies  |
| Use raw IndexedDB behind an adapter                     | Deliberate learning experiment with no current wrapper need  | One migration or atomic restore has been implemented and tested                   |
| Hydrate offline records into local React state          | Simple fit for a no-backend application                      | Data volume, rendering behavior, or synchronization needs show a concrete problem |
| Leave `BrowserRouter` in the scaffold                   | Native packaging is not implemented in this adoption         | Before creating the Android project                                               |

Additional tooling deviations are recorded in
[`engineering-profile.md`](engineering-profile.md).

## Known architectural risks

- The detailed v1 design is still unimplemented and must be validated
  incrementally rather than treated as proven architecture.
- Raw IndexedDB transaction and migration behavior can compromise user history
  if adapter-level integration tests lag behind implementation.
- Browser/native routing and file behavior remain unverified until Capacitor is
  introduced.
- Timezone and overnight behavior can diverge unless local date keys and instant
  timestamps remain distinct throughout persistence and reporting.
