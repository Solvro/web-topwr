import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk } from "next/font/google";

import { RootProviders } from "@/components/providers/root-providers";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import type { LayoutProps } from "@/types/components";

import "./globals.css";

const space_grotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const OG_IMAGE_METADATA = {
  // TODO: new OG image
  url: "/og-image.png",
  width: 1920,
  height: 960,
};

export const metadata: Metadata = {
  title: "Panel Administratora | ToPWR by Solvro",
  description:
    "Panel Administracyjny ToPWR autorstwa KN Solvro to zaawansowany system CMS do zarządzania aplikacją mobilną ToPWR. Zarządzaj organizacjami studenckimi, artykułami i wiele więcej w jednym intuicyjnym panelu.",
  metadataBase: new URL(env.NEXT_PUBLIC_WEBSITE_URL),
  openGraph: {
    images: OG_IMAGE_METADATA,
  },
  twitter: {
    images: OG_IMAGE_METADATA,
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="pl" className="overflow-hidden" suppressHydrationWarning>
      <RootProviders>
        <body
          className={cn(
            "bg-background text-foreground flex h-dvh flex-col overflow-auto font-sans antialiased",
            space_grotesk.variable,
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-center" />
            {children}
          </ThemeProvider>
        </body>
      </RootProviders>
    </html>
  );
}
