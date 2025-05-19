"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { StudentOrganizationSchema } from "@/schemas";

export default function Page() {
  const form = useForm<z.infer<typeof StudentOrganizationSchema>>({
    resolver: zodResolver(StudentOrganizationSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      coverPreview: false,
      source: OrganizationSource.Manual,
      organizationType: OrganizationType.ScientificClub,
      organizationStatus: OrganizationStatus.Unknown,
      isStrategic: false,
    },
  });

  function onSubmit(values: z.infer<typeof StudentOrganizationSchema>) {
    // eslint-disable-next-line no-console
    console.log(values);
  }

  return (
    <div className="mx-auto h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col space-y-8"
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
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationSource).map(
                            ([label, value]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
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
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationType).map(
                            ([label, value]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
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
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-input">
                          {Object.entries(OrganizationStatus).map(
                            ([label, value]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isStrategic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is Strategic</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
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
    </div>
  );
}
