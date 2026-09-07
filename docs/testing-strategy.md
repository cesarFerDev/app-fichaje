# Testing strategy

## Goals

Tests protect persisted user history, lifecycle transitions, earnings, backup
recovery, and report consistency. Prefer the lowest layer that proves a behavior,
then add broader coverage for critical user journeys and integration boundaries.

## Current automated baseline

Vitest is installed, but the repository does not yet contain tests because no
product behavior has been implemented. `pnpm test` is deterministic and
temporarily uses `--passWithNoTests`; `pnpm test:run` remains a compatible alias,
and `pnpm test:watch` starts interactive watch mode.

This zero-test tolerance keeps the shared local/CI contract executable during
foundation work. It is not permission to merge implemented behavior without
appropriate tests and must be removed when the first meaningful suite is added.

## Planned test stack

- Vitest is installed for pure unit and integration tests.
- React Testing Library, user-event, jest-dom, and jsdom are planned for React
  behavior.
- Playwright is planned for critical browser journeys.
- Manual Android smoke testing is planned for Capacitor-specific v1 behavior.

The supporting React and browser testing packages are not installed yet. Add
them only when an agreed test requires them.

## Test organization

Keep tests close to pure source modules when locality is useful. Use the existing
test areas for cross-module behavior:

```text
src/
  features/**/<module>.test.ts(x)
  shared/**/<module>.test.ts
  tests/
    integration/
    e2e/
```

Configure Playwright to use `src/tests/e2e` as its test directory. Keep its
fixtures isolated from application bundles and avoid importing test modules from
production entry points.

## Unit tests

Pure domain tests provide the broadest edge-case coverage. They must include:

- lifecycle transition acceptance and rejection;
- elapsed duration for working, active-break, completed, and overnight states;
- interval validation, including overlap and out-of-bounds breaks;
- local date-key construction near UTC offset and daylight-saving boundaries;
- rate snapshot behavior and per-day overrides;
- daily minor-unit rounding and monthly summation;
- mixed-currency report grouping;
- absence counts and exclusion from worked totals;
- simplified and extended report view models;
- backup schema validation and version rejection.

Inject a fixed clock rather than mocking global time when practical. Use table
tests for transition and validation matrices. Examples must state their timezone
assumption.

## Persistence integration tests

Exercise the raw IndexedDB adapter with an isolated in-memory IndexedDB
implementation or a real browser database. Cover:

- first database creation and default settings;
- reads and writes through repository interfaces;
- unique date enforcement;
- transaction completion and normalized failure behavior;
- upgrade from every supported prior schema version;
- loading an active shift and an active break after repository re-creation;
- atomic backup replacement;
- rollback on a failure during replacement;
- preservation of local data after parse or validation failure.

Each test receives a unique database name and deletes only that database during
cleanup. Do not share persistent state between tests.

## React integration tests

Test observable behavior through accessible roles and labels, not component
internals. Cover:

- provider bootstrap loading, ready, empty, and storage-error states;
- start, break, resume, and finish actions;
- finish during a break ending both intervals;
- prevention of duplicate pending actions;
- recovery display for active work and active breaks;
- past-day editing and validation feedback;
- work-to-absence replacement confirmation;
- settings persistence and historical rate preservation;
- locale, theme, and currency formatting changes;
- backup validation, replacement confirmation, cancellation, and success/failure
  feedback;
- monthly card expansion and report content.

Prefer real reducers, schemas, and calculations with repository/platform fakes.
Mock only the boundary whose failure or native behavior is under test.

## End-to-end journeys

Playwright verifies a small set of high-value browser flows:

1. Start a shift, begin a break, reload, confirm the break remains active, resume,
   finish, and verify the daily/monthly totals.
2. Create and edit a past overnight workday with multiple breaks.
3. Change the global rate, verify an old day's earnings remain unchanged, and
   apply a per-day override.
4. Mark absence categories and verify simplified and extended monthly reports.
5. Export a backup, alter local data, restore the backup, and verify replacement.
6. Reject a corrupt or unsupported backup without changing existing data.
7. Export simplified and extended CSV/PDF reports and verify filenames, MIME
   types, and representative content.
8. Switch Spanish/English and light/dark/system preferences across reloads.

Use deterministic seeded dates, locale, timezone, and clock. Do not depend on the
developer's current month or machine language.

## Report export tests

Test the report model separately from renderers. For CSV, verify delimiter
escaping, quotes, localized headings, line endings, UTF-8 content, and mixed
currencies. For PDF, verify metadata and extracted representative text rather
than pixel-perfect binary snapshots.

Platform adapter contract tests confirm that web builds request a download and
Capacitor builds pass the generated file to Filesystem/Share. The native share
sheet itself is a manual smoke-test responsibility in v1.

## Manual mobile checks

Before an Android release candidate:

- install a clean APK and verify first-run defaults;
- test touch targets and calendar behavior on a small phone;
- start work, background and force-stop the app, then verify recovery;
- repeat while a break is active;
- test crossing midnight;
- deny or cancel file/share actions and verify data remains safe;
- share JSON, PDF, and CSV through at least one installed target;
- import a backup selected from device storage;
- verify light/dark/system changes and Spanish/English layouts;
- exercise airplane mode for all core workflows.

## Quality gates

During development, run the smallest relevant test repeatedly. The canonical
fast local and CI gate is:

```bash
pnpm run check
```

It runs typecheck, lint, formatting, and the deterministic test suite. Build is a
separate gate because it also produces output. Before handoff, run the individual
commands when useful for evidence, then both canonical gates:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm run check
```

CI installs with `pnpm install --frozen-lockfile`, runs `pnpm run check`, and then
`pnpm build`. Run the Playwright command once its script is added. Run an Android
sync/build and manual smoke suite for native-boundary changes.

A change is not complete when tests are skipped without an explanation, flaky,
dependent on execution order, or asserting only implementation details. Bug
fixes require a regression test that fails for the original defect.
