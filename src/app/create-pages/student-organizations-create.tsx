"use client";

import { CreateBase, Form, required } from "ra-core";
import type { RaRecord } from "ra-core";

import { RaTextInput } from "@/components/ra-text-input";
import { Button } from "@/components/ui/button";

export function StudentOrganizationsCreate() {
  return (
    <CreateBase
      mutationMode="pessimistic"
      transform={(data: RaRecord) => ({
        name: data.name as string,
        description: data.description as string,
        shortDescription: data.shortDescription as string,
      })}
    >
      <CreateView />
    </CreateBase>
  );
}

function CreateView() {
  return (
    <>
      <h2>Dodawanie Organizacji</h2>
      <Form>
        <RaTextInput source="name" label="Nazwa" validate={required()} />
        <RaTextInput source="description" label="Opis" validate={required()} />
        <RaTextInput
          source="shortDescription"
          label="Krótki opis"
          validate={required()}
        />
        <Button type="submit">Utwórz</Button>
      </Form>
    </>
  );
}
