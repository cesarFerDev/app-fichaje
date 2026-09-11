# Domain rules

This document is the canonical detailed product-rule reference. See
[`product.md`](product.md) for product intent and
[`architecture.md`](architecture.md) for technical ownership and boundaries.

## Product scope

App Fichaje helps one individual record working time and estimate earnings. It
does not calculate taxes, overtime premiums, payroll deductions, invoices,
contract compliance, or employer-approved attendance.

The v1 calendar uses the device's local calendar and supports past and present
dates. Future dates are read-only.

## Records and identity

Each local calendar date is in exactly one of three states:

- no record;
- one workday;
- one categorized absence.

A date cannot contain both work and absence, and v1 does not support split
shifts. UUIDs generated with the Web Crypto API identify records; break
intervals will also use stable generated identifiers when introduced. The date
is a unique business key for a day record.

Dates are stored as `YYYY-MM-DD` local date keys. Event timestamps are stored as
ISO-8601 instants. An overnight workday belongs entirely to the date on which it
started.

## Workday lifecycle

The allowed lifecycle is:

```text
no record -> working -> on break -> working -> completed
                        \---------------------> completed
```

Allowed commands are:

- `startWorkday(now)`: create today's workday and snapshot the default hourly
  rate and currency.
- `startBreak(now)`: append one open break to the active workday.
- `resumeWork(now)`: close the active break.
- `finishWorkday(now)`: close the active break, if any, and close the workday at
  the same instant.
- `editPastWorkday(input)`: replace a completed past day's schedule after full
  validation.
- `setDayRate(date, rate, currency)`: change only that workday's rate snapshot.

At most one workday and one break within it may be active. Starting another day
while an older workday is active is invalid, including after midnight. The user
must finish or correct the active record first.

Every successful lifecycle command persists before updating visible state.
While an operation is pending, the corresponding action cannot be submitted
again.

## Timer recovery

The application never persists an incrementing elapsed counter. It persists
transition timestamps and calculates:

```text
gross duration = effective end - start
break duration = sum(effective break end - break start)
worked duration = gross duration - break duration
```

For an active workday, the effective end is `now`. For an active break, its
effective end is also `now`, so the displayed worked duration stops increasing
until work resumes. Reloading or reopening the application reconstructs the
same result from stored timestamps.

## Interval validation

A workday is valid only when:

- start is earlier than end for a completed day;
- every break starts at or after the workday start;
- completed breaks have an end later than their start;
- every break ends at or before the workday end;
- break intervals do not overlap;
- only the most recent break may be open;
- a completed workday has no open break;
- worked duration is not negative.

The historical editor uses start, end, and break fields rather than a separate
net-hours override. It shows field-level validation and does not persist a
partially valid schedule.

## Absences

The fixed absence categories are:

- `rest`;
- `publicHoliday`;
- `vacation`;
- `sick`;
- `other`.

An absence has no work duration or earnings. Reports count absence categories
separately from empty, unrecorded dates. Changing between work and absence is a
replacement operation and requires confirmation when it would discard interval
data.

## Rates, currencies, and earnings

Settings define the default hourly rate and currency for new workdays. Rates are
stored as non-negative integer minor units, not floating-point formatted values.
The initial currency is EUR; supported v1 codes are EUR, USD, GBP, CHF, MXN,
ARS, COP, CLP, PEN, and BRL.

Starting or manually creating a workday copies the current rate and currency
onto that day. Later changes to defaults do not recalculate existing days. An
explicit per-day edit replaces only that day's snapshot and marks its rate source
as an override.

For a day:

```text
unrounded earning = hourly rate in minor units * worked milliseconds / 3_600_000
daily earning = round unrounded earning to the nearest minor unit
```

Monthly earnings equal the sum of rounded daily earnings. Work duration is not
rounded before the calculation. Values are estimates and must be labelled as
such in the UI and exported reports.

## Monthly reports

A month is based on record date keys, not the UTC month of their timestamps.

The simplified report contains:

- localized month and year;
- number of worked days;
- total worked duration;
- count per absence category;
- estimated earnings grouped by currency if the month contains more than one.

The extended report adds one consolidated row for every recorded date:

- date and record type;
- shift start and finish for workdays;
- total break duration;
- worked duration;
- hourly rate and currency;
- estimated daily earning;
- absence category for absence days.

Mixed historical currencies must never be converted without an exchange-rate
source. Totals are therefore grouped by currency. The same report model powers
the screen, PDF, and CSV representations.

## Settings

Settings include:

- default hourly rate;
- one supported ISO currency code;
- `es` or `en` locale;
- `light`, `dark`, or `system` theme preference.

On first launch, use the supported device locale or fall back to Spanish. User
choices persist and take precedence afterward. Changing theme follows the same
rule; `system` responds to later operating-system theme changes.

## Backup format and restore

A backup is versioned and contains export time, app version, settings, and every
workday/absence record. It excludes derived report totals and transient UI state.

Restore follows this order:

1. Read the selected file without changing local data.
2. Parse JSON and validate its complete versioned schema with Zod.
3. Validate cross-record domain invariants and reject unsupported future schema
   versions.
4. Show a summary and explicit warning that existing data will be replaced.
5. Replace settings and records in one IndexedDB read-write transaction.
6. Rehydrate app state and report success only after the transaction completes.

Parse, validation, or transaction failure leaves current data unchanged. A
cancelled confirmation performs no write.

## Explicitly out of scope for v1

- Accounts, authentication, backend sync, and multi-device conflict handling.
- Multiple users, employers, projects, jobs, or shifts per day.
- Automatic breaks, geolocation, reminders, and background services.
- Overtime, tax, deductions, bonuses, exchange-rate conversion, and payroll.
- Future scheduling and recurring absence rules.
- iOS packaging and automated native-device tests.
