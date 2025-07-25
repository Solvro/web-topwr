"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { ImageInput } from "@/components/image/image-input";
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
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { RESOURCE_SCHEMAS } from "@/schemas/resources";
import type { MessageResponse } from "@/types/api";
import type { SchemaWithOptionalId } from "@/types/helpers";

import type {
  AbstractResourceFormGeneric,
  AbstractResourceFormProps,
  ExistingImages,
} from ".";

const isExistingResourceItem = <T extends z.ZodType>(
  defaultValues?: SchemaWithOptionalId<T>,
): defaultValues is z.infer<T> & { id: number } =>
  defaultValues != null &&
  "id" in defaultValues &&
  defaultValues.id !== undefined &&
  typeof defaultValues.id === "number";

const getMutationConfig = <T extends z.ZodType>(
  resource: Resource,
  defaultValues?: SchemaWithOptionalId<T>,
) =>
  isExistingResourceItem(defaultValues)
    ? ({
        mutationKey: `update__${resource}__${String(defaultValues.id)}`,
        endpoint: sanitizeId(String(defaultValues.id)),
        method: "PATCH",
      } as const)
    : ({
        mutationKey: `create__${resource}`,
        endpoint: "/",
        method: "POST",
      } as const);

export function AbstractResourceFormInternal<
  T extends AbstractResourceFormGeneric,
>({
  resource,
  defaultValues,
  formInputs: {
    imageInputs = [],
    textInputs = [],
    richTextInput,
    selectInputs = [],
    checkboxInputs = [],
  },
  returnButtonPath,
  existingImages,
}: AbstractResourceFormProps<T> & { existingImages: ExistingImages<T> }) {
  const schema = RESOURCE_SCHEMAS[resource];
  const router = useRouter();
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutationKey, endpoint, method } = getMutationConfig(
    resource,
    defaultValues,
  );
  type ResponseType = MessageResponse & {
    data: z.infer<T> & { id: number };
  };
  const { mutateAsync, isPending } = useMutationWrapper<
    ResponseType,
    z.infer<T>
  >(mutationKey, async (body) => {
    const response = await fetchMutation<ResponseType>(endpoint, {
      body,
      method,
      resource,
    });
    router.refresh();
    form.reset(response.data);
    return response;
  });

  return (
    <div className="mx-auto flex h-full flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            toast.promise(mutateAsync(values), {
              loading: "Trwa przetwarzanie...",
              success: "Pomyślnie zapisano!",
              error: "Wystąpił błąd podczas zapisywania.",
            }),
          )}
          className="flex grow flex-col space-y-4"
        >
          <div className="grow basis-[0] overflow-y-auto">
            <div className="bg-background-secondary flex min-h-full flex-col space-y-4 space-x-4 rounded-xl p-4 md:flex-row">
              <div className="flex w-full flex-col space-y-4 md:w-48">
                {imageInputs.map((input) => (
                  <FormField
                    key={input.label}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <ImageInput
                          {...field}
                          label={input.label}
                          existingImage={existingImages[field.name]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex w-full flex-col space-y-4">
                {textInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground shadow-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* // TODO: rich text editor */}
                {richTextInput != null && (
                  <FormField
                    key={richTextInput.name}
                    control={form.control}
                    name={richTextInput.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{richTextInput.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-background placeholder:text-foreground h-20 shadow-none"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {selectInputs.map((input) => (
                    <FormField
                      key={input.name}
                      control={form.control}
                      name={input.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{input.label}</FormLabel>
                          <Select
                            value={String(field.value ?? "")}
                            onValueChange={(value) => {
                              field.onChange(
                                Number.isNaN(Number.parseInt(value))
                                  ? value
                                  : Number.parseInt(value),
                              );
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background w-full shadow-none">
                                <SelectValue placeholder={input.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-input">
                              {input.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={String(option.value)}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {checkboxInputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row space-x-2">
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            className="bg-background"
                            onCheckedChange={(checked) => {
                              field.onChange(Boolean(checked));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary w-min"
              asChild
            >
              <Link href={returnButtonPath} className="">
                <ChevronLeft />
                Wróć do{" "}
                {declineNoun(resource, {
                  case: DeclensionCase.Genitive,
                  plural: true,
                })}
              </Link>
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={!form.formState.isDirty}
            >
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
