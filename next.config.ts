import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // image uploads from the /atelier admin go through server actions
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
