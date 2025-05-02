"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ListContextProvider, useListController } from "ra-core";
import { useEffect, useState } from "react";
import { Link } from "react-admin";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Organization } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

export function StudentOrganizationsList() {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const listContext = useListController<Organization>({
    perPage: 10,
  });

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (listContext.data == null) {
        return;
      }
      const urls: Record<string, string> = {};

      for (const organization of listContext.data) {
        if (organization.logoKey != null && organization.logoKey !== "") {
          const url = await getImageUrl(organization.logoKey);
          if (url == null) {
            return;
          }
          urls[organization.id] = url;
        }
      }

      setImageUrls(urls);
    };

    void fetchImageUrls();
  }, [listContext.data]);

  function handlePreviousPage() {
    if (listContext.hasPreviousPage != null && listContext.hasPreviousPage) {
      listContext.setPage(listContext.page - 1);
    }
  }

  function handleNextPage() {
    if (listContext.hasNextPage != null && listContext.hasNextPage) {
      listContext.setPage(listContext.page + 1);
    }
  }

  return (
    <ListContextProvider value={listContext}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Nazwa</TableHead>
            <TableHead>Opis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listContext.data?.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell>
                {imageUrls[organization.id] ? (
                  <Image
                    src={imageUrls[organization.id]}
                    alt={organization.name}
                    width={64}
                    height={64}
                  />
                ) : (
                  "No Logo"
                )}
              </TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {organization.shortDescription != null &&
                organization.shortDescription.length > 100
                  ? `${organization.shortDescription.slice(0, 100)}...`
                  : organization.shortDescription}
              </TableCell>
              <TableCell>
                <Link
                  href="/"
                  to={`/student_organizations/${organization.id.toString()}`}
                >
                  edit
                </Link>
              </TableCell>
              <TableCell>delete</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handlePreviousPage}>
        <ChevronLeft />
      </Button>
      <Button onClick={handleNextPage}>
        <ChevronRight />
      </Button>
    </ListContextProvider>
  );
}
