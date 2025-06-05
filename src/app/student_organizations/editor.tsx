"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ImageInput } from "@/components/image-input";
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
import { departments } from "@/lib/constants";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/lib/types";
import type {
  StudentOrganization,
  StudentOrganizationFormValues,
} from "@/lib/types";
import { StudentOrganizationSchema } from "@/schemas";

export function Editor({
  initialData,
}: {
  initialData?: StudentOrganization | null;
}) {
  const defaultValues: StudentOrganizationFormValues = initialData ?? {
    name: "",
    shortDescription: "",
    description: "",
    coverPreview: false,
    departmentId: null,
    source: OrganizationSource.Manual,
    organizationType: OrganizationType.ScientificClub,
    organizationStatus: OrganizationStatus.Unknown,
    isStrategic: false,
  };

  const form = useForm<StudentOrganizationFormValues>({
    resolver: zodResolver(StudentOrganizationSchema),
    defaultValues,
  });

  // TODO: add images handling

  function createOrganization(data: StudentOrganizationFormValues) {
    // TODO
    // eslint-disable-next-line no-console
    console.log("Creating organization:", data);
  }

  function updateOrganization(id: number, data: StudentOrganizationFormValues) {
    // TODO
    // eslint-disable-next-line no-console
    console.log(`Updating organization ${String(id)}:`, data);
  }

  function onSubmit(values: StudentOrganizationFormValues) {
    if (initialData == null) {
      createOrganization(values);
    } else {
      updateOrganization(initialData.id, values);
    }
  }

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-grow flex-col space-y-4"
        >
          <div className="flex-[1_1_0] flex-grow overflow-y-auto">
            <div className="bg-background-secondary flex min-h-full flex-col space-y-4 space-x-4 rounded-xl p-4 pb-8 md:flex-row">
              <div className="flex w-48 flex-col space-y-4">
                <ImageInput label="Logo" />
                <ImageInput label="Baner" />
              </div>

              <div className="flex w-full flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa</FormLabel>
                      <FormControl>
                        <Input
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
                          className="bg-background placeholder:text-foreground h-full min-h-32"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wydział</FormLabel>
                        <Select
                          value={
                            field.value === null
                              ? undefined
                              : String(field.value)
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
                            {Object.entries(OrganizationType).map(
                              ([, value]) => {
                                const labels: Record<string, string> = {
                                  [OrganizationType.ScientificClub]:
                                    "Koło naukowe",
                                  [OrganizationType.StudentOrganization]:
                                    "Organizacja studencka",
                                  [OrganizationType.StudentMedium]:
                                    "Organizacja medialna",
                                  [OrganizationType.CultureAgenda]:
                                    "Organizacja kulturalna",
                                  [OrganizationType.StudentCouncil]:
                                    "Samorząd studencki",
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
          </div>

          <div className="flex justify-end">
            <Button type="submit">Zapisz</Button>
          </div>
        </form>
      </Form>
      <Button
        variant="ghost"
        className="text-primary hover:text-primary w-min"
        asChild
      >
        <Link href="/student_organizations" className="">
          <ChevronLeft />
          Wroć do organizacji
        </Link>
      </Button>
    </div>
  );
}
