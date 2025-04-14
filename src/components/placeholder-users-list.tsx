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

export function PlaceholderUsersList() {
  const listContext = useListController<{
    id: number;
    name: string;
    username: string;
    email: string;
  }>({
    sort: { field: "reference", order: "ASC" },
  });

  return (
    <ListContextProvider value={listContext}>
      <Table>
        <TableCaption>A list of users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listContext.data?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Link href="/" to={`/users/${user.id.toString()}`}>
                  edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Users: {listContext.total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </ListContextProvider>
  );
}
