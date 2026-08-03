import { describe, expect, it } from "vitest";
import { earningsCents, workedMinutes, type WorkRecord } from "./work";

const record = (overrides: Partial<WorkRecord> = {}): WorkRecord => ({
  id: "record-1",
  date: "2026-08-03",
  start: "2026-08-03T07:00:00.000Z",
  end: "2026-08-03T15:00:00.000Z",
  breaks: [],
  rateCents: 1250,
  customRate: false,
  ...overrides,
});

describe("work calculations", () => {
  it("subtracts multiple breaks from a workday", () => {
    const value = record({
      breaks: [
        {
          id: "a",
          start: "2026-08-03T09:00:00.000Z",
          end: "2026-08-03T09:20:00.000Z",
        },
        {
          id: "b",
          start: "2026-08-03T12:00:00.000Z",
          end: "2026-08-03T12:30:00.000Z",
        },
      ],
    });
    expect(workedMinutes(value)).toBe(430);
    expect(earningsCents(value)).toBe(8958);
  });

  it("keeps overnight work on its start record", () => {
    const value = record({
      start: "2026-08-03T22:00:00.000Z",
      end: "2026-08-04T02:30:00.000Z",
    });
    expect(workedMinutes(value)).toBe(270);
  });

  it("uses the current timestamp for an active record", () => {
    const active = record({
      breaks: [{ id: "a", start: "2026-08-03T08:00:00.000Z" }],
    });
    delete active.end;
    const value = active;
    expect(workedMinutes(value, new Date("2026-08-03T09:30:00.000Z"))).toBe(60);
  });
});
