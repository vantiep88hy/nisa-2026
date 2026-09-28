// components/BarChart.tsx
// Tầng 2 — Component
// Base layout: ChartLayout
// Đặc trưng: bar chart SVG với animation bar mọc lên + label giá trị
// Dùng khi: tăng trưởng tài sản theo năm, biểu đồ tích lũy NISA

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ChartLayout } from "../layouts/ChartLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, useFadeIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface BarChartBar {
  label:      string;     // vd: "1年後"
  value:      number;     // vd: 12
  unit?:      string;     // vd: "万円"
  isHighlight?: boolean;  // bar cuối thường highlight
}

export interface BarChartSlide {
  type:      "bar_chart";
  start:     number;
  end:       number;
  title:     string;
  subtitle?: string;
  bars:      BarChartBar[];
  yUnit?:    string;      // vd: "(万円)"
  note?:     string;      // vd: "※毎月1万円を年利5%で積立した場合"
}

interface Props {
  slide:           BarChartSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const BarChart: React.FC<Props> = ({
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
      <BarChartSVG
        bars={slide.bars}
        yUnit={slide.yUnit}
        localFrame={localFrame}
        fps={fps}
      />
    </ChartLayout>
  );
};

// ── SVG Chart ─────────────────────────────────────────────────

const BarChartSVG: React.FC<{
  bars:       BarChartBar[];
  yUnit?:     string;
  localFrame: number;
  fps:        number;
}> = ({ bars, yUnit, localFrame, fps }) => {
  const theme = useTheme();

  // Chart dimensions (in SVG units, 1920x1080 canvas)
  const SVG_W     = 1620; // SAFE_W
  const SVG_H     = 680;
  const PAD_LEFT  = 120;
  const PAD_RIGHT = 60;
  const PAD_TOP   = 40;
  const PAD_BOT   = 120;

  const chartW = SVG_W - PAD_LEFT - PAD_RIGHT;
  const chartH = SVG_H - PAD_TOP - PAD_BOT;

  const maxValue = Math.max(...bars.map((b) => b.value));

  const barCount   = bars.length;
  const barWidth   = Math.min((chartW / barCount) * 0.55, 200);
  const barSpacing = chartW / barCount;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Y-axis label */}
      {yUnit && (
        <text
          x={PAD_LEFT - 10}
          y={PAD_TOP - 10}
          fill={theme.textSecondary}
          fontSize={32}
          textAnchor="end"
        >
          {yUnit}
        </text>
      )}

      {/* Baseline */}
      <line
        x1={PAD_LEFT}
        y1={PAD_TOP + chartH}
        x2={PAD_LEFT + chartW}
        y2={PAD_TOP + chartH}
        stroke={theme.border}
        strokeWidth={3}
      />

      {/* Horizontal grid lines */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = PAD_TOP + chartH * (1 - ratio);
        return (
          <g key={ratio}>
            <line
              x1={PAD_LEFT}
              y1={y}
              x2={PAD_LEFT + chartW}
              y2={y}
              stroke={theme.border}
              strokeWidth={1}
              strokeDasharray="8 8"
              opacity={0.4}
            />
            <text
              x={PAD_LEFT - 16}
              y={y + 10}
              fill={theme.textSecondary}
              fontSize={28}
              textAnchor="end"
            >
              {Math.round(maxValue * ratio)}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {bars.map((bar, i) => {
        const targetHeight = (bar.value / maxValue) * chartH;
        const x            = PAD_LEFT + barSpacing * i + (barSpacing - barWidth) / 2;
        const barDelay     = 10 + i * 8;

        const progress = interpolate(
          localFrame,
          [barDelay, barDelay + 30],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const currentHeight = targetHeight * progress;
        const barY           = PAD_TOP + chartH - currentHeight;

        const barColor = bar.isHighlight ? theme.highlight : theme.accent;
        const labelOp  = interpolate(
          localFrame,
          [barDelay + 25, barDelay + 38],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x}
              y={barY}
              width={barWidth}
              height={currentHeight}
              rx={12}
              fill={barColor}
              opacity={bar.isHighlight ? 1 : 0.8}
            />

            {/* Value label above bar */}
            <text
              x={x + barWidth / 2}
              y={barY - 16}
              fill={barColor}
              fontSize={38}
              fontWeight={900}
              textAnchor="middle"
              opacity={labelOp}
            >
              {bar.value}{bar.unit ?? ""}
            </text>

            {/* X label */}
            <text
              x={x + barWidth / 2}
              y={PAD_TOP + chartH + 52}
              fill={theme.textSecondary}
              fontSize={34}
              textAnchor="middle"
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
