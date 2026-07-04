"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  ClipboardList,
  Flame,
  Sparkles,
  Settings,
  PanelLeft,
  User,
  LogOut,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { cn } from "@/lib/utils";
import { getMyProfile, getToken, clearToken } from "@/lib/api";
import { USFlag, IDFlag } from "../../components/Flag";

const NAV_ITEMS = [
  { href: "/app", labelKey: "dash_nav_dashboard", icon: LayoutDashboard },
  { href: "/app/scanner", labelKey: "dash_nav_scanner", icon: ScanLine },
  { href: "/app/tracker", labelKey: "dash_nav_tracker", icon: ClipboardList },
  { href: "/app/habits", labelKey: "dash_nav_habits", icon: Flame },
  { href: "/app/ai", labelKey: "dash_nav_ai", icon: Sparkles },
  { href: "/app/profile", labelKey: "dash_nav_profile", icon: Settings },
] as const;

export default function DashboardShell({
  children,
  fontClassName,
}: {
  children: React.ReactNode;
  fontClassName?: string;
}) {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    getMyProfile()
      .then((u) => setUserName(u.name))
      .catch(() => {});
  }, [router]);

  // Sidebar follows the viewport: open on desktop, collapsed (drawer) on mobile.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = (matchesMobile: boolean) => setSidebarOpen(!matchesMobile);
    sync(mq.matches);
    const onChange = (e: MediaQueryListEvent) => sync(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeOnMobile = () => {
    if (window.matchMedia("(max-width: 767px)").matches) setSidebarOpen(false);
  };

  const toggleLanguage = () => setLanguage(language === "en" ? "id" : "en");

  const handleExit = () => {
    setMenuOpen(false);
    clearToken();
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "glucofy-dashboard min-h-screen bg-background text-foreground",
        fontClassName
      )}
    >
      {/* ===== Sidebar ===== */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[60px] items-center gap-2 px-5">
          <span className="relative block h-7 w-7 shrink-0">
            <Image src="/Group 14513.png" alt="Glucofy" fill className="object-contain" priority />
          </span>
          <span className="text-xl font-bold tracking-tight text-primary">Glucofy</span>
        </div>

        {/* Menu label */}
        <div className="px-5 pb-1 pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("dash_menu")}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeOnMobile}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-hidden
        />
      )}

      {/* ===== Main column ===== */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out",
          sidebarOpen ? "md:pl-[280px]" : "md:pl-0"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
              className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
            <p className="truncate text-sm text-foreground sm:text-base">
              {t("dash_greeting")}, {userName ?? "..."} <span aria-hidden>👋</span>
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
            >
              {language === "id" ? (
                <IDFlag className="w-5 aspect-[3/2] rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
              ) : (
                <USFlag className="w-5 aspect-[3/2] rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
              )}
            </button>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Profile menu"
                aria-expanded={menuOpen}
                className="grid h-9 w-9 place-items-center rounded-full border-2 border-primary/40 text-muted-foreground transition-colors hover:border-primary/70"
              >
                <User className="h-[18px] w-[18px]" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-soft">
                    <Link
                      href="/app/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      {t("menu_profile")}
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={handleExit}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive transition-colors hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("menu_logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
