"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, TrendingUp, ScanLine, PencilLine, BarChart3, Inbox } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getDashboardSummary,
  getWeeklyChart,
  getLastConsumption,
  type DashboardSummary,
  type WeeklyDataPoint,
  type ConsumptionLog,
} from "@/lib/api";
import { GradeBadge } from "./_components/grade-badge";
import { cn } from "@/lib/utils";

const card = "rounded-lg border bg-card text-card-foreground shadow-sm border-primary/10";
const statLabel = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

const fmtNum = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

// NutriGrade → local Grade mapping used by GradeBadge
const gradeMap: Record<string, "A" | "B" | "C" | "D" | "E"> = {
  A: "A", B: "B", C: "C", D: "D",
};

// ponytail: minimal bar chart — no external lib, plain divs
function WeeklyBars({ data, limit }: { data: WeeklyDataPoint[]; limit: number }) {
  const max = Math.max(limit, ...data.map((d) => d.totalSugar), 1);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="mt-4 flex h-36 items-end gap-2">
      {data.map((d) => {
        const pct = Math.min(100, (d.totalSugar / max) * 100);
        const label = new Date(d.date).toLocaleDateString("en-US", { weekday: "short" });
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full flex flex-col justify-end" style={{ height: "112px" }}>
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all",
                  d.exceeded ? "bg-red-400" : "bg-primary/70"
                )}
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Skeleton block
function Skel({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export default function DashboardPage() {
  const { t } = useLanguage();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weekly, setWeekly] = useState<{ data: WeeklyDataPoint[]; dailyLimit: number } | null>(null);
  const [recent, setRecent] = useState<ConsumptionLog[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardSummary(),
      getWeeklyChart(),
      getLastConsumption(),
    ])
      .then(([s, w, l]) => {
        setSummary(s);
        setWeekly(w);
        setRecent(l.data.slice(0, 5));
      })
      .catch(() => {}) // token guard handled by shell
      .finally(() => setLoading(false));
  }, []);

  const pct = summary
    ? Math.min(100, Math.round((summary.consumedToday / summary.dailyLimit) * 100))
    : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("dash_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dash_subtitle")}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Today's sugar */}
        <div className={cn(card, "p-5")}>
          <p className={statLabel}>{t("dash_stat_today_sugar")}</p>
          {loading ? (
            <Skel className="mt-3 h-9 w-24" />
          ) : (
            <p className="mt-3 text-3xl font-bold text-foreground">
              {fmtNum(summary?.consumedToday ?? 0)}g
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash_stat_from_target")} {fmtNum(summary?.dailyLimit ?? 50)}g
          </p>
        </div>

        {/* NutriGrade — derived from last consumption */}
        <div className={cn(card, "p-5")}>
          <p className={statLabel}>{t("dash_stat_nutrigrade")}</p>
          <div className="mt-3 flex items-center gap-3">
            {loading ? (
              <Skel className="h-8 w-8 rounded-full" />
            ) : recent && recent.length > 0 ? (
              <>
                <GradeBadge grade={gradeMap[recent[0].nutriGrade] ?? "A"} size="md" />
                <span className="text-sm text-muted-foreground">{recent[0].nutriGrade}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">{t("dash_stat_no_record")}</span>
            )}
          </div>
        </div>

        {/* Streak */}
        <div className={cn(card, "p-5")}>
          <div className="flex items-start justify-between">
            <p className={statLabel}>{t("dash_stat_streak")}</p>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skel className="mt-3 h-9 w-16" />
          ) : (
            <p className="mt-3 flex items-baseline gap-2 text-3xl font-bold text-foreground">
              <span aria-hidden className="text-2xl">🔥</span>
              <span>{summary?.currentStreak ?? 0}</span>
              <span className="text-base font-normal text-muted-foreground">{t("dash_stat_streak_unit")}</span>
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash_stat_longest")}: {summary?.longestStreak ?? 0} {t("dash_stat_streak_unit")}
          </p>
        </div>

        {/* Weekly avg from chart data */}
        <div className={cn(card, "p-5")}>
          <div className="flex items-start justify-between">
            <p className={statLabel}>{t("dash_stat_weekly_avg")}</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          {loading ? (
            <Skel className="mt-3 h-9 w-16" />
          ) : (
            <p className="mt-3 text-3xl font-bold text-foreground">
              {weekly
                ? fmtNum(weekly.data.reduce((a, d) => a + d.totalSugar, 0) / 7)
                : "0"}g
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">{t("dash_stat_last_7_days")}</p>
        </div>
      </div>

      {/* Daily progress */}
      <div className={cn(card, "p-6")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">{t("dash_progress_title")}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {fmtNum(summary?.consumedToday ?? 0)}g / {fmtNum(summary?.dailyLimit ?? 50)}g
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{pct}%</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Chart + quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={cn(card, "p-6 lg:col-span-2")}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-foreground">{t("dash_stat_last_7_days")}</p>
            <span className="text-sm text-muted-foreground">
              {t("dash_chart_limit")}: {fmtNum(weekly?.dailyLimit ?? 50)}g
            </span>
          </div>
          {loading ? (
            <Skel className="mt-4 h-36 w-full" />
          ) : weekly && weekly.data.length > 0 ? (
            <WeeklyBars data={weekly.data} limit={weekly.dailyLimit} />
          ) : (
            <div className="mt-4 flex h-36 items-center justify-center text-sm text-muted-foreground">
              {t("dash_recent_empty")}
            </div>
          )}
        </div>

        <div className={cn(card, "p-6")}>
          <p className="font-semibold text-foreground">{t("dash_quick_actions")}</p>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/app/scanner"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-gradient px-4 py-3 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <ScanLine className="h-[18px] w-[18px]" />
              {t("dash_quick_scan")}
            </Link>
            <Link
              href="/app/tracker"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <PencilLine className="h-[18px] w-[18px]" />
              {t("dash_quick_manual")}
            </Link>
            <Link
              href="/app/tracker"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <BarChart3 className="h-[18px] w-[18px]" />
              {t("dash_quick_report")}
            </Link>
          </div>
        </div>
      </div>

      {/* Recent records */}
      <div className={cn(card, "p-6")}>
        <p className="font-semibold text-foreground">{t("dash_recent_title")}</p>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skel key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !recent || recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">{t("dash_recent_empty")}</p>
            <Link
              href="/app/scanner"
              className="mt-4 inline-flex items-center rounded-lg bg-brand-gradient px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-95"
            >
              {t("dash_recent_cta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {recent.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-3">
                <GradeBadge grade={gradeMap[e.nutriGrade] ?? "A"} size="sm" />
                <span className="flex-1 truncate font-medium">{e.productName}</span>
                <span className="text-sm text-muted-foreground">
                  {fmtNum((e.sugarPer100ml * e.servingSizeMl) / 100)}g
                </span>
                <span className="w-20 text-right text-sm text-muted-foreground">
                  {fmtTime(e.consumedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
