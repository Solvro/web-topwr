import { API_URL } from "@/config/constants";
import type { GuideArticle } from "@/lib/types";

import { Editor } from "../../editor";

async function getGuideArticle(id: string): Promise<GuideArticle | null> {
  try {
    const sanitizedId = String(id).split(/ /)[0].replaceAll(/[^\d]/g, "");
    const response = await fetch(
      `${API_URL}/api/v1/guide_articles/${sanitizedId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch guide article: ${String(response.status)}`,
      );
    }

    const { data } = (await response.json()) as {
      data: GuideArticle;
    };

    return data;
  } catch (error) {
    console.error("Error fetching guide article:", error);
    return null;
  }
}

export default async function EditGuideArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guideArticle = await getGuideArticle(id);

  return <Editor initialData={guideArticle} />;
}
