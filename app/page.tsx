"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import useSWR from "swr";

import { ImageGallery } from "@/components/image-gallery";
import { SearchHeader } from "@/components/search-header";
import { fetcher } from "@/lib/fetcher";
import type { SearchResponse } from "@/lib/types";

export default function Home() {
  const [query, setQuery] = useState("Paintings of winter landscapes");
  const [searchQuery, setSearchQuery] = useState(
    "Paintings of winter landscapes"
  );
  const [isActive, setIsActive] = useState(false);
  const [scatterSeed, setScatterSeed] = useState(0);
  const { data, isLoading } = useSWR<SearchResponse>(
    searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : null,
    fetcher
  );

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
    <div className="pb-32 px-4 sm:px-6 lg:px-8">
      <SearchHeader
        query={query}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isActive={isActive}
        onSuggestionClick={handleSuggestionClick}
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
