import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassicProductPage } from "@/components/classic/ClassicProductPage";
import { CategoryPage } from "@/components/catalog/CategoryPage";
import { InfoPageView } from "@/components/catalog/InfoPageView";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { allRoutableSlugs, getInfoPage } from "@/data/catalog";
import { categoryMeta } from "@/data/navigation";
import { getProductBySlug, getProductsForCategorySlug, getRelatedProducts } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 0;
export const dynamicParams = true;

export function generateStaticParams() {
  return allRoutableSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product) {
    return {
      title: product.name,
      description: product.category,
    };
  }
  const category = categoryMeta[slug];
  if (category) {
    return {
      title: category.title,
      description: category.description,
    };
  }
  const info = getInfoPage(slug);
  if (info) {
    return { title: info.title };
  }
  return { title: "Sayfa bulunamadı" };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (product) {
    const related = await getRelatedProducts(product);
    return <ClassicProductPage key={product.slug} product={product} related={related} />;
  }

  if (categoryMeta[slug]) {
    return (
      <StorefrontShell>
        <CategoryPage slug={slug} products={await getProductsForCategorySlug(slug)} />
      </StorefrontShell>
    );
  }

  const info = getInfoPage(slug);
  if (info) {
    return (
      <StorefrontShell>
        <InfoPageView page={info} />
      </StorefrontShell>
    );
  }

  notFound();
}
