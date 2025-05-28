"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { GuideArticle } from "@/lib/types";

import { AbstractList } from "../components/abstract-list";

export default function GuideArticlesPage() {
  const searchParameters = useSearchParams();
  const page = Number.parseInt(searchParameters.get("page") ?? "1", 10);

  const [articles, setArticles] = useState<GuideArticle[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 10;
  const [resultsNumber, setResultsNumber] = useState(0);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `https://api.topwr.solvro.pl/api/v1/guide_articles?page=${String(page)}&limit=${String(resultsPerPage)}`,
        );
        const { data, meta } = (await response.json()) as {
          data: GuideArticle[];
          meta: { total: number };
        };
        setTotalPages(Math.ceil(meta.total / resultsPerPage));
        setResultsNumber(meta.total);
        setArticles(data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setArticles([]);
      }
    };
    void fetchOrganizations();
  }, [page]);

  return (
    <AbstractList
      resource="guide_articles"
      data={articles}
      page={page}
      totalPages={totalPages}
      resultsNumber={resultsNumber}
    />
  );
}
