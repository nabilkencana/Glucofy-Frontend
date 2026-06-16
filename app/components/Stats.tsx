"use client";

import { motion } from "framer-motion";

export default function Stats() {
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
    <section id="stats" className="py-20 md:py-28 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Heading Section */}
        <div className="max-w-2xl mx-auto mb-16 md:mb-20">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Indonesia has a sugar problem.
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-slate-500 font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Diabetes is rising fast — and most of it starts with what we drink.
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
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-green tracking-tight mb-4">
              19.5M
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              Indonesians living with diabetes (2024)
            </span>
          </motion.div>

          {/* Stat 2 with divider */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center px-6 md:px-8 py-4 text-center md:border-l border-slate-200/80"
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-green tracking-tight mb-4">
              73%
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              Of cases linked to excess sugar intake
            </span>
          </motion.div>

          {/* Stat 3 with divider */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center px-6 md:px-8 py-4 text-center md:border-l border-slate-200/80"
          >
            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-glucofy-green tracking-tight mb-4">
              25g
            </span>
            <span className="text-sm sm:text-base text-slate-500 max-w-[220px] font-medium leading-relaxed">
              Recommended daily sugar limit (WHO)
            </span>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
