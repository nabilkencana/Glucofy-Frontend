"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Globe, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Eagerly prefetch pages
  useEffect(() => {
    router.prefetch("/register");
    router.prefetch("/app");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      // Token is stored automatically by the service
      setSuccess(true);
      // Small delay so the user sees the success state before redirect
      setTimeout(() => router.push("/app"), 800);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
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
        {/* Light Refraction Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -left-20 top-1/4 w-96 h-96 rounded-full bg-green-500/15 blur-[80px]" />
          <div className="absolute right-10 bottom-1/4 w-[350px] h-[350px] rounded-full bg-green-400/15 blur-[100px]" />
        </div>

        {/* Top actions toolbar */}
        <div className="flex items-center justify-between w-full z-20">
          {/* Back button */}
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === "en" ? "Back" : "Kembali"}</span>
          </Link>

          {/* Language controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "en" ? "id" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold"
              title={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === "en" ? "🇬🇧 EN" : "🇮🇩 ID"}</span>
            </button>
          </div>
        </div>

        {/* Center: Card and login form */}
        <div className="max-w-md w-full mx-auto my-auto py-10 z-10">
          <div className="bg-liquid-glass p-8 sm:p-10 rounded-[32px] relative overflow-hidden">
            {/* Subtle light reflections on card edge */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white/30 via-white/0 to-white/0 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-white/30 via-white/0 to-white/0 pointer-events-none" />

            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {t("login_title")}
            </h2>
            <p className="text-sm text-slate-700/70 mb-8 leading-relaxed">
              {t("login_subtitle")}
            </p>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 mb-5 rounded-2xl bg-red-50 border border-red-200/70 px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div className="flex items-start gap-2.5 mb-5 rounded-2xl bg-green-50 border border-green-200/70 px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 leading-relaxed">
                  {language === "id" ? "Login berhasil! Mengarahkan…" : "Login successful! Redirecting…"}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-semibold text-slate-800/85 mb-2">
                  {t("login_email_label")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isLoading || success}
                  className="w-full px-4 py-3 input-liquid-glass rounded-[18px] text-slate-900 placeholder:text-slate-400/75 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all duration-300 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)] disabled:opacity-60"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null); // clear error on type
                  }}
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-semibold text-slate-800/85 mb-2">
                  {t("login_password_label")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading || success}
                    className="w-full pl-4 pr-12 py-3 input-liquid-glass rounded-[18px] text-slate-900 placeholder:text-slate-400/75 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all duration-300 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)] disabled:opacity-60"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    disabled={isLoading || success}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full mt-4 py-3.5 btn-glossy-green text-white font-semibold rounded-2xl transition-all duration-150 hover:brightness-105 active:scale-[0.98] shadow-md shadow-green-600/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading
                  ? (language === "id" ? "Memuat…" : "Loading…")
                  : t("login_button")}
              </button>
            </form>

            {/* Link to Register */}
            <div className="text-center text-sm text-slate-500 mt-8">
              {t("login_no_account")}{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                {t("login_register_link")}
              </button>
            </div>
          </div>
        </div>

        {/* Footer for mobile only */}
        <div className="md:hidden text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Glucofy. {t("footer_rights")}
        </div>
      </div>
    </div>
  );
}
