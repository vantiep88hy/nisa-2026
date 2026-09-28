import React from "react";

import {
  CANVAS_W,
  CANVAS_H,
  SAFE_W,
  SAFE_H,
  font,
  spacing,
  zIndex,
} from "./tokens";

import { ProgressBar } from "./ProgressBar";

// ─────────────────────────────────────────────────────────────
// Theme tokens — swap toàn bộ màu bằng 1 object duy nhất
// ─────────────────────────────────────────────────────────────

export interface Theme {
  /** Màu chính: border active, icon, connector line */
  accent: string;
  /** Màu highlight: số lớn, từ khoá quan trọng, conclusion box */
  highlight: string;
  /** Màu danger: dùng cho cạnh trái "bad" trong Comparison */
  danger: string;
  /** Nền card bình thường */
  bgCard: string;
  /** Nền card đậm hơn (BulletSummary rows, Description box) */
  bgCardDark: string;
  /** Màu chữ phụ (date badge, footer chip, desc text) */
  textMuted: string;
  /** Màu chữ secondary (point rows trong Comparison) */
  textSecondary: string;
}

export const NISA_THEME: Theme = {
  accent:        "#38bdf8",
  highlight:     "#f59e0b",
  danger:        "#ef4444",
  bgCard:        "rgba(0,0,0,0.35)",
  bgCardDark:    "rgba(15,23,42,0.85)",
  textMuted:     "#cbd5e1",
  textSecondary: "#e2e8f0",
};

export const MLB_THEME: Theme = {
  accent:        "#5b9bd5",
  highlight:     "#d50032",
  danger:        "#d50032",
  bgCard:        "rgba(0,10,40,0.45)",
  bgCardDark:    "rgba(0,5,30,0.88)",
  textMuted:     "#b0c4de",
  textSecondary: "#dce8f5",
};

export const NEWS_THEME: Theme = {
  accent:        "#f5a623",
  highlight:     "#ffffff",
  danger:        "#e53e3e",
  bgCard:        "rgba(28,28,30,0.80)",
  bgCardDark:    "rgba(10,10,12,0.90)",
  textMuted:     "#a0aec0",
  textSecondary: "#e2e8f0",
};

// ─────────────────────────────────────────────────────────────
// Context — để component con đọc theme mà không cần prop drilling
// ─────────────────────────────────────────────────────────────

export const ThemeContext = React.createContext<Theme>(NISA_THEME);

export const useTheme = () => React.useContext(ThemeContext);

// ─────────────────────────────────────────────────────────────
// BaseLayout — Tầng 1
// Chứa: outer shell, BackgroundDecoration, SafeZone, ProgressBar
// KHÔNG chứa: flexDirection, justifyContent, alignItems
//   → mỗi component tự quyết định layout bên trong SafeZone
// ─────────────────────────────────────────────────────────────

interface BaseLayoutProps {
  globalProgress?: number;
  theme?:          Theme;
  children:        React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  globalProgress = 0,
  theme = NISA_THEME,
  children,
}) => (
  <ThemeContext.Provider value={theme}>
    <div
      style={{
        width:      CANVAS_W,
        height:     CANVAS_H,
        position:   "relative",
        overflow:   "hidden",
        background: "transparent",
        fontFamily: font.family,
      }}
    >
      <BackgroundDecoration />

      {/* SafeZone: vị trí + kích thước từ tokens, layout do con quyết định */}
      <div
        style={{
          position: "absolute",
          top:      spacing.safeTop,
          left:     spacing.safeLeft,
          width:    SAFE_W,
          height:   SAFE_H,
          zIndex:   zIndex.text,
        }}
      >
        {children}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  </ThemeContext.Provider>
);

// ─────────────────────────────────────────────────────────────
// BackgroundDecoration — grid pattern mờ, 1 chỗ duy nhất
// ─────────────────────────────────────────────────────────────

const BackgroundDecoration: React.FC = () => (
  <div
    style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "90px 90px",
      opacity:        0.4,
    }}
  />
);

// ─────────────────────────────────────────────────────────────
// Shared UI atoms — dùng chung cho nhiều component
// ─────────────────────────────────────────────────────────────

/** Tiêu đề slide + underline gradient */
export const SlideTitle: React.FC<{
  children:   React.ReactNode;
  opacity:    number;
  translateY: number;
  align?:     "left" | "center";
  mb?:        number;
}> = ({ children, opacity, translateY, align = "left", mb = 50 }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        opacity,
        transform:    `translateY(${translateY}px)`,
        textAlign:    align,
        marginBottom: mb,
        flexShrink:   0,
      }}
    >
      <div
        style={{
          fontSize:      75,
          fontWeight:    900,
          color:         "#ffffff",
          letterSpacing: "0.02em",
        }}
      >
        {children}
      </div>
      <div
        style={{
          width:        100,
          height:       6,
          borderRadius: 3,
          marginTop:    16,
          marginLeft:   align === "center" ? "auto" : 0,
          marginRight:  align === "center" ? "auto" : 0,
          background:   `linear-gradient(90deg, ${theme.accent}, ${theme.accent}99)`,
        }}
      />
    </div>
  );
};

/** Badge pill nhỏ: date, context, label */
export const Pill: React.FC<{
  children: React.ReactNode;
  opacity?: number;
  mt?:      number;
}> = ({ children, opacity = 1, mt = 16 }) => (
  <div style={{ marginTop: mt, opacity }}>
    <div
      style={{
        display:      "inline-block",
        padding:      "8px 28px",
        borderRadius: 999,
        background:   "rgba(255,255,255,0.08)",
        border:       "1px solid rgba(255,255,255,0.12)",
        color:        "#cbd5e1",
        fontSize:     30,
        fontWeight:   700,
      }}
    >
      {children}
    </div>
  </div>
);
