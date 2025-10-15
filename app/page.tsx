"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import useSWR from "swr";

import { ImageGallery } from "@/components/image-gallery";
import { SearchHeader } from "@/components/search-header";
import { useView } from "@/contexts/view-context";
import { DEFAULT_QUERY } from "@/lib/constants";
import { fetcher } from "@/lib/fetcher";
import type { SearchResponse } from "@/lib/types";

export default function Home() {
  const { setIsActive } = useView();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);

  const { data, isLoading } = useSWR<SearchResponse>(
    searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : null,
    fetcher,
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

      {searchQuery && <ImageGallery images={results} isLoading={isLoading} />}
    </div>
  );
}
