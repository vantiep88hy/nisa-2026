// components/ProsAndCons.tsx
// Tầng 2 — Component
// Base layout: TwoColumnLayout
// Đặc trưng: cột trái (Pros/メリット) màu xanh, cột phải (Cons/デメリット) màu đỏ
// Dùng khi: so sánh ưu/nhược điểm của NISA, tài khoản đầu tư, v.v.

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { TwoColumnLayout } from "../layouts/TwoColumnLayout";
import { useTheme } from "../themes/ThemeContext";
import {
  slideIn,
  useSlideFromSide,
  splitHighlight,
} from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Types ─────────────────────────────────────────────────────
export interface ProsConsItem {
  text:       string;
  highlight?: string;
  /** Thời điểm item xuất hiện (giây tuyệt đối) */
  start?:     number;
}

export interface ProsAndConsSlide {
  type:    "pros_and_cons";
  start:   number;
  end:     number;
  title:   string;

  prosLabel?: string;    // mặc định "メリット"
  consLabel?: string;    // mặc định "デメリット"
  pros:       ProsConsItem[];
  cons:       ProsConsItem[];
}

interface Props {
  slide:           ProsAndConsSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const ProsAndCons: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame      = frame - slideStartFrame;

  const titleAnim = slideIn(localFrame, 0, fps);
  const leftAnim  = useSlideFromSide(localFrame, 10, "left");
  const rightAnim = useSlideFromSide(localFrame, 16, "right");

  return (
    <TwoColumnLayout
      theme={theme}
      globalProgress={globalProgress}
      title={slide.title}
      titleAnim={titleAnim}
      left={
        <ProsConsCard
          label={slide.prosLabel ?? "メリット"}
          items={slide.pros}
          accentKey="success"
          localFrame={localFrame}
          slideStart={slide.start}
          opacity={leftAnim.opacity}
          translateX={leftAnim.translateX}
          fps={fps}
        />
      }
      right={
        <ProsConsCard
          label={slide.consLabel ?? "デメリット"}
          items={slide.cons}
          accentKey="danger"
          localFrame={localFrame}
          slideStart={slide.start}
          opacity={rightAnim.opacity}
          translateX={rightAnim.translateX}
          fps={fps}
        />
      }
    />
  );
};

// ── ProsConsCard ──────────────────────────────────────────────

const ProsConsCard: React.FC<{
  label:       string;
  items:       ProsConsItem[];
  accentKey:   "success" | "danger";
  localFrame:  number;
  slideStart:  number;
  opacity:     number;
  translateX:  number;
  fps:         number;
}> = ({
  label,
  items,
  accentKey,
  localFrame,
  slideStart,
  opacity,
  translateX,
  fps,
}) => {
  const theme   = useTheme();
  const accent  = theme[accentKey];
  const Icon    = accentKey === "success" ? LucideIcons.TrendingUp : LucideIcons.TrendingDown;

  return (
    <div
      style={{
        flex:          1,
        opacity,
        transform:     `translateX(${translateX}px)`,
        background:    `${accent}10`,
        border:        `2px solid ${accent}50`,
        borderRadius:  28,
        padding:       "36px 40px",
        display:       "flex",
        flexDirection: "column",
        gap:           20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display:     "flex",
          alignItems:  "center",
          gap:         18,
          paddingBottom: 20,
          borderBottom: `1px solid ${accent}30`,
        }}
      >
        <div
          style={{
            width:          72,
            height:         72,
            borderRadius:   18,
            background:     `${accent}20`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          <Icon size={40} color={accent} strokeWidth={2.5} />
        </div>
        <div
          style={{
            fontSize:   52,
            fontWeight: 900,
            color:      accent,
          }}
        >
          {label}
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           16,
          flex:          1,
          justifyContent: "center",
        }}
      >
        {items.map((item, i) => {
          const appearFrame = item.start
            ? Math.max(Math.round((item.start - slideStart) * fps), 12)
            : 20 + i * 18;
          const anim = slideIn(localFrame, appearFrame, fps);
          const parts = splitHighlight(item.text, item.highlight ?? null);

          return (
            <div
              key={i}
              style={{
                display:    "flex",
                alignItems: "center",
                gap:        18,
                opacity:    anim.opacity > 0 ? 1 : 0,
                transform:  `translateY(${anim.translateY}px)`,
              }}
            >
              <LucideIcons.Check size={36} color={accent} strokeWidth={3} />
              <div
                style={{
                  fontSize:   42,
                  fontWeight: 700,
                  color:      theme.textPrimary,
                  lineHeight: 1.3,
                }}
              >
                {parts.map((p, idx) =>
                  p.hl ? (
                    <span key={idx} style={{ color: accent, fontWeight: 900 }}>
                      {p.text}
                    </span>
                  ) : (
                    <span key={idx}>{p.text}</span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
