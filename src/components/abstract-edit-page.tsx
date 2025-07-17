import { API_URL } from "@/config/constants";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type { Resource } from "@/types/app";

async function fetchSingleResource<T>(
  resource: Resource,
  id: string,
): Promise<T | null> {
  try {
    const response = await fetchQuery<{ data: T }>(
      `${API_URL}/${resource}/${sanitizeId(id)}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export async function AbstractEditPage<T>({
  resource,
  params,
  FormComponent,
}: {
  resource: Resource;
  params: Promise<{ id: string }>;
  FormComponent: React.ComponentType<{ initialData: T | null }>;
}) {
  const { id } = await params;
  const resourceData = await fetchSingleResource<T>(resource, id);

  return <FormComponent initialData={resourceData} />;
}
