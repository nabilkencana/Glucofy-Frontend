"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Stats() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section id="stats" className="py-16 md:py-28 bg-background relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        
        {/* Heading Section */}
        <div className="max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {t("stats_title")}
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-slate-500 font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("stats_subtitle")}
          </motion.p>
        </div>

        {/* Stats Display - Directly on background, no boxes/cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Stat 1 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center px-6 md:px-8 py-4 text-center"
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-gradient tracking-tight mb-4">
              {t("stats_num1")}
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              {t("stats_lbl1")}
            </span>
          </motion.div>

          {/* Stat 2 with divider */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center px-6 md:px-8 py-4 text-center md:border-l border-slate-200/80"
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-gradient tracking-tight mb-4">
              {t("stats_num2")}
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              {t("stats_lbl2")}
            </span>
          </motion.div>

          {/* Stat 3 with divider */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center px-6 md:px-8 py-4 text-center md:border-l border-slate-200/80"
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-gradient tracking-tight mb-4">
              {t("stats_num3")}
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              {t("stats_lbl3")}
            </span>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}

