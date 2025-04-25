"use client";

import { Link } from "react-admin";

export function Dashboard() {
  return (
    <div>
      *dashboard*
      <Link href="/" to="/articles">
        Artykuły
      </Link>
      <Link href="/" to="/organizations">
        Organizacje
      </Link>
    </div>
  );
}
