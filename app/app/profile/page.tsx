"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../_components/toast";
import { cn } from "@/lib/utils";
import {
  getMyProfile,
  updateHealthProfile,
  getHealthProfile,
  logout,
  type HealthProfileInput,
} from "@/lib/api";

const cardStyle =
  "rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-soft transition-all duration-300 hover:shadow-md";
const inputStyle =
  "mt-1.5 block w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors";
const labelStyle = "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

function Skel({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const toast = useToast();
  const router = useRouter();

  // Profile fields (from GET /users/me)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  // Health profile fields (from PATCH /users/me/health-profile)
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [activityLevel, setActivityLevel] = useState<
    "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | ""
  >("");
  const [dailySugarLimit, setDailySugarLimit] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getMyProfile(), getHealthProfile()])
      .then(([u, hp]) => {
        setName(u.name);
        setEmail(u.email);
        setRole(u.role);
        
        if (hp.age) setAge(hp.age);
        if (hp.weight) setWeight(hp.weight);
        if (hp.height) setHeight(hp.height);
        if (hp.gender) setGender(hp.gender);
        if (hp.activityLevel) setActivityLevel(hp.activityLevel);
        if (hp.dailySugarLimit) setDailySugarLimit(hp.dailySugarLimit);
      })
      .catch((e) => console.error("Error fetching profile and health data:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: HealthProfileInput = {};
    if (age !== "") payload.age = Number(age);
    if (weight !== "") payload.weight = Number(weight);
    if (height !== "") payload.height = Number(height);
    if (gender) payload.gender = gender;
    if (activityLevel) payload.activityLevel = activityLevel;

    try {
      const res = await updateHealthProfile(payload);
      setDailySugarLimit(res.dailySugarLimit);
      toast(t("profile_save_toast"));
    } catch {
      toast("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("profile_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile_subtitle")}</p>
      </div>

      {/* Account info — read-only from API */}
      <div className={cardStyle}>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t("profile_section_account")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyle}>{t("profile_name_label")}</label>
            {loading ? (
              <Skel className="mt-1.5 h-10 w-full" />
            ) : (
              <input
                type="text"
                value={name}
                readOnly
                className={cn(inputStyle, "cursor-default opacity-70")}
              />
            )}
          </div>
          <div>
            <label className={labelStyle}>{t("profile_email_label")}</label>
            {loading ? (
              <Skel className="mt-1.5 h-10 w-full" />
            ) : (
              <input
                type="email"
                value={email}
                readOnly
                className={cn(inputStyle, "cursor-default opacity-70")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Health Profile form */}
      <form onSubmit={handleSaveChanges} className={cardStyle}>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {t("profile_age_label")} &amp; Health Data
        </h2>
        {dailySugarLimit !== null && (
          <p className="text-sm text-muted-foreground mb-4">
            Personalized daily sugar limit:{" "}
            <span className="font-bold text-primary">{dailySugarLimit.toFixed(1)}g</span>
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Age */}
          <div>
            <label className={labelStyle}>{t("profile_age_label")}</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              min="1"
              max="150"
              placeholder={t("profile_age_placeholder")}
              className={inputStyle}
            />
          </div>
          {/* Weight */}
          <div>
            <label className={labelStyle}>Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
              min="1"
              placeholder={t("profile_weight_placeholder")}
              className={inputStyle}
            />
          </div>
          {/* Height */}
          <div>
            <label className={labelStyle}>Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
              min="30"
              placeholder={t("profile_height_placeholder")}
              className={inputStyle}
            />
          </div>
          {/* Gender */}
          <div>
            <label className={labelStyle}>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE" | "")}
              className={inputStyle}
            >
              <option value="">— select —</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          {/* Activity */}
          <div className="sm:col-span-2">
            <label className={labelStyle}>Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) =>
                setActivityLevel(
                  e.target.value as "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | ""
                )
              }
              className={inputStyle}
            >
              <option value="">— select —</option>
              <option value="SEDENTARY">Sedentary</option>
              <option value="LIGHT">Light</option>
              <option value="MODERATE">Moderate</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-[#63C71B] hover:bg-[#63C71B]/95 text-white px-5 py-2.5 text-sm font-semibold shadow-soft transition-all duration-200 cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving…" : t("profile_save_btn")}
          </button>
        </div>
      </form>

      {/* Plan Section Card */}
      <div className={cn(cardStyle, "flex items-center justify-between")}>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("profile_section_plan")}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "PREMIUM" ? t("profile_plan_desc_premium") : t("profile_plan_desc")}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-semibold text-white shadow-soft",
            role === "PREMIUM" ? "bg-glucofy-gradient" : "bg-[#63C71B]"
          )}
        >
          {role === "PREMIUM" ? t("profile_plan_badge_premium") : t("profile_plan_badge")}
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
