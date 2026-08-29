import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
