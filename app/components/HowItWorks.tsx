"use client";

import { motion } from "framer-motion";
import { Camera, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      id: "01",
      title: t("how_step1_title"),
      badge: t("how_step1_badge"),
      description: t("how_step1_desc"),
      tag: t("how_step1_tag"),
      // Miniature UI Mockup for Scan
      mockup: (
        <div className="w-full max-w-[280px] bg-white dark:bg-green-900/10 border border-slate-100 dark:border-green-900/30 rounded-3xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.015)] relative overflow-hidden">
          <div className="absolute inset-0 border-2 border-dashed border-green-500/30 rounded-3xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t("how_step1_view")}</span>
            <div className="px-2 py-0.5 rounded bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              {t("how_step1_processing")}
            </div>
          </div>
          <div className="h-28 rounded-2xl bg-slate-50 dark:bg-green-950 border border-slate-100 dark:border-green-900/30 flex flex-col items-center justify-center gap-2 mb-3 relative overflow-hidden">
            <Camera className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Nutrition_Label.jpg</span>
            <div className="absolute left-0 right-0 h-0.5 bg-green-400/50 animate-[bounce_3s_infinite]" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">{t("how_step1_sugar")}:</span>
            <span className="text-red-500 font-bold">14g</span>
          </div>
        </div>
      ),
    },
    {
      id: "02",
      title: t("how_step2_title"),
      badge: t("how_step2_badge"),
      description: t("how_step2_desc"),
      tag: t("how_step2_tag"),
      mockup: (
        <div className="w-full max-w-[280px] bg-white dark:bg-green-900/10 border border-slate-100 dark:border-green-900/30 rounded-3xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.015)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">{t("how_step2_view")}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">1:45 PM</span>
          </div>
          
          <div className="space-y-2 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">{t("how_step2_tea")}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">+12g sugar</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-green-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full w-[92%]" />
            </div>
          </div>

          <div className="flex gap-2.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-left">
              <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400 block">{t("how_step2_warn")}</span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 leading-normal block">{t("how_step2_warn_desc")}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "03",
      title: t("how_step3_title"),
      badge: t("how_step3_badge"),
      description: t("how_step3_desc"),
      tag: t("how_step3_tag"),
      mockup: (
        <div className="w-full max-w-[280px] bg-white dark:bg-green-900/10 border border-slate-100 dark:border-green-900/30 rounded-3xl p-5 shadow-[0_4px_20px_rgba(15,23,42,0.015)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-green-500/50">{t("how_step3_view")}</span>
            <span className="text-[10px] font-semibold text-glucofy-green">{t("how_step3_choice")}</span>
          </div>
          
          <div className="space-y-3">
            {/* Swap Visual */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-green-950 border border-slate-100 dark:border-green-900/30 rounded-xl">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 dark:text-green-500/60 block font-medium">{t("how_step3_instead")}</span>
                <span className="text-xs font-bold text-slate-600 dark:text-green-100">{t("how_step3_instead_val")}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-green-800" />
              <div className="text-left">
                <span className="text-[10px] text-glucofy-green block font-bold">{t("how_step3_try")}</span>
                <span className="text-xs font-bold text-green-700 dark:text-green-400">{t("how_step3_try_val")}</span>
              </div>
            </div>
            
            {/* Success message */}
            <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-450 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-450" />
              <span>{t("how_step3_save")}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-28 bg-white dark:bg-green-950 relative overflow-hidden transition-colors duration-200">
      
      {/* Background soft circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(34,197,94,0.03)_0%,transparent_70%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-28">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {t("how_title")}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("how_subtitle")}
          </motion.p>
        </div>

        {/* Steps Flow (Alternating on desktop, stacked on mobile) */}
        <div className="space-y-16 md:space-y-28 lg:space-y-36">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative"
              >
                
                {/* Massive Low-Opacity Watermark Number behind step block */}
                <div className="absolute top-[-4rem] left-0 lg:left-[5%] pointer-events-none -z-10 font-black text-slate-900/[0.03] dark:text-slate-100/[0.02] select-none text-[8rem] sm:text-[12rem] lg:text-[15rem] leading-none">
                  {step.id}
                </div>

                {/* Text Content Column */}
                <motion.div
                  className={`lg:col-span-6 space-y-5 text-center lg:text-left ${
                    isEven ? "lg:order-1 lg:pr-12" : "lg:order-2 lg:pl-12"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/30 text-xs font-semibold text-green-700 dark:text-green-400 shadow-sm">
                    {step.badge}
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light text-base sm:text-lg">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>{step.tag}</span>
                  </div>
                </motion.div>

                {/* Mockup Column */}
                <motion.div
                  className={`lg:col-span-6 flex justify-center ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  {/* Subtle outer glow element */}
                  <div className="relative p-2 rounded-[2.5rem] bg-slate-50/80 dark:bg-green-900/20 border border-slate-100/60 dark:border-green-900/20 shadow-[0_4px_24px_rgba(15,23,42,0.01)]">
                    {step.mockup}
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
