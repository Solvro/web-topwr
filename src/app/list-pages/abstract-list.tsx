"use client";

import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useCreatePath, useDelete } from "react-admin";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagiation } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* eslint-disable jsx-a11y/anchor-is-valid */
export function AbstractList<T extends { id: number; name: string }>({
  resource,
  data,
  columns,
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  setPage,
}: {
  resource: string;
  data?: T[];
  columns: {
    header: string;
    render: (item: T) => React.ReactNode;
  }[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (pageNumber: number) => void;
}) {
  const createPath = useCreatePath();

  return (
    <div className="container mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={crypto.randomUUID()}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell key={crypto.randomUUID()}>
                  {col.render(item)}
                </TableCell>
              ))}
              <TableCell>
                <Link
                  to={createPath({
                    resource,
                    type: "edit",
                    id: item.id,
                  })}
                >
                  <Button variant="outline">
                    <SquarePen />
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <DeleteButtonWithDialog
                  id={item.id}
                  name={item.name}
                  resource={resource}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link
        to={createPath({
          resource,
          type: "create",
        })}
      >
        <Button>
          <Plus />
        </Button>
      </Link>
      <Pagiation
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        setPage={setPage}
      />
    </div>
  );
}

function DeleteButtonWithDialog({
  id,
  name,
  resource,
}: {
  id: number;
  name: string;
  resource: string;
}) {
  const [deleteOne, { isLoading }] = useDelete();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Czy na pewno chcesz usunąć &quot;{name}&quot;
          </DialogTitle>
          <DialogDescription>Tego kroku nie można cofnąć</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                deleteOne(
                  resource,
                  { id },
                  { mutationMode: "pessimistic" },
                ).catch((error: unknown) => {
                  console.error("Failed to delete:", error);
                });
              }}
              disabled={isLoading}
            >
              Usuń
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading}>
              Anuluj
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
