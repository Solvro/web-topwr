"use client";

import Image from "next/image";
import { ListContextProvider, useListController } from "ra-core";
import { useEffect, useState } from "react";

import type { StudentOrganization } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

import { AbstractList } from "./abstract-list";

export function StudentOrganizationsList() {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const listContext = useListController<StudentOrganization>({ perPage: 10 });

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (listContext.data == null) {
        return;
      }
      const urls: Record<string, string> = {};
      for (const organization of listContext.data) {
        if (organization.logoKey != null) {
          const url = await getImageUrl(organization.logoKey);
          if (url != null) {
            urls[organization.id] = url;
          }
        }
      }
      setImageUrls(urls);
    };
    void fetchImageUrls();
  }, [listContext.data]);

  const columns = [
    {
      header: "Logo",
      render: (organization: StudentOrganization) =>
        imageUrls[organization.id] ? (
          <Image
            src={imageUrls[organization.id]}
            alt={organization.name}
            width={64}
            height={64}
          />
        ) : (
          "No Logo"
        ),
    },
    {
      header: "Nazwa",
      render: (organization: StudentOrganization) => organization.name,
    },
    {
      header: "Opis",
      render: (organization: StudentOrganization) =>
        organization.shortDescription === null
          ? "No description"
          : `${organization.shortDescription.slice(0, 100)}...`,
    },
  ];

  return (
    <ListContextProvider value={listContext}>
      <AbstractList
        resource="student_organizations"
        data={listContext.data}
        columns={columns}
        page={listContext.page}
        hasNextPage={listContext.hasNextPage ?? false}
        hasPreviousPage={listContext.hasPreviousPage ?? false}
        onNextPage={() => {
          listContext.setPage(listContext.page + 1);
        }}
        onPreviousPage={() => {
          listContext.setPage(listContext.page - 1);
        }}
      />
    </ListContextProvider>
  );
}
