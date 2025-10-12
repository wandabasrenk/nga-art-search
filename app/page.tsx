"use client";

import type { FormEvent } from "react";
import { use, useEffect, useState } from "react";
import useSWR from "swr";

import { ImageGallery } from "@/components/image-gallery";
import { SearchHeader } from "@/components/search-header";
import { LanguageContext } from "@/contexts/language-context";
import { ViewContext } from "@/contexts/view-context";
import { fetcher } from "@/lib/fetcher";
import type { SearchResponse } from "@/lib/types";

export default function Home() {
  const languageContext = use(LanguageContext);
  if (!languageContext) throw new Error("LanguageContext is required");

  const viewContext = use(ViewContext);
  if (!viewContext) throw new Error("ViewContext is required");

  const { language, translateQuery, defaultQueryEn } = languageContext;
  const { setIsActive } = viewContext;

  const [query, setQuery] = useState(defaultQueryEn);
  const [searchQuery, setSearchQuery] = useState(defaultQueryEn);

  const { data, isLoading } = useSWR<SearchResponse>(
    searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : null,
    fetcher,
  );

  useEffect(() => {
    setQuery((currentQuery) => {
      const translatedQuery = translateQuery(currentQuery);
      return translatedQuery !== currentQuery ? translatedQuery : currentQuery;
    });
  }, [language, translateQuery]);

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

  const results = data?.results || [];

  return (
    <div className="pb-32">
      <SearchHeader
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
      />

      {searchQuery && (
        <ImageGallery images={results} isLoading={isLoading} />
      )}
    </div>
  );
}
