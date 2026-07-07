"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Check, Users, TrendingDown, ShieldCheck, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import GlassSurface from "./GlassSurface";

export default function Hero() {
  const { t } = useLanguage();

  // Container stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // Custom out-quart ease for premium look
      },
    },
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 overflow-hidden bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-6 shadow-[0_1px_2px_rgba(34,197,94,0.02)]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("hero_badge")}</span>
            </motion.div>

            {/* Oversized Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-5"
            >
              {t("hero_title_1")} <br />
              <span className="text-glucofy-gradient">{t("hero_title_green")}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-600 max-w-xl mb-8 leading-relaxed font-light"
            >
              {t("hero_subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10"
            >
              <button
                onClick={() => { document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); history.pushState(null, '', '#cta'); }}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white bg-glucofy-gradient hover:opacity-90 transition-opacity shadow-sm shadow-green-500/10"
              >
                <span>{t("hero_cta_primary")}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 transition-colors"
              >
                <Play className="w-4 h-4 fill-slate-500 text-slate-500" />
                <span>{t("hero_cta_secondary")}</span>
              </Link>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-8 text-sm text-slate-500 border-t border-slate-200/60 pt-8 w-full"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600">
                  <Users className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-slate-800 font-semibold">17k+</strong> {t("hero_stats_users")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <span>
                  <strong className="text-slate-800 font-semibold">Avg. 31%</strong> {t("hero_stats_drop")}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[380px] sm:h-[440px] lg:h-[500px]">
            
            {/* Background Blob Grid (Subtle and human-made) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06),transparent_60%)] -z-10" />

            {/* Main Interactive Intake Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-[280px] min-[375px]:max-w-[305px] min-[410px]:max-w-[325px] sm:max-w-[340px] z-20"
            >
              <GlassSurface
                width="100%"
                height="auto"
                borderRadius={28}
                className="border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.03)] p-5 sm:p-6"
              >
                <div className="w-full text-left">
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-left">
                      <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">{t("hero_today_intake")}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-bold text-slate-800">18</span>
                        <span className="text-slate-500 font-medium text-sm">g</span>
                        <span className="text-slate-300 font-light text-sm mx-1">/</span>
                        <span className="text-slate-500 font-medium text-sm">25g</span>
                      </div>
                    </div>
                    {/* Grade Badge */}
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow-sm shadow-green-500/10">
                      B
                    </div>
                  </div>

                  {/* Progress Slider Mockup */}
                  <div className="space-y-3 mb-6">
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                      <div className="absolute top-0 left-0 bottom-0 w-[72%] bg-green-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span className="text-green-500">A</span>
                      <span className="text-green-500">B</span>
                      <span className="text-amber-500">C</span>
                      <span className="text-orange-500">D</span>
                    </div>
                  </div>

                  {/* Streak Section */}
                  <div className="flex items-start gap-3 p-3 bg-green-50/50 border border-green-100/40 rounded-2xl text-left">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-green-800">{t("hero_streak_maintained")}</p>
                      <p className="text-[11px] text-green-700/80 font-light font-sans">{t("hero_streak_desc")}</p>
                    </div>
                  </div>
                </div>
              </GlassSurface>
            </motion.div>

            {/* Floating UI Widget 1: Left Mini Card (Green Icon Badge) */}
            <motion.div
              className="absolute left-[-12px] top-12 sm:left-4 sm:top-16 z-30 shadow-[0_4px_16px_rgba(15,23,42,0.02)] scale-90 sm:scale-100 origin-top-left"
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <GlassSurface
                width={56}
                height={56}
                borderRadius={16}
                className="border border-white/40"
              >
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-glucofy-green">
                  <Sparkles className="w-5 h-5" />
                </div>
              </GlassSurface>
            </motion.div>

            {/* Floating UI Widget 2: Right Medal Badge */}
            <motion.div
              className="absolute right-[-12px] bottom-12 sm:right-4 sm:bottom-20 z-30 shadow-[0_4px_16px_rgba(15,23,42,0.02)] scale-[0.8] sm:scale-90 lg:scale-100 origin-bottom-right"
              initial={{ y: 0 }}
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <GlassSurface
                width={176}
                height="auto"
                borderRadius={16}
                className="border border-white/40 p-4"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">{t("hero_top_trackers")}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{t("hero_location")}</p>
                  </div>
                </div>
              </GlassSurface>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
