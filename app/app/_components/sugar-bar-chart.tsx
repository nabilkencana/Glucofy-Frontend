import { SUGAR_LIMIT } from "../_lib/log-store";

/** Daily total-sugar bar chart with an auto-scaled y-axis. Empty data → 0–4 axis. */
export function SugarBarChart({ days, totals, limit = SUGAR_LIMIT }: { days: Date[]; totals: number[]; limit?: number }) {
  const W = 720;
  const H = 280;
  const padLeft = 46;
  const padRight = 12;
  const padTop = 14;
  const padBottom = 28;
  const plotLeft = padLeft;
  const plotRight = W - padRight;
  const plotTop = padTop;
  const plotBottom = H - padBottom;

  const rawMax = Math.max(...totals, 0);
  const yMax = rawMax <= 0 ? 4 : Math.ceil((rawMax * 1.1) / 4) * 4;
  const ticks = [0, 1, 2, 3, 4].map((i) => (yMax / 4) * i);
  const band = (plotRight - plotLeft) / days.length;

  const yFor = (v: number) => plotBottom - (v / yMax) * (plotBottom - plotTop);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-2 w-full text-muted-foreground"
      role="img"
      aria-label="daily sugar chart"
    >
      {ticks.map((v) => (
        <g key={v}>
          <line
            x1={plotLeft}
            x2={plotRight}
            y1={yFor(v)}
            y2={yFor(v)}
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeDasharray="4 4"
          />
          <text
            x={plotLeft - 8}
            y={yFor(v)}
            textAnchor="end"
            dominantBaseline="middle"
            fill="currentColor"
            fontSize={12}
          >
            {Math.round(v)}
          </text>
        </g>
      ))}

      {totals.map((v, i) => {
        const barW = band * 0.5;
        const cx = plotLeft + band * (i + 0.5);
        const h = (v / yMax) * (plotBottom - plotTop);
        return (
          <rect
            key={i}
            x={cx - barW / 2}
            y={plotBottom - h}
            width={barW}
            height={Math.max(0, h)}
            rx={4}
            fill={v > limit ? "hsl(var(--grade-e))" : "hsl(var(--primary))"}
          />
        );
      })}

      {days.map((d, i) => (
        <text
          key={i}
          x={plotLeft + band * (i + 0.5)}
          y={plotBottom + 18}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
        >
          {d.toLocaleDateString("en-US", { weekday: "short" })}
        </text>
      ))}
    </svg>
  );
}
