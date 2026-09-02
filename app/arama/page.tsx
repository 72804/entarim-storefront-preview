import type { Metadata } from "next";
import { SearchPage } from "@/components/search/SearchPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" araması` : "Arama",
  };
}

export default async function AramaPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  return (
    <StorefrontShell>
      <SearchPage query={q} />
    </StorefrontShell>
  );
}
