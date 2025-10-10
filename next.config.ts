import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/mixedbread-omni-files-ash-prod/**",
      },
      {
        protocol: "https",
        hostname: "api.nga.gov",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
