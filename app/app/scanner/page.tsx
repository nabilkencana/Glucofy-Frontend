"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, Sparkles, Inbox, AlertCircle, Camera, X } from "lucide-react";
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

const gradeMap: Record<NutriGrade, "A" | "B" | "C" | "D"> = {
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

/** Client-side image compression helper */
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
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

  // Live camera preview state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [zoom, setZoom] = useState(1);

  // Apply hardware zoom if available, and fallback to CSS zoom
  const handleZoomChange = async (level: number) => {
    setZoom(level);
    if (stream) {
      const track = stream.getVideoTracks()[0];
      if (track) {
        try {
          if (typeof track.getCapabilities === "function") {
            const caps = track.getCapabilities() as any;
            if (caps.zoom) {
              const min = caps.zoom.min || 1;
              const max = caps.zoom.max || 3;
              // Map level (1 to 2) to track zoom level
              const targetZoom = level === 1 ? min : min + (max - min) * ((level - 1) / 1);
              await track.applyConstraints({
                advanced: [{ zoom: targetZoom } as any]
              });
            }
          }
        } catch (e) {
          console.warn("Hardware zoom not supported or failed:", e);
        }
      }
    }
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);
    setZoom(1);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      }, 100);
    } catch (err) {
      toast(language === "id" ? "Gagal mengakses kamera. Pastikan izin kamera diizinkan." : "Failed to access camera. Please make sure camera permission is granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraActive(false);
    setZoom(1);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          handleFile(file);
        }
      }, "image/jpeg");
    }
    stopCamera();
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Step 1-2-3 scan flow via real API
  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setResult(null);
    setError(null);
    setAnalyzing(true);
    try {
      console.log(`[Image Compression] Original file size: ${(file.size / 1024).toFixed(1)} KB`);
      const compressedFile = await compressImage(file);
      console.log(`[Image Compression] Compressed file size: ${(compressedFile.size / 1024).toFixed(1)} KB`);

      const log = await scanLabel({
        file: compressedFile,
        contentType: "image/jpeg",
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
        <div className={cn(card, "p-6 border-primary/10 flex flex-col justify-between")}>
          <h2 className="mb-4 font-semibold">{t("scan_upload_title")}</h2>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Drag and Drop / Choose File */}
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
            
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {language === "id" ? "atau" : "or"}
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Direct Camera Button */}
            <button
              type="button"
              onClick={startCamera}
              disabled={analyzing}
              className="w-full py-3 px-4 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-semibold rounded-xl flex items-center justify-center gap-2.5 transition duration-200 cursor-pointer disabled:opacity-60"
            >
              <Camera className="h-5 w-5" />
              <span>
                {language === "id" ? "Buka Kamera Langsung" : "Open Camera Directly"}
              </span>
            </button>
          </div>
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
      {isCameraActive && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white p-6 justify-between">
          {/* Header */}
          <div className="flex items-center justify-between max-w-3xl mx-auto w-full mb-4 shrink-0">
            <div>
              <h3 className="text-lg font-bold">
                {language === "id" ? "Pindai Label Nutrisi" : "Scan Nutrition Label"}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {language === "id"
                  ? "Posisikan tabel nilai gizi agar terbaca jelas oleh AI"
                  : "Position the nutrition facts table clearly for the AI"}
              </p>
            </div>
            <button
              type="button"
              onClick={stopCamera}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Video stream container */}
          <div className="flex-1 w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 relative shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoom})` }}
            />
            {/* Guide overlay box */}
            <div className="absolute inset-0 border-[3px] border-dashed border-primary/40 m-8 sm:m-12 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary/70 uppercase bg-zinc-950/80 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-sm">
                {language === "id" ? "Area Pindai Gizi" : "Nutrition Facts Area"}
              </span>
            </div>
            {/* Zoom presets overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {[1, 1.5, 2].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => handleZoomChange(z)}
                  className={cn(
                    "h-8 w-8 rounded-full text-xs font-extrabold flex items-center justify-center backdrop-blur-md transition cursor-pointer border",
                    zoom === z
                      ? "bg-primary text-white border-primary"
                      : "bg-black/60 text-white/80 border-white/20 hover:bg-black/80"
                  )}
                >
                  {z}x
                </button>
              ))}
            </div>
          </div>

          {/* Shutter Controls */}
          <div className="py-6 flex items-center justify-center gap-6 max-w-3xl mx-auto w-full shrink-0">
            <button
              type="button"
              onClick={capturePhoto}
              className="h-16 w-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent transition active:scale-95 cursor-pointer"
              aria-label="Capture photo"
            >
              <div className="h-12 w-12 rounded-full bg-white transition hover:bg-zinc-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
