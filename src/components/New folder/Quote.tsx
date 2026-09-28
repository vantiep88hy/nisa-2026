// components/Quote.tsx
// Tầng 2 — Component
// Base layout: HeroLayout
// Đặc trưng: dấu " lớn trang trí + text trích dẫn + tên tác giả
// Dùng khi: quote từ chuyên gia, warren buffett, v.v.

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HeroLayout } from "../layouts/HeroLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, useFadeIn } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Type ──────────────────────────────────────────────────────
export interface QuoteSlide {
  type:        "quote";
  start:       number;
  end:         number;
  text:        string;    // vd: "投資で一番大切なのは、「続けること」です。"
  author?:     string;    // vd: "ー ウォーレン・バフェット"
  source?:     string;    // vd: "バークシャー・ハサウェイ年次報告書"
}

interface Props {
  slide:           QuoteSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const Quote: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - Math.round(slide.start * fps);

  const quoteMarkAnim = slideIn(localFrame, 0, fps);
  const textAnim      = slideIn(localFrame, 10, fps);
  const authorOp      = useFadeIn(localFrame, 30);

  return (
    <HeroLayout theme={theme} globalProgress={globalProgress} padding={140}>
      <QuoteContent
        slide={slide}
        quoteMarkAnim={quoteMarkAnim}
        textAnim={textAnim}
        authorOp={authorOp}
      />
    </HeroLayout>
  );
};

// ── Inner content ─────────────────────────────────────────────
const QuoteContent: React.FC<{
  slide:          QuoteSlide;
  quoteMarkAnim:  { opacity: number; translateY: number };
  textAnim:       { opacity: number; translateY: number };
  authorOp:       number;
}> = ({ slide, quoteMarkAnim, textAnim, authorOp }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        maxWidth:      1400,
        width:         "100%",
        position:      "relative",
      }}
    >
      {/* Opening quotation mark — decorative, large */}
      <div
        style={{
          opacity:        quoteMarkAnim.opacity,
          transform:      `translateY(${quoteMarkAnim.translateY}px)`,
          fontSize:       220,
          fontWeight:     900,
          color:          `${theme.accent}30`,
          lineHeight:     0.8,
          alignSelf:      "flex-start",
          marginBottom:   -30,
          userSelect:     "none",
          fontFamily:     "Georgia, serif",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          opacity:    textAnim.opacity,
          transform:  `translateY(${textAnim.translateY}px)`,
          fontSize:   72,
          fontWeight: 900,
          color:      theme.textPrimary,
          lineHeight: 1.45,
          textAlign:  "center",
          padding:    "0 40px",
        }}
      >
        {slide.text}
      </div>

      {/* Closing quotation mark */}
      <div
        style={{
          opacity:        quoteMarkAnim.opacity,
          fontSize:       220,
          fontWeight:     900,
          color:          `${theme.accent}30`,
          lineHeight:     0.8,
          alignSelf:      "flex-end",
          marginTop:      -30,
          userSelect:     "none",
          fontFamily:     "Georgia, serif",
        }}
      >
        "
      </div>

      {/* Author */}
      {slide.author && (
        <div
          style={{
            opacity:   authorOp,
            marginTop: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width:  80,
              height: 3,
              background: theme.accent,
              borderRadius: 2,
              margin: "0 auto 20px",
            }}
          />
          <div
            style={{
              fontSize:   44,
              fontWeight: 700,
              color:      theme.textSecondary,
            }}
          >
            {slide.author}
          </div>
          {slide.source && (
            <div
              style={{
                fontSize:  32,
                fontWeight: 500,
                color:     `${theme.textSecondary}80`,
                marginTop: 10,
              }}
            >
              {slide.source}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
