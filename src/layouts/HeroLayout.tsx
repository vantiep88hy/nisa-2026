// layouts/HeroLayout.tsx
// Tầng 1 — Layout cơ bản
// Pattern: toàn bộ nội dung căn giữa màn hình theo cả chiều ngang lẫn dọc
// Dùng cho: BigNumber, Warning, Question, Quote (hero content)

import React from "react";
import { CANVAS_W, CANVAS_H, font, zIndex } from "../shared/tokens";
import { ProgressBar } from "../shared/ProgressBar";
import { ThemeProvider } from "../themes/ThemeContext";
import { ThemeTokens, NisaTheme } from "../themes/themes";

interface HeroLayoutProps {
  theme?:          ThemeTokens;
  globalProgress?: number;
  /** Padding override — mặc định 120px mỗi cạnh */
  padding?:        number;
  children:        React.ReactNode;
}

export const HeroLayout: React.FC<HeroLayoutProps> = ({
  theme          = NisaTheme,
  globalProgress = 0,
  padding        = 120,
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
      {/* Grid decoration */}
      <GridDecoration />

      {/* Hero content zone — căn giữa tuyệt đối */}
      <div
        style={{
          position:       "absolute",
          top:            padding,
          left:           padding,
          right:          padding,
          bottom:         padding,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          zIndex:         zIndex.text,
        }}
      >
        {children}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  </ThemeProvider>
);

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
