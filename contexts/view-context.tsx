"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";

interface ViewContextValue {
  isActive: boolean;
  scatterSeed: number;
  setIsActive: (active: boolean) => void;
  regenerateScatter: () => void;
}

export const ViewContext = createContext<ViewContextValue | null>(null);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [scatterSeed, setScatterSeed] = useState(0);

  const regenerateScatter = useCallback(() => {
    setScatterSeed((prev) => prev + 1);
    setIsActive(false);
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      scatterSeed,
      setIsActive,
      regenerateScatter,
    }),
    [isActive, scatterSeed, regenerateScatter],
  );

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}
