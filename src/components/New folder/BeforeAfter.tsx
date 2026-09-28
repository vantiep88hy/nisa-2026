// components/BeforeAfter.tsx
// Tầng 2 — Component
// Base layout: TwoColumnLayout
// Đặc trưng: cột Before (xám/mờ) + VS arrow + cột After (accent rực)
// Dùng khi: so sánh kết quả trước/sau đầu tư, có NISA vs không có NISA

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { TwoColumnLayout } from "../layouts/TwoColumnLayout";
import { useTheme } from "../themes/ThemeContext";
import {
  slideIn,
  useSlideFromSide,
  usePopIn,
  splitHighlight,
} from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface BeforeAfterSide {
  label:      string;     // vd: "Before（運用しない場合）"
  value:      string;     // vd: "100万円"
  result:     string;     // vd: "↓\n100万円" hoặc "↓\n約265万円"
  highlight?: string;     // phần nổi bật trong result
  icon?:      string;     // Lucide icon name
  points?:    string[];   // điểm mô tả thêm
}

export interface BeforeAfterSlide {
  type:   "before_after";
  start:  number;
  end:    number;
  title:  string;
  before: BeforeAfterSide;
  after:  BeforeAfterSide;
  badge?: string;         // vd: "20年後のシミュレーション"
}

interface Props {
  slide:           BeforeAfterSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const BeforeAfter: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - Math.round(slide.start * fps);

  const titleAnim = slideIn(localFrame, 0, fps);
  const badgeAnim = slideIn(localFrame, 8, fps);
  const leftAnim  = useSlideFromSide(localFrame, 10, "left");
  const rightAnim = useSlideFromSide(localFrame, 18, "right");
  const vsAnim    = usePopIn(localFrame, 14);

  const badge = slide.badge ? (
    <BadgePill text={slide.badge} />
  ) : undefined;

  const vsElement = (
    <VsBubble scale={vsAnim.scale} opacity={vsAnim.opacity} />
  );

  return (
    <TwoColumnLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
      badge={badge}
      titleAnim={titleAnim}
      badgeAnim={badgeAnim}
      centerElement={vsElement}
      left={
        <SideCard
          side={slide.before}
          accentKey="dim"
          opacity={leftAnim.opacity}
          translateX={leftAnim.translateX}
        />
      }
      right={
        <SideCard
          side={slide.after}
          accentKey="highlight"
          opacity={rightAnim.opacity}
          translateX={rightAnim.translateX}
        />
      }
    />
  );
};

// ── Sub-components ────────────────────────────────────────────

const BadgePill: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <span
      style={{
        display:      "inline-block",
        background:   `${theme.accent}15`,
        border:       `2px solid ${theme.accent}`,
        borderRadius: 12,
        color:        theme.accent,
        fontWeight:   900,
        fontSize:     44,
        padding:      "6px 36px",
      }}
    >
      {text}
    </span>
  );
};

const VsBubble: React.FC<{ scale: number; opacity: number }> = ({ scale, opacity }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        width:          120,
        height:         120,
        borderRadius:   999,
        background:     "rgba(15,23,42,0.85)",
        border:         `4px solid ${theme.accent}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          theme.accent,
        fontWeight:     900,
        fontSize:       46,
        transform:      `scale(${scale})`,
        opacity,
        boxShadow:      `0 0 40px ${theme.accent}35`,
      }}
    >
      VS
    </div>
  );
};

const SideCard: React.FC<{
  side:       BeforeAfterSide;
  accentKey:  "dim" | "highlight";
  opacity:    number;
  translateX: number;
}> = ({ side, accentKey, opacity, translateX }) => {
  const theme  = useTheme();
  const accent = accentKey === "highlight" ? theme.highlight : theme.textSecondary;
  const Icon   =
    side.icon && (LucideIcons as Record<string, any>)[side.icon]
      ? (LucideIcons as Record<string, any>)[side.icon]
      : accentKey === "highlight" ? LucideIcons.TrendingUp : LucideIcons.Building2;

  const resultParts = splitHighlight(side.result, side.highlight ?? null);

  return (
    <div
      style={{
        flex:          1,
        opacity,
        transform:     `translateX(${translateX}px)`,
        background:    accentKey === "highlight" ? `${accent}12` : "rgba(0,0,0,0.3)",
        border:        `2px solid ${accent}60`,
        borderRadius:  28,
        padding:       "40px 44px",
        display:       "flex",
        flexDirection: "column",
        gap:           24,
        alignItems:    "center",
        textAlign:     "center",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width:          100,
          height:         100,
          borderRadius:   24,
          background:     `${accent}20`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <Icon size={56} color={accent} strokeWidth={2.5} />
      </div>

      {/* Label */}
      <div
        style={{
          fontSize:   40,
          fontWeight: 700,
          color:      accent,
          lineHeight: 1.2,
        }}
      >
        {side.label}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize:   72,
          fontWeight: 900,
          color:      theme.textPrimary,
        }}
      >
        {side.value}
      </div>

      {/* Result (with highlight) */}
      <div
        style={{
          fontSize:   80,
          fontWeight: 900,
          lineHeight: 1.3,
          whiteSpace: "pre-line",
        }}
      >
        {resultParts.map((p, i) =>
          p.hl ? (
            <span key={i} style={{ color: accent }}>{p.text}</span>
          ) : (
            <span key={i} style={{ color: theme.textPrimary }}>{p.text}</span>
          )
        )}
      </div>

      {/* Points */}
      {side.points && side.points.length > 0 && (
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           12,
            width:         "100%",
            marginTop:     "auto",
          }}
        >
          {side.points.map((p, i) => (
            <div
              key={i}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        12,
                fontSize:   34,
                color:      theme.textSecondary,
              }}
            >
              <LucideIcons.ChevronRight size={28} color={accent} />
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
