// components/BulletSummary.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";
import { BulletSummarySlide } from "../types/slide";
import {
  colors,
  font,
  spacing,
  zIndex,
  CANVAS_W,
  CANVAS_H,
  SAFE_W,
  SAFE_H,
} from "../shared/tokens";
import { ProgressBar } from "../shared/ProgressBar";
import {
  slideIn,
  useFadeIn,
  splitHighlight,
} from "../shared/animations";

interface Props {
  slide: BulletSummarySlide;
  globalProgress: number;
}

export const BulletSummary: React.FC<Props> = ({ slide, globalProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = slide.start * fps;
  const slideDurFrames  = (slide.end - slide.start) * fps;
  const localFrame      = frame - slideStartFrame;

  const points = slide.points;

  // Title slides in at the very start of the slide
  const titleAnim = slideIn(localFrame, 0, fps);

  // CTA fades in at 80% of slide duration
  const ctaActive = Math.round(slideDurFrames * 0.8);
  const ctaOp     = useFadeIn(localFrame, ctaActive);

  return (
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
      <BackgroundDecoration />

      {/* Safe zone */}
      <div
        style={{
          position:      "absolute",
          top:           spacing.safeTop,
          left:          spacing.safeLeft,
          width:         SAFE_W,
          height:        SAFE_H,
          display:       "flex",
          flexDirection: "column",
          gap:           45,
          zIndex:        zIndex.text,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity:    titleAnim.opacity,
            transform:  `translateY(${titleAnim.translateY}px)`,
            flexShrink: 0,
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
            {slide.title}
          </div>
          {/* Underline */}
          <div
            style={{
              width:        100,
              height:       6,
              background:   "linear-gradient(90deg, #38bdf8, #0ea5e9)",
              borderRadius: 3,
              marginTop:    16,
            }}
          />
        </div>

        {/* Bullet points */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            gap:            28,
            flex:           1,
            justifyContent: "center",
          }}
        >
          {points.map((point, i) => {
            const activeFrame = Math.round((point.start - slide.start) * fps);
            const anim        = slideIn(localFrame, activeFrame, fps);

            const nextPoint    = points[i + 1];
            const deactivateAt = nextPoint
              ? Math.round((nextPoint.start - slide.start) * fps)
              : slideDurFrames;
            const isActive =
              localFrame >= activeFrame && localFrame < deactivateAt;

            return (
              <BulletRow
                key={i}
                text={point.text}
                highlight={point.highlight}
                icon={point.icon ?? "ChevronRight"}
                animOpacity={anim.opacity} 
                isActive={isActive}
                translateY={anim.translateY}
                focusWeight={point.focus_weight ?? 1}
              />
            );
          })}
        </div>

        {/* CTA */}
        {slide.cta && (
          <div style={{ opacity: ctaOp, flexShrink: 0 }}>
            <CtaBox text={slide.cta} />
          </div>
        )}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────

interface BulletRowProps {
  text:        string;
  highlight:  string | null;
  icon:       string;
  animOpacity: number; 
  isActive:   boolean;
  translateY: number;
  focusWeight: number;
}

const BulletRow: React.FC<BulletRowProps> = ({
  text,
  highlight,
  icon,
  animOpacity, 
  isActive,
  translateY,
  focusWeight,
}) => {
  const parts = splitHighlight(text, highlight);

  const LucideIcon =
    (LucideIcons as Record<string, any>)[icon] ?? LucideIcons.ChevronRight;

  // Bullet có focus_weight >= 2 sẽ nổi bật mạnh hơn khi active
  // (viền dày hơn, glow rực hơn, chữ to hơn một chút)
  const isStrongFocus = isActive && focusWeight >= 2;

  return (
    <div
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          28,
        padding:      "24px 36px",
        /* Giữ nguyên màu nền tối chuẩn sang trọng cho toàn bộ các khung */
        background:   "rgba(15, 23, 42, 0.85)", 
        /* Khung đang active sẽ có viền xanh sáng rực, focus_weight >= 2 thì viền dày hơn */
        border:       `${isStrongFocus ? 3 : 2}px solid ${
          isActive ? "#38bdf8" : "rgba(255, 255, 255, 0.2)"
        }`,
        borderRadius: 20,
        boxShadow:    isActive
          ? isStrongFocus
            ? "0 24px 55px rgba(56, 189, 248, 0.32), 0 0 40px rgba(56, 189, 248, 0.18)"
            : "0 20px 40px rgba(56, 189, 248, 0.2)"
          : "0 10px 30px rgba(0, 0, 0, 0.3)",
        /* Chỉ dùng để ẩn khi chưa xuất hiện. Khi đã xuất hiện, giữ nguyên độ đậm 100% */
        opacity:      animOpacity > 0 ? 1 : 0, 
        /* Focus_weight >= 2 thì phóng lớn hơn một chút so với active thường */
        transform:    `translateY(${translateY}px) scale(${
          isStrongFocus ? 1.05 : isActive ? 1.03 : 1
        })`,
        transition:   "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Lucide icon */}
      <div
        style={{
          flexShrink:     0,
          width:          72,
          height:         72,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          /* Nền icon luôn sáng rõ, focus mạnh thì đậm hơn */
          background:     isActive
            ? isStrongFocus
              ? "rgba(56, 189, 248, 0.35)"
              : "rgba(56, 189, 248, 0.25)"
            : "rgba(255, 255, 255, 0.1)",
          borderRadius:   18,
          transition:     "all 0.3s ease",
        }}
      >
        <LucideIcon
          size={38}
          color={isActive ? "#38bdf8" : "#ffffff"}
          strokeWidth={2.5}
        />
      </div>

      {/* Text */}
      <div
        style={{
          fontSize:   isStrongFocus ? 58 : 55,
          color:      "#ffffff",
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {parts.map((p, i) =>
          p.hl ? (
            <span
              key={i}
              style={{
                color:      "#f59e0b",
                fontSize:   isStrongFocus ? "1.15em" : "1.1em",
                fontWeight: 900,
                margin:     "0 4px",
              }}
            >
              {p.text}
            </span>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </div>

      {/* Focus indicator - chỉ hiện khi focus_weight >= 2 và đang active */}
      {isStrongFocus && (
        <div
          style={{
            marginLeft: 12,
            width:      10,
            height:     10,
            flexShrink: 0,
            borderRadius: "50%",
            background: "#38bdf8",
            boxShadow:  "0 0 14px rgba(56, 189, 248, 0.7)",
          }}
        />
      )}
    </div>
  );
};

const CtaBox: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      display:      "flex",
      alignItems:   "center",
      gap:          14,
      padding:      "20px 36px",
      background:   "rgba(15, 23, 42, 0.9)", 
      border:       `2px solid #f59e0b`,
      borderRadius: 16,
      boxShadow:    "0 12px 32px rgba(245, 158, 11, 0.15)",
      color:        "#f59e0b",
      fontSize:     45,
      fontWeight:   700,
      zIndex:       zIndex.cta,
      whiteSpace:   "nowrap",
      overflow:     "hidden",
      textOverflow: "ellipsis",
    }}
  >
    <span style={{ fontSize: 42, marginRight: 6 }}>★</span>
    {text}
  </div>
);

const BackgroundDecoration: React.FC = () => (
  <>
    <div
      style={{
        position:        "absolute",
        inset:           0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize:  "100px 100px",
        opacity:         0.15,
        zIndex:          zIndex.decoration,
      }}
    />
  </>
);