# AGENTS.md — App Fichaje

## Project purpose

App Fichaje is an offline-first, mobile-focused work-time tracker for one person.
It is currently a learning project in its planning and foundation stage: the
toolchain and minimal React shell exist, while product features and persistence
are still planned.

## Canonical context

- Global engineering playbook: `cesarFerDev/software-engineering-playbook`
- Playbook version reviewed against: `0.2.1`
- Global learning source: `cesarFerDev/software-engineering-university`
- Project-facing learning interface:
  `cesarFerDev/software-engineering-university/academic/learning-progress.md`
- Local docs index: `docs/README.md`
- Product: `docs/product.md`
- Architecture: `docs/architecture.md`
- Domain rules: `docs/domain.md`
- Code conventions: `docs/code-style.md`
- Testing strategy: `docs/testing-strategy.md`
- Local profile/deviations: `docs/engineering-profile.md`
- Local learning evidence: `docs/learning-evidence.md`
- Gotchas: `docs/gotchas.md`
- Active task spec: `docs/specs/spec.md` (temporary and gitignored)

Use progressive disclosure. Read this file and `README.md`, then only the local
and playbook documents relevant to the task. Repository evidence is the source
of truth. When learning context materially affects a decision, start with the
project-facing learning interface; if the referenced snapshot does not contain
it, report that limitation and do not invent competency evidence.

## Commands

Use pnpm. Do not replace the package manager or edit the lockfile manually.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:watch
pnpm build
pnpm run check
```

`pnpm run check` covers typecheck, lint, formatting, and deterministic tests.
Build is a separate gate. Run the smallest relevant check while developing and
the complete applicable set before handoff; never claim an unrun check passed.

## Project map

- `src/app`: application composition, providers, and routing.
- `src/pages`: route-level composition without business calculations.
- `src/features`: vertical product behavior and public feature APIs.
- `src/shared`: reusable, domain-neutral code.
- `docs`: versioned product, architecture, engineering, and learning context.

Keep the dependency direction `app -> pages -> features -> shared`. Cross-feature
imports use feature entry points. React components do not call IndexedDB or
Capacitor directly. Raw IndexedDB access belongs only in the persistence adapter.

## Local rules and deviations

Read `docs/engineering-profile.md` before applying a global default differently.
Read `docs/domain.md` before changing behavior and `docs/gotchas.md` before
changing affected tooling, routing, dates, or persistence. Update
`docs/architecture.md` when module boundaries, persistence, public contracts, or
cross-cutting dependencies change.

Follow `docs/code-style.md`: keep TypeScript strict, runtime-validate untrusted
boundaries with Zod, keep domain calculations pure, localize user-visible text,
preserve accessibility, and keep feature public APIs small. Backend validation
and authorization would remain authoritative if a backend is introduced.

## Learning contract

This project is part of the Engineering Studio. The university owns global
competency/progression state; this repository owns only project-local evidence.

For learning-critical work:

- César implements the core logic.
- Agents may scaffold, configure, style, write agreed tests, and implement
  already-delegable or repetitive mechanics.
- New decisions found during delegated work return to César.
- Agents may append meaningful observations to `docs/learning-evidence.md`, but
  never change global competency or curriculum state.
- Necessary ahead-of-course concepts receive a focused mini-lesson rather than
  blocking delivery.

When César is learning or implementing manually, ask one focused question at a
time, request repository evidence, distinguish facts from hypotheses and
decisions, give progressively stronger hints, and ask him to restate the concept
after a direct explanation. Do not disguise a complete solution as a hint.

## Agent safety

- Never commit secrets or real credentials.
- Never use destructive Git/history/worktree commands.
- Never overwrite or reset unrelated existing changes; report them first.
- Never persist an interval counter as truth or rely on frontend-only checks as
  authorization.
- Diagnose and gather evidence before fixing defects.
- Modify only the declared workflow scope.

## Task workflow

Planning and review workflows do not change production code unless César
explicitly changes mode. Non-trivial work follows:

```text
proposal -> plan-mentor -> approved temporary spec
-> César/agent split by learning value -> agreed tests/checks
-> review-mentor -> corrections/re-review -> learning evidence when meaningful
-> César validates the main flow -> PR -> squash merge
```

The active spec belongs at `docs/specs/spec.md` and defines the objective,
context, requirements, exclusions, agreed approach, expected changes, phases,
risks, validation, open questions, and Definition of Done.
