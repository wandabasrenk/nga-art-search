"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

import { FeedbackDialog } from "@/components/feedback-dialog";
import { InfoDialog } from "@/components/info-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageContext } from "@/contexts/language-context";

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

const SHEET_NAV_ITEM_CLASS =
  "block w-full px-0 py-2 text-left text-sm font-medium transition-colors";

const DESKTOP_NAV_ITEM_CLASS =
  "text-sm font-medium transition-colors hover:text-foreground/80";

export function Header() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const context = use(LanguageContext);
  if (!context) throw new Error("LanguageContext is required");

  const { language, setLanguage } = context;

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "cn" : "en");
  };

  // Show opposite language
  const displayLanguage = language === "en" ? "CN" : "EN";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        <a href="/" className="flex-shrink-0">
          <Image
            src="/logo_mb.svg"
            alt="Mixedbread"
            className="size-6 sm:size-7 lg:size-8"
            width={32}
            height={32}
          />
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 absolute left-1/2 -translate-x-1/2">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={DESKTOP_NAV_ITEM_CLASS}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
          <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="font-light text-xs h-8 min-w-12 px-2"
          >
            {displayLanguage}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setSheetOpen(true)}
          >
            <MenuIcon className="size-5" />
          </Button>
        </div>

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
                  className={SHEET_NAV_ITEM_CLASS}
                  onClick={() => setSheetOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className={SHEET_NAV_ITEM_CLASS}
                onClick={() => {
                  setSheetOpen(false);
                  setTimeout(() => setInfoOpen(true), 150);
                }}
              >
                Info
              </button>
              <button
                type="button"
                className={SHEET_NAV_ITEM_CLASS}
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
