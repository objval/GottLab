import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["s3.us-central-1.wasabisys.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
};

export default nextConfig;
