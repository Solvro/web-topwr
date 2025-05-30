import { ChevronsLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AbstractResourceLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col space-y-4 py-2">
      <h2 className="bg-primary w-[20rem] max-w-full rounded-r-xl p-5 text-center text-lg font-medium whitespace-nowrap text-white sm:w-[25rem] md:w-[30rem] xl:w-[40rem]">
        {title}
      </h2>
      <div className="container mx-auto flex h-full flex-grow flex-col space-y-2 px-2 xl:px-32">
        <div className="flex-grow">{children}</div>
        <Button
          variant={"ghost"}
          className="text-primary hover:text-primary w-min"
          asChild
        >
          <Link href="/" className="">
            <ChevronsLeft />
            Wroć na stronę główną
          </Link>
        </Button>
      </div>
    </div>
  );
}
