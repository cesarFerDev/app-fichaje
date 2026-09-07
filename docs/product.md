# Product — App Fichaje

**Status:** planning and foundation  
**Last reviewed:** 2026-09-07

## Problem

Some individuals have no reliable way to record their own work hours, breaks,
historical corrections, and estimated earnings. App Fichaje provides a private,
device-local record that remains useful without a network connection.

It is a personal estimation tool, not an official payroll, invoicing, tax, or
employer attendance system.

## Target user

One person tracking their own working time on a phone, especially when their
employer or work arrangement provides no suitable record.

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
application shell. Product features, IndexedDB persistence, automated tests, and
the Android project have not yet been implemented.

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

Detailed lifecycle, money, reporting, and restore rules live in
[`domain.md`](domain.md).

## Realistic roadmap

### Short term

- Establish domain types and pure lifecycle/date/money calculations.
- Implement the IndexedDB adapter and recovery-aware application state.
- Build the calendar and daily work controls with agreed automated tests.

### Medium term

- Add historical editing, absences, settings, localization, and theming.
- Add monthly reports and shared PDF/CSV view models.
- Add validated atomic backup/restore and the Android packaging boundary.
