import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { defaultData, type AppData, type Locale } from "../domain/work";
import { loadSnapshot, saveSnapshot } from "../infrastructure/storage";
import { AppContext, type AppContextValue } from "./appState";

const detectedLocale = (): Locale => {
  const language = navigator.language.toLowerCase();
  if (language.startsWith("en")) return "en";
  if (language.startsWith("ca") || language.startsWith("val")) return "ca";
  return "es";
};

export function AppProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<AppData>(() =>
    defaultData(detectedLocale()),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadSnapshot()
      .then((saved) => {
        if (saved) setData(saved);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const commit = (next: AppData) => {
    setData(next);
    void saveSnapshot(next);
  };
  const value = useMemo<AppContextValue>(
    () => ({
      data,
      loading,
      createRecord: (
        date,
        start = new Date(
          `${date}T${new Date().toTimeString().slice(0, 5)}:00`,
        ).toISOString(),
      ) => {
        if (data.records.some((record) => record.date === date)) return;
        commit({
          ...data,
          records: [
            ...data.records,
            {
              id: crypto.randomUUID(),
              date,
              start,
              breaks: [],
              rateCents: data.settings.defaultRateCents,
              customRate: false,
            },
          ],
        });
      },
      updateRecord: (record) =>
        commit({
          ...data,
          records: data.records.map((item) =>
            item.id === record.id ? record : item,
          ),
        }),
      deleteRecord: (id) =>
        commit({
          ...data,
          records: data.records.filter((record) => record.id !== id),
        }),
      updateSettings: (settings) => commit({ ...data, settings }),
      setExceptions: (exceptions) => commit({ ...data, exceptions }),
      restore: (replacement) => commit(replacement),
    }),
    [data, loading],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
