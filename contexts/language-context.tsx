"use client";

import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

const DEFAULT_QUERY_EN = "Paintings of winter landscapes";
const DEFAULT_QUERY_CN = "冬季风景画";

// Mapping between English and Chinese suggestions
const SUGGESTION_MAP: Record<string, string> = {
  // EN to CN
  "Still life paintings": "静物画",
  "Paintings of flowers": "花卉画",
  "Woodcuts of landscapes": "风景木刻",
  "Portraits of women": "女性肖像",
  "Sculptures of animals": "动物雕塑",
  "Paintings of the sea": "海景画",
  "Ancient coins": "古代钱币",
  // CN to EN
  静物画: "Still life paintings",
  花卉画: "Paintings of flowers",
  风景木刻: "Woodcuts of landscapes",
  女性肖像: "Portraits of women",
  动物雕塑: "Sculptures of animals",
  海景画: "Paintings of the sea",
  古代钱币: "Ancient coins",
};

interface LanguageContextValue {
  language: "en" | "cn";
  setLanguage: (language: "en" | "cn") => void;
  translateQuery: (currentQuery: string) => string;
  defaultQueryEn: string;
  defaultQueryCn: string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"en" | "cn">("en");

  const translateQuery = useCallback(
    (currentQuery: string): string => {
      // Case 1: If it's a default query, switch to the other language's default
      if (
        currentQuery === DEFAULT_QUERY_EN ||
        currentQuery === DEFAULT_QUERY_CN
      ) {
        return language === "en" ? DEFAULT_QUERY_EN : DEFAULT_QUERY_CN;
      }
      // Case 2: If it's a mapped suggestion, translate it
      if (currentQuery in SUGGESTION_MAP) {
        return SUGGESTION_MAP[currentQuery];
      }
      // Case 3: If it's custom text, keep it unchanged
      return currentQuery;
    },
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      translateQuery,
      defaultQueryEn: DEFAULT_QUERY_EN,
      defaultQueryCn: DEFAULT_QUERY_CN,
    }),
    [language, translateQuery],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hooks for consuming language context
export function useLanguage() {
  const context = use(LanguageContext);
  if (!context) throw new Error("LanguageContext is required");
  return context;
}

export function useLanguageToggle() {
  const context = use(LanguageContext);
  if (!context) throw new Error("LanguageContext is required");

  const { language, setLanguage } = context;

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "cn" : "en");
  }, [language, setLanguage]);

  const displayLanguage = language === "en" ? "CN" : "EN";

  return { toggleLanguage, displayLanguage };
}
