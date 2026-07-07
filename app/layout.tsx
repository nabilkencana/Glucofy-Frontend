import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import ScrollRestoration from "./components/ScrollRestoration";
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
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-green-100 selection:text-green-800">
        <ScrollRestoration />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

