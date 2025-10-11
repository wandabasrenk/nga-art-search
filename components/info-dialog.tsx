"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InfoDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InfoDialog({
  open: controlledOpen,
  onOpenChange,
}: InfoDialogProps = {}) {
  const [open, setOpen] = useControllableState({
    prop: controlledOpen,
    onChange: onOpenChange,
    defaultProp: false,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs lg:text-sm text-foreground/70 transition-colors hover:text-foreground hover:bg-transparent px-0"
        >
          Info
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>About This Demo</DialogTitle>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            This demo showcases over 50,000 artworks from the National Gallery
            of Art's open-access collection, searchable using natural language.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Powered by Mixedbread Search API and our multimodal Omni model for
            accurate semantic retrieval.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
