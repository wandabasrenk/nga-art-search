const FEEDBACK_STORAGE_KEY = "nga-feedback-submitted";

export function hasSentFeedback(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(FEEDBACK_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function markFeedbackSent(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, "true");
  } catch {
    // Silently fail if localStorage is not available
  }
}
