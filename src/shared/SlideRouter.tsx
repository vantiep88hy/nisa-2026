// shared/SlideRouter.tsx
import React from "react";
import { Slide } from "../types/slide";

import { SlideWithBg }   from "./SlideWithBg";
import { TitleCard }     from "../components/TitleCard";
import { BulletSummary } from "../components/BulletSummary";
import { Comparison }    from "../components/Comparison";
import { BigNumber }     from "../components/BigNumber";
import { Timeline }      from "../components/Timeline";

// ── IMPORT 5 COMPONENT ĐỊNH DẠNG MỚI ─────────────────────────────────────
import { Question }      from "../components/Question";
import { Quote }         from "../components/Quote";
import { Ranking }       from "../components/Ranking";
import { Summary }       from "../components/Summary";
import { Warning }       from "../components/Warning";

interface Props {
  slide:          Slide;
  globalProgress: number;
  slideIndex?:    number;
  typeIndex?:     number; // thứ tự xuất hiện trong cùng slideType
}

export const SlideRouter: React.FC<Props> = ({
  slide,
  globalProgress,
  slideIndex = 0,
  typeIndex  = 0,
}) => {

  const renderContent = () => {
    switch (slide.type) {
      // ── 5 ĐỊNH DẠNG CŨ ─────────────────────────────────────────────────────
      case "title_card":
        return <TitleCard slide={slide} globalProgress={globalProgress} />;
      case "bullet_summary":
        return <BulletSummary slide={slide} globalProgress={globalProgress} />;
      case "comparison":
        return <Comparison slide={slide} />;
      case "big_number":
        return <BigNumber slide={slide} />;
      case "timeline":
        return <Timeline slide={slide} />;

      // ── 5 ĐỊNH DẠNG MỚI (Gọi trực tiếp phẳng, không bọc Sequence) ──────────
      case "question":
        return <Question slide={slide as any} globalProgress={globalProgress} />;
      case "quote":
        return <Quote slide={slide as any} globalProgress={globalProgress} />;
      case "ranking":
        return <Ranking slide={slide as any} globalProgress={globalProgress} />;
      case "summary":
        return <Summary slide={slide as any} globalProgress={globalProgress} />;
      case "warning":
        return <Warning slide={slide as any} globalProgress={globalProgress} />;

      default:
        return <PlaceholderSlide slide={slide} globalProgress={globalProgress} />;
    }
  };

  return (
    <SlideWithBg
      slideType={slide.type}
      slideIndex={slideIndex}
      typeIndex={typeIndex}
    >
      {renderContent()}
    </SlideWithBg>
  );
};

// ── Placeholder ───────────────────────────────────────────────────────────────
import { colors, font, CANVAS_W, CANVAS_H } from "./tokens";
import { ProgressBar } from "./ProgressBar";

const PlaceholderSlide: React.FC<{ slide: Slide; globalProgress: number }> = ({
  slide,
  globalProgress,
}) => (
  <div
    style={{
      width:          CANVAS_W,
      height:         CANVAS_H,
      background:     colors.bgPrimary,
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      fontFamily:     font.family,
      gap:            24,
      position:       "relative",
    }}
  >
    <div style={{ fontSize: 48, color: colors.textMuted }}>
      [{slide.type}]
    </div>
    <div style={{ fontSize: font.sizeTitle, color: colors.textPrimary, fontWeight: 700 }}>
      {"title" in slide ? slide.title : ""}
    </div>
    <div style={{ fontSize: font.sizeBody, color: colors.textSecondary }}>
      slide_id: {slide.slide_id}
    </div>
    <ProgressBar progress={globalProgress} />
  </div>
);