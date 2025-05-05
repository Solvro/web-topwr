"use client";

import { EditBase, Form, required, useEditContext } from "ra-core";
import type { RaRecord } from "ra-core";

import { RaInput } from "@/components/ra-input";
import { Button } from "@/components/ui/button";

export function StudentOrganizationsEdit() {
  return (
    <EditBase
      mutationMode="pessimistic"
      transform={(data: RaRecord) => ({
        name: data.name as string,
      })}
    >
      <ProductEditView />
    </EditBase>
  );
}

function ProductEditView() {
  const context = useEditContext<RaRecord>();

  return (
    <>
      <h2>{context.record?.name ?? ""}</h2>
      <Form>
        <RaInput source="name" label="Name" validate={required()} />
        <Button type="submit">Zapisz</Button>
      </Form>
    </>
  );
}
