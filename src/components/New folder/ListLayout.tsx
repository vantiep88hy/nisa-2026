// layouts/ListLayout.tsx
// Tầng 1 — Layout cơ bản
// Pattern: title + underline accent ở trên, scrollable list bên dưới
// Dùng cho: BulletSummary, Checklist, Ranking, Summary

import React from "react";
import {
  CANVAS_W, CANVAS_H, SAFE_W, SAFE_H,
  spacing, font, zIndex,
} from "../shared/tokens";
import { ProgressBar } from "../shared/ProgressBar";
import { ThemeProvider, useTheme } from "../themes/ThemeContext";
import { ThemeTokens, NisaTheme } from "../themes/themes";

interface ListLayoutProps {
  theme?:          ThemeTokens;
  globalProgress?: number;
  title:           string;
  /** Slot cho phần CTA / footer (tuỳ chọn) */
  footer?:         React.ReactNode;
  children:        React.ReactNode;
}

export const ListLayout: React.FC<ListLayoutProps> = ({
  theme          = NisaTheme,
  globalProgress = 0,
  title,
  footer,
  children,
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
          gap:           40,
          zIndex:        zIndex.text,
        }}
      >
        {/* Title block */}
        <ListTitle title={title} />

        {/* List items — flex 1 để chiếm hết không gian còn lại */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           24,
            flex:          1,
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        {/* Footer / CTA */}
        {footer && (
          <div style={{ flexShrink: 0 }}>{footer}</div>
        )}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  </ThemeProvider>
);

// Sub-component — dùng useTheme() để đọc màu accent
const ListTitle: React.FC<{ title: string }> = ({ title }) => {
  const theme = useTheme();
  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          fontSize:      75,
          fontWeight:    900,
          color:         theme.textPrimary,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          width:        100,
          height:       6,
          background:   theme.progressGradient,
          borderRadius: 3,
          marginTop:    16,
        }}
      />
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
      opacity:        0.5,
    }}
  />
);
