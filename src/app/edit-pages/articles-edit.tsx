"use client";

import { EditBase, Form, required, useEditContext } from "ra-core";
import type { RaRecord } from "ra-core";
import { Link } from "react-admin";

import { RaInput } from "@/components/ra-input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export function ArticlesEdit() {
  return (
    <EditBase mutationMode="pessimistic">
      <ProductEditView />
    </EditBase>
  );
}

function ProductEditView() {
  const context = useEditContext<RaRecord>();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" to="/">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/" to="/articles">
              Artykuły
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{context.record?.name ?? "Artykuł"}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2>{context.record?.name ?? ""}</h2>
      <Form>
        <RaInput source="name" label="Name" validate={required()} />
        <RaInput source="contents" label="Contents" validate={required()} />
        <Button type="submit">Zapisz</Button>
      </Form>
    </>
  );
}
