import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./node_modules/pg-cloudflare/dist/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a.nooncdn.com" },
      { protocol: "https", hostname: "*.nooncdn.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "*.cdn-apple.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "*.media-amazon.com" },
      { protocol: "https", hostname: "cdn.thewirecutter.com" },
      { protocol: "https", hostname: "*.pcmag.com" },
    ],
  },
};

export default nextConfig;
