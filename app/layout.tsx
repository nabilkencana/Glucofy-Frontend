import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Glucofy - Know Your Sugar, Control Your Future",
  description:
    "Glucofy is your AI-powered companion to scan, track, and reduce sugar – cutting your diabetes risk one drink at a time.",
  keywords: ["sugar tracker", "diabetes prevention", "health app", "nutrition scanner", "Glucofy", "sugar tracker Indonesia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-green-100 dark:selection:bg-green-950 selection:text-green-800 dark:selection:text-green-200 transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

