import { Heart } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import CampusPhoto from "@/assets/images/pwr-campus.png";
import PwrLogoWhite from "@/assets/logos/pwr-white.svg";
import SolvroLogoWhite from "@/assets/logos/solvro-white.svg";
import { Logo } from "@/components/presentation/logo";
import { Button } from "@/components/ui/button";
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";

import {
  MOBILE_APP_STORE_LINKS,
  PWR_WEBPAGE_URL,
  SOCIAL_LINKS,
} from "../constants";
import type { MobileAppStoreLink } from "../types";

const isExternalHref = (href: Route) => href.startsWith("http");

function FooterLink({
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

function MobileAppStoreButton({
  mobileAppStore,
}: {
  mobileAppStore: MobileAppStoreLink;
}) {
  return (
    <Button
      className="bg-foreground text-background hover:bg-foreground/90 h-auto gap-3 rounded-lg"
      asChild
    >
      <FooterLink href={mobileAppStore.href}>
        <Image
          src={mobileAppStore.logo}
          alt=""
          className="size-5 shrink-0 dark:invert"
        />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-background/70 text-xs">Pobierz z</span>
          <span className="font-semibold">{mobileAppStore.name}</span>
        </span>
      </FooterLink>
    </Button>
  );
}

function DownloadBannerCta() {
  return (
    <section className="border-border bg-background relative overflow-hidden rounded-3xl border p-8 shadow-xl md:p-12">
      <Image
        src={CampusPhoto}
        alt=""
        fill
        sizes="(min-width: 72rem) 72rem, 100vw"
        placeholder="blur"
        className="object-cover"
      />
      <div className="from-background via-background/90 to-background/25 absolute inset-0 bg-linear-to-br" />

      <div className="relative">
        <h2 className="text-foreground mb-4 max-w-md text-4xl leading-tight font-medium sm:text-5xl">
          Cały kampus PWr w Twojej kieszeni.
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-lg">
          Pobierz ToPWR za darmo - bez reklam, bez opłat, bez logowania.
        </p>
        <div className="flex flex-wrap gap-2">
          {MOBILE_APP_STORE_LINKS.map((mobileAppStore) => (
            <MobileAppStoreButton
              key={mobileAppStore.name}
              mobileAppStore={mobileAppStore}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterBrand() {
  return (
    <div>
      <Logo variant="white" className="mb-3 h-7" />
      <p className="max-w-56 text-sm">
        Aplikacja, która porządkuje studencki dzień na Politechnice
        Wrocławskiej. Life made easy.
      </p>
    </div>
  );
}

function FooterSocialLinks() {
  return (
    <nav aria-label="Media społecznościowe">
      <ul className="flex items-center gap-4">
        {SOCIAL_LINKS.map(({ label, href, logo }) => (
          <li key={label}>
            <FooterLink
              href={href}
              aria-label={label}
              className="block opacity-70 transition-opacity hover:opacity-100"
            >
              <Image src={logo} alt="" className="size-5" />
            </FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterAffiliation({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3">
      <span className="text-xs">{label}</span>
      {children}
    </div>
  );
}

function FooterCreators() {
  return (
    <FooterLink
      href={SOLVRO_WEBPAGE_URL}
      className="text-foreground flex h-fit w-fit items-center gap-2 text-xl transition-opacity hover:opacity-80"
    >
      <Image
        src={SolvroLogoWhite as StaticImageData}
        alt=""
        className="h-8 w-auto"
      />
      KN Solvro
    </FooterLink>
  );
}

function FooterPartners() {
  return (
    <FooterLink
      href={PWR_WEBPAGE_URL}
      className="block h-fit w-fit transition-opacity hover:opacity-80"
    >
      <Image
        src={PwrLogoWhite as StaticImageData}
        alt="Politechnika Wrocławska"
        className="h-10 w-auto"
      />
    </FooterLink>
  );
}

export function LandingFooter() {
  return (
    <footer className="dark w-full pt-20">
      <div className="relative z-10 container mx-auto -mb-28 max-w-6xl px-4 md:px-6">
        <DownloadBannerCta />
      </div>

      <div className="bg-background text-muted-foreground pt-44 pb-8">
        <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-end md:justify-between md:px-6">
          <FooterBrand />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FooterAffiliation label="Tworzone przez">
              <FooterCreators />
            </FooterAffiliation>
            <FooterAffiliation label="Partner">
              <FooterPartners />
            </FooterAffiliation>
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-6 md:pt-8">
          <div className="container mx-auto flex max-w-6xl flex-col-reverse gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p className="flex items-center gap-1 text-xs">
              Made with
              <Heart
                aria-label="love"
                className="fill-primary text-primary size-3"
              />
              by Solvro © {new Date().getFullYear()}
            </p>
            <FooterSocialLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
