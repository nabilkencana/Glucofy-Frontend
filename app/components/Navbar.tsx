"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "#features", label: t("nav_features") },
    { href: "#how-it-works", label: t("nav_how_it_works") },
    { href: "#stats", label: t("nav_why_glucofy") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          mobileOpen ? "z-[210]" : "z-50"
        } ${
          isScrolled || mobileOpen
            ? "bg-white/90 dark:bg-green-950/90 backdrop-blur-md border-b border-slate-100/50 dark:border-green-900/30 py-3 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group" onClick={() => setMobileOpen(false)}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 relative transition-transform group-hover:scale-105">
              <Image
                src="/Group 14513.png"
                alt="Glucofy Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-7 w-24 sm:h-8 sm:w-[110px] relative">
              <Image
                src="/Group 14550.png"
                alt="Glucofy text logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-green-900/40 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-full border border-slate-200 dark:border-green-900/30 hover:bg-slate-100 dark:hover:bg-green-900/40 transition-colors text-xs font-semibold"
              title={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "en" ? "🇬🇧 EN" : "🇮🇩 ID"}</span>
            </button>

            {/* Desktop login + CTA */}
            <Link
              href="/login"
              className="hidden md:inline-block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {t("nav_login")}
            </Link>
            <Link
              href="#cta"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium text-white bg-glucofy-gradient hover:opacity-95 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              {t("nav_get_started")}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-green-900/40 text-slate-700 dark:text-slate-300 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[200] bg-white dark:bg-green-950 flex flex-col pt-24 pb-10 px-6"
          onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}
        >
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 py-4 border-b border-slate-100 dark:border-green-900/30 hover:text-glucofy-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-lg font-semibold text-slate-800 dark:text-slate-100 py-4 border-b border-slate-100 dark:border-green-900/30 hover:text-glucofy-green transition-colors"
            >
              {t("nav_login")}
            </Link>
          </nav>

          {/* Bottom actions */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-green-900/30 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "🇬🇧 English" : "🇮🇩 Indonesia"}
            </button>
            <Link
              href="#cta"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-base font-semibold text-white bg-glucofy-gradient shadow-sm"
            >
              {t("nav_get_started")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
