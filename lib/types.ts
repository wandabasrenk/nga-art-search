export type SearchResult = {
  chunk_index: number;
  mime_type: string;
  model: string;
  score: number;
  file_id: string;
  filename: string;
  store_id: string;
  metadata: {
    nid?: string;
    date?: string;
    page?: string;
    type?: string;
    score?: string;
    title?: string;
    artist?: string;
    medium?: string;
    location?: string;
    image_url?: string;
    artwork_url?: string;
    download_url?: string;
    source_page_url?: string;
    accession_number?: string;
    [key: string]: unknown;
  };
  type: string;
  image_url: {
    url: string;
    format: string;
  };
};

export type SearchResponse = {
  results: SearchResult[];
  query: string;
};

export interface Position {
  x: number;
  y: number;
  size: number;
}
