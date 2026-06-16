"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section id="cta" className="py-16 md:py-24 bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="bg-glucofy-gradient rounded-[2.5rem] px-8 py-16 md:py-24 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-lg shadow-green-500/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          {/* Subtle design element: oversized circles with very low opacity */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/[0.04] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/[0.04] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 max-w-2xl leading-[1.15]">
            {t("cta_title")}
          </h2>

          {/* Subtitle */}
          <p className="text-white/80 font-light text-base sm:text-lg mb-10 max-w-md leading-relaxed">
            {t("cta_subtitle")}
          </p>

          {/* White CTA Button with Green Text */}
          <Link
            href="#signup"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-slate-50 text-glucofy-green text-base font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-black/0.02"
          >
            <span>{t("cta_btn")}</span>
            <ArrowRight className="w-4.5 h-4.5 text-glucofy-green" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

