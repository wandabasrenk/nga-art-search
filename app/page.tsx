"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { ImageGallery } from "@/components/image-gallery";
import { SearchHeader } from "@/components/search-header";
import { fetcher } from "@/lib/fetcher";
import type { SearchResponse } from "@/lib/types";

const DEFAULT_QUERY_EN = "Paintings of winter landscapes";
const DEFAULT_QUERY_CN = "冬季风景画";

// Mapping between English and Chinese suggestions
const SUGGESTION_MAP: Record<string, string> = {
  // EN to CN
  "Paintings of flowers": "花卉画",
  "Woodcuts of landscapes": "风景木刻",
  "Sculptures of animals": "动物雕塑",
  "Ancient coins": "古代钱币",
  // CN to EN
  花卉画: "Paintings of flowers",
  风景木刻: "Woodcuts of landscapes",
  动物雕塑: "Sculptures of animals",
  古代钱币: "Ancient coins",
};

export default function Home() {
  const [query, setQuery] = useState(DEFAULT_QUERY_EN);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY_EN);
  const [isActive, setIsActive] = useState(false);
  const [scatterSeed, setScatterSeed] = useState(0);
  const [language, setLanguage] = useState<"en" | "cn">("en");
  const prevLanguageRef = useRef<"en" | "cn">("en");

  const { data, isLoading } = useSWR<SearchResponse>(
    searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : null,
    fetcher,
  );

  useEffect(() => {
    // Only update query when language actually changes
    if (prevLanguageRef.current !== language) {
      // Case 1: If it's a default query, switch to the other language's default
      if (query === DEFAULT_QUERY_EN || query === DEFAULT_QUERY_CN) {
        const newQuery =
          language === "en" ? DEFAULT_QUERY_EN : DEFAULT_QUERY_CN;
        setQuery(newQuery);
      }
      // Case 2: If it's a mapped suggestion, translate it
      else if (query in SUGGESTION_MAP) {
        setQuery(SUGGESTION_MAP[query]);
      }
      // Case 3: If it's custom text, keep it unchanged

      // Update the ref to current language
      prevLanguageRef.current = language;
    }
  }, [language]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
      setIsActive(true);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
    setIsActive(true);
  };

  const handleBackToScatter = () => {
    setScatterSeed((prev) => prev + 1);
    setIsActive(false);
  };

  const results = data?.results || [];

  return (
    <div className="pb-32">
      <SearchHeader
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isActive={isActive}
        onSuggestionClick={handleSuggestionClick}
        language={language}
        onLanguageChange={setLanguage}
      />

      {searchQuery && (
        <ImageGallery
          images={results}
          isLoading={isLoading}
          isActive={isActive}
          scatterSeed={scatterSeed}
          onBackToScatter={handleBackToScatter}
        />
      )}
    </div>
  );
}
