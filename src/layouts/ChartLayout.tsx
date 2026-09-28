// layouts/ChartLayout.tsx
// Tầng 1 — Layout cơ bản
// Pattern: title + subtitle bên trên, canvas chart chiếm phần lớn không gian
// Dùng cho: PieChart, BarChart, và bất kỳ biểu đồ nào

import React from "react";
import {
  CANVAS_W, CANVAS_H, SAFE_W, SAFE_H,
  spacing, font, zIndex,
} from "../shared/tokens";
import { ProgressBar } from "../shared/ProgressBar";
import { ThemeProvider, useTheme } from "../themes/ThemeContext";
import { ThemeTokens, NisaTheme } from "../themes/themes";

interface ChartLayoutProps {
  theme?:          ThemeTokens;
  globalProgress?: number;
  title:           string;
  subtitle?:       string;
  /** Slot note nhỏ bên dưới chart (vd: ※毎月1万円を年利5%で積立した場合) */
  note?:           string;
  children:        React.ReactNode;
  titleAnim?:      { opacity: number; translateY: number };
}

export const ChartLayout: React.FC<ChartLayoutProps> = ({
  theme          = NisaTheme,
  globalProgress = 0,
  title,
  subtitle,
  note,
  children,
  titleAnim      = { opacity: 1, translateY: 0 },
}) => (
  <ThemeProvider theme={theme}>
    <div
      style={{
        width:      CANVAS_W,
        height:     CANVAS_H,
        background: "transparent",
        position:   "relative",
        overflow:   "hidden",
        fontFamily: font.family,
      }}
    >
      <GridDecoration />

      <div
        style={{
          position:      "absolute",
          top:           spacing.safeTop,
          left:          spacing.safeLeft,
          width:         SAFE_W,
          height:        SAFE_H,
          display:       "flex",
          flexDirection: "column",
          gap:           32,
          zIndex:        zIndex.text,
        }}
      >
        {/* Title block */}
        <ChartTitle title={title} subtitle={subtitle} anim={titleAnim} />

        {/* Chart canvas — chiếm hết flex space */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          {children}
        </div>

        {/* Note nhỏ */}
        {note && <ChartNote text={note} />}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  </ThemeProvider>
);

const ChartTitle: React.FC<{
  title:    string;
  subtitle?: string;
  anim:     { opacity: number; translateY: number };
}> = ({ title, subtitle, anim }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        opacity:   anim.opacity,
        transform: `translateY(${anim.translateY}px)`,
        flexShrink: 0,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize:   68,
          fontWeight: 900,
          color:      theme.textPrimary,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize:   38,
            fontWeight: 600,
            color:      theme.textSecondary,
            marginTop:  10,
          }}
        >
          {subtitle}
        </div>
      )}
      <div
        style={{
          width:        80,
          height:       5,
          borderRadius: 3,
          background:   theme.progressGradient,
          margin:       "14px auto 0",
        }}
      />
    </div>
  );
};

const ChartNote: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontSize:   28,
        color:      theme.textSecondary,
        textAlign:  "center",
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
};

const GridDecoration: React.FC = () => (
  <div
    style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
      `,
      backgroundSize: "100px 100px",
      opacity:        0.4,
    }}
  />
);
