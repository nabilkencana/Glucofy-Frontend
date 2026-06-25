"use client";

import { useRef, useState } from "react";
import { Upload, Sparkles, Inbox } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useLog, gradeForSugar } from "../_lib/log-store";
import { useToast } from "../_components/toast";
import { GradeBadge } from "../_components/grade-badge";
import { cn } from "@/lib/utils";

const card = "rounded-lg border bg-card text-card-foreground shadow-sm";
const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "text-sm font-medium leading-none";
const btnBrand =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-brand-gradient text-white shadow-soft transition-all hover:opacity-95 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0";

interface Result {
  product: string;
  sugarPer100ml: number;
  servingMl: number;
}

const fmtTime = (ts: number) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export default function ScannerPage() {
  const { t } = useLanguage();
  const { ready, scans, logScan } = useLog();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState("");
  const [sugar, setSugar] = useState("");
  const [serving, setServing] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [adding, setAdding] = useState(false);

  // ponytail: a frontend clone can't OCR an arbitrary nutrition label, so the
  // upload path simulates analysis with a random sugar value (ceiling: no real
  // parsing — wire to a vision API to read actual labels).
  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setAnalyzing(true);
    window.setTimeout(() => {
      const randomSugar = Math.round(Math.random() * 250) / 10; // 0.0–25.0 g/100ml
      setResult({
        product: file.name.replace(/\.[^.]+$/, "") || "Produk",
        sugarPer100ml: randomSugar,
        servingMl: 250,
      });
      setAnalyzing(false);
    }, 1200);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(sugar);
    if (Number.isNaN(s)) return;
    setResult({
      product: product.trim() || "Produk",
      sugarPer100ml: s,
      servingMl: parseFloat(serving) || 100,
    });
  };

  const handleAdd = () => {
    if (!result) return;
    setAdding(true);
    window.setTimeout(() => {
      logScan(result);
      toast(t("scan_added_toast"));
      setResult(null);
      setProduct("");
      setSugar("");
      setServing("");
      setAdding(false);
    }, 700);
  };

  const grade = result ? gradeForSugar(result.sugarPer100ml) : null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("scan_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("scan_subtitle")}</p>
      </div>

      {/* Upload + manual */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload */}
        <div className={cn(card, "p-6 border-primary/10")}>
          <h2 className="mb-4 font-semibold">{t("scan_upload_title")}</h2>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-10 text-center transition hover:bg-muted/40"
          >
            <Upload className="mx-auto h-10 w-10 text-primary" />
            <div className="mt-3 font-medium">
              {analyzing ? t("scan_upload_analyzing") : t("scan_upload_drop")}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{t("scan_upload_hint")}</div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
            />
          </label>
        </div>

        {/* Manual input */}
        <div className={cn(card, "p-6 border-primary/10")}>
          <h2 className="mb-4 font-semibold">{t("scan_manual_title")}</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-2">
              <label className={labelClass}>{t("scan_product_label")}</label>
              <input
                className={inputClass}
                placeholder={t("scan_product_ph")}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className={labelClass}>{t("scan_sugar_label")}</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  className={inputClass}
                  placeholder="10.6"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>{t("scan_serving_label")}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputClass}
                  placeholder="100"
                  value={serving}
                  onChange={(e) => setServing(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className={cn(btnBrand, "w-full")} disabled={sugar.trim() === ""}>
              <Sparkles />
              {t("scan_analyze")}
            </button>
          </form>
        </div>
      </div>

      {/* Result */}
      {result && grade && (
        <div className={cn(card, "p-8 border-primary/20 shadow-soft")}>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <GradeBadge grade={grade.grade} size="lg" />
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{grade.label}</div>
              <h2 className="text-2xl font-bold">{result.product}</h2>
              <div className="mt-1 text-muted-foreground">
                {result.sugarPer100ml} g sugar per 100ml · {result.servingMl} ml serving
              </div>
              <p className="mt-3 text-sm">{grade.description}</p>
            </div>
            <button onClick={handleAdd} className={btnBrand} disabled={adding}>
              {adding ? t("scan_adding") : t("scan_add_to_log")}
            </button>
          </div>
        </div>
      )}

      {/* Scan history */}
      <div className={cn(card, "p-6 border-primary/10")}>
        <h2 className="mb-4 font-semibold">{t("scan_history_title")}</h2>
        {!ready || scans.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Inbox className="mx-auto mb-3 h-8 w-8 opacity-60" />
            <p className="text-sm">{t("scan_history_empty")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">{t("scan_th_product")}</th>
                  <th className="pb-3 font-medium">{t("scan_th_sugar100")}</th>
                  <th className="pb-3 font-medium">{t("scan_th_grade")}</th>
                  <th className="pb-3 text-right font-medium">{t("scan_th_time")}</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 font-medium">{s.product}</td>
                    <td className="py-3">{s.sugarPer100ml}g</td>
                    <td className="py-3">
                      <GradeBadge grade={s.grade} size="sm" />
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{fmtTime(s.ts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
