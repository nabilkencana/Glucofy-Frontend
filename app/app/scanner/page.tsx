"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Sparkles, Inbox, AlertCircle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../_components/toast";
import { GradeBadge } from "../_components/grade-badge";
import { cn } from "@/lib/utils";
import {
  scanLabel,
  createManualEntry,
  getLastConsumption,
  type ConsumptionLog,
  type NutriGrade,
} from "@/lib/api";

const card = "rounded-lg border bg-card text-card-foreground shadow-sm";
const inputClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "text-sm font-medium leading-none";
const btnBrand =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-brand-gradient text-white shadow-soft transition-all hover:opacity-95 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0";

const gradeMap: Record<NutriGrade, "A" | "B" | "C" | "D" | "E"> = {
  A: "A", B: "B", C: "C", D: "D",
};

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

function Skel({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export default function ScannerPage() {
  const { t, language } = useLanguage();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  // Manual form state
  const [product, setProduct] = useState("");
  const [sugar, setSugar] = useState("");
  const [serving, setServing] = useState("");
  const [salt, setSalt] = useState("0");
  const [fat, setFat] = useState("0");

  // Scan result (from scan or manual)
  const [result, setResult] = useState<ConsumptionLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Scan history from API
  const [history, setHistory] = useState<ConsumptionLog[] | null>(null);
  const [histLoading, setHistLoading] = useState(true);

  const reloadHistory = () => {
    getLastConsumption()
      .then((r) => setHistory(r.data))
      .catch(() => {})
      .finally(() => setHistLoading(false));
  };

  useEffect(() => {
    reloadHistory();
  }, []);

  // Step 1-2-3 scan flow via real API
  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setError(null);
    setAnalyzing(true);
    try {
      const log = await scanLabel({
        file,
        contentType: file.type === "image/png" ? "image/png" : "image/jpeg",
        productName: product.trim() || undefined,
        servingSizeMl: serving ? parseFloat(serving) : undefined,
      });
      setResult(log);
      toast(t("scan_added_toast"));
      reloadHistory();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Scan failed. Try adding serving size manually.";
      setError(msg);
      toast(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  // Manual entry via API
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseFloat(sugar);
    if (Number.isNaN(s)) return;
    setResult(null);
    setError(null);
    setAnalyzing(true);
    try {
      const log = await createManualEntry({
        productName: product.trim() || "Product",
        servingSizeMl: parseFloat(serving) || 100,
        sugarPer100ml: s,
        saltPer100ml: parseFloat(salt) || 0,
        saturatedFatPer100ml: parseFloat(fat) || 0,
      });
      setResult(log);
      toast(t("scan_added_toast"));
      reloadHistory();
      setProduct(""); setSugar(""); setServing(""); setSalt("0"); setFat("0");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log. Please try again.";
      setError(msg);
      toast(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("scan_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("scan_subtitle")}</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">
              {language === "id" ? "Pemindaian Gagal" : "Scan Failed"}
            </p>
            <p className="text-muted-foreground/90">{error}</p>
          </div>
        </div>
      )}

      {/* Upload + manual */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload — real 3-step S3 scan */}
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

        {/* Manual entry */}
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
            <button
              type="submit"
              className={cn(btnBrand, "w-full")}
              disabled={sugar.trim() === "" || analyzing}
            >
              <Sparkles />
              {analyzing ? t("scan_upload_analyzing") : t("scan_analyze")}
            </button>
          </form>
        </div>
      </div>

      {/* Result card — from API response */}
      {result && (
        <div className={cn(card, "p-8 border-primary/20 shadow-soft")}>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <GradeBadge grade={gradeMap[result.nutriGrade] ?? "A"} size="lg" />
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Grade {result.nutriGrade}
              </div>
              <h2 className="text-2xl font-bold">{result.productName}</h2>
              <div className="mt-1 text-muted-foreground">
                {result.sugarPer100ml}g sugar/100ml · {result.servingSizeMl}ml serving ·{" "}
                <span className="font-semibold">
                  {((result.sugarPer100ml * result.servingSizeMl) / 100).toFixed(1)}g total
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan history — from GET /nutrition/last-consumption */}
      <div className={cn(card, "p-6 border-primary/10")}>
        <h2 className="mb-4 font-semibold">{t("scan_history_title")}</h2>
        {histLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skel key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !history || history.length === 0 ? (
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
                {history.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 font-medium">{s.productName}</td>
                    <td className="py-3">{s.sugarPer100ml}g</td>
                    <td className="py-3">
                      <GradeBadge grade={gradeMap[s.nutriGrade] ?? "A"} size="sm" />
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{fmtTime(s.consumedAt)}</td>
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
