import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/a-propos", destination: "/about", permanent: true }];
  },
  experimental: {
    serverActions: {
      // image uploads from the /atelier admin go through server actions
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
