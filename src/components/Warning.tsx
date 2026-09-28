// components/Warning.tsx
// Tầng 2 — Component
// Base layout: HeroLayout
// Đặc trưng: icon cảnh báo lớn + text đậm + hộp giải thích
// Dùng khi: cảnh báo rủi ro, lưu ý quan trọng trong video NISA

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { HeroLayout } from "../layouts/HeroLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, useFadeIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Type ──────────────────────────────────────────────────────
export interface WarningSlide {
  type:         "warning";
  start:        number;
  end:          number;
  title:        string;       // vd: "注意！"
  subtitle:     string;       // vd: "NISAでも損することはあります"
  body?:        string;       // vd: "やり方を間違えると元本割れのリスクも…"
  icon?:        string;       // Lucide icon name, mặc định "AlertTriangle"
  severity?:    "warning" | "danger" | "info";
}

interface Props {
  slide:           WarningSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const Warning: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - Math.round(slide.start * fps);

  const iconAnim  = slideIn(localFrame, 0, fps);
  const titleAnim = slideIn(localFrame, 10, fps);
  const bodyOp    = useFadeIn(localFrame, 28);

  return (
    <HeroLayout theme={theme} globalProgress={globalProgress}>
      <WarningContent
        slide={slide}
        localFrame={localFrame}
        iconAnim={iconAnim}
        titleAnim={titleAnim}
        bodyOp={bodyOp}
      />
    </HeroLayout>
  );
};

// ── Inner content — dùng useTheme() ───────────────────────────
const WarningContent: React.FC<{
  slide:      WarningSlide;
  localFrame: number;
  iconAnim:   { opacity: number; translateY: number };
  titleAnim:  { opacity: number; translateY: number };
  bodyOp:     number;
}> = ({ slide, iconAnim, titleAnim, bodyOp }) => {
  const theme = useTheme();

  const severity = slide.severity ?? "warning";
  const accentColor =
    severity === "danger" ? theme.danger :
    severity === "info"   ? theme.accent :
    theme.highlight;  // warning → amber

  const Icon =
    slide.icon && (LucideIcons as Record<string, any>)[slide.icon]
      ? (LucideIcons as Record<string, any>)[slide.icon]
      : LucideIcons.AlertTriangle;

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            40,
        maxWidth:       1400,
        width:          "100%",
      }}
    >
      {/* Icon lớn */}
      <div
        style={{
          opacity:   iconAnim.opacity,
          transform: `translateY(${iconAnim.translateY}px)`,
        }}
      >
        <div
          style={{
            width:          160,
            height:         160,
            borderRadius:   32,
            background:     `${accentColor}20`,
            border:         `3px solid ${accentColor}`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            boxShadow:      `0 0 60px ${accentColor}30`,
          }}
        >
          <Icon size={80} color={accentColor} strokeWidth={2.5} />
        </div>
      </div>

      {/* Title + Subtitle */}
      <div
        style={{
          opacity:   titleAnim.opacity,
          transform: `translateY(${titleAnim.translateY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize:   110,
            fontWeight: 900,
            color:      accentColor,
            lineHeight: 1,
          }}
        >
          {slide.title}
        </div>
        <div
          style={{
            fontSize:   68,
            fontWeight: 900,
            color:      theme.textPrimary,
            marginTop:  20,
            lineHeight: 1.2,
          }}
        >
          {slide.subtitle}
        </div>
      </div>

      {/* Body explanation */}
      {slide.body && (
        <div
          style={{
            opacity:      bodyOp,
            padding:      "32px 48px",
            borderRadius: 20,
            background:   theme.bgCard,
            border:       `2px solid ${accentColor}40`,
            textAlign:    "center",
            fontSize:     44,
            fontWeight:   600,
            color:        theme.textSecondary,
            lineHeight:   1.5,
            maxWidth:     1200,
          }}
        >
          {slide.body}
        </div>
      )}
    </div>
  );
};
