import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Rinder',
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
