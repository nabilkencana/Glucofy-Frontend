"use client";

import { motion } from "framer-motion";
import { Scan, GlassWater, Flame, Sparkles } from "lucide-react";

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const featuresList = [
    {
      icon: Scan,
      title: "Sugar Scanner",
      description: "Scan a nutrition label — instantly get the Nutri-Grade and understand what you are drinking.",
      className: "col-span-1 md:col-span-7",
      colorClass: "bg-green-50 text-glucofy-green",
    },
    {
      icon: GlassWater,
      title: "Daily Tracker",
      description: "Log every drink easily and stay comfortably under your recommended daily sugar limit.",
      className: "col-span-1 md:col-span-5",
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      icon: Flame,
      title: "Habit Monitor",
      description: "Build streaks. Track sugar-free days, visualize progress, and celebrate your health wins like a pro.",
      className: "col-span-1 md:col-span-5",
      colorClass: "bg-amber-50 text-amber-500",
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      description: "Get personalized swaps, custom feedback, and intelligent weekly insights tailormade for you.",
      className: "col-span-1 md:col-span-7",
      colorClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F8F9FA] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Title Block */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Everything you need to take control
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-slate-500 font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Four powerful tools, one beautiful app.
          </motion.p>
        </div>

        {/* Bento Box Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuresList.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`group bg-white border border-slate-100/80 rounded-3xl p-8 lg:p-10 flex flex-col justify-between transition-colors hover:border-slate-200/80 ${feature.className}`}
              >
                <div>
                  {/* Icon Badge */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-105 duration-300 ${feature.colorClass}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-glucofy-green transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-light text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
                
                {/* Visual bottom spacing */}
                <div className="mt-8 pt-4 border-t border-slate-50/50 flex items-center text-xs font-semibold text-glucofy-green opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
      </div>
    </section>
  );
}
