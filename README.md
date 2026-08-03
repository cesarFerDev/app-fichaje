# App Fichaje

An offline-first, mobile-focused work-time tracker for individual agricultural workers. It helps users record workdays and breaks, estimate earnings, and review their time without acting as an official payroll system.

## Status

The project is in its planning and foundation stage. Product functionality has not been implemented yet.

The planned first version includes local work-record storage, calendar and report views, hourly-rate settings and overrides, non-working-day status, multilingual UI, and JSON backup/restore.

## Technology

- React and TypeScript
- Vite
- Material UI
- Capacitor (planned Android packaging)
- IndexedDB (planned local persistence)

## Run locally

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Useful validation commands:

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

At the current baseline, tests and the production build are not yet passing because the scaffold has no test files and `src/app/App.tsx` imports a missing stylesheet.

## Documentation

Read [AGENTS.md](AGENTS.md) before contributing. The project rules and decisions are documented in:

- [Architecture](docs/architecture.md)
- [Domain rules](docs/domain.md)
- [Code style](docs/code-style.md)
- [Testing strategy](docs/testing-strategy.md)
- [Android tester APK guide](docs/android-apk.md)
