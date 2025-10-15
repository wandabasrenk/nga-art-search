"use client";

import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MULTILINGUAL_SUGGESTIONS } from "@/lib/constants";
import { useView } from "@/contexts/view-context";

const ANIMATION_DELAYS = {
  TITLE: 0,
  INPUT: 0.2,
  SUGGESTIONS: 0.4,
  BOTTOM_INPUT: 0.7,
} as const;

interface SearchHeaderProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  onSuggestionClick: (suggestion: string) => void;
}

function SearchInput({
  query,
  isLoading,
  onQueryChange,
}: {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search for art..."
          className="!bg-background/70 tracking-tighter backdrop-blur-sm pl-4"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        variant="outline"
        disabled={isLoading}
        aria-label="Search"
        title="Search"
        className="flex-shrink-0 bg-background/70 backdrop-blur-sm"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function SearchHeader({
  query,
  isLoading,
  onQueryChange,
  onSearch,
  onSuggestionClick,
}: SearchHeaderProps) {
  const { isActive } = useView();

  return (
    <>
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4 sm:max-w-md sm:px-5 lg:max-w-2xl lg:px-6"
        style={{ pointerEvents: isActive ? "none" : "auto" }}
      >
        {/* Title - fades out first (no delay) */}
        <motion.h1
          className="font-light tracking-tighter text-4xl md:text-5xl mb-4 text-center"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: ANIMATION_DELAYS.TITLE,
            ease: "easeInOut",
          }}
        >
          Discover art with <br /> natural language
        </motion.h1>

        {/* Input - fades out second */}
        <motion.form
          onSubmit={onSearch}
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? ANIMATION_DELAYS.INPUT : 0,
            ease: "easeInOut",
          }}
        >
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
          />
        </motion.form>

        {/* Suggestions - fade out last */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-4 max-w-full"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? ANIMATION_DELAYS.SUGGESTIONS : 0,
            ease: "easeInOut",
          }}
        >
          {MULTILINGUAL_SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="font-light bg-background/70 px-1 text-xs sm:text-sm backdrop-blur-sm whitespace-nowrap min-w-34"
            >
              {suggestion}
            </Button>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:max-w-md sm:px-5 lg:max-w-2xl lg:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{
          duration: 0.3,
          delay: isActive ? ANIMATION_DELAYS.BOTTOM_INPUT : 0,
          ease: "easeInOut",
        }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        <form onSubmit={onSearch}>
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
          />
        </form>
      </motion.div>
    </>
  );
}
