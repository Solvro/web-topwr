import { RefreshCcw } from "lucide-react";

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
          <DashboardButton resource={Resource.StudentOrganizations} />
          <DashboardButton resource={Resource.GuideArticles} />
          <DashboardButton resource={Resource.Banners} />
          <DashboardButton resource={Resource.CalendarEvents} />
          <DashboardButton resource={Resource.Departments} />
          <DashboardButton resource={Resource.Map} />
          <DashboardButton resource={Resource.Versions} />
          <DashboardButton resource={Resource.AboutUs} label="Sekcja o nas" />
          <DashboardButton resource={Resource.Notifications} />
          <DashboardButton resource={Resource.AcademicSemesters} />
          <DashboardButton resource={Resource.MobileConfig} />
        </div>
      </div>
    </div>
  );
}
