// components/PieChart.tsx
// Tầng 2 — Component
// Base layout: ChartLayout
// Đặc trưng: pie chart SVG với animation vẽ từng phần + legend bên phải
// Dùng khi: tỷ lệ phân bổ tài sản, cơ cấu danh mục đầu tư

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChartLayout } from "../layouts/ChartLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface PieSlice {
  label:  string;    // vd: "国内株式"
  value:  number;    // vd: 20 (percent)
  color?: string;    // override màu, mặc định dùng palette
}

export interface PieChartSlide {
  type:      "pie_chart";
  start:     number;
  end:       number;
  title:     string;
  subtitle?: string;
  slices:    PieSlice[];
  note?:     string;
}

interface Props {
  slide:           PieChartSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Palette mặc định cho các lát ──────────────────────────────
const DEFAULT_COLORS = [
  "#38bdf8",  // sky
  "#f59e0b",  // amber
  "#22c55e",  // green
  "#a78bfa",  // violet
  "#f472b6",  // pink
  "#34d399",  // emerald
  "#fb923c",  // orange
];

// ── Component ─────────────────────────────────────────────────
export const PieChart: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - Math.round(slide.start * fps);
  const titleAnim  = slideIn(localFrame, 0, fps);

  return (
    <ChartLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
      subtitle={slide.subtitle}
      note={slide.note}
      titleAnim={titleAnim}
    >
      <PieChartContent
        slices={slide.slices}
        localFrame={localFrame}
      />
    </ChartLayout>
  );
};

// ── SVG Pie ───────────────────────────────────────────────────

const PieChartContent: React.FC<{
  slices:     PieSlice[];
  localFrame: number;
}> = ({ slices, localFrame }) => {
  const theme = useTheme();

  const total  = slices.reduce((s, p) => s + p.value, 0);
  const radius = 260;
  const cx     = 480;
  const cy     = 340;

  // Animate: pie vẽ từ 0 → 1 trong 40 frame đầu
  const drawProgress = interpolate(localFrame, [5, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Build arc paths
  let cumulativeAngle = -Math.PI / 2; // bắt đầu từ đỉnh
  const arcs = slices.map((slice, i) => {
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    const drawAngle  = sliceAngle * drawProgress;

    const x1 = cx + radius * Math.cos(cumulativeAngle);
    const y1 = cy + radius * Math.sin(cumulativeAngle);
    const x2 = cx + radius * Math.cos(cumulativeAngle + drawAngle);
    const y2 = cy + radius * Math.sin(cumulativeAngle + drawAngle);

    const largeArc = drawAngle > Math.PI ? 1 : 0;

    // Label position — midpoint of arc
    const midAngle  = cumulativeAngle + sliceAngle / 2;
    const labelR    = radius * 0.65;
    const labelX    = cx + labelR * Math.cos(midAngle);
    const labelY    = cy + labelR * Math.sin(midAngle);

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const color = slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];

    cumulativeAngle += sliceAngle;

    return { path, color, labelX, labelY, slice, midAngle };
  });

  // Legend animate
  const legendOp = interpolate(localFrame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <svg viewBox="0 0 1620 680" style={{ width: "100%", height: "100%" }}>
      {/* Pie slices */}
      {arcs.map((arc, i) => (
        <g key={i}>
          <path
            d={arc.path}
            fill={arc.color}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={3}
          />
          {/* Percent label inside slice — chỉ hiện khi đủ lớn */}
          {arc.slice.value >= 8 && drawProgress > 0.8 && (
            <text
              x={arc.labelX}
              y={arc.labelY + 10}
              fill="#fff"
              fontSize={36}
              fontWeight={900}
              textAnchor="middle"
            >
              {arc.slice.value}%
            </text>
          )}
        </g>
      ))}

      {/* Center donut hole (optional — uncomment for donut style)
      <circle cx={cx} cy={cy} r={radius * 0.42} fill="transparent" /> */}

      {/* Legend — bên phải */}
      <g opacity={legendOp}>
        {slices.map((slice, i) => {
          const color = slice.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          const y     = 140 + i * 74;
          return (
            <g key={i}>
              <rect x={1040} y={y - 18} width={36} height={36} rx={8} fill={color} />
              <text
                x={1090}
                y={y + 10}
                fill={theme.textPrimary}
                fontSize={38}
                fontWeight={700}
              >
                {slice.label}
              </text>
              <text
                x={1600}
                y={y + 10}
                fill={color}
                fontSize={38}
                fontWeight={900}
                textAnchor="end"
              >
                {slice.value}%
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
