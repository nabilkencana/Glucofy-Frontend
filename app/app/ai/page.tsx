"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Send, Sparkles, Lightbulb, Inbox } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  useLog,
  SUGAR_LIMIT,
  dateKey,
  entriesForDate,
  gradeForSugar,
  type LogEntry,
  type Grade,
} from "../_lib/log-store";
import { GradeBadge } from "../_components/grade-badge";
import { cn } from "@/lib/utils";

const cardStyle = "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

function streakLengths(entries: LogEntry[]) {
  if (entries.length === 0) return { current: 0, longest: 0 };

  const loggedDates = Array.from(new Set(entries.map((e) => dateKey(e.ts)))).sort();
  if (loggedDates.length === 0) return { current: 0, longest: 0 };

  const todayStr = dateKey(Date.now());
  const datesSet = new Set(loggedDates);

  const firstDate = new Date(loggedDates[0]);
  const endDate = new Date();
  firstDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let current = 0;
  let longest = 0;
  let tempDate = new Date(firstDate);

  while (tempDate <= endDate) {
    const key = dateKey(tempDate);
    const hasLog = datesSet.has(key);

    if (hasLog) {
      current++;
      longest = Math.max(longest, current);
    } else {
      // Skip day: breaks streak unless it's today
      if (key !== todayStr) {
        current = 0;
      }
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return { current, longest: Math.max(longest, current) };
}

export default function AIPage() {
  const { t, language } = useLanguage();
  const { ready, entries } = useLog();
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat history with localized welcome message
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "ai",
      text:
        language === "id"
          ? "Halo! Saya adalah Glucofy AI. Ajukan pertanyaan seputar asupan gula, risiko diabetes, atau alternatif minuman sehat."
          : "Hello! I am Glucofy AI. Ask me questions about your sugar intake, diabetes risks, or healthy beverage alternatives.",
    },
  ]);

  // Sync welcome message if language changes and chat has only the welcome message
  useEffect(() => {
    if (chatHistory.length === 1 && chatHistory[0].id === "welcome") {
      setChatHistory([
        {
          id: "welcome",
          sender: "ai",
          text:
            language === "id"
              ? "Halo! Saya adalah Glucofy AI. Ajukan pertanyaan seputar asupan gula, risiko diabetes, atau alternatif minuman sehat."
              : "Hello! I am Glucofy AI. Ask me questions about your sugar intake, diabetes risks, or healthy beverage alternatives.",
        },
      ]);
    }
  }, [language, chatHistory.length]);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    if (!ready || entries.length === 0) {
      return {
        avgSugar30Days: 0,
        grade: "A" as Grade,
        gradeLabel: t("ai_overall_excellent"),
        total7Days: 0,
        avgDaily7Days: 0,
        streak: 0,
      };
    }

    const nowMs = Date.now();
    const thirtyDaysAgoMs = nowMs - 30 * 24 * 60 * 60 * 1000;
    const sevenDaysAgoMs = nowMs - 7 * 24 * 60 * 60 * 1000;

    // 30 days average sugar per 100ml
    const entries30Days = entries.filter((e) => e.ts >= thirtyDaysAgoMs);
    const avgSugar30Days = entries30Days.length
      ? entries30Days.reduce((sum, e) => sum + e.sugarPer100ml, 0) / entries30Days.length
      : 0;

    const gradeInfo = gradeForSugar(avgSugar30Days);

    // 7 days total sugar
    const entries7Days = entries.filter((e) => e.ts >= sevenDaysAgoMs);
    const total7Days = entries7Days.reduce((sum, e) => sum + e.totalSugar, 0);
    const avgDaily7Days = total7Days / 7;

    const { current: streak } = streakLengths(entries);

    // Localized grade label
    let gradeLabel = t("ai_overall_excellent");
    if (gradeInfo.grade === "B") gradeLabel = t("ai_overall_good");
    else if (gradeInfo.grade === "C") gradeLabel = t("ai_overall_moderate");
    else if (gradeInfo.grade === "D") gradeLabel = t("ai_overall_high");
    else if (gradeInfo.grade === "E") gradeLabel = t("ai_overall_high"); // Map to High as per mockup

    return {
      avgSugar30Days,
      grade: gradeInfo.grade,
      gradeLabel,
      total7Days,
      avgDaily7Days,
      streak,
    };
  }, [entries, ready, t]);

  // Dynamic Pattern Detection
  const detectedPatterns = useMemo(() => {
    if (!ready || entries.length === 0) return [];

    const patterns: string[] = [];
    const nowMs = Date.now();
    
    // Check morning sugar habits (6am to 11am)
    const morningHighEntries = entries.filter((e) => {
      const hours = new Date(e.ts).getHours();
      return hours >= 6 && hours < 11 && (e.grade === "D" || e.grade === "E");
    });

    if (morningHighEntries.length >= 2) {
      patterns.push(
        language === "id"
          ? "Konsumsi gula tinggi di pagi hari terdeteksi (rata-rata grade D/E). Cobalah beralih ke teh tawar atau air lemon hangat."
          : "High morning sugar intake detected (average grade D/E). Try switching to unsweetened tea or warm lemon water."
      );
    }

    // Check fluctuations/overlimit
    const overLimitDays = Array.from(new Set(entries.map((e) => dateKey(e.ts)))).filter((key) => {
      const total = entriesForDate(entries, key).reduce((s, e) => s + e.totalSugar, 0);
      return total > SUGAR_LIMIT;
    });

    if (overLimitDays.length >= 2) {
      patterns.push(
        language === "id"
          ? "Fluktuasi harian terdeteksi. Asupan gulamu melebihi batas 25g pada beberapa hari terakhir. Prioritaskan minuman dengan nutri-grade A atau B."
          : "Daily fluctuations detected. Your sugar intake exceeded the 25g limit on some days. Prioritize beverages with nutri-grade A or B."
      );
    }

    // Healthy pattern
    const uniqueLoggedDays = new Set(entries.map((e) => dateKey(e.ts)));
    if (uniqueLoggedDays.size >= 3 && overLimitDays.length === 0) {
      patterns.push(
        language === "id"
          ? "Pola hidup sehat sangat konsisten! Semua minuman yang tercatat berada di bawah batas harian 25g. Pertahankan kebiasaan luar biasa ini!"
          : "Highly consistent healthy lifestyle! All recorded beverages are below the daily 25g limit. Keep up this amazing habit!"
      );
    }

    // Fallback if logs exist but no patterns matched
    if (patterns.length === 0) {
      patterns.push(
        language === "id"
          ? "Pola konsumsi stabil terdeteksi. Teruskan memantau asupan harianmu untuk menjaga kadar gula tetap seimbang."
          : "Stable consumption pattern detected. Continue monitoring your daily intake to maintain balanced sugar levels."
      );
    }

    return patterns;
  }, [entries, ready, language]);

  // Chat simulator action
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI typing delay and reply
    setTimeout(() => {
      let aiResponseText = "";
      const textLower = text.toLowerCase();

      if (textLower.includes("aman") || textLower.includes("safe")) {
        aiResponseText =
          language === "id"
            ? "Berdasarkan catatanmu hari ini, asupan gulamu aman dan masih di bawah rekomendasi batas harian 25g WHO. Terus pertahankan pilihan sehat ini!"
            : "Based on your records today, your sugar intake is safe and well below the WHO recommended daily limit of 25g. Keep up these healthy choices!";
      } else if (textLower.includes("rekomendasi") || textLower.includes("recommend") || textLower.includes("rendah") || textLower.includes("low")) {
        aiResponseText =
          language === "id"
            ? "Tentu! Berikut beberapa alternatif sehat rendah gula: teh hijau tawar hangat (0g), air kelapa murni tanpa sirup (3g/100ml - Grade B), fruit infusion dengan stroberi dan mint, atau soda air dengan irisan lemon."
            : "Certainly! Here are some healthy low-sugar alternatives: warm unsweetened green tea (0g), pure coconut water without syrup (3g/100ml - Grade B), fruit infusion with strawberries and mint, or sparkling water with lemon slices.";
      } else if (textLower.includes("risiko") || textLower.includes("risk") || textLower.includes("pola") || textLower.includes("pattern")) {
        aiResponseText =
          language === "id"
            ? "Menurut data 30 hari terakhir, asupan gulamu tergolong baik. Namun, fluktuasi asupan tinggi gula sesekali dapat meningkatkan beban insulin. Tetap konsisten menjaga batas 25g untuk mencegah risiko diabetes tipe 2."
            : "According to your last 30 days of data, your sugar intake is generally good. However, occasional high-sugar spikes can increase insulin load. Stay consistent under the 25g limit to prevent type 2 diabetes risks.";
      } else {
        aiResponseText =
          language === "id"
            ? "Pertanyaan yang sangat bagus! Secara umum, konsumsi gula berlebih dapat memicu resistensi insulin dan kelelahan kronis. Glucofy merekomendasikan untuk membatasi konsumsi minuman kemasan dengan grade C, D, atau E dan beralih ke alternatif alami seperti air putih hangat."
            : "That is a very good question! In general, excess sugar consumption can trigger insulin resistance and chronic fatigue. Glucofy recommends limiting packaged drinks graded C, D, or E and switching to natural alternatives like warm plain water.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
      };

      setChatHistory((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(chatInput);
    }
  };

  // Grade color mappings
  const gradeColors: Record<Grade, string> = {
    A: "bg-[#1D7F3A]",
    B: "bg-[#63C71B]",
    C: "bg-[#F5A623]",
    D: "bg-[#F56223]",
    E: "bg-[#E53E3E]",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("ai_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("ai_subtitle")}</p>
      </div>

      {/* Overall Grade Card */}
      <div className={cn(cardStyle, "flex flex-col sm:flex-row items-center gap-6 p-6")}>
        {/* Large Grade Circle */}
        <div className={cn(
          "h-20 w-20 flex shrink-0 items-center justify-center rounded-full text-white text-4xl font-extrabold shadow-soft",
          gradeColors[stats.grade]
        )}>
          {stats.grade}
        </div>

        {/* Grade Details */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("ai_overall_grade")}
          </p>
          <h2 className="text-xl font-bold text-foreground">
            {stats.gradeLabel} — {stats.avgSugar30Days.toFixed(1)}g/100ml avg
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("ai_total_7_days")}: <span className="font-semibold text-foreground">{stats.total7Days.toFixed(1)}g</span> &middot;{" "}
            {t("ai_daily_avg")}: <span className="font-semibold text-foreground">{stats.avgDaily7Days.toFixed(1)}g</span> &middot;{" "}
            {t("ai_streak")}: <span className="font-semibold text-foreground">{stats.streak} {t("habits_streak_unit")}</span>
          </p>
        </div>
      </div>

      {/* Pattern Detection Card */}
      <div className={cardStyle}>
        {detectedPatterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("ai_no_patterns")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              {language === "id" ? "Pola Konsumsi Terdeteksi" : "Detected Consumption Patterns"}
            </h3>
            <div className="divide-y divide-border/60">
              {detectedPatterns.map((pattern, index) => (
                <div key={index} className="flex gap-3 py-3 first:pt-0 last:pb-0 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#63C71B] mt-0.5">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{pattern}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Limit Card */}
      <div className={cn(cardStyle, "flex items-start gap-3 p-5")}>
        <div className="flex h-6 w-6 items-center justify-center text-[#63C71B] shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">{t("ai_dynamic_limit_title")}</h4>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {t("ai_dynamic_limit_desc")}{" "}
            <span className="font-extrabold text-[#63C71B]">{SUGAR_LIMIT}g</span>.
          </p>
        </div>
      </div>

      {/* Ask Glucofy AI Chat Box */}
      <div className={cn(cardStyle, "flex flex-col space-y-4 h-[450px]")}>
        <div>
          <h3 className="font-semibold text-foreground">{t("ai_chat_title")}</h3>
          <p className="text-xs text-muted-foreground">{t("ai_chat_eg")}</p>
        </div>

        {/* Scrollable Chat Area */}
        <div className="flex-1 overflow-y-auto border border-border rounded-xl p-4 space-y-4 bg-slate-50/50 scrollbar-none">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex max-w-[85%] flex-col rounded-2xl p-3 text-sm shadow-sm",
                msg.sender === "user"
                  ? "bg-brand-gradient text-white ml-auto rounded-tr-none"
                  : "bg-card text-foreground border border-border mr-auto rounded-tl-none"
              )}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="bg-card text-foreground border border-border mr-auto rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Row */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("ai_chat_quick")}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSendMessage(t("ai_chat_q1"))}
              className="text-xs border border-border bg-card hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
            >
              {t("ai_chat_q1")}
            </button>
            <button
              onClick={() => handleSendMessage(t("ai_chat_q2"))}
              className="text-xs border border-border bg-card hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
            >
              {t("ai_chat_q2")}
            </button>
            <button
              onClick={() => handleSendMessage(t("ai_chat_q3"))}
              className="text-xs border border-border bg-card hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
            >
              {t("ai_chat_q3")}
            </button>
          </div>
        </div>

        {/* Text Input Row */}
        <div className="flex gap-2">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("ai_chat_placeholder")}
            className="flex-1 min-h-[44px] max-h-[44px] border border-border rounded-xl px-4 py-2.5 text-sm bg-card placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none scrollbar-none text-foreground"
          />
          <button
            onClick={() => handleSendMessage(chatInput)}
            aria-label="Send message"
            className="h-11 w-11 flex shrink-0 items-center justify-center rounded-xl bg-brand-gradient hover:opacity-95 text-white shadow-soft transition-opacity cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
