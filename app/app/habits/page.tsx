"use client";

import { useState, useMemo, useEffect } from "react";
import { Flame, TrendingUp, Lightbulb, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  getLastConsumption,
  getDashboardSummary,
  getWeeklyChart,
  type ConsumptionLog,
  type DashboardSummary,
  type WeeklyChartResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const cardStyle = "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md border-primary/10";

// date helpers (local time)
const dateKey = (d: Date | number) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const gradeMap: Record<string, "A" | "B" | "C" | "D" | "E"> = {
  A: "A", B: "B", C: "C", D: "D",
};

export default function HabitsPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [now] = useState(() => Date.now());
  const [logs, setLogs] = useState<ConsumptionLog[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyChartResponse | null>(null);

  const loadData = async () => {
    try {
      const [l, s, w] = await Promise.all([
        getLastConsumption(),
        getDashboardSummary(),
        getWeeklyChart(),
      ]);
      setLogs(l.data);
      setSummary(s);
      setWeeklyData(w);
    } catch (err) {
      console.error("Failed to load habits data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const limit = summary?.dailyLimit ?? 25;
  const streak = summary?.currentStreak ?? 0;
  const longest = summary?.longestStreak ?? 0;

  // Build a consolidated map of logged days: YYYY-MM-DD -> totalSugar
  const loggedDays = useMemo(() => {
    const daysMap = new Map<string, number>();

    // 1. Group recent logs by date
    logs.forEach((log) => {
      const key = log.consumedAt.split("T")[0];
      const sugar = (log.sugarPer100ml * log.servingSizeMl) / 100;
      daysMap.set(key, (daysMap.get(key) ?? 0) + sugar);
    });

    // 2. Overwrite with weekly chart data (ground truth for last 7 days)
    weeklyData?.data.forEach((p) => {
      if (p.totalSugar > 0 || p.logCount > 0) {
        daysMap.set(p.date, p.totalSugar);
      } else {
        daysMap.delete(p.date);
      }
    });

    return daysMap;
  }, [logs, weeklyData]);

  const loggedDaysList = useMemo(() => Array.from(loggedDays.keys()), [loggedDays]);
  const loggedDaysCount = loggedDaysList.length;

  // Compute adherence rate
  const adherenceStats = useMemo(() => {
    if (loggedDaysCount === 0) {
      return { rate: 100, healthy: 0, bad: 0 };
    }
    const healthy = loggedDaysList.filter((key) => {
      const totalSugar = loggedDays.get(key) ?? 0;
      return totalSugar <= limit;
    }).length;
    const bad = loggedDaysCount - healthy;
    const rate = Math.round((healthy / loggedDaysCount) * 100);
    return { rate, healthy, bad };
  }, [loggedDays, loggedDaysList, loggedDaysCount, limit]);

  // Grade counts for distribution (from recent logs)
  const gradeCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    logs.forEach((e) => {
      const grade = gradeMap[e.nutriGrade] ?? "A";
      if (counts[grade] !== undefined) counts[grade]++;
    });
    return counts;
  }, [logs]);

  const totalGradesCount = useMemo(() => {
    return Object.values(gradeCounts).reduce((a, b) => a + b, 0);
  }, [gradeCounts]);

  const segments = useMemo(() => {
    if (totalGradesCount === 0) return [];
    
    const activeGrades = (["A", "B", "C", "D", "E"] as const)
      .map((grade) => ({ grade, count: gradeCounts[grade] || 0 }))
      .filter((g) => g.count > 0);

    const radius = 40;
    const circumference = 2 * Math.PI * radius; // ~251.327
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

    const pctUnder = adherenceStats.rate;

    if (language === "id") {
      if (pctUnder === 100) {
        return `Luar biasa! 100% hari tercatat berada di bawah batas gula harian (${limit}g). Pertahankan konsistensi ini untuk kesehatan jangka panjangmu!`;
      } else if (pctUnder >= 75) {
        return `Bagus sekali! ${pctUnder}% hari tercatat berada di bawah batas rekomendasi. Kamu melakukan pekerjaan yang sangat baik dalam mengontrol konsumsi gula harian.`;
      } else if (pctUnder >= 50) {
        return `Kamu berhasil menjaga batas gula pada ${pctUnder}% hari tercatat. Gunakan fitur Pemindai Gula untuk mencari alternatif minuman sehat lainnya.`;
      } else {
        return `Perhatian khusus diperlukan. Hanya ${pctUnder}% hari tercatat yang berada di bawah batas gula harian. Cobalah beralih ke air putih atau fruit infusion hari ini.`;
      }
    } else {
      if (pctUnder === 100) {
        return `Amazing! 100% of your logged days are under the daily sugar limit (${limit}g). Keep up this perfect consistency for your long-term health!`;
      } else if (pctUnder >= 75) {
        return `Great job! ${pctUnder}% of your logged days are under the recommended limit. You are doing a fantastic job managing your daily sugar intake.`;
      } else if (pctUnder >= 50) {
        return `You kept sugar under the limit on ${pctUnder}% of logged days. Use the Sugar Scanner to discover healthier alternatives.`;
      } else {
        return `Attention recommended. Only ${pctUnder}% of logged days are below the daily limit. Try swapping to water or unsweetened infusions today.`;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                      const hasData = loggedDays.has(key);
                      const totalSugar = loggedDays.get(key) ?? 0;
                      const isOverLimit = totalSugar > limit;
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
                  ? `Analisis ini memantau persentase kepatuhan konsumsi gula harian Anda di bawah batas target (${limit}g).`
                  : `This analysis monitors your daily sugar consumption adherence rate under your limit (${limit}g).`}
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
        {/* Tips Box (Aligned horizontally) */}
        <div className={cn(cardStyle, "lg:col-span-2 flex items-center gap-3 p-5 min-h-[64px]")}>
          <div className="flex h-6 w-6 items-center justify-center text-[#63C71B]">
            <Lightbulb className="h-5 w-5" />
          </div>
          <p className="text-sm text-foreground font-medium">
            {language === "id" ? (
              streak > 0 
                ? `Kamu sedang dalam streak ${streak} hari di bawah batas ${limit}g. Pertahankan!`
                : "Mulai kebiasaan sehat hari ini! Catat minuman rendah gulamu untuk memulai streak."
            ) : (
              streak > 0
                ? `You're on a ${streak}-day streak under your ${limit}g limit. Keep it up!`
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
