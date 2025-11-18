import {
  Bell,
  BookOpen,
  Building,
  Calendar,
  CalendarCog,
  CircleQuestionMark,
  Megaphone,
  Notebook,
  RefreshCcw,
  University,
} from "lucide-react";

import { DashboardButton } from "@/components/presentation/dashboard-button";
import { getUserDisplayName } from "@/features/authentication";
import { getAuthStateServer } from "@/features/authentication/server";
import { Resource } from "@/features/resources";

export default async function Home() {
  const authState = await getAuthStateServer();
  const user = authState?.user;

  if (user == null) {
    return null;
  }

  return (
    <div className="container mx-auto flex h-full flex-col items-center gap-8 p-4 sm:p-8">
      <h1 className="mt-4 w-full text-2xl">
        Cześć, {getUserDisplayName(user)}!
      </h1>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full grid grid-cols-subgrid gap-4">
          <DashboardButton
            href="/review"
            icon={RefreshCcw}
            label="Review zmian"
            variant="outline"
          />
        </div>
        <div className="col-span-full grid grid-cols-subgrid gap-4">
          <DashboardButton
            resource={Resource.StudentOrganizations}
            icon={Building}
          />
          <DashboardButton resource={Resource.GuideArticles} icon={BookOpen} />
          <DashboardButton resource={Resource.Banners} icon={Megaphone} />
          <DashboardButton resource={Resource.CalendarEvents} icon={Calendar} />
          <DashboardButton resource={Resource.Departments} icon={University} />
          <DashboardButton resource={Resource.Versions} icon={Notebook} />
          <DashboardButton
            resource={Resource.AboutUs}
            icon={CircleQuestionMark}
            label="Sekcja o nas"
          />
          <DashboardButton resource={Resource.Notifications} icon={Bell} />
          <DashboardButton
            resource={Resource.AcademicSemesters}
            icon={CalendarCog}
          />
        </div>
      </div>
    </div>
  );
}
