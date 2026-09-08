# App Fichaje

App Fichaje is an offline-first, mobile-focused work-time tracker for
individuals who do not have another way to record their hours. It helps a user
track shifts and breaks, correct historical entries, estimate monthly earnings,
and share reports. It is a personal estimation tool, not an official payroll or
attendance system.

The React application is designed for phones and will be packaged as an Android
application with Capacitor. Version 1 has no backend or user accounts; records
remain on the device unless the user explicitly exports them.

## Project status

The first MVP vertical slice and its visual direction are approved for
implementation. The source tree and initial toolchain exist, but product
features, persistence, automated tests, and the Android project have not been
implemented yet.

Planned version 1 capabilities include:

- A monthly calendar with today's start, break, resume, and finish actions.
- Recovery of active shifts and breaks after the app closes or is suspended.
- Editing previous days using start, end, and break intervals.
- Categorized rest, public-holiday, vacation, sick, and other absence days.
- A default hourly rate plus rate and currency snapshots per workday.
- Simplified and extended monthly reports, viewable in-app and exportable as PDF
  or CSV.
- Spanish and English, light/dark/system themes, and a curated currency list.
- Versioned JSON backup export and validated, atomic restore.

## Installed technology

- React 19 and TypeScript 6
- Vite 8
- React Router 8
- Material UI 9 with Emotion
- react-datepicker and date-fns
- React Hook Form and Zod
- Capacitor Core 8
- Vitest, ESLint, and Prettier

Some planned capabilities still require dependencies, including Capacitor's CLI
and Android/file-sharing packages, localization, report generation, React DOM
testing utilities, and Playwright. Raw IndexedDB will be used intentionally
without a wrapper so its API, transactions, and migrations can be learned and
kept behind a repository boundary.

## Local development

Use Node 24.20.0 and pnpm 11.25.0. The repository pins both versions through
`.node-version` and the `packageManager` field.

```bash
pnpm install
pnpm dev
```

Available validation commands are:

```bash
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:watch
pnpm build
pnpm run check
```

`pnpm run check` is the canonical fast quality gate and covers type checking,
linting, formatting, and deterministic tests. The build remains a separate gate.
Until the first meaningful suite is added, the deterministic test command
temporarily accepts a repository with no tests.

## Project documentation

- [Documentation index](docs/README.md)
- [Product scope](docs/product.md)
- [Architecture](docs/architecture.md)
- [Visual direction](docs/design.md)
- [Engineering profile and playbook deviations](docs/engineering-profile.md)
