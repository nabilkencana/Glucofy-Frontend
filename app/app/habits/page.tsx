"use client";

import { useState, useMemo } from "react";
import { Flame, TrendingUp, Lightbulb, Inbox } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  useLog,
  SUGAR_LIMIT,
  dateKey,
  entriesForDate,
  type LogEntry,
  type Grade,
} from "../_lib/log-store";
import { GradeBadge } from "../_components/grade-badge";
import { cn } from "@/lib/utils";

const cardStyle = "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md";

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
    } else {
      run = 0;
    }
  }
  return { current, longest: Math.max(longest, current) };
}

export default function HabitsPage() {
  const { t, language } = useLanguage();
  const { ready, entries } = useLog();
  const [now] = useState(() => Date.now());

  // Calculate stats
  const { current: streak, longest } = ready
    ? streakLengths(entries)
    : { current: 0, longest: 0 };

  const loggedDaysList = useMemo(() => {
    if (!ready) return [];
    return Array.from(new Set(entries.map((e) => dateKey(e.ts))));
  }, [entries, ready]);

  const loggedDaysCount = loggedDaysList.length;

  // Grade counts for distribution
  const gradeCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    if (!ready) return counts;
    entries.forEach((e) => {
      if (counts[e.grade] !== undefined) counts[e.grade]++;
    });
    return counts;
  }, [entries, ready]);

  const maxGradeCount = useMemo(() => {
    return Math.max(...Object.values(gradeCounts), 1);
  }, [gradeCounts]);

  const totalGradesCount = useMemo(() => {
    return Object.values(gradeCounts).reduce((a, b) => a + b, 0);
  }, [gradeCounts]);

  const segments = useMemo(() => {
    if (totalGradesCount === 0) return [];
    
    const activeGrades = (["A", "B", "C", "D", "E"] as Grade[])
      .map((grade) => ({ grade, count: gradeCounts[grade] || 0 }))
      .filter((g) => g.count > 0);

    const radius = 40;
    const circumference = 2 * Math.PI * radius; // ~251.327
    
    // gap between segments (4px if multiple segments exist, otherwise 0)
    // ponytail: gap spacing is applied dynamically to provide gaps only when separate segments exist
    const gap = activeGrades.length > 1 ? 4 : 0;
    let accumulatedStroke = 0;
    
    return activeGrades.map(({ grade, count }) => {
      const percentage = (count / totalGradesCount) * 100;
      const strokeLength = (count / totalGradesCount) * circumference - gap;
      const strokeOffset = accumulatedStroke + gap / 2;
      accumulatedStroke += (count / totalGradesCount) * circumference;
      
      let colorHex = "hsl(var(--grade-a))";
      if (grade === "A") colorHex = "#1D7F3A";
      else if (grade === "B") colorHex = "#63C71B";
      else if (grade === "C") colorHex = "#F5A623";
      else if (grade === "D") colorHex = "#F56223";
      else if (grade === "E") colorHex = "#E53E3E";

      return {
        grade,
        count,
        percentage,
        strokeLength,
        strokeOffset,
        colorHex,
      };
    });
  }, [gradeCounts, totalGradesCount]);

  // Generate flat array of 84 dates for the 12-week heatmap (7 rows, 12 columns)
  // rendered via grid-flow-col grid-rows-7.
  // ponytail: flat array mapped to grid-flow-col avoids nested loops & aligns days of week perfectly
  const heatmapDays = useMemo(() => {
    const today = new Date(now);
    const todayDay = today.getDay(); // 0 is Sunday, 6 is Saturday

    // Align grid to Sunday of the current week
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - todayDay);
    currentSunday.setHours(0, 0, 0, 0);

    const startDate = new Date(currentSunday);
    startDate.setDate(currentSunday.getDate() - 11 * 7); // Start 11 weeks ago Sunday

    return Array.from({ length: 84 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  }, [now]);

  // Precompute month headings above columns
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = "";
    
    for (let col = 0; col < 12; col++) {
      const colSunday = heatmapDays[col * 7];
      if (!colSunday) continue;
      const monthName = colSunday.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
        month: "short",
      });
      
      if (monthName !== lastMonth) {
        labels.push({ text: monthName, colIndex: col });
        lastMonth = monthName;
      }
    }
    return labels;
  }, [heatmapDays, language]);

  // Compute adherence rate
  const adherenceStats = useMemo(() => {
    if (loggedDaysCount === 0) {
      return { rate: 100, healthy: 0, bad: 0 };
    }
    const healthy = loggedDaysList.filter(
      (key) => dayTotal(entries, key) <= SUGAR_LIMIT
    ).length;
    const bad = loggedDaysCount - healthy;
    const rate = Math.round((healthy / loggedDaysCount) * 100);
    return { rate, healthy, bad };
  }, [entries, loggedDaysList, loggedDaysCount]);

  // Format date nicely based on active locale
  const formatDateLabel = (d: Date) => {
    return d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Determine dynamic insight text if data is present
  const getInsightText = () => {
    if (loggedDaysCount === 0) {
      return t("habits_insights_empty");
    }

    const underLimitDaysCount = loggedDaysList.filter(
      (key) => dayTotal(entries, key) <= SUGAR_LIMIT
    ).length;

    const pctUnder = Math.round((underLimitDaysCount / loggedDaysCount) * 100);

    if (language === "id") {
      if (pctUnder === 100) {
        return "Luar biasa! 100% hari tercatat berada di bawah batas gula harian (25g). Pertahankan konsistensi ini untuk kesehatan jangka panjangmu!";
      } else if (pctUnder >= 75) {
        return `Bagus sekali! ${pctUnder}% hari tercatat berada di bawah batas rekomendasi. Kamu melakukan pekerjaan yang sangat baik dalam mengontrol konsumsi gula harian.`;
      } else if (pctUnder >= 50) {
        return `Kamu berhasil menjaga batas gula pada ${pctUnder}% hari tercatat. Gunakan fitur Pemindai Gula untuk mencari alternatif minuman sehat lainnya.`;
      } else {
        return `Perhatian khusus diperlukan. Hanya ${pctUnder}% hari tercatat yang berada di bawah batas gula harian. Cobalah beralih ke air putih atau fruit infusion hari ini.`;
      }
    } else {
      if (pctUnder === 100) {
        return "Amazing! 100% of your logged days are under the daily sugar limit (25g). Keep up this perfect consistency for your long-term health!";
      } else if (pctUnder >= 75) {
        return `Great job! ${pctUnder}% of your logged days are under the recommended limit. You are doing a fantastic job managing your daily sugar intake.`;
      } else if (pctUnder >= 50) {
        return `You kept sugar under the limit on ${pctUnder}% of logged days. Use the Sugar Scanner to discover healthier alternatives.`;
      } else {
        return `Attention recommended. Only ${pctUnder}% of logged days are below the daily limit. Try swapping to water or unsweetened infusions today.`;
      }
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("habits_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("habits_subtitle")}</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Current Streak */}
        <div className={cn(cardStyle, "flex items-center gap-4")}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("habits_current_streak")}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {streak} <span className="text-sm font-normal text-muted-foreground">{t("habits_streak_unit")}</span>
            </p>
          </div>
        </div>

        {/* Longest Streak */}
        <div className={cn(cardStyle, "flex items-center gap-4")}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("habits_longest_streak")}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {longest} <span className="text-sm font-normal text-muted-foreground">{t("habits_streak_unit")}</span>
            </p>
          </div>
        </div>

        {/* Days Recorded */}
        <div className={cn(cardStyle, "flex items-center gap-4")}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-500">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("habits_days_recorded")}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{loggedDaysCount}</p>
          </div>
        </div>
      </div>

      {/* Heatmap Card */}
      <div className={cardStyle}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Heatmap Calendar Section (Left 2 cols) */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-6">{t("habits_heatmap_title")}</h2>
            
            <div className="overflow-x-auto pb-2 scrollbar-none">
              <div className="flex min-w-[320px] flex-col gap-2">
                
                {/* Month labels header row */}
                <div className="flex gap-2.5">
                  {/* Spacing for Day Labels */}
                  <div className="w-8 shrink-0" />
                  
                  {/* Grid matching column columns width */}
                  <div className="grid grid-cols-12 gap-1.5 w-max">
                    {Array.from({ length: 12 }).map((_, colIdx) => {
                      const label = monthLabels.find((l) => l.colIndex === colIdx);
                      return (
                        <div key={colIdx} className="w-5 text-[10px] text-muted-foreground font-semibold select-none text-left truncate">
                          {label ? label.text : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar body: Day Labels on left, Grid on right */}
                <div className="flex gap-2.5 items-center">
                  {/* Day Labels column */}
                  <div className="grid grid-rows-7 gap-1.5 text-[10px] text-muted-foreground font-semibold w-8 shrink-0 text-right pr-1 select-none leading-5">
                    <span>{language === "id" ? "Min" : "Sun"}</span>
                    <span className="opacity-0">Sen</span>
                    <span>{language === "id" ? "Sel" : "Tue"}</span>
                    <span className="opacity-0">Rab</span>
                    <span>{language === "id" ? "Kam" : "Thu"}</span>
                    <span className="opacity-0">Jum</span>
                    <span>{language === "id" ? "Sab" : "Sat"}</span>
                  </div>

                  {/* 12-week cell grid */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
                    {heatmapDays.map((day, index) => {
                      const key = dateKey(day);
                      const dayEntries = ready ? entriesForDate(entries, key) : [];
                      const hasData = dayEntries.length > 0;
                      const totalSugar = dayTotal(entries, key);
                      const isOverLimit = totalSugar > SUGAR_LIMIT;
                      const isFuture = day.getTime() > now;

                      let cellColorClass = "bg-[#F1F3F5] hover:bg-slate-200/80"; // No data default
                      if (hasData) {
                        cellColorClass = isOverLimit 
                          ? "bg-[#FF4D4D] hover:bg-[#FF4D4D]/90" 
                          : "bg-[#63C71B] hover:bg-[#63C71B]/90";
                      }

                      // Tooltip message
                      const tooltip = `${formatDateLabel(day)}: ${
                        hasData 
                          ? `${totalSugar.toFixed(1)}g sugar` 
                          : isFuture 
                            ? t("habits_legend_none") 
                            : t("habits_legend_none")
                      }`;

                      return (
                        <div
                          key={index}
                          title={tooltip}
                          className={cn(
                            "h-5 w-5 rounded-[4px] transition-transform duration-150 hover:scale-110 cursor-pointer shadow-sm",
                            cellColorClass,
                            isFuture && "opacity-50 cursor-default hover:scale-100"
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Heatmap Legend (Aligned under grid) */}
                <div className="flex gap-2.5 mt-3">
                  <div className="w-8 shrink-0" />
                  <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-[3px] bg-[#63C71B]" />
                      <span>{t("habits_legend_under")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-[3px] bg-[#FF4D4D]" />
                      <span>{t("habits_legend_over")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-[3px] bg-[#F1F3F5]" />
                      <span>{t("habits_legend_none")}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Habit Pattern Summary Card (Right 1 col) */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
                {language === "id" ? "Analisis Pola" : "Pattern Analysis"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === "id" 
                  ? "Analisis ini memantau persentase kepatuhan konsumsi gula harian Anda di bawah batas WHO (25g)."
                  : "This analysis monitors your daily sugar consumption adherence rate under the WHO limit (25g)."}
              </p>
            </div>

            {/* Circular Adherence Gauge */}
            <div className="flex items-center gap-4 my-6">
              <div className="relative h-16 w-16 text-[#63C71B] shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="transition-all duration-1000 ease-out"
                    strokeDasharray={`${adherenceStats.rate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.5" className="text-[8px] font-bold text-foreground" textAnchor="middle" fill="currentColor">
                    {adherenceStats.rate}%
                  </text>
                </svg>
              </div>

              <div>
                <p className="text-sm font-bold text-foreground">
                  {language === "id" ? "Tingkat Kepatuhan" : "Adherence Rate"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {language === "id" 
                    ? `Skor rata-rata berdasarkan ${loggedDaysCount} hari` 
                    : `Average score based on ${loggedDaysCount} days`}
                </p>
              </div>
            </div>

            {/* Mini metrics list */}
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-auto">
              <div className="p-2 rounded-lg bg-green-50/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                  {language === "id" ? "Hari Sehat" : "Healthy Days"}
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">{adherenceStats.healthy}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                  {language === "id" ? "Melebihi Batas" : "Over Limit"}
                </p>
                <p className="text-lg font-bold text-red-500 mt-1">{adherenceStats.bad}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Insights and Grade Distribution Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Tips Box (Aligned horizontally, matches the screenshot) */}
        <div className={cn(cardStyle, "lg:col-span-2 flex items-center gap-3 p-5 min-h-[64px]")}>
          <div className="flex h-6 w-6 items-center justify-center text-[#63C71B]">
            <Lightbulb className="h-5 w-5" />
          </div>
          <p className="text-sm text-foreground font-medium">
            {language === "id" ? (
              streak > 0 
                ? `Kamu sedang dalam streak ${streak} hari di bawah batas 25g. Pertahankan!`
                : "Mulai kebiasaan sehat hari ini! Catat minuman rendah gulamu untuk memulai streak."
            ) : (
              streak > 0
                ? `You're on a ${streak}-day streak under your 25g limit. Keep it up!`
                : "Start a healthy habit today! Log your low-sugar drinks to start a streak."
            )}
          </p>
        </div>

        {/* Grade Distribution Box */}
        <div className={cn(cardStyle, "flex flex-col min-h-[260px]")}>
          <h3 className="font-semibold text-foreground mb-4">
            {t("habits_grade_dist_title")}
          </h3>

          {totalGradesCount === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center py-6">
              <p className="text-sm text-muted-foreground">{t("habits_grade_dist_empty")}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-2">
              {/* SVG Pie/Donut Chart */}
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Background track circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="10"
                  />
                  {segments.map((seg) => (
                    <circle
                      key={seg.grade}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={seg.colorHex}
                      strokeWidth="10"
                      strokeDasharray={`${seg.strokeLength} 251.327`}
                      strokeDashoffset={-seg.strokeOffset}
                      className="animate-donut-segment transition-all duration-500 ease-out"
                    />
                  ))}
                </svg>
              </div>

              {/* Legend list below */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5 text-xs font-semibold text-muted-foreground">
                {segments.map((seg) => (
                  <div key={seg.grade} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: seg.colorHex }}
                    />
                    <span>
                      {seg.grade} ({seg.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
