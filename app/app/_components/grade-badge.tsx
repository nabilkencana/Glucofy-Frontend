import { cn } from "@/lib/utils";
import type { Grade } from "../_lib/log-store";

const GRADE_BG: Record<Grade, string> = {
  A: "bg-grade-a",
  B: "bg-grade-b",
  C: "bg-grade-c",
  D: "bg-grade-d",
};

const SIZES = {
  sm: "h-7 w-7 text-xs",
  md: "h-12 w-12 text-xl",
  lg: "h-24 w-24 text-5xl",
} as const;

export function GradeBadge({
  grade,
  size = "md",
  className,
}: {
  grade: Grade;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-soft",
        GRADE_BG[grade],
        SIZES[size],
        className
      )}
    >
      {grade}
    </span>
  );
}
