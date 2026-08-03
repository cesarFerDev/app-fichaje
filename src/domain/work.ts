export type Locale = "es" | "en" | "ca";

export type BreakPeriod = {
  id: string;
  start: string;
  end?: string;
};

export type WorkRecord = {
  id: string;
  date: string;
  start: string;
  end?: string;
  breaks: BreakPeriod[];
  rateCents: number;
  customRate: boolean;
};

export type DayException = {
  date: string;
  kind: "holiday" | "dayOff";
};

export type Settings = {
  defaultRateCents: number;
  locale: Locale;
  localeChosen: boolean;
};

export type AppData = {
  version: 1;
  settings: Settings;
  records: WorkRecord[];
  exceptions: DayException[];
};

export const defaultData = (locale: Locale = "es"): AppData => ({
  version: 1,
  settings: { defaultRateCents: 1000, locale, localeChosen: false },
  records: [],
  exceptions: [],
});

export const newId = () => crypto.randomUUID();

export const localDate = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const localTime = (value: Date) =>
  `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;

export const atLocalTime = (date: string, time: string) =>
  new Date(`${date}T${time}:00`).toISOString();

const positiveMinutes = (start: string, end: string) =>
  Math.max(0, Math.round((Date.parse(end) - Date.parse(start)) / 60000));

export const workedMinutes = (record: WorkRecord, now = new Date()) => {
  const end = record.end ?? now.toISOString();
  const total = positiveMinutes(record.start, end);
  const breaks = record.breaks.reduce(
    (sum, item) =>
      sum + positiveMinutes(item.start, item.end ?? now.toISOString()),
    0,
  );
  return Math.max(0, total - breaks);
};

export const earningsCents = (record: WorkRecord, now = new Date()) =>
  Math.round((workedMinutes(record, now) * record.rateCents) / 60);

export const formatDuration = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;

export const formatMoney = (cents: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "ca" ? "ca-ES" : `${locale}-ES`, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);

export const dateForMonth = (date: string, month: Date) =>
  date.startsWith(
    `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`,
  );

export const isWeekday = (date: string) => {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day >= 1 && day <= 5;
};

export const validateData = (value: unknown): value is AppData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<AppData>;
  return (
    data.version === 1 &&
    Array.isArray(data.records) &&
    Array.isArray(data.exceptions) &&
    !!data.settings
  );
};
