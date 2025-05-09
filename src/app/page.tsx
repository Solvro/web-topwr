"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(
  async () =>
    import("@/components/admin-app").then((module) => module.AdminApp),
  { ssr: false },
);

export default function Home() {
  return <AdminApp />;
}
