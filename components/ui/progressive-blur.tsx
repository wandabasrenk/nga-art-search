"use client";

import { motion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

export const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<"div">;

export function ProgressiveBlur({
  direction = "bottom",
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2);
  const segmentSize = 1 / (layers + 1);
  const layerDescriptors = Array.from({ length: layers }, (_, layerIndex) => ({
    id: `${direction}-${layerIndex}`,
    layerIndex,
  }));

  return (
    <div className={cn("relative", className)}>
      {layerDescriptors.map(({ id, layerIndex }) => {
        const angle = GRADIENT_ANGLES[direction];
        const gradientStops = [
          layerIndex * segmentSize,
          (layerIndex + 1) * segmentSize,
          (layerIndex + 2) * segmentSize,
          (layerIndex + 3) * segmentSize,
        ].map(
          (pos, posIndex) =>
            `rgba(255, 255, 255, ${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`,
        );

        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(
          ", ",
        )})`;

        return (
          <motion.div
            key={id}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${layerIndex * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${layerIndex * blurIntensity}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
