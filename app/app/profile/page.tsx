"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../_components/toast";
import { cn } from "@/lib/utils";

const cardStyle = "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md";
const inputStyle = "mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors";

export default function ProfilePage() {
  const { t } = useLanguage();
  const toast = useToast();
  const router = useRouter();

  // Load state from localStorage on mount
  const [name, setName] = useState("nabilkencana");
  const [email, setEmail] = useState("jojelek459@gmail.com");
  const [age, setAge] = useState<number>(28);
  const [targetLimit, setTargetLimit] = useState<number>(25);

  useEffect(() => {
    const savedName = localStorage.getItem("glucofy:profile_name");
    const savedEmail = localStorage.getItem("glucofy:profile_email");
    const savedAge = localStorage.getItem("glucofy:profile_age");
    const savedTarget = localStorage.getItem("glucofy:profile_target");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedAge) setAge(Number(savedAge));
    if (savedTarget) setTargetLimit(Number(savedTarget));
  }, []);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("glucofy:profile_name", name);
    localStorage.setItem("glucofy:profile_email", email);
    localStorage.setItem("glucofy:profile_age", String(age));
    localStorage.setItem("glucofy:profile_target", String(targetLimit));

    // Also update global store key if it existed, otherwise just toast
    toast(t("profile_save_toast"));
  };

  const handleLogout = () => {
    // Clear user simulation states if needed
    localStorage.removeItem("glucofy:profile_name");
    localStorage.removeItem("glucofy:profile_email");
    
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("profile_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile_subtitle")}</p>
      </div>

      {/* Account Settings Form Card */}
      <form onSubmit={handleSaveChanges} className={cardStyle}>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("profile_section_account")}</h2>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("profile_name_label")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputStyle}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("profile_email_label")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyle}
            />
          </div>

          {/* Age */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("profile_age_label")}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
              min="1"
              max="120"
              className={inputStyle}
            />
          </div>

          {/* Daily Sugar Target */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("profile_target_label")}
            </label>
            <input
              type="number"
              value={targetLimit}
              onChange={(e) => setTargetLimit(Number(e.target.value))}
              required
              min="1"
              max="200"
              className={inputStyle}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl bg-[#63C71B] hover:bg-[#63C71B]/95 text-white px-5 py-2.5 text-sm font-semibold shadow-soft transition-all duration-200 cursor-pointer"
          >
            {t("profile_save_btn")}
          </button>
        </div>
      </form>

      {/* Plan Section Card */}
      <div className={cn(cardStyle, "flex items-center justify-between")}>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("profile_section_plan")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("profile_plan_desc")}</p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-[#63C71B] px-3.5 py-1 text-xs font-semibold text-white shadow-soft">
          {t("profile_plan_badge")}
        </span>
      </div>

      {/* Session Section Card */}
      <div className={cn(cardStyle, "space-y-4")}>
        <h2 className="text-lg font-semibold text-foreground">{t("profile_section_session")}</h2>
        <div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-foreground px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
          >
            {t("profile_logout_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
