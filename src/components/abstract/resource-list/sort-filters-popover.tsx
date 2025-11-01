"use client";

import { Filter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Resource } from "@/config/enums";
import type { ResourceDeclinableField } from "@/types/polish";

import { SortFilters } from "./sort-filters";

export function SortFiltersPopover<T extends Resource>({
  sortableFields,
  searchableFields,
}: {
  sortableFields: ResourceDeclinableField<T>[];
  searchableFields: ResourceDeclinableField<T>[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="mb-2 self-start">
          Pokaż filtry <Filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mx-4 w-[calc(100vw-2rem)] sm:w-fit">
        <SortFilters
          sortableFields={sortableFields}
          searchableFields={searchableFields}
          onChangeFilters={() => {
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
