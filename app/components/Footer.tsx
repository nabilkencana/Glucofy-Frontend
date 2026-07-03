"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-background border-t border-slate-200/50 py-10 md:py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="w-8 h-8 relative transition-transform group-hover:scale-105">
            <Image
              src="/Group 14513.png"
              alt="Glucofy Logo"
              fill
              className="object-contain"
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

        {/* Center: Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500 font-light">
          <Link href="#about" className="hover:text-slate-900 transition-colors">
            {t("footer_about")}
          </Link>
          <Link href="#contact" className="hover:text-slate-900 transition-colors">
            {t("footer_contact")}
          </Link>
          <Link href="#privacy" className="hover:text-slate-900 transition-colors">
            {t("footer_privacy")}
          </Link>
        </nav>

        {/* Right: Copyright */}
        <div className="text-sm text-slate-400 font-light">
          &copy; {currentYear} Glucofy. {t("footer_rights")}
        </div>

      </div>
    </footer>
  );
}

