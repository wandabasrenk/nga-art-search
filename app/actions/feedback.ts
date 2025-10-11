"use server";

import { headers } from "next/headers";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { Resend } from "resend";
import sanitizeHtml from "sanitize-html";
import { feedbackSchema } from "@/lib/validations/feedback";

export type FeedbackFormState = {
  success: boolean;
  message?: string;
  timestamp?: number;
  errors?: {
    rating?: string[];
    message?: string[];
  };
};

const feedbackLimiter = new RateLimiterMemory({
  points: process.env.FEEDBACK_LIMIT
    ? parseInt(process.env.FEEDBACK_LIMIT, 10)
    : 2,
  duration: 60 * 60 * 24, // 2 submissions per day
  blockDuration: 60 * 60 * 24,
});

export async function submitFeedback(
  // biome-ignore lint: prevState required by useActionState signature
  prevState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const clientIdentifier =
      forwardedFor?.split(",")[0]?.trim() ??
      headerList.get("x-real-ip") ??
      headerList.get("cf-connecting-ip") ??
      headerList.get("x-vercel-ip") ??
      `anonymous:${headerList.get("user-agent") ?? "unknown"}`;

    try {
      await feedbackLimiter.consume(clientIdentifier);
    } catch (rateLimiterRes) {
      console.warn(
        "Feedback rate limit exceeded for",
        clientIdentifier,
        rateLimiterRes,
      );
      return {
        success: false,
        message:
          "You have reached the daily feedback limit. Please try again tomorrow.",
        timestamp: Date.now(),
      };
    }

    const rawData = {
      rating: formData.get("rating") as string | null,
      message: formData.get("message") || undefined,
    };

    const validatedData = feedbackSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten((issue) => issue.message)
          .fieldErrors,
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return {
        success: false,
        message: "Email service is not configured. Please contact support.",
        timestamp: Date.now(),
      };
    }

    const { rating, message } = validatedData.data;
    const sanitizedMessage = message
      ? sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} })
          .trim()
          .replace(/\r?\n/g, "<br>")
      : undefined;
    const resend = new Resend(apiKey);

    const ratingEmojis = {
      good: "Good",
      okay: "Okay",
      bad: "Bad",
    };

    const ratingText = rating
      ? ratingEmojis[rating as keyof typeof ratingEmojis]
      : "No rating";

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL || "support@mixedbread.com",
      subject: `New Feedback - NGA Gallery [${ratingText}]`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Rating:</strong> ${ratingText}</p>
        ${
          sanitizedMessage
            ? `<p><strong>Message:</strong></p><p>${sanitizedMessage}</p>`
            : "<p><em>No message provided</em></p>"
        }
        <hr>
        <p>Sent from NGA Gallery - Mixedbread Art Search - ${new Date().toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )}</p>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        message: "Failed to send feedback. Please try again.",
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: "Feedback sent successfully!",
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error sending feedback:", error);
    return {
      success: false,
      message: "Failed to send feedback. Please try again.",
      timestamp: Date.now(),
    };
  }
}
