// layouts/TwoColumnLayout.tsx
// Tầng 1 — Layout cơ bản
// Pattern: title + optional badge ở trên, 2 cột chiều ngang bên dưới
// Dùng cho: Comparison, BeforeAfter, ProsAndCons

import React from "react";
import {
  CANVAS_W, CANVAS_H, SAFE_W, SAFE_H,
  spacing, font, zIndex,
} from "../shared/tokens";
import { ProgressBar } from "../shared/ProgressBar";
import { ThemeProvider, useTheme } from "../themes/ThemeContext";
import { ThemeTokens, NisaTheme } from "../themes/themes";

interface TwoColumnLayoutProps {
  theme?:          ThemeTokens;
  globalProgress?: number;
  title:           string;
  /** Badge nhỏ hiển thị dưới title (vd: kết quả, nhận xét) */
  badge?:          React.ReactNode;
  /** Nội dung cột trái */
  left:            React.ReactNode;
  /** Nội dung cột phải */
  right:           React.ReactNode;
  /** Element đè giữa 2 cột (vd: VS bubble) */
  centerElement?:  React.ReactNode;
  /** Gap giữa 2 cột — mặc định 40px */
  columnGap?:      number;
  titleAnim?:      { opacity: number; translateY: number };
  badgeAnim?:      { opacity: number; translateY: number };
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  theme          = NisaTheme,
  globalProgress = 0,
  title,
  badge,
  left,
  right,
  centerElement,
  columnGap      = 40,
  titleAnim      = { opacity: 1, translateY: 0 },
  badgeAnim      = { opacity: 1, translateY: 0 },
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
          zIndex:        zIndex.text,
        }}
      >
        {/* Title */}
        <TwoColTitle
          title={title}
          anim={titleAnim}
        />

        {/* Optional badge */}
        {badge && (
          <div
            style={{
              opacity:      badgeAnim.opacity,
              transform:    `translateY(${badgeAnim.translateY}px)`,
              textAlign:    "center",
              marginBottom: 24,
              flexShrink:   0,
            }}
          >
            {badge}
          </div>
        )}

        {/* Two columns */}
        <div
          style={{
            flex:       1,
            display:    "flex",
            gap:        columnGap,
            alignItems: "stretch",
            position:   "relative",
            minHeight:  0,
          }}
        >
          {left}

          {/* Center overlay element (VS bubble, arrow, ...) */}
          {centerElement && (
            <div
              style={{
                position:  "absolute",
                left:      "50%",
                top:       "50%",
                transform: "translate(-50%, -50%)",
                zIndex:    50,
              }}
            >
              {centerElement}
            </div>
          )}

          {right}
        </div>
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  </ThemeProvider>
);

const TwoColTitle: React.FC<{
  title: string;
  anim:  { opacity: number; translateY: number };
}> = ({ title, anim }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        opacity:      anim.opacity,
        transform:    `translateY(${anim.translateY}px)`,
        textAlign:    "center",
        marginBottom: 28,
        flexShrink:   0,
      }}
    >
      <div
        style={{
          color:         theme.textPrimary,
          fontWeight:    900,
          fontSize:      75,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          width:        100,
          height:       6,
          borderRadius: 3,
          background:   theme.progressGradient,
          margin:       "16px auto 0",
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
      backgroundSize: "90px 90px",
      opacity:        0.4,
    }}
  />
);
