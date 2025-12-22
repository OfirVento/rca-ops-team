import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/rca-ops-team',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
