import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as LucideIcons from "lucide-react";

import { TimelineSlide } from "../types/slide";

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

import {
  slideIn,
  useFadeIn,
  useDrawLine,
  splitHighlight,
} from "../shared/animations";

import { ProgressBar } from "../shared/ProgressBar";

interface Props {
  slide:           TimelineSlide;
  globalProgress?: number;
}

export const Timeline: React.FC<Props> = ({
  slide,
  globalProgress = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideStartFrame = Math.round(slide.start * fps);
  const localFrame      = frame - slideStartFrame;

  const steps = slide.steps ?? [];

  const titleAnim = slideIn(localFrame, 0, fps);

  const getStepAppearFrame = (stepIndex: number): number => {
    const step = steps[stepIndex];

    if (typeof (step as any).start === "number") {
      const stepAbsoluteFrame = Math.round((step as any).start * fps);
      const localAppear       = stepAbsoluteFrame - slideStartFrame;
      return Math.max(localAppear, 8);
    }

    return 15 + stepIndex * 18;
  };

  const lastStepAppearFrame = getStepAppearFrame(steps.length - 1);
  const conclusionOpacity   = useFadeIn(
    localFrame,
    lastStepAppearFrame + 20,
  );

  return (
    <div
      style={{
        width:      CANVAS_W,
        height:     CANVAS_H,
        position:   "relative",
        overflow:   "hidden",
        background: "transparent", // ← video BG từ layer cha xuyên qua
        fontFamily: font.family,
      }}
    >
      <BackgroundDecoration />

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
        {/* ── TITLE ── */}
        <div
          style={{
            opacity:      titleAnim.opacity,
            transform:    `translateY(${titleAnim.translateY}px)`,
            textAlign:    "center",
            marginBottom: 50,
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
            {slide.title}
          </div>
          <div
            style={{
              width:        100,
              height:       6,
              borderRadius: 3,
              margin:       "18px auto 0",
              background:   "linear-gradient(90deg,#38bdf8,#0ea5e9)",
            }}
          />
        </div>

        {/* ── TIMELINE ── */}
        <div
          style={{
            flex:           1,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            20,
            minHeight:      0,
          }}
        >
          {steps.map((step, i) => {
            const appearFrame = getStepAppearFrame(i);
            const anim        = slideIn(localFrame, appearFrame, fps, 40);

            const Icon =
              step.icon &&
              (LucideIcons as Record<string, any>)[step.icon]
                ? (LucideIcons as Record<string, any>)[step.icon]
                : LucideIcons.Circle;

            const isLast    = i === steps.length - 1;
            const accent    = isLast ? "#f59e0b" : "#38bdf8";

            const labelText = (step as any).title ?? step.label ?? "";
            const highlight = (step as any).highlight ?? null;
            const parts     = splitHighlight(labelText, highlight);

            return (
              <React.Fragment key={i}>
                <div
                  style={{
                    flex:          1,
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    opacity:       anim.opacity,
                    transform:     `translateY(${anim.translateY}px)`,
                  }}
                >
                  {/* ICON CIRCLE */}
                  <div
                    style={{
                      width:          140,
                      height:         140,
                      borderRadius:   999,
                      display:        "flex",
                      justifyContent: "center",
                      alignItems:     "center",
                      background:     isLast
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(56,189,248,0.12)",
                      border:         `3px solid ${accent}`,
                      boxShadow:      isLast
                        ? "0 20px 50px rgba(245,158,11,0.2)"
                        : "0 20px 50px rgba(56,189,248,0.15)",
                    }}
                  >
                    <Icon size={62} color={accent} strokeWidth={2.5} />
                  </div>

                  {/* LABEL */}
                  <div
                    style={{
                      marginTop:  24,
                      fontSize:   38,
                      fontWeight: 800,
                      textAlign:  "center",
                      lineHeight: 1.3,
                      color:      "#ffffff",
                    }}
                  >
                    {parts.map((p, idx) =>
                      p.hl ? (
                        <span
                          key={idx}
                          style={{ color: "#f59e0b", fontWeight: 900 }}
                        >
                          {p.text}
                        </span>
                      ) : (
                        <span key={idx}>{p.text}</span>
                      )
                    )}
                  </div>

                  {/* DESC */}
                  {step.desc && (
                    <div
                      style={{
                        marginTop:  14,
                        fontSize:   32,
                        fontWeight: 600,
                        color:      "#94a3b8",
                        textAlign:  "center",
                        lineHeight: 1.4,
                        maxWidth:   260,
                      }}
                    >
                      {splitHighlight(step.desc, highlight).map((p, idx) =>
                        p.hl ? (
                          <span
                            key={idx}
                            style={{ color: accent, fontWeight: 800 }}
                          >
                            {p.text}
                          </span>
                        ) : (
                          <span key={idx}>{p.text}</span>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* CONNECTOR */}
                {i < steps.length - 1 && (
                  <Connector
                    frame={localFrame}
                    activeFrame={getStepAppearFrame(i + 1) - 6}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── CONCLUSION ── */}
        {slide.conclusion && (
          <ConclusionBox
            text={slide.conclusion}
            opacity={conclusionOpacity}
          />
        )}
      </div>

      <ProgressBar progress={globalProgress} />
    </div>
  );
};

// ── Connector ─────────────────────────────────────────────────

const Connector: React.FC<{
  frame:       number;
  activeFrame: number;
}> = ({ frame, activeFrame }) => {
  const scaleX = useDrawLine(frame, activeFrame, 12);

  return (
    <div
      style={{
        width:           120,
        height:          4,
        borderRadius:    999,
        background:      "linear-gradient(90deg,#38bdf8,#0ea5e9)",
        transform:       `scaleX(${scaleX})`,
        transformOrigin: "left center",
        flexShrink:      0,
      }}
    />
  );
};

// ── ConclusionBox ─────────────────────────────────────────────

const ConclusionBox: React.FC<{
  text:    string;
  opacity: number;
}> = ({ text, opacity }) => (
  <div
    style={{
      opacity,
      marginTop:    40,
      padding:      "24px 36px",
      background:   "rgba(245,158,11,0.1)",
      border:       "2px solid #f59e0b",
      borderRadius: 18,
      textAlign:    "center",
      fontSize:     42,
      fontWeight:   700,
      color:        "#f59e0b",
      flexShrink:   0,
      backdropFilter: "blur(6px)",
    }}
  >
    {text}
  </div>
);

// ── BackgroundDecoration ──────────────────────────────────────
// Chỉ giữ grid pattern mờ — KHÔNG có radial-gradient che video

const BackgroundDecoration: React.FC = () => (
  <div
    style={{
      position:        "absolute",
      inset:           0,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "100px 100px",
      opacity:        0.4,
    }}
  />
);