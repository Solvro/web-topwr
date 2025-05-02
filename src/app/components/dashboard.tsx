"use client";

import { Link } from "react-admin";

export function Dashboard() {
  return (
    <div>
      *dashboard*
      <Link href="/" to="/student_organizations">
        Zarządzanie organizacjami
      </Link>
    </div>
  );
}
