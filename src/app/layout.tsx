import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { Navbar } from "@/components/presentation/navbar";
import { RootProviders } from "@/components/providers/root-providers";
import { env } from "@/config/env";
import { Toaster } from "@/features/toaster";
import { cn } from "@/lib/utils";
import type { WrapperProps } from "@/types/components";

import "./globals.css";
import manifest from "./manifest.json";

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
  title: "ToPWR | Twój studencki asystent",
  description:
    "Pierwszy dzień na zajęciach i już nieparzysta środa w poniedziałek? Budynek o zagadkowej nazwie C-13 w planie zajęć? A może szukasz informacji o wydziałach i kołach naukowych? Każdy student na PWr zadaje podobne pytania, dlatego wiemy, jak trudno jest ogarnąć życie na uczelni. Stworzyliśmy ToPWR, by uprościć i ułatwić codzienne studenckie wyzwania!",
  metadataBase: new URL(env.NEXT_PUBLIC_WEBSITE_URL),
  openGraph: {
    images: OG_IMAGE_METADATA,
  },
  twitter: {
    images: OG_IMAGE_METADATA,
  },
};

export const viewport: Viewport = {
  themeColor: manifest.theme_color,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: WrapperProps) {
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
            <Navbar />
            <main className="w-full grow">{children}</main>
          </ThemeProvider>
          <Analytics />
        </body>
      </RootProviders>
    </html>
  );
}
