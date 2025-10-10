import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Discover art with Mixedbread Search",
  description:
    "Browse and search the complete public image collection of the National Gallery of Art, powered by Mixedbread Search. Discover artworks, artists, and more with natural language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          <Header />
          <main className="pt-12 sm:pt-14">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
