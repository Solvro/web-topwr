"use client";

import type { CoreLayoutProps } from "ra-core";

import { Navbar } from "./navbar";

export function Layout(props: CoreLayoutProps) {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
}
