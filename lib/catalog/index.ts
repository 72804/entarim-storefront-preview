import {
  categoryProductSlugs,
  getProduct as getStaticProduct,
  homepageNewArrivalSlugs,
  products as staticProducts,
  productsBySlugs as staticBySlugs,
  productsForCategory as staticForCategory,
  relatedProductsFor as staticRelated,
  searchProducts as staticSearch,
} from "@/data/catalog";
import { categoryMeta } from "@/data/navigation";
import type { CatalogProduct } from "@/data/types";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  mapProduct,
  type CategoryRow,
  type ImageRow,
  type PlacementRow,
  type ProductRow,
  type VariantRow,
} from "@/lib/catalog/map";

const CATEGORY_ALIASES: Record<string, string> = {
  "emzirme-giyim": "emzirmeye-uygun-giyim",
  "kislik-hamile-elbiseleri": "hamile-elbise",
  "pantolon-tayt": "tunik-bluz",
};

type Loaded = {
  products: CatalogProduct[];
  bySlug: Map<string, CatalogProduct>;
  placements: PlacementRow[];
  categories: CategoryRow[];
};

async function client() {
  return (await createServerSupabase()) ?? createAdminSupabase();
}

async function loadPublished(): Promise<Loaded | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await client();
  if (!supabase) return null;

  const [{ data: products, error: productError }, { data: variants }, { data: images }, { data: categories }, { data: placements }] =
    await Promise.all([
      supabase.from("products").select("*").eq("published", true).eq("archived", false),
      supabase.from("product_variants").select("*").eq("active", true),
      supabase.from("product_images").select("*"),
      supabase.from("categories").select("*").eq("active", true),
      supabase.from("product_placements").select("*"),
    ]);

  if (productError || !products) return null;

  const categoryMap = new Map((categories as CategoryRow[] | null)?.map((item) => [item.id, item]) ?? []);
  const variantRows = (variants as VariantRow[] | null) ?? [];
  const imageRows = (images as ImageRow[] | null) ?? [];
  const mapped = (products as ProductRow[]).map((product) =>
    mapProduct(
      product,
      product.category_id ? categoryMap.get(product.category_id) ?? null : null,
      variantRows.filter((variant) => variant.product_id === product.id),
      imageRows.filter((image) => image.product_id === product.id),
    ),
  );

  return {
    products: mapped,
    bySlug: new Map(mapped.map((item) => [item.slug, item])),
    placements: (placements as PlacementRow[] | null) ?? [],
    categories: (categories as CategoryRow[] | null) ?? [],
  };
}

export async function getPublishedProducts(): Promise<CatalogProduct[]> {
  const loaded = await loadPublished();
  return loaded?.products ?? staticProducts;
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  const loaded = await loadPublished();
  if (!loaded) return getStaticProduct(slug);
  return loaded.bySlug.get(slug);
}

export async function getHomepageArrivals(): Promise<CatalogProduct[]> {
  const loaded = await loadPublished();
  if (!loaded) return staticBySlugs(homepageNewArrivalSlugs);
  const fromFlag = loaded.products
    .filter((product) => {
      const row = loaded.placements.find((item) => item.product_id === product.id && item.placement_key === "homepage_new_arrivals");
      return Boolean(row);
    })
    .sort((a, b) => {
      const pa = loaded.placements.find((item) => item.product_id === a.id && item.placement_key === "homepage_new_arrivals")?.sort_order ?? 0;
      const pb = loaded.placements.find((item) => item.product_id === b.id && item.placement_key === "homepage_new_arrivals")?.sort_order ?? 0;
      return pa - pb;
    });
  if (fromFlag.length > 0) return fromFlag;
  return homepageNewArrivalSlugs.map((slug) => loaded.bySlug.get(slug)).filter((item): item is CatalogProduct => Boolean(item));
}

export async function getProductsForCategorySlug(slug: string): Promise<CatalogProduct[]> {
  const loaded = await loadPublished();
  if (!loaded) return staticForCategory(slug);
  const mapped = CATEGORY_ALIASES[slug] ?? slug;
  const ordered = loaded.placements
    .filter((item) => item.placement_key === mapped || item.placement_key === slug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => loaded.products.find((product) => product.id === item.product_id))
    .filter((item): item is CatalogProduct => Boolean(item));
  if (ordered.length > 0) return ordered;
  const byPrimary = loaded.products.filter((product) => product.categorySlug === mapped || product.categorySlug === slug);
  return byPrimary.length > 0 ? byPrimary : loaded.products.slice(0, 8);
}

export async function searchPublishedProducts(query: string): Promise<CatalogProduct[]> {
  const loaded = await loadPublished();
  const list = loaded?.products ?? staticProducts;
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];
  return list.filter((product) => {
    const haystack = [product.name, product.category, product.slug, ...product.colors.map((color) => color.name)]
      .join(" ")
      .toLocaleLowerCase("tr");
    return haystack.includes(q);
  });
}

export async function getRelatedProducts(product: CatalogProduct): Promise<CatalogProduct[]> {
  const loaded = await loadPublished();
  if (!loaded) return staticRelated(product);
    const related = product.relatedSlugs.flatMap((slug) => {
      const item = loaded.bySlug.get(slug);
      if (!item || item.slug === product.slug) return [];
      return [item];
    });
  if (related.length >= 6) return related.slice(0, 10);
  const extras = (await getProductsForCategorySlug(product.categorySlug)).filter(
    (item) => item.slug !== product.slug && !related.some((rel) => rel.slug === item.slug),
  );
  return [...related, ...extras].slice(0, 10);
}

export async function getActiveCategories() {
  const loaded = await loadPublished();
  if (!loaded) {
    return Object.entries(categoryMeta)
      .filter(([slug]) => slug !== "kategoriler")
      .map(([slug, meta], index) => ({
        id: slug,
        slug,
        name: meta.title,
        description: meta.description,
        sort_order: index,
        active: true,
      }));
  }
  return loaded.categories.sort((a, b) => a.sort_order - b.sort_order);
}

export async function allStorefrontSlugs() {
  const loaded = await loadPublished();
  const productSlugs = loaded ? loaded.products.map((item) => item.slug) : staticProducts.map((item) => item.slug);
  const categorySlugs = loaded ? loaded.categories.map((item) => item.slug) : Object.keys(categoryProductSlugs);
  return { productSlugs, categorySlugs };
}

export { staticSearch };
