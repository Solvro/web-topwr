"use client";

import type { VariantProps } from "class-variance-authority";
import {
  BookOpen,
  Building,
  Calendar,
  Megaphone,
  Notebook,
  ScrollText,
  University,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import type { Button } from "@/components/ui/button";
import { DeclensionCase, Resource } from "@/config/enums";
import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName, toTitleCase } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { RoutableResource } from "@/types/app";

export default function Home() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto flex h-full flex-col items-center space-y-8 p-4 sm:p-8 2xl:max-w-[1280px]">
      <h1 className="w-full text-4xl font-medium">
        Cześć,{" "}
        <span className="text-primary font-bold">
          {getUserDisplayName(auth.user)}
        </span>
        !
      </h1>
      <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-full grid grid-cols-subgrid gap-4">
          <DashboardButton
            resource={Resource.StudentOrganizations}
            icon={Building}
            image="https://pwr.edu.pl/fcp/4GBUKOQtTKlQhbx08SlkTUhZeUTgtCgg9ACFDC0RFTm9PFRYqCl5tDXdAGHoV/1/public/news_team/rozne/fast_plaskie.jpg"
          />
          <DashboardButton
            resource={Resource.GuideArticles}
            icon={BookOpen}
            image="https://zibisklep.pl/images/design/content-artykuly-szkolne.webp"
          />
          <DashboardButton
            resource={Resource.Banners}
            icon={Megaphone}
            image="https://wit.pwr.edu.pl/fcp/2GBUKOQtTKlQhbx08SlkTUg1CUWRuHQwFDBoIVURNWHxbDlhnRlUuWTISTnoYDxMe/190/public/news/arina_golubeva/das_marzec_2024_pion.jpg"
          />
          <DashboardButton
            resource={Resource.CalendarEvents}
            icon={Calendar}
            image="https://st.depositphotos.com/34055376/59075/v/450/depositphotos_590755890-stock-illustration-calendar-marked-date-important-day.jpg"
          />
          <DashboardButton
            resource={Resource.Departments}
            icon={University}
            image="https://pwr.edu.pl/thumb/VUmgKJzsLe2g8XRU_DVMBUwVAXSI8CAo,1/pl/news/24/13022/13/0DVRXPBwBfwctBkRo,image00012.jpeg"
          />
          <DashboardButton
            resource={Resource.Contributors}
            icon={UsersRound}
            image="https://media.licdn.com/dms/image/v2/C5612AQGuAvT4YZf3zA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1614612727877?e=2147483647&v=beta&t=qvvxWZcfMj9ub7uUCVciwXwFJJ8jMZieLJf2G8KYKkg"
          />
          <DashboardButton
            resource={Resource.Versions}
            icon={Notebook}
            image="https://www.thatcompany.com/wp-content/uploads/2020/03/art5.jpg"
          />
          <DashboardButton
            resource={Resource.Milestones}
            icon={ScrollText}
            image="https://www.teamly.com/blog/wp-content/uploads/2021/12/Project-milestones-examples.png"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardButton({
  icon: Icon,
  className = "",
  href: hrefOverride,
  label: labelOverride,
  image,
  resource,
}: VariantProps<typeof Button> & {
  icon: LucideIcon;
  className?: string;
  image: string;
} & (
    | { href?: never; label?: never; resource: RoutableResource }
    | { href: Route; label: string; resource?: never }
  )) {
  const [href, label] =
    resource == null
      ? [hrefOverride, labelOverride]
      : ([
          `/${resource}`,
          declineNoun(resource, {
            case: DeclensionCase.Nominative,
            plural: true,
          }),
        ] as const);
  return (
    <Link href={href}>
      <div
        className={`group relative h-72 w-full justify-start space-x-2 overflow-hidden rounded-xl ${className}`}
      >
        <Image
          src={image}
          unoptimized
          className="absolute inset-0 z-0 h-full w-full object-cover transition-all group-hover:blur-[1px]"
          alt="c13"
          width={100}
          height={100}
        />
        <div className="absolute inset-0 z-10 flex items-end justify-center bg-linear-to-b from-transparent via-orange-950/40 to-orange-950 p-4 text-white group-hover:via-orange-950/70">
          <div className="flex w-full items-start gap-3 transition-all">
            <Icon className="ml-2 size-6 transition-all group-hover:size-8" />
            <span className="text-lg leading-7 text-balance transition-all group-hover:text-2xl md:text-xl">
              {toTitleCase(label)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
