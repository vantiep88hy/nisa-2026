// components/Summary.tsx
// Tầng 2 — Component
// Base layout: ListLayout
// Đặc trưng: checkmark xanh lá + text tổng kết + header "まとめ"
// Dùng khi: slide tổng kết cuối video, recap các điểm chính

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { ListLayout } from "../layouts/ListLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, splitHighlight } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface SummaryPoint {
  text:       string;
  highlight?: string;
  start?:     number;
}

export interface SummarySlide {
  type:    "summary";
  start:   number;
  end:     number;
  title:   string;    // vd: "まとめ"
  points:  SummaryPoint[];
}

interface Props {
  slide:           SummarySlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const Summary: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame      = frame - slideStartFrame;

  return (
    <ListLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
    >
      {slide.points.map((point, i) => {
        const appearFrame = point.start
          ? Math.max(Math.round((point.start - slide.start) * fps), 8)
          : 15 + i * 22;
        const anim = slideIn(localFrame, appearFrame, fps);

        return (
          <SummaryRow
            key={i}
            point={point}
            index={i}
            opacity={anim.opacity}
            translateY={anim.translateY}
          />
        );
      })}
    </ListLayout>
  );
};

// ── Sub-components ────────────────────────────────────────────

const SummaryRow: React.FC<{
  point:      SummaryPoint;
  index:      number;
  opacity:    number;
  translateY: number;
}> = ({ point, index, opacity, translateY }) => {
  const theme  = useTheme();
  const parts  = splitHighlight(point.text, point.highlight ?? null);

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          32,
        padding:      "28px 40px",
        background:   theme.bgCard,
        border:       `2px solid ${theme.success}40`,
        borderLeft:   `6px solid ${theme.success}`,
        borderRadius: 20,
        opacity:      opacity > 0 ? 1 : 0,
        transform:    `translateY(${translateY}px)`,
        boxShadow:    `0 6px 20px ${theme.success}10`,
      }}
    >
      {/* Check icon */}
      <div
        style={{
          flexShrink:     0,
          width:          72,
          height:         72,
          borderRadius:   999,
          background:     `${theme.success}20`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <LucideIcons.CheckCircle2
          size={42}
          color={theme.success}
          strokeWidth={2.5}
        />
      </div>

      {/* Text */}
      <div
        style={{
          fontSize:   52,
          fontWeight: 700,
          color:      theme.textPrimary,
          lineHeight: 1.3,
        }}
      >
        {parts.map((p, i) =>
          p.hl ? (
            <span key={i} style={{ color: theme.highlight, fontWeight: 900 }}>
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </div>
    </div>
  );
};
