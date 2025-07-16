import { AbstractList } from "@/components/abstract-list";
import { API_URL } from "@/config/constants";
import type { GuideArticle } from "@/types/app";

async function fetchGuideArticles(page: number, resultsPerPage: number) {
  try {
    const response = await fetch(
      `${API_URL}/guide_articles?page=${String(page)}&limit=${String(resultsPerPage)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch guide articles: ${String(response.status)}`,
      );
    }

    const { data, meta } = (await response.json()) as {
      data: GuideArticle[];
      meta: { total: number };
    };

    return { data, meta };
  } catch (error) {
    console.error("Error fetching guide articles:", error);
    return { data: [], meta: { total: 0 } };
  }
}

export default async function GuideArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParameters = await searchParams;
  const page = Number.parseInt(resolvedSearchParameters.page ?? "1", 10);
  const resultsPerPage = 10; // może będzie do zmiany przez użytkownika w przyszłości

  const { data: articles, meta } = await fetchGuideArticles(
    page,
    resultsPerPage,
  );
  const totalPages = Math.ceil(meta.total / resultsPerPage);
  const resultsNumber = meta.total;

  const listItems = articles.map((article) => ({
    id: article.id,
    name: article.title,
    shortDescription: article.shortDesc,
  }));

  return (
    <AbstractList
      resource="guide_articles"
      listItems={listItems}
      page={page}
      totalPages={totalPages}
      resultsNumber={resultsNumber}
    />
  );
}
