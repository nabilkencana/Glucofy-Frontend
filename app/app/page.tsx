"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, TrendingUp, ScanLine, PencilLine, BarChart3, Inbox } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  useLog,
  gradeForSugar,
  SUGAR_LIMIT,
  dateKey,
  entriesForDate,
  type LogEntry,
} from "./_lib/log-store";
import { GradeBadge } from "./_components/grade-badge";
import { SugarBarChart } from "./_components/sugar-bar-chart";
import { cn } from "@/lib/utils";

const card = "rounded-lg border bg-card text-card-foreground shadow-sm border-primary/10";
const statLabel = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

const fmtNum = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const fmtTime = (ts: number) =>
  new Date(ts).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

function dayTotal(entries: LogEntry[], key: string) {
  return entriesForDate(entries, key).reduce((s, e) => s + e.totalSugar, 0);
}

function streakLengths(entries: LogEntry[]) {
  // Count consecutive logged days (ending today) under the limit, plus the
  // longest such run over the past ~180 days.
  const ok = (i: number) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const e = entriesForDate(entries, dateKey(d));
    return e.length > 0 && e.reduce((s, x) => s + x.totalSugar, 0) <= SUGAR_LIMIT;
  };
  let current = 0;
  for (let i = 0; i < 400 && ok(i); i++) current++;
  let longest = 0;
  let run = 0;
  for (let i = 180; i >= 0; i--) {
    if (ok(i)) {
      run++;
      if (run > longest) longest = run;
    } else run = 0;
  }
  return { current, longest: Math.max(longest, current) };
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const { ready, entries } = useLog();
  // Captured once on mount so render stays pure (no Date.now() during render).
  const [now] = useState(() => Date.now());

  const todayKey = dateKey(now);
  const todayEntries = ready ? entriesForDate(entries, todayKey) : [];
  const todaySugar = todayEntries.reduce((s, e) => s + e.totalSugar, 0);
  const pct = Math.min(100, Math.round((todaySugar / SUGAR_LIMIT) * 100));

  const avgPer100 = todayEntries.length
    ? todayEntries.reduce((s, e) => s + e.sugarPer100ml, 0) / todayEntries.length
    : 0;
  const todayGrade = todayEntries.length ? gradeForSugar(avgPer100) : null;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const weekTotals = weekDays.map((d) => (ready ? dayTotal(entries, dateKey(d)) : 0));
  const weeklyAvg = weekTotals.reduce((a, b) => a + b, 0) / 7;

  const { current: streak, longest } = ready
    ? streakLengths(entries)
    : { current: 0, longest: 0 };

  const recent = ready ? entries.slice(0, 5) : [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("dash_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("dash_subtitle")}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cn(card, "p-5")}>
          <p className={statLabel}>{t("dash_stat_today_sugar")}</p>
          <p className="mt-3 text-3xl font-bold text-foreground">{fmtNum(todaySugar)}g</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash_stat_from_target")} {SUGAR_LIMIT}g
          </p>
        </div>

        <div className={cn(card, "p-5")}>
          <p className={statLabel}>{t("dash_stat_nutrigrade")}</p>
          <div className="mt-3 flex items-center gap-3">
            <GradeBadge grade={todayGrade?.grade ?? "A"} size="md" />
            <span className="text-sm text-muted-foreground">
              {todayGrade ? todayGrade.label : t("dash_stat_no_record")}
            </span>
          </div>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="flex items-start justify-between">
            <p className={statLabel}>{t("dash_stat_streak")}</p>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 flex items-baseline gap-2 text-3xl font-bold text-foreground">
            <span aria-hidden className="text-2xl">🔥</span>
            <span>{streak}</span>
            <span className="text-base font-normal text-muted-foreground">
              {t("dash_stat_streak_unit")}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash_stat_longest")}: {longest} {t("dash_stat_streak_unit")}
          </p>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="flex items-start justify-between">
            <p className={statLabel}>{t("dash_stat_weekly_avg")}</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">{fmtNum(weeklyAvg)}g</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("dash_stat_last_7_days")}</p>
        </div>
      </div>

      {/* Daily progress */}
      <div className={cn(card, "p-6")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">{t("dash_progress_title")}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {fmtNum(todaySugar)}g / {SUGAR_LIMIT}g
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
              {t("dash_chart_limit")}: {SUGAR_LIMIT}g
            </span>
          </div>
          <SugarBarChart days={weekDays} totals={weekTotals} />
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
        {recent.length === 0 ? (
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
                <GradeBadge grade={e.grade} size="sm" />
                <span className="flex-1 truncate font-medium">{e.product}</span>
                <span className="text-sm text-muted-foreground">{fmtNum(e.totalSugar)}g</span>
                <span className="w-20 text-right text-sm text-muted-foreground">{fmtTime(e.ts)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
