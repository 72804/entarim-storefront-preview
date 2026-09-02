import { createAdminSupabase } from "@/lib/supabase/admin";
import type { AdminProduct, CategoryRow, ImageRow, PlacementRow, ProductRow, VariantRow } from "@/lib/catalog/map";

export async function fetchAdminCategories() {
  const admin = createAdminSupabase();
  if (!admin) return [];
  const { data } = await admin.from("categories").select("*").order("sort_order");
  return (data as CategoryRow[] | null) ?? [];
}

export async function fetchAdminProducts() {
  const admin = createAdminSupabase();
  if (!admin) return [];
  const [{ data: products }, { data: categories }, { data: variants }, { data: images }, { data: placements }] =
    await Promise.all([
      admin.from("products").select("*").eq("archived", false).order("updated_at", { ascending: false }),
      admin.from("categories").select("*"),
      admin.from("product_variants").select("*"),
      admin.from("product_images").select("*"),
      admin.from("product_placements").select("*"),
    ]);
  const categoryMap = new Map(((categories as CategoryRow[] | null) ?? []).map((item) => [item.id, item]));
  const variantRows = (variants as VariantRow[] | null) ?? [];
  const imageRows = (images as ImageRow[] | null) ?? [];
  const placementRows = (placements as PlacementRow[] | null) ?? [];
  return ((products as ProductRow[] | null) ?? []).map((product) => ({
    ...product,
    category: product.category_id ? categoryMap.get(product.category_id) ?? null : null,
    variants: variantRows
      .filter((variant) => variant.product_id === product.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((variant) => ({
        ...variant,
        images: imageRows
          .filter((image) => image.variant_id === variant.id)
          .sort((a, b) => a.sort_order - b.sort_order),
      })),
    placements: placementRows.filter((item) => item.product_id === product.id),
  })) as AdminProduct[];
}

export async function fetchAdminProduct(id: string) {
  const list = await fetchAdminProducts();
  return list.find((item) => item.id === id) ?? null;
}

export async function fetchAdminStats() {
  const products = await fetchAdminProducts();
  const categories = await fetchAdminCategories();
  return {
    total: products.length,
    published: products.filter((item) => item.published).length,
    drafts: products.filter((item) => !item.published).length,
    categories: categories.filter((item) => item.active).length,
  };
}
