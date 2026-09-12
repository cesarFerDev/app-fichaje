# AGENTS.md — App Fichaje

## Project purpose

App Fichaje is an offline-first, mobile-focused work-time tracker for one person.
It is currently a learning project with an approved first MVP slice and visual
direction: the toolchain and minimal React shell exist, while product behavior
and persistence have not yet been implemented. The approved UI foundation now
includes providers, domain-owned translations, and initial presentational
components.

## Canonical context

- Global engineering playbook: `cesarFerDev/software-engineering-playbook`
- Playbook version reviewed against: `0.3.0`
- Global learning source: `cesarFerDev/software-engineering-university`
- Project-facing learning interface:
  `cesarFerDev/software-engineering-university/academic/learning-progress.md`
- Project lifecycle guidance: playbook `docs/project-lifecycle.md`
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

For broad project inception, product discovery, roadmap work, UX architecture,
visual exploration, or UI-foundation decisions, follow the project lifecycle
without forcing task-spec workflow. Use `plan-mentor` after a concrete
non-trivial task has been selected and needs an approved spec.

## Commands

Use pnpm. Do not replace the package manager or edit the lockfile manually.

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm format:check
pnpm i18n:check
pnpm i18n:format
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
- `src/domains`: product behavior, domain-owned UI, and public domain APIs.
- `src/shared`: reusable, domain-neutral code.
- `docs`: versioned product, architecture, engineering, and learning context.

Keep the dependency direction `app -> pages -> domains -> shared`. Cross-domain
imports use domain entry points. React components do not call IndexedDB or
Capacitor directly. Raw IndexedDB access belongs only in the persistence adapter.

## Local rules and deviations

Read `docs/engineering-profile.md` before applying a global default differently.
Read `docs/domain.md` before changing behavior and `docs/gotchas.md` before
changing affected tooling, routing, dates, or persistence. Update
`docs/architecture.md` when module boundaries, persistence, public contracts, or
cross-cutting dependencies change.

Follow `docs/code-style.md`: keep TypeScript strict, runtime-validate untrusted
boundaries with Zod, keep domain calculations pure, localize user-visible text,
preserve accessibility, and keep domain public APIs small. Backend validation
and authorization would remain authoritative if a backend is introduced.

Domain React components use one folder per component with colocated component,
test, and meaningful `styles.ts`. They obtain owned copy through
`useTranslation`; each domain owns matching `es.json` and `en.json` resources.
Run the i18n scripts after changing translations. Because
`erasableSyntaxOnly` is active, use `as const` plus a derived union for named
closed domain/application values instead of TypeScript enums.

## Learning contract

This project is part of the Engineering Studio. The university owns global
competency/progression state; this repository owns only project-local evidence.

For learning-critical work:

- César implements the core logic.
- Agents may scaffold, configure, style, write agreed tests, and implement
  already-delegable or repetitive mechanics.
- Visual design, styling, and presentational UI implementation are agent-owned
  unless César explicitly makes them a learning focus. César owns product/UX
  constraints, evaluates valid alternatives, and approves the final direction.
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
explicitly changes mode. Project inception/discovery and any required visual
foundation precede this loop. Non-trivial selected-task work follows:

```text
selected task -> plan-mentor -> approved temporary spec
-> César/agent split by learning value -> agreed tests/checks
-> review-mentor -> corrections/re-review -> learning evidence when meaningful
-> César validates the main flow -> PR -> squash merge
```

The active spec belongs at `docs/specs/spec.md` and defines the objective,
context, requirements, exclusions, agreed approach, expected changes, phases,
risks, validation, open questions, and Definition of Done.
