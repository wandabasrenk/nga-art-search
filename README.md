# Mixedbread Art Search (NGA Gallery)

Discover over 50,000 artworks from the National Gallery of Art using natural language. This demo uses [Mixedbread Search](https://www.mixedbread.com/blog/mixedbread-search) and our multimodal model Omni to retrieve image results that match your query.

## Prerequisites

Before you begin, you’ll need:

- Node.js 18+
- Mixedbread account — sign up at https://platform.mixedbread.com
- Mixedbread API Key — create at https://platform.mixedbread.com/platform?next=api-keys
- A Mixedbread Store (name or ID) holding your images
- Optional: Resend credentials if you want the feedback form to send emails

## Data Source

Images are from the National Gallery of Art’s Free Images and Open Access Program:  
https://www.nga.gov/artworks/free-images-and-open-access

Huge thanks to the NGA for enabling research and demos like this with their public dataset.

## Quick Start

1) Install dependencies

```bash
bun install
```

2) Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your Mixedbread key:

```env
MXBAI_API_KEY=your_api_key_here
```

Optional (feedback emails):

```env
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
RESEND_TO_EMAIL=...
```

3) Point the API route at your store

Update the `store_identifiers` value in `app/api/search/route.ts` to your store’s name or ID:

```ts
// app/api/search/route.ts
const res = await mxbai.stores.search({
  query,
  store_identifiers: ["YOUR_STORE_NAME"],
  top_k: 16,
  search_options: { score_threshold: 0.55 },
});
```

4) Start the dev server

```bash
bun run dev
```

## Upload PNGs to a Store (TypeScript)

This minimal example creates a store and uploads all `.png` files from a directory, waiting for processing to complete.

```ts
//scripts/upload-pngs.ts
import { Mixedbread } from "@mixedbread/sdk";
import { readdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";

async function main() {
  const apiKey = process.env.MXBAI_API_KEY;
  if (!apiKey) throw new Error("Missing MXBAI_API_KEY");

  const mxbai = new Mixedbread({ apiKey }); // Pass the API key

  const storeName = "nga-public-images";

  const imagesDir = path.resolve("./data/images");
  const files = (await readdir(imagesDir)).filter((f) => /\.png$/i.test(f));

  for (const filename of files) {
    const filePath = path.join(imagesDir, filename);
    const uploaded = await mxbai.stores.files.uploadAndPoll({
      storeIdentifier: storeName, // Use storeName instead of store.name
      file: createReadStream(filePath),
      body: { filename, metadata: { source: "NGA", path: filePath } },
    });
    console.log(`Processed: ${uploaded.filename} -> ${uploaded.status}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Run with Bun:

```bash
# after saving scripts/upload-pngs.ts
bun scripts/upload-pngs.ts
```

## How This App Works

- API route `app/api/search/route.ts` performs a Mixedbread stores search using your `MXBAI_API_KEY` and `store_identifiers`.
- The UI calls `/api/search?q=...` and renders image results returned by the SDK.

## Features

- Natural language search over artworks
- Multimodal retrieval via Omni (text, image, audio, video)
- Built on a public, open-access image dataset

## Powered By

- Mixedbread Search — https://www.mixedbread.com/docs/stores/overview
- Omni multimodal model — https://www.mixedbread.com/docs/stores/ingest/file-types

## Demos

If you like art, but love cats even more:  
https://cats.mixedbread.com/

## Troubleshooting

- Credentials: Ensure `MXBAI_API_KEY` is set in `.env` and your shell.
- Store name: Update `app/api/search/route.ts` with your actual store name or ID.
- Content indexed: Upload PNGs to your store and wait for processing (`uploadAndPoll`).
- Search thresholds: Adjust `score_threshold` or `top_k` for your dataset.

## Attribution

- Artworks courtesy of the National Gallery of Art (NGA)
- Demo built by Mixedbread
