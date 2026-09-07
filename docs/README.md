# Project documentation

Keep this directory small and current. A fresh contributor or agent should be
able to reconstruct the project without relying on historical chats.

- [`product.md`](product.md) — current problem, user, scope, and constraints.
- [`architecture.md`](architecture.md) — current technical state and intended
  boundaries that already constrain implementation.
- [`domain.md`](domain.md) — detailed product invariants and calculations.
- [`code-style.md`](code-style.md) — local implementation conventions.
- [`testing-strategy.md`](testing-strategy.md) — current gates and planned test
  coverage.
- [`engineering-profile.md`](engineering-profile.md) — playbook alignment,
  deviations, and experiments.
- [`learning-evidence.md`](learning-evidence.md) — local Engineering Studio
  evidence; never global competency state.
- [`gotchas.md`](gotchas.md) — current non-obvious traps.
- [`adr/`](adr/) — durable, significant technical decisions.
- `specs/spec.md` — temporary active task specification; intentionally
  gitignored.

The public entry point remains the repository [`README`](../README.md), and
agent operating instructions live in [`AGENTS.md`](../AGENTS.md). Do not
duplicate the global playbook or university learning record here.
