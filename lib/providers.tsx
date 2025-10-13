"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { ViewProvider } from "@/contexts/view-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem
    >
      <LanguageProvider>
        <ViewProvider>{children}</ViewProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
