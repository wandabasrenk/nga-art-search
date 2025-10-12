"use client";

import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

interface SearchHeaderProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  isActive: boolean;
  onSuggestionClick: (suggestion: string) => void;
  language: "en" | "cn";
  onLanguageChange: (language: "en" | "cn") => void;
}

function SearchInput({
  query,
  isLoading,
  onQueryChange,
  language,
  onLanguageChange,
}: {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  language: "en" | "cn";
  onLanguageChange: (language: "en" | "cn") => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1 z-10">
        <Toggle
          pressed={language === "en"}
          onPressedChange={() => onLanguageChange("en")}
          variant="outline"
          size="sm"
          className="font-light bg-background/70 text-xs backdrop-blur-sm h-7 min-w-7 px-1.5"
        >
          EN
        </Toggle>
        <Toggle
          pressed={language === "cn"}
          onPressedChange={() => onLanguageChange("cn")}
          variant="outline"
          size="sm"
          className="font-light bg-background/70 text-xs backdrop-blur-sm h-7 min-w-7 px-1.5"
        >
          CN
        </Toggle>
      </div>
      <Input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for art..."
        className="!bg-background/70 tracking-tighter backdrop-blur-sm pl-24 pr-12"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={isLoading}
        aria-label="Search"
        title="Search"
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
  isActive,
  onSuggestionClick,
  language,
  onLanguageChange,
}: SearchHeaderProps) {
  const suggestionsEn = [
    "Still life paintings",
    "Paintings of flowers",
    "Woodcuts of landscapes",
    "Portraits of women",
    "Sculptures of animals",
    "Paintings of the sea",
    "Ancient coins",
  ];

  const suggestionsCn = [
    "火车在行驶",
    "动物雕塑",
    "房屋建筑",
    "花卉画",
    "风景木刻",
    "古代钱币",
  ];

  const suggestions = language === "en" ? suggestionsEn : suggestionsCn;

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
            delay: 0,
            ease: "easeInOut",
          }}
        >
          Discover art with <br /> natural language
        </motion.h1>

        {/* Input - fades out second (0.2s delay) */}
        <motion.form
          onSubmit={onSearch}
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.2 : 0,
            ease: "easeInOut",
          }}
        >
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </motion.form>

        {/* Suggestions - fade out last (0.4s delay) */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-4 max-w-full"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.4 : 0,
            ease: "easeInOut",
          }}
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="font-light bg-background/70 text-xs sm:text-sm backdrop-blur-sm whitespace-nowrap"
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
          delay: isActive ? 0.7 : 0,
          ease: "easeInOut",
        }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        <form onSubmit={onSearch}>
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </form>
      </motion.div>
    </>
  );
}
