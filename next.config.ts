import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Base path for deployment at /growthmvp
  basePath: '/growthmvp',

  // Also set assetPrefix for static files
  assetPrefix: '/growthmvp',

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_BASE_PATH: '/growthmvp',
  },
};

export default nextConfig;
