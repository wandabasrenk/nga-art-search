"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { type FeedbackFormState, submitFeedback } from "@/app/actions/feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { hasSentFeedback, markFeedbackSent } from "@/lib/feedback-storage";
import { cn } from "@/lib/utils";
import {
  type FeedbackFormValues,
  feedbackSchema,
  RATINGS,
} from "@/lib/validations/feedback";

interface FeedbackDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FeedbackDialog({
  open: controlledOpen,
  onOpenChange,
}: FeedbackDialogProps = {}) {
  const [open, setOpen] = useControllableState({
    prop: controlledOpen,
    onChange: onOpenChange,
    defaultProp: false,
  });
  const [alreadySent, setAlreadySent] = useState(false);
  const [state, setState] = useState<FeedbackFormState>({ success: false });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setAlreadySent(hasSentFeedback());
    }
  }, [open]);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: null, message: "" },
  });

  const messageValue = form.watch("message") || "";

  const handleSubmit = (data: FeedbackFormValues) => {
    const formData = new FormData();
    if (data.rating) formData.append("rating", data.rating);
    if (data.message) formData.append("message", data.message);

    startTransition(async () => {
      const result = await submitFeedback(state, formData);
      setState(result);
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: setOpen and form are stable references
  useEffect(() => {
    const submissionId = state.timestamp;
    if (!submissionId) return;

    if (state.success) {
      markFeedbackSent();
      setAlreadySent(true);
      toast.success("Thank you for your feedback!", {
        description: "This helps us improving the search experience.",
      });
      setOpen(false);
      form.reset();
      return;
    }

    if (state.message) {
      toast.error("Failed to send feedback", {
        description: "Please try again later.",
      });
    }
  }, [state.timestamp, state.success, state.message]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="transition-colors"
          aria-label="Feedback"
        >
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {alreadySent ? (
          <>
            <DialogTitle>Thank You!</DialogTitle>
            <div className="mt-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                We've already received your feedback. Thank you for helping us
                improve the search experience for everyone.
              </p>
            </div>
            <div className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DialogClose>
            </div>
          </>
        ) : (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <FieldSet className="gap-5 mt-6">
              <Controller
                name="rating"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>How was your experience?</FieldLabel>
                    <FieldDescription>
                      Select a rating to help us improve.
                    </FieldDescription>
                    <div className="flex gap-2 mt-2">
                      {RATINGS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => field.onChange(item.value)}
                          className={cn(
                            "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50",
                            field.value === item.value
                              ? "border-primary bg-primary/5"
                              : "border-border bg-background",
                          )}
                        >
                          <span className="text-3xl">{item.emoji}</span>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="feedback-message">
                      Tell us more (optional)
                    </FieldLabel>
                    <textarea
                      {...field}
                      id="feedback-message"
                      placeholder="What could we improve?"
                      className={cn(
                        "min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "dark:bg-input/30",
                      )}
                      maxLength={500}
                    />
                    <FieldDescription className="text-xs">
                      {messageValue.length}/500 characters
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldGroup className="!gap-2">
                <div className="flex gap-2 w-full">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => form.reset()}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? "Sending..." : "Submit Feedback"}
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
