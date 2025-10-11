"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Position, SearchResult } from "@/lib/types";

interface GalleryItemProps {
  image: SearchResult;
  index: number;
  isActive: boolean;
  position?: Position;
}

export function GalleryItem({
  image,
  index,
  isActive,
  position,
}: GalleryItemProps) {
  const isMobile = useIsMobile();
  const imageUrl = image.metadata.image_url ?? "";
  const dialogTitle = image.metadata.title ?? "Artwork";
  const displayTitle = image.metadata.title ?? "Untitled";
  const [isHovered, setIsHovered] = useState(false);

  const imageContent = (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        layout: { duration: 0.8, ease: "easeInOut" },
        opacity: { delay: index * 0.1, duration: 0.5 },
      }}
      className={isActive ? "relative aspect-square" : "absolute"}
      style={
        !isActive && position
          ? {
              left: position.x,
              top: position.y,
              width: position.size,
              height: position.size,
            }
          : undefined
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full rounded-md overflow-hidden p-0 border cursor-pointer">
        {/* biome-ignore lint/performance/noImgElement: Next.js Image cannot easily support the randomly sized scatter layout without layout shift. */}
        <img
          src={imageUrl}
          alt={dialogTitle}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <ProgressiveBlur
        direction="bottom"
        blurLayers={8}
        blurIntensity={0.5}
        className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full rounded-md"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-background/80 via-background/60 to-transparent rounded-b-md"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        animate={isHovered ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex flex-col items-start gap-0 px-4 py-3 text-xs">
          <p className="text-sm font-medium truncate w-full">{displayTitle}</p>
          {image.metadata.artist && (
            <span className="truncate w-full">{image.metadata.artist}</span>
          )}
          {image.metadata.date && <span>{image.metadata.date}</span>}
        </div>
      </motion.div>
    </motion.div>
  );

  // On mobile, render without dialog
  if (isMobile) {
    return imageContent;
  }

  const artworkUrl = image.metadata.artwork_url;

  return (
    <Dialog>
      <DialogTrigger asChild>{imageContent}</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 w-auto h-auto max-w-[95vw] sm:max-w-[90vw] max-h-[90vh] sm:max-h-[90vh] overflow-auto bg-transparent place-items-center"
      >
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        <div className="relative">
          <img
            src={imageUrl}
            alt={dialogTitle}
            loading="lazy"
            className="rounded-lg max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain"
          />
          {artworkUrl && (
            <div className="absolute bottom-4 right-4">
              <Button asChild variant="secondary" size="sm">
                <Link
                  href={artworkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Details
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
