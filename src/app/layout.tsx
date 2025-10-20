import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { LayoutProps } from "@/types/components";

import "./globals.css";

const space_grotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel | ToPWR by Solvro",
  description:
    "The ToPWR Admin Panel by KN Solvro is a powerful CMS for managing the ToPWR mobile app. Control content, users, and app settings with ease in one intuitive dashboard.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="overflow-hidden">
      <Providers>
        <body
          className={cn(
            "flex h-screen flex-col overflow-auto font-sans antialiased",
            space_grotesk.variable,
          )}
        >
          <NextTopLoader color="var(--color-primary)" />
          <Toaster position="top-right" />
          {children}
        </body>
      </Providers>
    </html>
  );
}
