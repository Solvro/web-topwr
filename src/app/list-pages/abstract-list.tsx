"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AbstractList<T extends { id: number }>({
  data,
  columns,
  page,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
}: {
  data?: T[];
  columns: {
    header: string;
    render: (item: T) => React.ReactNode;
  }[];
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
}) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={col.header}>{col.render(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <Button onClick={onPreviousPage} disabled={!hasPreviousPage}>
          <ChevronLeft />
        </Button>
        <Button onClick={onNextPage} disabled={!hasNextPage}>
          <ChevronRight />
        </Button>
        <span className="text-sm">Page {page}</span>
      </div>
    </div>
  );
}
