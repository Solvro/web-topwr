"use client";

import { Filter } from "lucide-react";
import { useState } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { SortFilters } from "./sort-filters";

export function SortFiltersPopover(props: ComponentProps<typeof SortFilters>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          Pokaż filtry <Filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mx-4 w-[calc(100vw-2rem)] sm:w-fit sm:min-w-lg">
        <SortFilters
          {...props}
          onChangeFilters={() => {
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
