# Learning Evidence

This file stores **project-local observations** from Engineering Studio work. It
is not the global competency record.

Global learning authority: `cesarFerDev/software-engineering-university`  
Project-facing interface: `academic/learning-progress.md` in that repository.

## Rules

- Add entries only when real project work provides meaningful evidence.
- Record behavior or evidence, not personality judgments.
- Do not assign numeric grades.
- Do not promote or demote global competency states here.
- Keep entries concise; Git preserves history.
- The academic director may consume this evidence and decide whether global
  learning state changes.

## Entry template

```md
## YYYY-MM-DD — <task/context>

- Concept: <concept/boundary>
- Evidence: <what César independently reasoned/implemented/diagnosed>
- Help required: <none / question / hint / mini-lesson / scaffold>
- Transfer signal: <positive / fragile / new exposure>
- Academic candidate: <optional short follow-up proposal>
```

## 2026-09-12 — Raw IndexedDB persistence boundary

- Concept: Repository contracts, connection ownership, runtime validation, and
  request success versus transaction commit.
- Evidence: César independently chose one externally owned connection with
  separate domain repository contracts, implemented the opening and repository
  operations after orientation, and correctly explained that an aborted
  transaction must reject without changing confirmed UI state even after a
  successful request.
- Help required: Focused IndexedDB mini-lessons, agent-authored test scaffolding,
  and direct help with the event-based atomic read/validate/write sequence.
- Transfer signal: Positive for ownership and persist-first reasoning; raw
  IndexedDB event mechanics remain new exposure.
- Academic candidate: Revisit transaction/commit reasoning later with a
  promise-based or SQL persistence client to separate transferable concepts from
  IndexedDB-specific syntax.
