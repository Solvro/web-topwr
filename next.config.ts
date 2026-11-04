import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  "./src/features/landing-page/features/i18n/request.ts",
);

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

export default withNextIntl(nextConfig);
