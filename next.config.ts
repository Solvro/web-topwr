import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.topwr.solvro.pl",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "test.api.topwr.solvro.pl",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
