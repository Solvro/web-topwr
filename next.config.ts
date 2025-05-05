import type { NextConfig } from "next";

const API_DOMAIN = new URL(process.env.NEXT_PUBLIC_API_URL ?? "").hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      typeof API_DOMAIN === "string" && API_DOMAIN.length > 0
        ? [
            {
              protocol: "https",
              hostname: API_DOMAIN,
            },
          ]
        : [],
  },
};

export default nextConfig;
