import type { SearchResponse } from "./types";

export const fetcher = async (url: string): Promise<SearchResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to fetch results");
  }
  return response.json();
};
