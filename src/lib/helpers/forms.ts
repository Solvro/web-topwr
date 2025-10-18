import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type { ResourceDataType } from "@/types/app";
import type {
  BelongsToInputsSelectOptions,
  FormBelongsToInput,
} from "@/types/forms";

import { fetchQuery } from "../fetch-utils";

export async function fetchBelongsToInputOptions<T extends Resource>(
  belongsToInputs: FormBelongsToInput<T>[],
): Promise<BelongsToInputsSelectOptions> {
  const optionsMap: BelongsToInputsSelectOptions = {};

  for (const input of belongsToInputs) {
    const response = await fetchQuery<{ data: ResourceDataType<Resource>[] }>(
      `/${RESOURCE_METADATA[input.relatedResource].apiPath}`,
    );
    optionsMap[input.name] = response.data.map((item) => ({
      value: item[input.valueField as keyof typeof item] as number,
      name: item[input.nameField as keyof typeof item] as string,
    }));
  }

  return optionsMap;
}
