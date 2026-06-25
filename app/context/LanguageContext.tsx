"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    nav_features: "Features",
    nav_how_it_works: "How it works",
    nav_why_glucofy: "Why Glucofy",
    nav_login: "Log in",
    nav_get_started: "Get Started",

    // Hero
    hero_badge: "Backed by Indonesian health science",
    hero_title_1: "Know Your Sugar,",
    hero_title_green: "Control Your Future.",
    hero_subtitle: "Glucofy is your AI-powered companion to scan, track, and reduce sugar — cutting your diabetes risk one drink at a time.",
    hero_cta_primary: "Get Started Free",
    hero_cta_secondary: "See how it works",
    hero_stats_users: "users active",
    hero_stats_drop: "sugar drop",
    hero_today_intake: "Today's Intake",
    hero_streak_maintained: "4-day streak maintained",
    hero_streak_desc: "Keep going — you're crushing it!",
    hero_top_trackers: "Top 5% Trackers",
    hero_location: "Jakarta Barat area",

    // Stats
    stats_title: "Indonesia has a sugar problem.",
    stats_subtitle: "Diabetes is rising fast — and most of it starts with what we drink.",
    stats_num1: "19.5M",
    stats_lbl1: "Indonesians living with diabetes (2024)",
    stats_num2: "73%",
    stats_lbl2: "Of cases linked to excess sugar intake",
    stats_num3: "25g",
    stats_lbl3: "Recommended daily sugar limit (WHO)",

    // Features
    feat_title: "Everything you need to take control",
    feat_subtitle: "Four powerful tools, one beautiful app.",
    feat_scanner_title: "Sugar Scanner",
    feat_scanner_desc: "Scan a nutrition label — instantly get the Nutri-Grade and understand what you are drinking.",
    feat_tracker_title: "Daily Tracker",
    feat_tracker_desc: "Log every drink easily and stay comfortably under your recommended daily sugar limit.",
    feat_habit_title: "Habit Monitor",
    feat_habit_desc: "Build streaks. Track sugar-free days, visualize progress, and celebrate your health wins like a pro.",
    feat_ai_title: "AI Recommendations",
    feat_ai_desc: "Get personalized swaps, custom feedback, and intelligent weekly insights tailormade for you.",
    feat_learn_more: "Learn more",

    // How It Works
    how_title: "How it works",
    how_subtitle: "Three steps to a healthier you.",
    how_step1_badge: "Step 01",
    how_step1_title: "Scan",
    how_step1_desc: "Upload a photo of any nutrition label, or simply type the sugar amount. Our AI instantly parses the label and grades the drink.",
    how_step1_tag: "Instant Analysis",
    how_step1_view: "Scanner View",
    how_step1_processing: "Processing",
    how_step1_sugar: "Parsed Sugar",

    how_step2_badge: "Step 02",
    how_step2_title: "Track",
    how_step2_desc: "Glucofy logs it instantly and calculates your cumulative sugar budget for the day. Receive gentle warnings before you exceed your target limit.",
    how_step2_tag: "Budget Alert",
    how_step2_view: "Log Entry",
    how_step2_tea: "Iced Sweet Tea",
    how_step2_warn: "Close to limit",
    how_step2_warn_desc: "This leaves you with only 2g remaining for today.",

    how_step3_badge: "Step 03",
    how_step3_title: "Improve",
    how_step3_desc: "Our smart recommendation engine suggests delicious, low-glycemic alternatives. Watch your daily averages drop and unlock active healthy streaks.",
    how_step3_tag: "Smart Alternatives",
    how_step3_view: "AI Swap Recommendation",
    how_step3_choice: "Healthy choice",
    how_step3_instead: "Instead of",
    how_step3_instead_val: "Soft Drink (39g)",
    how_step3_try: "Try swapping",
    how_step3_try_val: "Fruit Infusion (3g)",
    how_step3_save: "Saved 36g of sugar!",

    // CTA
    cta_title: "Ready to take back control?",
    cta_subtitle: "Join thousands building healthier habits with Glucofy. Start managing your sugar intake today.",
    cta_btn: "Start free — it's 100% free",

    // Footer
    footer_about: "About",
    footer_contact: "Contact",
    footer_privacy: "Privacy Policy",
    footer_rights: "All rights reserved.",

    // Login
    login_welcome_title: "Welcome back. Your sugar journey continues.",
    login_welcome_subtitle: "Continue from where you left off and keep your streak alive.",
    login_title: "Sign In",
    login_subtitle: "Enter your details to access your dashboard.",
    login_email_label: "Email",
    login_password_label: "Password",
    login_button: "Sign In",
    login_no_account: "Don't have an account?",
    login_register_link: "Sign Up",

    // Register
    register_welcome_title: "Start your healthy journey. Control your sugar.",
    register_welcome_subtitle: "Register now to track your daily sugar intake easily and maintain healthy streaks.",
    register_title: "Sign Up",
    register_subtitle: "Enter your details to create a new account.",
    register_name_label: "Full Name",
    register_email_label: "Email",
    register_password_label: "Password",
    register_confirm_password_label: "Confirm Password",
    register_button: "Sign Up",
    register_has_account: "Already have an account?",
    register_login_link: "Sign In",
  },
  id: {
    // Navbar
    nav_features: "Fitur",
    nav_how_it_works: "Cara Kerja",
    nav_why_glucofy: "Mengapa Glucofy",
    nav_login: "Masuk",
    nav_get_started: "Mulai Sekarang",

    // Hero
    hero_badge: "Didukung oleh ilmu kesehatan Indonesia",
    hero_title_1: "Ketahui Gulamu,",
    hero_title_green: "Kendalikan Masa Depanmu.",
    hero_subtitle: "Glucofy adalah pendamping bertenaga AI untuk memindai, melacak, dan mengurangi gula — memotong risiko diabetes Anda satu minuman setiap kalinya.",
    hero_cta_primary: "Mulai Gratis",
    hero_cta_secondary: "Lihat cara kerja",
    hero_stats_users: "pengguna aktif",
    hero_stats_drop: "penurunan gula rata-rata",
    hero_today_intake: "Asupan Hari Ini",
    hero_streak_maintained: "Streak 4 hari dipertahankan",
    hero_streak_desc: "Lanjutkan — Anda luar biasa!",
    hero_top_trackers: "5% Pelacak Teratas",
    hero_location: "Wilayah Jakarta Barat",

    // Stats
    stats_title: "Indonesia memiliki masalah gula.",
    stats_subtitle: "Diabetes meningkat pesat — dan sebagian besar dimulai dari apa yang kita minum.",
    stats_num1: "19,5Jt",
    stats_lbl1: "Masyarakat Indonesia hidup dengan diabetes (2024)",
    stats_num2: "73%",
    stats_lbl2: "Kasus terkait dengan asupan gula berlebih",
    stats_num3: "25g",
    stats_lbl3: "Batas asupan gula harian rekomendasi (WHO)",

    // Features
    feat_title: "Semua yang Anda butuhkan untuk memegang kendali",
    feat_subtitle: "Empat alat hebat, satu aplikasi indah.",
    feat_scanner_title: "Pemindai Gula",
    feat_scanner_desc: "Pindai label nutrisi — dapatkan nilai Nutri-Grade secara instan dan pahami apa yang Anda minum.",
    feat_tracker_title: "Pelacak Harian",
    feat_tracker_desc: "Catat setiap minuman dengan mudah dan tetap berada di bawah batas gula harian Anda dengan nyaman.",
    feat_habit_title: "Pemantau Kebiasaan",
    feat_habit_desc: "Bangun streak. Lacak hari bebas gula, visualisasikan kemajuan, dan rayakan pencapaian kesehatan Anda seperti pro.",
    feat_ai_title: "Rekomendasi AI",
    feat_ai_desc: "Dapatkan alternatif pengganti yang disesuaikan, umpan balik kustom, dan wawasan mingguan cerdas khusus untuk Anda.",
    feat_learn_more: "Pelajari lebih lanjut",

    // How It Works
    how_title: "Bagaimana cara kerjanya",
    how_subtitle: "Tiga langkah menuju diri Anda yang lebih sehat.",
    how_step1_badge: "Langkah 01",
    how_step1_title: "Pindai",
    how_step1_desc: "Unggah foto label nutrisi apa saja, atau cukup ketik jumlah gulanya. AI kami langsung membaca label dan menilai minuman tersebut.",
    how_step1_tag: "Analisis Instan",
    how_step1_view: "Tampilan Pemindai",
    how_step1_processing: "Memproses",
    how_step1_sugar: "Gula Terbaca",

    how_step2_badge: "Langkah 02",
    how_step2_title: "Lacak",
    how_step2_desc: "Glucofy mencatatnya secara instan dan menghitung anggaran gula harian Anda. Dapatkan peringatan halus sebelum Anda melampaui batas target.",
    how_step2_tag: "Peringatan Anggaran",
    how_step2_view: "Catatan Masuk",
    how_step2_tea: "Teh Manis Es",
    how_step2_warn: "Mendekati batas",
    how_step2_warn_desc: "Asupan Anda menyisakan hanya 2g untuk hari ini.",

    how_step3_badge: "Langkah 03",
    how_step3_title: "Tingkatkan",
    how_step3_desc: "Mesin rekomendasi cerdas kami menyarankan alternatif minuman lezat rendah glikemik. Saksikan rata-rata gula Anda menurun dan picu streak aktif.",
    how_step3_tag: "Alternatif Cerdas",
    how_step3_view: "Rekomendasi AI Pengganti",
    how_step3_choice: "Pilihan sehat",
    how_step3_instead: "Daripada",
    how_step3_instead_val: "Minuman Soda (39g)",
    how_step3_try: "Coba ganti dengan",
    how_step3_try_val: "Infus Buah (3g)",
    how_step3_save: "Menghemat 36g gula!",

    // CTA
    cta_title: "Siap mengambil kendali kembali?",
    cta_subtitle: "Bergabunglah dengan ribuan orang membangun kebiasaan lebih sehat bersama Glucofy. Mulai kelola asupan gula Anda hari ini.",
    cta_btn: "Mulai gratis — 100% gratis",

    // Footer
    footer_about: "Tentang Kami",
    footer_contact: "Kontak",
    footer_privacy: "Kebijakan Privasi",
    footer_rights: "Hak cipta dilindungi undang-undang.",

    // Login
    login_welcome_title: "Selamat datang kembali. Perjalanan gulamu berlanjut.",
    login_welcome_subtitle: "Lanjutkan dari mana kamu berhenti dan jaga streakmu tetap hidup.",
    login_title: "Masuk",
    login_subtitle: "Masukkan detailmu untuk mengakses dasbor.",
    login_email_label: "Email",
    login_password_label: "Kata sandi",
    login_button: "Masuk",
    login_no_account: "Belum punya akun?",
    login_register_link: "Daftar",

    // Register
    register_welcome_title: "Mulai perjalanan sehatmu. Kendalikan konsumsi gulamu.",
    register_welcome_subtitle: "Daftar sekarang untuk melacak konsumsi gula harian Anda dengan mudah.",
    register_title: "Daftar",
    register_subtitle: "Masukkan detail Anda untuk membuat akun baru.",
    register_name_label: "Nama Lengkap",
    register_email_label: "Email",
    register_password_label: "Kata sandi",
    register_confirm_password_label: "Konfirmasi Kata Sandi",
    register_button: "Daftar",
    register_has_account: "Sudah punya akun?",
    register_login_link: "Masuk",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    let initialLang: Language = "en";
    if (savedLang) {
      initialLang = savedLang;
    } else {
      // Default to Indonesian if browser language matches Indonesian
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("id")) {
        initialLang = "id";
      }
    }
    requestAnimationFrame(() => {
      setLanguageState(initialLang);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language] as Record<string, string>;
    return langDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
