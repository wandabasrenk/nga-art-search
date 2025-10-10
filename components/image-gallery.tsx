"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { GalleryItem } from "@/components/gallery-item";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { Position, SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: SearchResult[];
  isLoading: boolean;
  isActive: boolean;
  scatterSeed: number;
  onBackToScatter: () => void;
}

// Helper function to check if two rectangles overlap
function checkOverlap(
  rect1: { x: number; y: number; size: number },
  rect2: { x: number; y: number; width: number; height: number },
  padding = 0
): boolean {
  return !(
    rect1.x + rect1.size + padding < rect2.x ||
    rect1.x > rect2.x + rect2.width + padding ||
    rect1.y + rect1.size + padding < rect2.y ||
    rect1.y > rect2.y + rect2.height + padding
  );
}

// Generate non-overlapping random positions
function generateRandomPositions(count: number): Position[] {
  const positions: Position[] = [];
  const padding = 20; // Space between images
  const minSize = 180;
  const maxSize = 280;
  const marginLeft = 10; // Buffer from left edge
  const marginRight = 10; // Buffer from right edge
  const marginTop = 20; // Buffer from top edge
  const marginBottom = 100; // Larger buffer from bottom (for search bar)

  // Get viewport dimensions
  const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
  const vh = typeof window !== "undefined" ? window.innerHeight : 1080;

  // Define exclusion zone for centered search header
  const exclusionZone = {
    x: vw / 2 - 225 - padding, // 450px / 2 + padding
    y: vh / 2 - 125 - padding, // 250px / 2 + padding
    width: 450 + padding * 2,
    height: 250 + padding * 2,
  };

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let position: Position | null = null;

    while (attempts < 50) {
      const size =
        Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
      // Ensure x + size stays within bounds (more conservative on right)
      const maxAllowedX = vw - size - marginRight;
      const x =
        Math.random() * Math.max(0, maxAllowedX - marginLeft) + marginLeft;
      // Ensure y + size stays within bounds
      const maxAllowedY = vh - size - marginBottom;
      const y =
        Math.random() * Math.max(0, maxAllowedY - marginTop) + marginTop;

      const newPos = { x, y, size };

      // Check for overlaps with other images
      const overlapsImages = positions.some((pos) =>
        checkOverlap(
          newPos,
          { x: pos.x, y: pos.y, width: pos.size, height: pos.size },
          padding
        )
      );

      // Check for overlap with exclusion zone
      const overlapsExclusion = checkOverlap(newPos, exclusionZone, 0);

      if (!overlapsImages && !overlapsExclusion) {
        position = newPos;
        break;
      }

      attempts++;
    }

    // If we couldn't find a non-overlapping position, place it anyway with bounds check
    // but still avoid the exclusion zone
    if (position) {
      positions.push(position);
    } else {
      const size = minSize;
      const maxAllowedX = vw - size - marginRight;
      const maxAllowedY = vh - size - marginBottom;

      // Try a few times to avoid exclusion zone even in fallback
      let fallbackPos: Position = {
        x: Math.random() * Math.max(0, maxAllowedX - marginLeft) + marginLeft,
        y: Math.random() * Math.max(0, maxAllowedY - marginTop) + marginTop,
        size,
      };

      for (let j = 0; j < 10; j++) {
        const testPos = {
          x: Math.random() * Math.max(0, maxAllowedX - marginLeft) + marginLeft,
          y: Math.random() * Math.max(0, maxAllowedY - marginTop) + marginTop,
          size,
        };
        if (!checkOverlap(testPos, exclusionZone, 0)) {
          fallbackPos = testPos;
          break;
        }
      }
      positions.push(fallbackPos);
    }
  }

  return positions;
}

export function ImageGallery({
  images,
  isLoading,
  isActive,
  scatterSeed,
  onBackToScatter,
}: ImageGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const isCompactViewport = useIsMobile(1024);
  const shouldRenderScatter = !isCompactViewport;

  // Generate random positions only once when component mounts
  const randomPositions = useMemo(
    () => (shouldRenderScatter ? generateRandomPositions(images.length) : []),
    [images.length, scatterSeed, shouldRenderScatter]
  );

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  }, []);

  const handleHoverChange = useCallback(
    (isHovered: boolean, imageId: string) => {
      setHoveredId(isHovered ? imageId : null);
    },
    []
  );

  const renderItems = (active: boolean) =>
    images.map((image, index) => (
      <GalleryItem
        key={image.file_id}
        image={image}
        index={index}
        isLoaded={loadedImages.has(image.file_id)}
        isHovered={hoveredId === image.file_id}
        onLoad={() => handleImageLoad(image.file_id)}
        onHover={(hovered) => handleHoverChange(hovered, image.file_id)}
        isActive={active}
        position={shouldRenderScatter ? randomPositions[index] : undefined}
      />
    ));

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onBackToScatter();
      }
    },
    [onBackToScatter]
  );

  const handleGridClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  if (isLoading || images.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {shouldRenderScatter && (
        <motion.div
          key={`scatter-${scatterSeed}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={cn("relative", { "pointer-events-none": isActive })}
          aria-hidden={isActive}
        >
          {renderItems(false)}
        </motion.div>
      )}

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-10 overflow-auto"
            onClick={handleOverlayClick}
          >
            <div className="mx-auto max-w-7xl p-8 pb-20">
              <LayoutGroup>
                <motion.div
                  layout
                  initial={false}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                  onClick={handleGridClick}
                >
                  {renderItems(true)}
                </motion.div>
              </LayoutGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
