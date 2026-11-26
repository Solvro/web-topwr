import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps } from "react";

const isExternalHref = (href: Route) => href.startsWith("http");

export function FooterLink({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "target" | "rel"> & {
  href: Route;
}) {
  return (
    <Link
      href={href}
      {...(isExternalHref(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      {...props}
    >
      {children}
    </Link>
  );
}
