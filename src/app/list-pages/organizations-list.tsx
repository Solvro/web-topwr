"use client";

import { ListContextProvider, useListController } from "ra-core";
import { Link } from "react-admin";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrganizationsList() {
  const listContext = useListController<{
    id: number;
    name: string;
    contents: string;
  }>({
    sort: { field: "reference", order: "ASC" },
  });

  return (
    <ListContextProvider value={listContext}>
      <Table>
        <TableCaption>A list of organizations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contents</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listContext.data?.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>{organization.contents}</TableCell>
              <TableCell>
                <Link
                  href="/"
                  to={`/organizations/${organization.id.toString()}`}
                >
                  edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              Total organizations: {listContext.total}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ListContextProvider>
  );
}
