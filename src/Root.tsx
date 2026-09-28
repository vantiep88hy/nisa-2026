// remotion/src/Root.tsx
import React from "react";
import "./fonts.css";
import {
  Composition,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  registerRoot,
} from "remotion";

import slidesData from "../public/slides.json";
import { SlideRouter } from "./shared/SlideRouter";

// ── 1. PARSE DỮ LIỆU ────────────────────────────────────────────────────
const rawData  = slidesData as any;
const slides   = Array.isArray(rawData) ? rawData : (rawData.slides || []);
const meta     = !Array.isArray(rawData)
  ? (rawData.meta || {})
  : { fps: 30, audio: true };

// ── 2. TÍNH typeIndex MỘT LẦN DUY NHẤT Ở MODULE LEVEL ──────────────────
// Mỗi slide nhận một "thứ tự xuất hiện" riêng trong cùng slideType
// Ví dụ: title_card xuất hiện ở index 0,2,3,10 → typeIndex = 0,1,2,3
const typeCountMap: Record<string, number> = {};
const typeIndexMap: Record<number, number> = {}; // key = slideIndex global

slides.forEach((slide: any, i: number) => {
  const type = slide.type ?? "Default";
  typeCountMap[type]  = typeCountMap[type] ?? 0;
  typeIndexMap[i]     = typeCountMap[type];
  typeCountMap[type] += 1;
});

// ── 3. COMPONENT HIỂN THỊ ───────────────────────────────────────────────
const NisaVideo: React.FC = () => {
  const frame          = useCurrentFrame();
  const { fps }        = useVideoConfig();

  const currentSlideIndex = slides.findIndex((slide: any) => {
    const startF = slide.start !== undefined
      ? slide.start * fps
      : (slide.start_frame || 0);
    const endF   = slide.end !== undefined
      ? slide.end * fps
      : (slide.end_frame || 0);
    return frame >= startF && frame < endF;
  });

  const safeIndex    = currentSlideIndex !== -1 ? currentSlideIndex : 0;
  const currentSlide = slides[safeIndex];

  const lastSlide    = slides[slides.length - 1];
  const lastEnd      = lastSlide?.end || lastSlide?.end_frame / fps || 1;
  const globalProgress = frame / (lastEnd * fps);

  // ✅ Lookup typeIndex đã tính sẵn — không tính lại mỗi frame
  const typeIndex = typeIndexMap[safeIndex] ?? 0;

  return (
    <>
      {meta.audio && <Audio src={staticFile("audio.wav")} volume={1.0} />}

      {currentSlide ? (
        <SlideRouter
          slide={currentSlide}
          globalProgress={globalProgress}
          slideIndex={safeIndex}
          typeIndex={typeIndex}   // ✅ truyền xuống SlideRouter → SlideWithBg
        />
      ) : (
        <div
          style={{
            flex:            1,
            backgroundColor: "#000",
            color:           "#fff",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            fontSize:        30,
          }}
        >
          Dữ liệu slide trống hoặc lỗi frame: {frame}
        </div>
      )}
    </>
  );
};

// ── 4. CẤU HÌNH COMPOSITION ─────────────────────────────────────────────
const RemotionRoot: React.FC = () => {
  const fps         = meta.fps ?? 30;
  const lastSlide   = slides[slides.length - 1];

  let durationInFrames = 300;
  if (lastSlide) {
    const lastEnd    = lastSlide.end !== undefined
      ? lastSlide.end * fps
      : (lastSlide.end_frame || 300);
    durationInFrames = Math.max(1, Math.ceil(lastEnd));
  }

  return (
    <Composition
      id="NisaVideo"
      component={NisaVideo}
      durationInFrames={durationInFrames}
      fps={fps}
      width={1920}
      height={1080}
    />
  );
};

// ── 5. ĐĂNG KÝ ROOT ─────────────────────────────────────────────────────
registerRoot(RemotionRoot);