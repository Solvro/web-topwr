import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.topwr.solvro.pl",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
