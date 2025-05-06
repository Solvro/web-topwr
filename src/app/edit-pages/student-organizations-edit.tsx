"use client";

import { EditBase, Form, required } from "ra-core";
import type { RaRecord } from "ra-core";

import { RaTextInput } from "@/components/ra-text-input";
import { Button } from "@/components/ui/button";

export function StudentOrganizationsEdit() {
  return (
    <EditBase
      mutationMode="pessimistic"
      transform={(data: RaRecord) => ({
        name: data.name as string,
      })}
    >
      <EditView />
    </EditBase>
  );
}

function EditView() {
  return (
    <>
      <h2>Edycja Organizacji</h2>
      <Form>
        <RaTextInput source="name" label="Name" validate={required()} />
        <Button type="submit">Zapisz</Button>
      </Form>
    </>
  );
}
