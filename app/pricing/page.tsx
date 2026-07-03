"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBlur from "../components/PageBlur";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      <Navbar />
      <PageBlur />
      
      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background blobs for premium glassmorphic effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-400/10 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {t("pricing_title")}
            </h1>
            <p className="text-lg text-slate-600">
              {t("pricing_subtitle")}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <div className="relative inline-flex items-center p-1 bg-slate-100/80 rounded-full border border-slate-200/50 backdrop-blur-sm">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
                  !isYearly ? "text-slate-900 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t("pricing_monthly")}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2",
                  isYearly ? "text-slate-900 shadow-sm bg-white" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {t("pricing_yearly")}
                <span className="px-2 py-0.5 text-[10px] font-bold text-green-700 bg-green-100 rounded-full tracking-wider uppercase">
                  {t("pricing_save")}
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {/* Basic Plan */}
            <div className="bg-liquid-glass p-8 rounded-[32px] border border-white/40 shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("pricing_basic")}</h3>
                <p className="text-sm text-slate-500 min-h-[40px]">{t("pricing_basic_desc")}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{t("pricing_basic_price")}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <FeatureItem text={t("pricing_feat_scan")} included={true} />
                <FeatureItem text={t("pricing_feat_limit")} included={true} />
                <FeatureItem text={t("pricing_feat_history_7")} included={true} />
                <FeatureItem text={t("pricing_feat_history_unlimited")} included={false} />
                <FeatureItem text={t("pricing_feat_ai")} included={false} />
                <FeatureItem text={t("pricing_feat_habits")} included={false} />
              </div>

              <Link
                href="/login"
                className="block w-full py-3.5 text-center rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-sm"
              >
                {t("pricing_btn_current")}
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative bg-white p-8 rounded-[32px] border border-green-200 shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full overflow-hidden">
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 blur-[40px] pointer-events-none" />
              
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{t("pricing_premium")}</h3>
                  <span className="px-3 py-1 text-xs font-bold text-white bg-glucofy-gradient rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
                <p className="text-sm text-slate-500 min-h-[40px]">{t("pricing_premium_desc")}</p>
              </div>
              
              <div className="relative z-10 mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {isYearly ? t("pricing_premium_price_yr") : t("pricing_premium_price_mo")}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    {isYearly ? t("pricing_premium_period_yr") : t("pricing_premium_period_mo")}
                  </span>
                </div>
                {isYearly && (
                  <p className="text-xs text-green-600 font-medium mt-1">{t("pricing_premium_billed_yearly")}</p>
                )}
              </div>

              <div className="relative z-10 space-y-4 mb-8 flex-1">
                <FeatureItem text={t("pricing_feat_scan")} included={true} />
                <FeatureItem text={t("pricing_feat_limit")} included={true} />
                <FeatureItem text={t("pricing_feat_history_unlimited")} included={true} />
                <FeatureItem text={t("pricing_feat_ai")} included={true} />
                <FeatureItem text={t("pricing_feat_habits")} included={true} />
              </div>

              <Link
                href="/login"
                className="relative z-10 block w-full py-3.5 text-center rounded-2xl bg-glucofy-gradient text-white font-semibold hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm"
              >
                {t("pricing_btn_upgrade")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function FeatureItem({ text, included }: { text: string; included: boolean }) {
  return (
    <div className="flex items-start gap-3">
      {included ? (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
          <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
        </div>
      ) : (
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
          <X className="w-4 h-4 text-slate-300" strokeWidth={2} />
        </div>
      )}
      <span className={cn("text-sm", included ? "text-slate-700 font-medium" : "text-slate-400")}>
        {text}
      </span>
    </div>
  );
}
