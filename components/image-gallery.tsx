"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { GalleryItem } from "@/components/gallery-item";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { generateRandomPositions } from "@/lib/gallery-layout";
import type { SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: SearchResult[];
  isLoading: boolean;
  isActive: boolean;
  scatterSeed: number;
  onBackToScatter: () => void;
}

export function ImageGallery({
  images,
  isLoading,
  isActive,
  scatterSeed,
  onBackToScatter,
}: ImageGalleryProps) {
  const isCompactViewport = useIsMobile(1024);
  const shouldRenderScatter = !isCompactViewport;
  const [_, setLoadedImages] = useState<Set<string>>(new Set());

  const randomPositions = useMemo(
    () =>
      shouldRenderScatter
        ? generateRandomPositions(images.length, scatterSeed)
        : [],
    [images.length, scatterSeed, shouldRenderScatter],
  );

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  }, []);

  const renderItems = (active: boolean) =>
    images.map((image, index) => (
      <GalleryItem
        key={image.file_id}
        image={image}
        index={index}
        onLoad={() => handleImageLoad(image.file_id)}
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
    [onBackToScatter],
  );

  const handleGridClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative" aria-busy={isLoading}>
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
            <div className="mx-auto max-w-7xl p-8 py-20">
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
