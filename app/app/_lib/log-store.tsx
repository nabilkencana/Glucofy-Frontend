"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// WHO recommended daily sugar limit (grams). Mirrors the Lovable reference.
export const SUGAR_LIMIT = 25;

export type Grade = "A" | "B" | "C" | "D";

export interface GradeInfo {
  grade: Grade;
  label: string;
  description: string;
}

// Exact thresholds + copy extracted from the Lovable bundle (grade by sugar/100ml).
// Labels/descriptions are English in the reference regardless of UI language.
const GRADE_TABLE: { max: number; info: GradeInfo }[] = [
  { max: 0.5, info: { grade: "A", label: "Excellent", description: "Excellent choice — virtually sugar-free." } },
  { max: 6, info: { grade: "B", label: "Good", description: "Good choice — low sugar content." } },
  { max: 12, info: { grade: "C", label: "Moderate", description: "Moderate — consume mindfully." } },
  { max: Infinity, info: { grade: "D", label: "High", description: "High sugar — limit intake." } },
];

export function gradeForSugar(sugarPer100ml: number): GradeInfo {
  return (GRADE_TABLE.find((g) => sugarPer100ml <= g.max) ?? GRADE_TABLE[GRADE_TABLE.length - 1]).info;
}

export interface LogEntry {
  id: string;
  product: string;
  sugarPer100ml: number;
  servingMl: number;
  totalSugar: number;
  grade: Grade;
  ts: number;
}

export interface ScanEntry {
  id: string;
  product: string;
  sugarPer100ml: number;
  totalSugar: number;
  grade: Grade;
  ts: number;
}

interface LogContextValue {
  ready: boolean;
  entries: LogEntry[];
  scans: ScanEntry[];
  /** Manual tracker entry → daily log only. */
  logManual: (input: { product: string; sugarPer100ml: number; servingMl: number }) => void;
  /** Scanner "Tambah ke Catatan" → scan history AND daily log. */
  logScan: (input: { product: string; sugarPer100ml: number; servingMl: number }) => void;
  removeEntry: (id: string) => void;
}

const ENTRIES_KEY = "glucofy:entries";
const SCANS_KEY = "glucofy:scans";

const LogContext = createContext<LogContextValue | undefined>(undefined);

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount. setState-in-effect is intentional:
  // reading localStorage during render would break SSR hydration.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setEntries(load<LogEntry>(ENTRIES_KEY));
    setScans(load<ScanEntry>(SCANS_KEY));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(SCANS_KEY, JSON.stringify(scans));
  }, [scans, ready]);

  const logManual = useCallback(
    ({ product, sugarPer100ml, servingMl }: { product: string; sugarPer100ml: number; servingMl: number }) => {
      const totalSugar = (sugarPer100ml * servingMl) / 100;
      const entry: LogEntry = {
        id: newId(),
        product,
        sugarPer100ml,
        servingMl,
        totalSugar,
        grade: gradeForSugar(sugarPer100ml).grade,
        ts: Date.now(),
      };
      setEntries((prev) => [entry, ...prev]);
    },
    []
  );

  const logScan = useCallback(
    ({ product, sugarPer100ml, servingMl }: { product: string; sugarPer100ml: number; servingMl: number }) => {
      const totalSugar = (sugarPer100ml * servingMl) / 100;
      const grade = gradeForSugar(sugarPer100ml).grade;
      const ts = Date.now();
      const id = newId();
      setEntries((prev) => [{ id, product, sugarPer100ml, servingMl, totalSugar, grade, ts }, ...prev]);
      setScans((prev) => [{ id: newId(), product, sugarPer100ml, totalSugar, grade, ts }, ...prev]);
    },
    []
  );

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo(
    () => ({ ready, entries, scans, logManual, logScan, removeEntry }),
    [ready, entries, scans, logManual, logScan, removeEntry]
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLog() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error("useLog must be used within a LogProvider");
  return ctx;
}

// ---- date helpers (local time) ----

export const dateKey = (d: Date | number) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export const entriesForDate = (entries: LogEntry[], key: string) =>
  entries.filter((e) => dateKey(e.ts) === key);

export const totalForDate = (entries: LogEntry[], key: string) =>
  entriesForDate(entries, key).reduce((sum, e) => sum + e.totalSugar, 0);
