import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["air.local"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
