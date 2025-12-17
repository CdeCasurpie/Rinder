import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Para desarrollo con mock data
    remotePatterns: [],
  },
};

export default nextConfig;
