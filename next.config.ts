import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/",
      destination: "/map",
    },
  ],
  transpilePackages: ["lucide-react"],
};

export default nextConfig;
