"use client";

import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

export const LANGUAGES = ["en", "cn"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_QUERY_EN = "Paintings of winter landscapes";
export const DEFAULT_QUERY_CN = "冬季风景画";

// Language-specific suggestions
const SUGGESTIONS_EN = [
  "Still life paintings",
  "Paintings of flowers",
  "Woodcuts of landscapes",
  "Portraits of women",
  "Sculptures of animals",
  "Paintings of the sea",
  "Ancient coins",
] as const;

const SUGGESTIONS_CN = [
  "静物画",
  "花卉画",
  "风景木刻",
  "女性肖像",
  "动物雕塑",
  "海景画",
  "古代钱币",
] as const;

// Bidirectional mapping between English and Chinese suggestions
const SUGGESTION_MAP: Record<string, string> = SUGGESTIONS_EN.reduce(
  (acc, en, index) => {
    const cn = SUGGESTIONS_CN[index];
    acc[en] = cn; // EN to CN
    acc[cn] = en; // CN to EN
    return acc;
  },
  {} as Record<string, string>,
);

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  displayLanguage: string;
  translateQuery: (currentQuery: string) => string;
  suggestions: readonly string[];
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

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

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "cn" : "en");
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      displayLanguage: language === "en" ? "CN" : "EN",
      translateQuery,
      suggestions: language === "en" ? SUGGESTIONS_EN : SUGGESTIONS_CN,
    }),
    [language, toggleLanguage, translateQuery],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for consuming language context
export function useLanguage() {
  const context = use(LanguageContext);
  if (!context) throw new Error("LanguageContext is required");
  return context;
}
