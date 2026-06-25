"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun, Globe, ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === "en" ? `Logging in as ${email}` : `Masuk sebagai ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors duration-200">
      {/* Left side brand banner (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-[42%] bg-glucofy-gradient p-12 lg:p-16 text-white relative overflow-hidden shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-10">
          <div className="w-8 h-8 relative transition-transform group-hover:scale-105">
            <Image
              src="/Group 14513.png"
              alt="Glucofy Logo"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </div>
          <div className="h-8 w-[110px] relative">
            <Image
              src="/Group 14550.png"
              alt="Glucofy text logo"
              fill
              className="object-contain brightness-0 invert"
            />
          </div>
        </Link>

        {/* Brand Slogan */}
        <div className="my-auto max-w-sm z-10 space-y-6">
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-[1.25] tracking-tight">
            {t("login_welcome_title")}
          </h1>
          <p className="text-base lg:text-lg text-white/80 font-light leading-relaxed">
            {t("login_welcome_subtitle")}
          </p>
        </div>

        {/* Footer info inside green banner */}
        <div className="z-10 text-xs text-white/50 font-light">
          &copy; {new Date().getFullYear()} Glucofy. {t("footer_rights")}
        </div>

        {/* Ambient background graphics */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Right side form view */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative">
        {/* Top actions toolbar */}
        <div className="flex items-center justify-between w-full z-20">
          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "en" ? "Back" : "Kembali"}</span>
          </Link>

          {/* Theme & Language controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-green-900/20 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-green-900/30 hover:bg-slate-50 dark:hover:bg-green-900/40 transition-colors text-xs font-semibold"
              title={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "en" ? "🇬🇧 EN" : "🇮🇩 ID"}</span>
            </button>
          </div>
        </div>

        {/* Center: Card and login form */}
        <div className="max-w-md w-full mx-auto my-auto py-10">
          <div className="bg-white dark:bg-green-950/10 p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-green-900/20 shadow-xl shadow-slate-100/50 dark:shadow-none">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
              {t("login_title")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              {t("login_subtitle")}
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t("login_email_label")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-green-900/30 rounded-xl bg-white dark:bg-green-950/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t("login_password_label")}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-green-900/30 rounded-xl bg-white dark:bg-green-950/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-green-600/10 text-sm"
              >
                {t("login_button")}
              </button>
            </form>

            {/* Link to Register */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
              {t("login_no_account")}{" "}
              <Link href="/register" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors">
                {t("login_register_link")}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer for mobile only */}
        <div className="md:hidden text-center text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} Glucofy. {t("footer_rights")}
        </div>
      </div>
    </div>
  );
}
