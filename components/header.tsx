"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { FeedbackDialog } from "@/components/feedback-dialog";
import { InfoDialog } from "@/components/info-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAVIGATION_LINKS = [
  {
    href: "https://www.nga.gov/",
    label: "National Gallery of Art",
  },
  {
    href: "https://www.mixedbread.com",
    label: "Mixedbread",
  },
  {
    href: "https://github.com/mixedbread-ai/nga-art-search",
    label: "Github",
  },
] as const;

export function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        <a href="/" className="flex-shrink-0">
          {/* biome-ignore lint: Using img for simplicity */}
          <img
            src="/logo_mb.svg"
            alt="Mixedbread"
            className="h-3.5 sm:h-5 lg:h-6 w-auto"
          />
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 absolute left-1/2 -translate-x-1/2">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs lg:text-sm text-foreground/70 transition-colors hover:text-foreground whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
          <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setSheetOpen(true)}
        >
          <MenuIcon className="size-5" />
        </Button>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader className="pb-6">
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4">
              {NAVIGATION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/80 transition-all hover:text-foreground hover:bg-accent rounded-md py-2.5"
                  onClick={() => setSheetOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className="text-sm text-foreground/80 transition-all hover:text-foreground hover:bg-accent rounded-md py-2.5 text-left"
                onClick={() => {
                  setSheetOpen(false);
                  setTimeout(() => setInfoOpen(true), 150);
                }}
              >
                Info
              </button>
              <button
                type="button"
                className="text-sm text-foreground/80 transition-all hover:text-foreground hover:bg-accent rounded-md py-2.5 text-left"
                onClick={() => {
                  setSheetOpen(false);
                  setTimeout(() => setFeedbackOpen(true), 150);
                }}
              >
                Feedback
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
