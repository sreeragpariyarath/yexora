import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `npm run build` writes it to out/ for Cloudflare (no server needed)
  output: "export",
  // next/image's default optimiser needs a server; the logos are small, so serve them as-is
  images: { unoptimized: true },
};

export default nextConfig;
