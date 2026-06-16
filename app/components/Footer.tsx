"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8F9FA] border-t border-slate-200/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-glucofy-green flex items-center justify-center text-white shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-glucofy-green transition-colors">
            Glucofy
          </span>
        </Link>

        {/* Center: Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500 font-light">
          <Link href="#about" className="hover:text-slate-900 transition-colors">
            About
          </Link>
          <Link href="#contact" className="hover:text-slate-900 transition-colors">
            Contact
          </Link>
          <Link href="#privacy" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </Link>
        </nav>

        {/* Right: Copyright */}
        <div className="text-sm text-slate-400 font-light">
          &copy; {currentYear} Glucofy. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
