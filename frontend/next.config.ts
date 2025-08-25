import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for better deployment compatibility
  output: 'standalone',

  // Handle environment variables
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
  },

  // Disable strict mode for deployment
  reactStrictMode: false,

  // Handle image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;