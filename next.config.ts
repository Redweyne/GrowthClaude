import type { NextConfig } from "next";

const basePath = process.env.NODE_ENV === 'production' ? '/growthmvp' : '';

const nextConfig: NextConfig = {
  // Base path for deployment at /growthmvp
  basePath: basePath || undefined,

  // Also set assetPrefix for static files
  assetPrefix: basePath || undefined,

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
