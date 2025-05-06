"use client";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

/* eslint-disable jsx-a11y/anchor-is-valid */

export function Dashboard() {
  return (
    <div>
      <h2>dashboard</h2>
      <Link to="/student_organizations">
        <Button>Zarządzanie organizacjami</Button>
      </Link>
    </div>
  );
}
