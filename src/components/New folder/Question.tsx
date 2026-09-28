// components/Question.tsx
// Tầng 2 — Component
// Base layout: HeroLayout
// Đặc trưng: dấu "Q." lớn + câu hỏi + button "結論から言うと…"
// Dùng khi: đặt câu hỏi kéo người xem, tạo suspense trước khi giải đáp

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { HeroLayout } from "../layouts/HeroLayout";
import { useTheme } from "../themes/ThemeContext";
import { slideIn, useFadeIn, splitHighlight } from "../shared/animations";
import { ThemeTokens } from "../themes/themes";

// ── Type ──────────────────────────────────────────────────────
export interface QuestionSlide {
  type:       "question";
  start:      number;
  end:        number;
  question:   string;   // vd: "NISAってやらないと損なの？"
  highlight?: string;   // phần cần highlight trong câu hỏi
  cta?:       string;   // vd: "結論から言うと…"
}

interface Props {
  slide:           QuestionSlide;
  globalProgress?: number;
  theme?:          ThemeTokens;
}

// ── Component ─────────────────────────────────────────────────
export const Question: React.FC<Props> = ({
  slide,
  globalProgress = 0,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - Math.round(slide.start * fps);

  const qBadgeAnim  = slideIn(localFrame, 0, fps);
  const questionAnim = slideIn(localFrame, 12, fps);
  const ctaOp        = useFadeIn(localFrame, 30);

  return (
    <HeroLayout theme={theme} globalProgress={globalProgress}>
      <QuestionContent
        slide={slide}
        qBadgeAnim={qBadgeAnim}
        questionAnim={questionAnim}
        ctaOp={ctaOp}
      />
    </HeroLayout>
  );
};

// ── Inner content ─────────────────────────────────────────────
const QuestionContent: React.FC<{
  slide:        QuestionSlide;
  qBadgeAnim:   { opacity: number; translateY: number };
  questionAnim: { opacity: number; translateY: number };
  ctaOp:        number;
}> = ({ slide, qBadgeAnim, questionAnim, ctaOp }) => {
  const theme = useTheme();
  const parts  = splitHighlight(slide.question, slide.highlight ?? null);

  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            48,
        maxWidth:       1400,
        width:          "100%",
      }}
    >
      {/* Q. badge */}
      <div
        style={{
          opacity:   qBadgeAnim.opacity,
          transform: `translateY(${qBadgeAnim.translateY}px)`,
        }}
      >
        <div
          style={{
            width:          180,
            height:         180,
            borderRadius:   999,
            background:     `${theme.highlight}18`,
            border:         `4px solid ${theme.highlight}`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       100,
            fontWeight:     900,
            color:          theme.highlight,
            boxShadow:      `0 0 80px ${theme.highlight}25`,
          }}
        >
          Q.
        </div>
      </div>

      {/* Question text */}
      <div
        style={{
          opacity:    questionAnim.opacity,
          transform:  `translateY(${questionAnim.translateY}px)`,
          textAlign:  "center",
          fontSize:   82,
          fontWeight: 900,
          color:      theme.textPrimary,
          lineHeight: 1.3,
        }}
      >
        {parts.map((p, i) =>
          p.hl ? (
            <span key={i} style={{ color: theme.highlight }}>{p.text}</span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </div>

      {/* CTA button */}
      {slide.cta && (
        <div style={{ opacity: ctaOp }}>
          <div
            style={{
              padding:      "22px 56px",
              borderRadius: 999,
              background:   theme.bgCard,
              border:       `2px solid ${theme.accent}`,
              fontSize:     48,
              fontWeight:   700,
              color:        theme.accent,
              boxShadow:    `0 12px 40px ${theme.accent}20`,
            }}
          >
            {slide.cta}
          </div>
        </div>
      )}
    </div>
  );
};
