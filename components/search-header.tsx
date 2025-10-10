"use client";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SearchHeaderProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onSuggestionClick: (suggestion: string) => void;
}

interface SearchInputProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onFocus?: () => void;
  disabled?: boolean;
}

function SearchInput({
  query,
  isLoading,
  onQueryChange,
  onFocus,
  disabled = false,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Search for art..."
        className="shadow-lg !text-xl py-5 !bg-background tracking-tighter"
        disabled={disabled || isLoading}
      />
      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin text-muted-foreground" size={18} />
        </div>
      )}
    </div>
  );
}

export function SearchHeader({
  query,
  isLoading,
  onQueryChange,
  onSearch,
  isActive,
  setIsActive,
  onSuggestionClick,
}: SearchHeaderProps) {
  const suggestions = [
    "Still life paintings",
    "Paintings of flowers",
    "Woodcuts of landscapes",
    "Portraits of women",
    "Sculptures of animals",
    "Paintings of the sea",
    "Ancient coins",
  ];

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
            onFocus={() => setIsActive(true)}
          />
        </motion.form>

        {/* Suggestions - fade out last (0.4s delay) */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-4"
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
              className="font-light !bg-background text-xs sm:text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </motion.div>

        <motion.div
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.4 : 0,
            ease: "easeInOut",
          }}
          className="mt-4 text-center text-xs text-muted-foreground"
        >
          <p>
            Powered by{" "}
            <Link
              href="https://mixedbread.com"
              className="font-semibold text-orange-600"
              target="_blank"
            >
              Mixedbread
            </Link>
          </p>
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
          />
        </form>
      </motion.div>
    </>
  );
}
