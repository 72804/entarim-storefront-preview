import type { Metadata } from "next";
import { SearchPage } from "@/components/search/SearchPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { searchPublishedProducts } from "@/lib/catalog";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" araması` : "Arama",
  };
}

export const revalidate = 0;

export default async function AramaPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = q ? await searchPublishedProducts(q) : [];
  return (
    <StorefrontShell>
      <SearchPage query={q} results={results} />
    </StorefrontShell>
  );
}
