# Code style

## Principles

- Optimize for readable domain behavior and safe change, not minimum line count.
- Prefer explicit ownership and small public APIs over global convenience.
- Keep side effects at application boundaries and calculations pure.
- Do not add abstractions until a real second use or boundary requires them.

Prettier is the formatting authority. ESLint and TypeScript strict mode are
correctness tools; do not suppress them without documenting a concrete reason.

## TypeScript

- Avoid `any`. Use `unknown` at untrusted boundaries and narrow it.
- Avoid non-null assertions and broad `as` casts. Model unavailable values in
  the type system.
- Use discriminated unions for lifecycle and record variants.
- Prefer `type` by default. Use `interface` when declaration merging, extension,
  or an explicitly open object contract provides a concrete benefit.
- Keep money in integer minor units and timestamps/date keys in explicitly named
  string types. Do not perform money calculations on formatted strings.
- Use exhaustive switches with a `never` check for closed domain unions.
- Use `import type` when an import is type-only.
- Validate file, storage-migration, and form inputs with Zod before converting
  them to trusted domain values.

## Naming and files

- Components, providers, and error boundaries use `PascalCase` filenames.
- Hooks start with `use`; ordinary functions do not.
- Boolean names read as predicates: `isActive`, `hasOpenBreak`, `canFinish`.
- Event handlers describe the event at component level (`handleFinishClick`) and
  the intention at command level (`finishWorkday`).
- Tests use `*.test.ts` or `*.test.tsx`; Playwright journeys use `*.spec.ts`.
- Avoid generic buckets such as `helpers.ts` when a domain-specific name is
  available.

## React

- Components render UI and coordinate hooks; pure domain logic belongs outside
  React.
- Do not store derived duration, lifecycle, or report totals in component state.
- Keep context values stable and separate state from commands when it prevents
  broad re-renders.
- Effects synchronize with external systems. Do not use effects to calculate
  values that can be derived during render.
- Forms use React Hook Form and Zod schemas. Map validation errors to localized,
  accessible helper text.
- Feature pages must cover loading, empty, error, and ready states explicitly.
- Use semantic elements and MUI primitives before custom click handlers on
  generic containers.

## Imports and feature APIs

Follow `app -> pages -> features -> shared`.

- A feature exposes supported components, hooks, and types through `index.ts`.
- Consumers do not import another feature's internal path.
- Relative imports are acceptable inside a feature. Introduce path aliases only
  when configured consistently for TypeScript, Vite, ESLint, Vitest, and
  Playwright.
- An `index.ts` is an intentional public boundary, not a wildcard export of
  every implementation detail.
- Avoid circular dependencies by keeping domain types/calculations below React
  adapters.

## Domain and persistence

- Repository interfaces describe application needs, not IndexedDB object-store
  mechanics.
- Only the IndexedDB adapter creates requests and transactions.
- Await transaction completion, not merely request success.
- Storage migrations are additive and versioned; migration code must be tested
  against representative earlier data.
- Mutations validate first, persist second, and update the reducer third.
- Report functions accept records/settings and return deterministic view models
  without reading clocks, storage, or translations.
- Inject `now` into timer calculations and commands so tests remain deterministic.

## Dates and money

- Use date-fns for calendar manipulation and explicit functions for ISO parsing.
- Never derive a calendar key with `toISOString().slice(0, 10)` because that uses
  UTC rather than the user's local date.
- Store instants and local date keys separately as documented in the domain
  rules.
- Format dates, durations, rates, and currency at the presentation/export edge.
- Never silently combine different currencies in a single money total.

## Localization and accessibility

- No user-visible text is hard-coded in a component, validator, notification,
  report, or export template.
- Translation keys describe meaning rather than the original wording.
- Prefer visible labels. Icon-only actions require localized accessible names.
- Interactive targets must be comfortable for touch, keyboard reachable on the
  web, and visibly focused.
- Status must not be conveyed by color alone.
- Dialog focus, error announcements, and date-picker keyboard behavior require
  explicit manual and automated checks.

## Errors and user feedback

- Normalize storage and export failures into application error categories while
  retaining a debuggable cause for development.
- Messages tell the user what failed, whether data changed, and what they can do
  next.
- Do not catch an error only to ignore it.
- Destructive replacements require confirmation; success messages appear only
  after persistence finishes.

## Comments and documentation

Comments explain non-obvious reasons, invariants, browser/native differences, or
workarounds. Do not narrate straightforward code. Update architecture or domain
documentation when a decision changes; do not rely on a code comment to redefine
project-wide behavior.
