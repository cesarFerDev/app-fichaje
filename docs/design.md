# Visual direction — Precisión serena

**Status:** approved for the first MVP slice

**Last reviewed:** 2026-09-08

**Playbook version:** 0.3.0

## Product intent

App Fichaje must feel minimal, elegant, calm, and immediately understandable.
Its daily flow serves people with very different levels of digital confidence,
including users who may rarely use smartphone applications. Visual restraint is
therefore functional: the screen emphasizes the current state and the one action
that can be taken next.

## Approved character

`Precisión serena` combines:

- a cool neutral background and surface;
- graphite primary text and restrained neutral secondary text;
- teal as the only functional accent for the primary action, active state,
  focus, and concise confirmation;
- a clean sans-serif type system with clear numeric forms;
- generous whitespace, fine dividers, limited radius, and little or no shadow;
- short, literal copy without motivational or decorative headlines.

Cards, badges, gradients, glass effects, nested surfaces, and decorative metrics
are not defaults. They require a concrete product responsibility.

## Initial visual tokens

The first implementation uses the following small token set. MUI theme values
are the source of truth; components do not duplicate these literals.

| Role           | Initial value | Use                                                     |
| -------------- | ------------- | ------------------------------------------------------- |
| App background | `#F7FAF9`     | Quiet cool-neutral page background                      |
| Surface        | `#FFFFFF`     | Form/control surface where separation is required       |
| Primary text   | `#17201F`     | Headings, time values, and essential labels             |
| Secondary text | `#5F6B68`     | Date and supporting information                         |
| Primary teal   | `#00796B`     | Primary action, active halo, focus, and concise success |
| Primary hover  | `#00695C`     | Hover/pressed emphasis where applicable                 |
| Teal soft      | `#E0F2F1`     | Subtle supporting active surface when needed            |
| Divider        | `#D7DEDC`     | Fine structural separation                              |
| Error          | `#B42318`     | Error text and state paired with an explicit message    |

The approved light palette provides at least `4.5:1` contrast for primary and
secondary text and white-on-teal button text. Contrast is rechecked against the
actual component states rather than inferred from the token table alone.

Use the native system sans-serif stack for the first slice. It avoids a font
download/dependency, remains familiar across Android and desktop platforms, and
fits the approved direction. Use regular and semibold emphasis only, with
tabular numeric forms for clocks and durations.

Initial geometry:

- page padding: 16 px at the narrowest viewport, then 24 px;
- focused daily-content width: at most 440 px;
- primary action height: at least 56 px;
- other interactive targets: at least 48 × 48 px;
- primary action radius: 12 px;
- status halo diameter: fluid between 220 and 280 px with a 4 px complete ring;
- default elevation: none; add shadow only if later overlap requires it.

## Daily hierarchy

The mobile daily screen follows this order:

1. Product identity and local calendar date.
2. Explicit textual workday state.
3. The central status halo with the most important time value.
4. One large primary action: start or finish.
5. Local persistence/error feedback close to that action.

The UI does not repeat equivalent messages such as both `Registro activo` and
`Jornada en curso`. One concise state label is enough.

## Status halo

The halo is a complete, stable circle around the central workday information.
It communicates state through its label, content, and supporting color.

It is not a progress indicator:

- never render it as a partial arc;
- never expose `progressbar`, percentage, or target-duration semantics;
- never persist or animate an accumulating counter as truth;
- never imply an expected finishing time that the product has not configured.

For an active workday, the center shows `Jornada en curso`, the derived elapsed
duration, and the persisted entry time. Empty and completed variants preserve
the same direct hierarchy without inventing new domain behavior.

The circle is a presentational component. Domain state and time calculations
remain outside it.

## Typography and iconography

- Use one highly legible sans-serif family or system stack; do not introduce a
  serif display face.
- Keep labels and body copy at readable sizes; do not shrink essential
  information to preserve a composition.
- Use tabular numeric forms for clock times and durations when the selected font
  supports them.
- Navigation combines familiar icons with visible localized labels. Essential
  actions never depend on an icon alone.
- Icon style remains simple, consistent, and subordinate to text and state.

## MVP navigation boundary

The approved future navigation direction combines familiar icons with visible
localized labels. The first MVP does not render that navigation because reports,
settings, and other destinations are outside its scope.

Do not show disabled destinations, `Próximamente` placeholders, or empty routes
to preview future structure. Add the navigation when at least two destinations
provide real user behavior, then validate its mobile and desktop composition.

## Interaction and accessibility

- Expose one dominant daily action with a comfortable touch target.
- Use semantic controls and visible focus; color never carries state alone.
- Pending persistence disables repeat submission while preserving the last
  confirmed visual state.
- Errors explain what failed, whether data changed, and what the user can do.
- Motion is optional, restrained, and respects reduced-motion preferences; the
  halo does not need motion to communicate an active workday.
- Validate keyboard use, zoom/larger text, narrow screens, contrast, and status
  announcements as behavior rather than polish.

## Responsive boundary

The first slice is designed mobile-first and must remain usable from 320 px
without clipping or horizontal overflow. Content width and the halo scale within
bounded limits rather than growing indefinitely.

A separate desktop composition is outside this MVP. The foundation must still
allow the daily content to center or reflow on wider screens; mobile navigation
must not become an irreversible desktop architecture decision.

## Deferred design decisions

- How pauses extend or complement the halo.
- Whether a compact timeline becomes useful once pause/history behavior exists.
- The final wide-screen navigation and composition.
- Bottom navigation once at least two destinations are functional.
- Full light/dark/system theme behavior beyond the implemented slice.

These decisions return to product/UX exploration when their behavior enters
scope. They are not anticipated with speculative components now.
