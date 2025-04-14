"use client";

import { EditBase, Form, required, useEditContext } from "ra-core";
import type { RaRecord } from "ra-core";
import { Link } from "react-admin";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { RaInput } from "./ra-input";
import { Button } from "./ui/button";

export function PlaceholderUsersEdit() {
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
            <Link href="/" to="/users">
              Users
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{context.record?.name ?? "User"}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h2>{context.record?.name ?? ""}</h2>
      <Form>
        <RaInput source="name" label="Name" validate={required()} />
        <Button type="submit">Save</Button>
      </Form>
    </>
  );
}
