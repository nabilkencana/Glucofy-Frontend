import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
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
    <html lang="en" className={`${poppins.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8F9FA] text-slate-800 selection:bg-green-100 selection:text-green-800">
        {children}
      </body>
    </html>
  );
}

