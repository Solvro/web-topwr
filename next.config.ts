import type { NextConfig } from "next";

const domain = process.env.IMAGES_DOMAIN;
const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      typeof domain === "string" && domain.length > 0
        ? [
            {
              protocol: "https",
              hostname: domain,
            },
          ]
        : [],
  },
};

export default nextConfig;
