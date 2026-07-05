"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Lock, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBlur from "../components/PageBlur";
import { useLanguage } from "../context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <PageBlur />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
        {/* Background ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-green-500/8 blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full bg-emerald-400/6 blur-[110px]" />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("privacy_back_home")}</span>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="bg-liquid-glass rounded-[32px] border border-white/40 shadow-soft p-8 md:p-12 space-y-8"
          >
            {/* Header */}
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-xs font-semibold text-green-700 mb-4 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t("privacy_title")}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t("privacy_title")}
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                {t("privacy_subtitle")}
              </p>
            </div>

            {/* Intro */}
            <p className="text-slate-600 leading-relaxed font-light">
              {t("privacy_intro")}
            </p>

            {/* Sections */}
            <div className="space-y-8 pt-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {t("privacy_sec1_title")}
                  </h2>
                  <p className="text-slate-500 font-light leading-relaxed text-sm">
                    {t("privacy_sec1_desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {t("privacy_sec2_title")}
                  </h2>
                  <p className="text-slate-500 font-light leading-relaxed text-sm">
                    {t("privacy_sec2_desc")}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {t("privacy_sec3_title")}
                  </h2>
                  <p className="text-slate-500 font-light leading-relaxed text-sm">
                    {t("privacy_sec3_desc")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
