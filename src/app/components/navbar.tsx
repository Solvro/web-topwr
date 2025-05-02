"use client";

import { Link, useLogout } from "react-admin";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const logout = useLogout();
  const handleClick = async () => {
    await logout();
  };
  return (
    <div className="flex flex-row">
      *navbar*
      <Link href="/" to="/">
        Home
      </Link>
      <Link href="/" to="/student_organizations">
        Organizacje studenckie
      </Link>
      <Button onClick={handleClick}>logout</Button>
    </div>
  );
}
