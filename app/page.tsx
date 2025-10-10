"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import useSWR from "swr";
import { motion } from "motion/react";

import { ImageGallery } from "@/components/image-gallery";
import { SearchHeader } from "@/components/search-header";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { fetcher } from "@/lib/fetcher";
import type { SearchResponse } from "@/lib/types";

export default function Home() {
  const [query, setQuery] = useState("paintings of winter landscapes");
  const [searchQuery, setSearchQuery] = useState(
    "paintings of winter landscapes"
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
        setIsActive={setIsActive}
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

      {isActive && searchQuery && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.7, ease: "easeInOut" }}
          className="fixed top-6 right-6 z-40 sm:right-6 lg:hidden"
        >
          <Button
            type="button"
            variant="default"
            size="icon"
            onClick={handleBackToScatter}
            className="!h-10 !w-10"
          >
            <Icons.scatter size={24} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
