"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { ImageInput } from "@/app/components/image-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/types";
import type { StudentOrganization } from "@/lib/types";
import { StudentOrganizationSchema } from "@/schemas";

const departments = [
  {
    id: 1,
    name: "Wydział Architektury",
  },
  {
    id: 2,
    name: "Wydział Budownictwa Lądowego i Wodnego",
  },
  {
    id: 4,
    name: "Wydział Chemiczny",
  },
  {
    id: 5,
    name: "Wydział Informatyki i Telekomunikacji",
  },
  {
    id: 6,
    name: "Wydział Elektryczny",
  },
  {
    id: 7,
    name: "Wydział Geoinżynierii, Górnictwa i Geologii",
  },
  {
    id: 8,
    name: "Wydział Inżynierii Środowiska",
  },
  {
    id: 9,
    name: "Wydział Zarządzania",
  },
  {
    id: 10,
    name: "Wydział Mechaniczno-Energetyczny",
  },
  {
    id: 11,
    name: "Wydział Mechaniczny",
  },
  {
    id: 12,
    name: "Wydział Podstawowych Problemów Techniki",
  },
  {
    id: 13,
    name: "Wydział Elektroniki, Fotoniki i Mikrosystemów",
  },
  {
    id: 14,
    name: "Wydział Matematyki",
  },
  {
    id: 15,
    name: "Wydział Medyczny",
  },
];

export function Editor({ id }: { id: string | null }) {
  const form = useForm<z.infer<typeof StudentOrganizationSchema>>({
    resolver: zodResolver(StudentOrganizationSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      coverPreview: false,
      departmentId: null,
      source: OrganizationSource.Manual,
      organizationType: OrganizationType.ScientificClub,
      organizationStatus: OrganizationStatus.Unknown,
      isStrategic: false,
    },
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `https://api.topwr.solvro.pl/api/v1/student_organizations/${String(id)}`,
        );
        const { data } = (await response.json()) as {
          data: StudentOrganization;
        };
        form.reset(data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };
    if (id !== null) {
      void fetchOrganizations();
    }
  }, [form, id]);

  function onSubmit(values: z.infer<typeof StudentOrganizationSchema>) {
    // eslint-disable-next-line no-console
    console.log(id ?? "no id");
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-grow flex-col space-y-8"
        >
          <div className="bg-background-secondary flex flex-grow flex-row space-x-4 rounded-xl p-4">
            <div className="flex w-48 flex-col space-y-4">
              <ImageInput label="Logo" />
              <ImageInput label="Cover" />
            </div>

            <div className="flex h-full w-full flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Krótki opis</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-grow flex-col">
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        className="bg-background placeholder:text-foreground h-full"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wydział</FormLabel>
                      <Select
                        value={
                          field.value === null ? undefined : String(field.value)
                        }
                        onValueChange={(value) => {
                          field.onChange(value ? Number(value) : null);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Wybierz wydział" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Źródło</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Wybierz źródło" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationSource).map(
                            ([, value]) => {
                              const labels: Record<string, string> = {
                                [OrganizationSource.StudentDepartment]:
                                  "Dział Studencki",
                                [OrganizationSource.Manual]: "Ręcznie",
                                [OrganizationSource.PwrActive]: "PWR Active",
                              };
                              return (
                                <SelectItem key={value} value={value}>
                                  {labels[value] ?? value}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Wybierz typ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationType).map(([, value]) => {
                            const labels: Record<string, string> = {
                              [OrganizationType.ScientificClub]: "Koło naukowe",
                              [OrganizationType.StudentOrganization]:
                                "Organizacja studencka",
                              [OrganizationType.StudentMedium]:
                                "Środowisko studenckie",
                              [OrganizationType.CultureAgenda]:
                                "Agenda kultury",
                              [OrganizationType.StudentCouncil]:
                                "Samorząd studencki",
                            };
                            return (
                              <SelectItem key={value} value={value}>
                                {labels[value] ?? value}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Wybierz status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationStatus).map(
                            ([, value]) => {
                              const labels: Record<string, string> = {
                                [OrganizationStatus.Active]: "Aktywna",
                                [OrganizationStatus.Inactive]: "Nieaktywna",
                                [OrganizationStatus.Dissolved]: "Rozwiązana",
                                [OrganizationStatus.Unknown]: "Nieznany",
                              };
                              return (
                                <SelectItem key={value} value={value}>
                                  {labels[value] ?? value}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isStrategic"
                render={({ field }) => (
                  <FormItem className="flex flex-row">
                    <FormLabel>Czy jest kołem strategicznym?</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        className="bg-background"
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </Form>
      <Button
        variant={"ghost"}
        className="text-primary hover:text-primary w-min"
        asChild
      >
        <Link href="/student_organizations" className="">
          <ChevronLeft />
          Wroć do organizacjami
        </Link>
      </Button>
    </div>
  );
}
