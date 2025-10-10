import { Mixedbread } from "@mixedbread/sdk";
import { type NextRequest, NextResponse } from "next/server";

const mxbai = new Mixedbread({
  apiKey: process.env.MXBAI_API_KEY || "",
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return Response.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 },
      );
    }

    const res = await mxbai.stores.search({
      query,
      store_identifiers: ["nga-public-images"], // Update with your store identifier
      top_k: 16,
      search_options: {
        score_threshold: 0.55,
      },
    });

    return NextResponse.json({
      results: res.data,
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
