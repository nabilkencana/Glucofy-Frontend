"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-green-950/80 backdrop-blur-md border-b border-slate-100/50 dark:border-green-900/30 py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="w-8 h-8 relative transition-transform group-hover:scale-105">
            <Image
              src="/Group 14513.png"
              alt="Glucofy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="h-8 w-[110px] relative">
            <Image
              src="/Group 14550.png"
              alt="Glucofy text logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {t("nav_features")}
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {t("nav_how_it_works")}
          </Link>
          <Link
            href="#stats"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {t("nav_why_glucofy")}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-green-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-green-900/30 hover:bg-slate-100 dark:hover:bg-green-900/40 transition-colors text-xs font-semibold"
            title={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === "en" ? "🇬🇧 EN" : "🇮🇩 ID"}</span>
          </button>

          {/* Log in */}
          <Link
            href="#login"
            className="hidden sm:inline-block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {t("nav_login")}
          </Link>

          {/* Get Started Button */}
          <Link
            href="#cta"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-glucofy-gradient hover:opacity-95 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            {t("nav_get_started")}
          </Link>
        </div>
      </div>
      </header>
    </>
  );
}

