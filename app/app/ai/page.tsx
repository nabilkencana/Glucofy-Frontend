"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Lightbulb, Inbox, Crown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../_components/toast";
import { GradeBadge } from "../_components/grade-badge";
import { cn } from "@/lib/utils";
import {
  getDashboardSummary,
  getAIRecommendations,
  type DashboardSummary,
  type SummarizeResponse,
} from "@/lib/api";


const cardStyle = "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md";

type Grade = "A" | "B" | "C" | "D" | "E";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

function Skel({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export default function AIPage() {
  const { t, language } = useLanguage();
  const toast = useToast();
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real API state
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [aiData, setAiData] = useState<SummarizeResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Grade color mappings
  const gradeColors: Record<Grade, string> = {
    A: "bg-[#1D7F3A]",
    B: "bg-[#63C71B]",
    C: "bg-[#F5A623]",
    D: "bg-[#F56223]",
    E: "bg-[#E53E3E]",
  };

  const fetchAIRecommendations = () => {
    setAiLoading(true);
    setAiError(null);
    getAIRecommendations()
      .then(setAiData)
      .catch((err) => {
        setAiError(
          err?.status === 403
            ? "AI recommendations require a premium subscription."
            : "Failed to fetch recommendations. Please try again."
        );
      })
      .finally(() => setAiLoading(false));
  };

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
    fetchAIRecommendations();
  }, []);

  // Chat
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      let aiResponseText = "";
      const textLower = text.toLowerCase();
      if (textLower.includes("aman") || textLower.includes("safe")) {
        aiResponseText = language === "id"
          ? "Berdasarkan catatanmu hari ini, asupan gulamu aman dan masih di bawah rekomendasi batas harian WHO. Terus pertahankan pilihan sehat ini!"
          : "Based on your records today, your sugar intake is safe and well below the WHO recommended daily limit. Keep up these healthy choices!";
      } else if (textLower.includes("rekomendasi") || textLower.includes("recommend") || textLower.includes("rendah") || textLower.includes("low")) {
        aiResponseText = language === "id"
          ? "Tentu! Beberapa alternatif sehat rendah gula: teh hijau tawar hangat (0g), air kelapa murni (3g/100ml - Grade B), atau soda air dengan irisan lemon."
          : "Certainly! Some healthy low-sugar alternatives: warm unsweetened green tea (0g), pure coconut water (3g/100ml - Grade B), or sparkling water with lemon slices.";
      } else {
        aiResponseText = language === "id"
          ? "Pertanyaan bagus! Secara umum, konsumsi gula berlebih dapat memicu resistensi insulin. Glucofy merekomendasikan minuman dengan grade A atau B."
          : "Great question! Excess sugar consumption can trigger insulin resistance. Glucofy recommends beverages graded A or B.";
      }
      setChatHistory((prev) => [...prev, { id: `ai-${Date.now()}`, sender: "ai", text: aiResponseText }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(chatInput);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("ai_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("ai_subtitle")}</p>
      </div>

      {/* Stats card from dashboard-summary */}
      <div className={cn(cardStyle, "flex flex-col sm:flex-row items-center gap-6 p-6")}>
        {statsLoading ? (
          <Skel className="h-20 w-20 rounded-full shrink-0" />
        ) : (
          <div className={cn(
            "h-20 w-20 flex shrink-0 items-center justify-center rounded-full text-white text-4xl font-extrabold shadow-soft",
            summary && summary.currentStreak > 0 ? "bg-[#63C71B]" : "bg-[#1D7F3A]"
          )}>
            🔥
          </div>
        )}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("ai_overall_grade")}
          </p>
          {statsLoading ? (
            <Skel className="h-6 w-48" />
          ) : (
            <h2 className="text-xl font-bold text-foreground">
              {summary?.consumedToday.toFixed(1)}g today · limit {summary?.dailyLimit.toFixed(1)}g
            </h2>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t("ai_streak")}:{" "}
            <span className="font-semibold text-foreground">
              {summary?.currentStreak ?? 0} {t("habits_streak_unit")}
            </span>{" "}
            · longest{" "}
            <span className="font-semibold text-foreground">
              {summary?.longestStreak ?? 0} {t("habits_streak_unit")}
            </span>
          </p>
        </div>
      </div>

      {/* AI Recommendations — POST /summarize */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            {language === "id" ? "Rekomendasi AI" : "AI Recommendations"}
          </h3>
          <button
            onClick={fetchAIRecommendations}
            disabled={aiLoading}
            className="text-xs border border-border bg-card hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer disabled:opacity-60"
          >
            {aiLoading ? (language === "id" ? "Memuat..." : "Loading...") : (language === "id" ? "Muat Rekomendasi" : "Load Recommendations")}
          </button>
        </div>

        {aiError && aiError.toLowerCase().includes("premium") && (
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-yellow-200 bg-yellow-50/50 my-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-bounce">
              <Crown className="h-6 w-6 fill-current" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              {language === "id" ? "Fitur Premium Glucofy" : "Glucofy Premium Feature"}
            </h4>
            <p className="text-sm text-slate-600 max-w-sm mt-2 leading-relaxed">
              {language === "id"
                ? "Dapatkan rekomendasi kesehatan kustom berbasis AI dan analisis pola konsumsi gula dengan berlangganan Premium."
                : "Unlock custom AI-based health recommendations and sugar consumption pattern analysis with Premium."}
            </p>
            <button
              onClick={() => {
                toast(language === "id" ? "Terima kasih atas antusiasme Anda! Fitur berlangganan Premium segera hadir." : "Thank you for your interest! Premium subscriptions are coming soon.");
              }}
              className="mt-5 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold rounded-full shadow transition-all duration-300 hover:scale-[1.02]"
            >
              {language === "id" ? "Upgrade ke Premium" : "Upgrade to Premium"}
            </button>
          </div>
        )}

        {aiError && !aiError.toLowerCase().includes("premium") && (
          <p className="text-sm text-red-500 mb-3">{aiError}</p>
        )}

        {!aiData && !aiLoading && !aiError && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Inbox className="h-6 w-6 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground max-w-md">{t("ai_no_patterns")}</p>
          </div>
        )}

        {aiLoading && (
          <div className="space-y-3">
            <Skel className="h-16 w-full" />
            <Skel className="h-10 w-3/4" />
            <Skel className="h-10 w-2/3" />
          </div>
        )}

        {aiData && !aiLoading && (
          <div className="space-y-4">
            <p className="text-sm text-foreground leading-relaxed">{aiData.recommendation}</p>
            {aiData.tips.length > 0 && (
              <div className="divide-y divide-border/60 mt-2">
                {aiData.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0 items-start">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#63C71B] mt-0.5">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}
            {(aiData.bmi != null || aiData.avgDailySugar != null) && (
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
                {aiData.bmi != null && (
                  <span>
                    BMI: <strong className="text-foreground">{aiData.bmi.toFixed(1)}</strong>
                    {aiData.bmiCategory ? ` (${aiData.bmiCategory})` : ""}
                  </span>
                )}
                {aiData.avgDailySugar != null && (
                  <span>
                    Avg daily sugar:{" "}
                    <strong className="text-foreground">{aiData.avgDailySugar.toFixed(1)}g</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic limit hint */}
      <div className={cn(cardStyle, "flex items-start gap-3 p-5")}>
        <div className="flex h-6 w-6 items-center justify-center text-[#63C71B] shrink-0">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground">{t("ai_dynamic_limit_title")}</h4>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {t("ai_dynamic_limit_desc")}{" "}
            <span className="font-extrabold text-[#63C71B]">
              {summary ? `${summary.dailyLimit.toFixed(1)}g` : "…"}
            </span>.
          </p>
        </div>
      </div>

      {/* Chat */}
      <div className={cn(cardStyle, "flex flex-col space-y-4 h-[450px] relative overflow-hidden")}>
        {/* On-going Feature Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-slate-50/90 backdrop-blur-[2px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3 animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            {language === "id" ? "Fitur Dalam Pengembangan" : "On-going Feature"}
          </h4>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            {language === "id"
              ? "Fitur tanya jawab asisten kesehatan Glucofy AI sedang dalam pengembangan dan segera hadir."
              : "Glucofy AI health assistant chat feature is currently under development and will be available soon."}
          </p>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{t("ai_chat_title")}</h3>
            <p className="text-xs text-muted-foreground">{t("ai_chat_eg")}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200 uppercase tracking-wider shrink-0">
            {language === "id" ? "Dalam Pengembangan" : "On-going Feature"}
          </span>
        </div>
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
          {isTyping && (
            <div className="bg-card text-foreground border border-border mr-auto rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("ai_chat_quick")}</p>
          <div className="flex flex-wrap gap-2">
            {[t("ai_chat_q1"), t("ai_chat_q2"), t("ai_chat_q3")].map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="text-xs border border-border bg-card hover:bg-muted text-foreground px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
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
