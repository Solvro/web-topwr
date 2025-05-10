"use client";

import { useLogout } from "react-admin";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

/* eslint-disable jsx-a11y/anchor-is-valid */
export function Navbar() {
  const logout = useLogout();
  const handleClick = async () => {
    await logout();
  };
  return (
    <div className="flex flex-row">
      <Link to="/">Home</Link>
      <Link to="/student_organizations">Organizacje studenckie</Link>
      <Button onClick={handleClick}>logout</Button>
    </div>
  );
}
