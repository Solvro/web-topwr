"use client";

import { Link } from "react-admin";

export function Navbar() {
  return (
    <div className="flex flex-row">
      *navbar*
      <Link href="/" to="/">
        Home
      </Link>
      <Link href="/" to="/articles">
        Artykuły
      </Link>
      <Link href="/" to="/organizations">
        Organizacje
      </Link>
    </div>
  );
}
