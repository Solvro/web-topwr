import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.topwr.solvro.pl",
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
  typedRoutes: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  reactCompiler: true,
};

export default nextConfig;
