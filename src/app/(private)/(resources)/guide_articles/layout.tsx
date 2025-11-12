import { Resource } from "@/features/resources";
import { AbstractResourceLayout } from "@/features/resources/server";
import type { LayoutProps } from "@/types/components";

export default function GuideArticlesLayout(props: LayoutProps) {
  return (
    <AbstractResourceLayout resource={Resource.GuideArticles} {...props} />
  );
}
