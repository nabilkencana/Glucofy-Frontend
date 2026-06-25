"use client";

import { useEffect, useState } from "react";
import { TriangleAlert, Timer, Trash2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  useLog,
  SUGAR_LIMIT,
  dateKey,
  entriesForDate,
  totalForDate,
} from "../_lib/log-store";
import { useToast } from "../_components/toast";
import { GradeBadge } from "../_components/grade-badge";
import { SugarBarChart } from "../_components/sugar-bar-chart";
import { cn } from "@/lib/utils";

const card = "rounded-lg border bg-card text-card-foreground shadow-sm";
const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const labelClass = "text-sm font-medium leading-none";
const btnBrand =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-brand-gradient text-white shadow-soft transition-all hover:opacity-95 disabled:pointer-events-none disabled:opacity-60";

const fmtNum = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const fmtTime = (ts: number) =>
  new Date(ts).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

function sinceLabel(now: number, ts: number) {
  const diff = Math.max(0, now - ts);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

export default function TrackerPage() {
  const { t } = useLanguage();
  const { ready, entries, logManual, removeEntry } = useLog();
  const toast = useToast();

  const [tab, setTab] = useState<"today" | "weekly">("today");
  const [selectedDate, setSelectedDate] = useState(() => dateKey(Date.now()));
  const [now, setNow] = useState(() => Date.now());

  const [product, setProduct] = useState("");
  const [sugar, setSugar] = useState("");
  const [serving, setServing] = useState("");

  // Keep the "since last entry" timer fresh.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const dayEntries = ready ? entriesForDate(entries, selectedDate) : [];
  const total = dayEntries.reduce((s, e) => s + e.totalSugar, 0);
  const pct = Math.min(100, (total / SUGAR_LIMIT) * 100);
  const ratio = (total / SUGAR_LIMIT) * 100;
  const fill = ratio < 60 ? "bg-grade-b" : ratio < 90 ? "bg-grade-c" : "bg-grade-e";
  const over = total > SUGAR_LIMIT;
  const last = dayEntries[0];

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(sugar);
    if (Number.isNaN(s)) return;
    logManual({
      product: product.trim() || "Produk",
      sugarPer100ml: s,
      servingMl: parseFloat(serving) || 100,
    });
    toast(t("track_logged_toast"));
    setProduct("");
    setSugar("");
    setServing("");
  };

  const handleDelete = (id: string) => {
    removeEntry(id);
    toast(t("track_deleted_toast"));
  };

  // Weekly data (last 7 days ending today)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const weekTotals = weekDays.map((d) => (ready ? totalForDate(entries, dateKey(d)) : 0));
  const weekAvg = weekTotals.reduce((a, b) => a + b, 0) / 7;
  const weekHigh = Math.max(...weekTotals);
  const weekLow = Math.min(...weekTotals);
  const underCount = weekTotals.filter((v) => v <= SUGAR_LIMIT).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading + date */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("track_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("track_subtitle")}</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* Tabs */}
      <div className="inline-flex h-10 items-center rounded-lg bg-muted p-1 text-muted-foreground">
        {(["today", "weekly"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              tab === key ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"
            )}
          >
            {t(key === "today" ? "track_tab_today" : "track_tab_weekly")}
          </button>
        ))}
      </div>

      {tab === "today" ? (
        <div className="space-y-6">
          {/* Over-limit warning */}
          {over && (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
              <TriangleAlert className="h-5 w-5 shrink-0 text-destructive" />
              <p>
                <span className="font-semibold">
                  {t("track_over_limit_pre")} {SUGAR_LIMIT}
                  {t("track_over_limit_suffix")}
                </span>{" "}
                {t("track_over_limit_post")}
              </p>
            </div>
          )}

          {/* Total + since last */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className={cn(card, "p-6 lg:col-span-2")}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{t("track_total_running")}</p>
                <span className="text-sm text-muted-foreground">
                  {fmtNum(total)}g / {SUGAR_LIMIT}g
                </span>
              </div>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full transition-all", fill)} style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className={cn(card, "flex items-center gap-4 p-6")}>
              <Timer className="h-9 w-9 shrink-0 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t("track_since_last")}
                </p>
                {last ? (
                  <>
                    <p className="text-2xl font-bold text-foreground">{sinceLabel(now, last.ts)}</p>
                    <p className="text-sm text-muted-foreground">{last.product}</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-foreground">—</p>
                    <p className="text-sm text-muted-foreground">{t("track_no_entry_today")}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Add entry */}
          <div className={cn(card, "p-6")}>
            <h2 className="mb-4 font-semibold">{t("track_add_title")}</h2>
            <form onSubmit={handleLog} className="grid items-end gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <label className={labelClass}>{t("track_product_label")}</label>
                <input
                  className={inputClass}
                  placeholder={t("track_product_ph")}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{t("track_sugar_label")}</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  className={inputClass}
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{t("track_serving_label")}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputClass}
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className={cn(btnBrand, "lg:col-span-3 lg:justify-self-start")}
                disabled={sugar.trim() === ""}
              >
                {t("track_log_btn")}
              </button>
            </form>
          </div>

          {/* Records */}
          <div className={cn(card, "p-6")}>
            <h2 className="mb-4 font-semibold">
              {t("track_records_for")} {selectedDate}
            </h2>
            {dayEntries.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                <p className="text-sm">{t("track_empty")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 font-medium">{t("track_th_product")}</th>
                      <th className="pb-3 font-medium">{t("track_th_sugar")}</th>
                      <th className="pb-3 font-medium">{t("track_th_grade")}</th>
                      <th className="pb-3 font-medium">{t("track_th_time")}</th>
                      <th className="pb-3 text-right font-medium">—</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayEntries.map((e) => (
                      <tr key={e.id} className="border-b border-border/60 last:border-0">
                        <td className="py-3 font-medium">{e.product}</td>
                        <td className="py-3">{fmtNum(e.totalSugar)}g</td>
                        <td className="py-3">
                          <GradeBadge grade={e.grade} size="sm" />
                        </td>
                        <td className="py-3 text-muted-foreground">{fmtTime(e.ts)}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDelete(e.id)}
                            aria-label="Delete entry"
                            className="text-destructive/80 transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Weekly chart */}
          <div className={cn(card, "p-6")}>
            <h2 className="mb-2 font-semibold">{t("track_weekly_title")}</h2>
            <SugarBarChart days={weekDays} totals={weekTotals} />
          </div>

          {/* Weekly stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: t("track_weekly_avg"), value: `${weekAvg.toFixed(1)}g` },
              { label: t("track_weekly_highest"), value: `${fmtNum(weekHigh)}g` },
              { label: t("track_weekly_lowest"), value: `${fmtNum(weekLow)}g` },
              { label: t("track_weekly_under"), value: `${underCount} / 7` },
            ].map((s) => (
              <div key={s.label} className={cn(card, "p-5")}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-3 text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
