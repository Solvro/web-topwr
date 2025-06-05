import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/lib/query-client";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body
          className={`${space_grotesk.variable} flex h-screen flex-col font-sans antialiased`}
        >
          <Navbar />
          <div className="h-full w-full">{children}</div>
        </body>
      </QueryProvider>
    </html>
  );
}
