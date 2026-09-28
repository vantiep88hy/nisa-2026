// shared/ProgressBar.tsx
import React from "react";
import { colors, spacing, zIndex, CANVAS_W } from "./tokens";

interface Props {
  progress: number; // 0.0 – 1.0
}

export const ProgressBar: React.FC<Props> = ({ progress }) => {
  const clamp = Math.max(0, Math.min(1, progress));

  return (
    <div
      style={{
        position:   "absolute",
        bottom:     0,
        left:       0,
        width:      CANVAS_W,
        height:     spacing.progressH,
        background: colors.progressBg,
        zIndex:     zIndex.progress,
      }}
    >
      <div
        style={{
          height:     "100%",
          width:      `${clamp * 100}%`,
          background: colors.progressFill,
        }}
      />
    </div>
  );
};
