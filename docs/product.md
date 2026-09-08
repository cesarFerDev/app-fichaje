# Product — App Fichaje

**Status:** first MVP slice approved for implementation

**Last reviewed:** 2026-09-08

## Problem

Some individuals have no reliable way to record their own work hours, breaks,
historical corrections, and estimated earnings. App Fichaje provides a private,
device-local record that remains useful without a network connection.

It is a personal estimation tool, not an official payroll, invoicing, tax, or
employer attendance system.

## Target user

One person tracking their own working time on a phone, especially when their
employer or work arrangement provides no suitable record.

The intended audience spans very different levels of digital confidence,
including people in manual occupations who may have little familiarity with
smartphone interaction patterns. The core daily flow must therefore remain
direct, legible, and usable without prior explanation.

The phone is the primary context, but the web application is also intended to
gain a deliberate desktop composition. A separate desktop design is not part of
the first MVP slice.

## Goals

- Make daily start, break, resume, and finish actions quick on mobile.
- Preserve active work and break state across suspension, termination, and
  reloads.
- Allow validated correction of historical entries and categorized absences.
- Produce consistent monthly time and estimated-earnings summaries.
- Keep records private and usable offline while supporting explicit reports and
  backups.

## Non-goals

- Official payroll, tax, overtime, deductions, invoices, or compliance.
- Accounts, authentication, backend synchronization, or multiple users.
- Multiple employers, projects, jobs, or split shifts in one day.
- Automatic breaks, geolocation, reminders, or background services.
- Exchange-rate conversion, future scheduling, or iOS packaging in v1.

## Current scope

The repository currently contains the React/Vite toolchain and a minimal empty
application shell. The approved first slice covers mandatory rate onboarding,
starting and finishing today's workday, persist-first IndexedDB storage, and
recovery after reload. Its approved visual direction is documented in
[`design.md`](design.md). Product features, IndexedDB persistence, automated
tests, and the Android project have not yet been implemented.

## Planned v1 flows

1. Start today's workday, begin and end breaks, and finish the shift.
2. Reopen the app and reconstruct an active shift or break from persisted
   timestamps.
3. Create or correct a past workday and mark a day with an absence category.
4. Configure rate, currency, language, and theme without rewriting historical
   earnings.
5. View simplified or extended monthly reports and export PDF or CSV.
6. Export a versioned JSON backup and replace local data only after complete
   validation and explicit confirmation.

## Constraints

- V1 is offline-first and has no backend or account system.
- IndexedDB is the local source of truth; users create other copies only through
  explicit export.
- The web application is the product core and is intended to be packaged for
  Android with Capacitor.
- Active timers derive from persisted timestamps; incrementing counters are not
  durable truth.
- A calendar date has at most one workday or one absence.
- Historical workdays retain their captured rate and currency.
- Report and UI totals share the same domain calculations.
- Spanish and English, mobile accessibility, and no-network behavior are v1
  product requirements.
- The first MVP is mobile-first; later desktop work should reuse product and
  domain behavior while adapting navigation and composition to wider viewports.

Detailed lifecycle, money, reporting, and restore rules live in
[`domain.md`](domain.md).

## Realistic roadmap

### Short term

- Deliver the approved first vertical slice for onboarding, start, finish, and
  recovery with agreed automated tests.
- Validate its domain, persistence, application-state, accessibility, and visual
  boundaries before broadening the product surface.
- Add the monthly calendar only when it provides real history/selection behavior
  rather than a decorative shell.

### Medium term

- Add historical editing, absences, settings, localization, and theming.
- Define the desktop composition once the application has enough real
  destinations and workflows to justify it.
- Add monthly reports and shared PDF/CSV view models.
- Add validated atomic backup/restore and the Android packaging boundary.
