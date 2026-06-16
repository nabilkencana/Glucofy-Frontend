"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/75 backdrop-blur-md border-b border-gray-100/50 py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-glucofy-green flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-glucofy-green transition-colors">
            Glucofy
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#stats"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Why Glucofy
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Link
            href="#login"
            className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="#cta"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-glucofy-green hover:bg-green-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
