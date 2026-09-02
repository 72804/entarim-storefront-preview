import type { CatalogProduct, ProductColor, VariantSwatchConfig } from "@/data/types";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  active: boolean;
};

export type ProductRow = {
  id: string;
  legacy_id: string | null;
  slug: string;
  name: string;
  category_id: string | null;
  price: number | string;
  old_price: number | string | null;
  description: string[];
  sizes: string[];
  published: boolean;
  featured: boolean;
  show_on_homepage: boolean;
  homepage_sort: number;
  archived: boolean;
  related_slugs: string[];
  generated_palette: string[];
  palette_override: string[];
  created_at: string;
  updated_at: string;
};

export type VariantRow = {
  id: string;
  product_id: string;
  slug: string;
  name: string;
  hex: string;
  sort_order: number;
  active: boolean;
  listing_image_id: string | null;
  swatch_image_url: string | null;
  swatch_source_image_id: string | null;
  swatch_x: number | string | null;
  swatch_y: number | string | null;
  swatch_zoom: number | string | null;
};

export type ImageRow = {
  id: string;
  product_id: string;
  variant_id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type PlacementRow = {
  id: string;
  product_id: string;
  placement_key: string;
  sort_order: number;
};

export type AdminProduct = ProductRow & {
  category: CategoryRow | null;
  variants: (VariantRow & { images: ImageRow[] })[];
  placements: PlacementRow[];
};

function num(value: number | string | null | undefined, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function orderedImages(images: ImageRow[]) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = sorted.find((image) => image.is_primary);
  if (!primary) return sorted;
  return [primary, ...sorted.filter((image) => image.id !== primary.id)];
}

export function mapVariant(variant: VariantRow, images: ImageRow[]): ProductColor {
  const ordered = orderedImages(images.filter((image) => image.variant_id === variant.id));
  const listing = ordered.find((image) => image.id === variant.listing_image_id) ?? ordered[0];
  const urls = listing ? [listing.url, ...ordered.filter((image) => image.id !== listing.id).map((image) => image.url)] : ordered.map((image) => image.url);

  let swatchConfig: VariantSwatchConfig | undefined;
  const source = ordered.find((image) => image.id === variant.swatch_source_image_id) ?? listing;
  if (source && variant.swatch_x != null && variant.swatch_y != null && variant.swatch_zoom != null) {
    swatchConfig = {
      sourceImage: source.url,
      x: num(variant.swatch_x, 50),
      y: num(variant.swatch_y, 44),
      zoom: num(variant.swatch_zoom, 1),
    };
  }

  return {
    id: variant.slug,
    name: variant.name,
    hex: variant.hex,
    images: urls,
    swatchImage: variant.swatch_image_url ?? undefined,
    swatchConfig,
  };
}

export function mapProduct(
  product: ProductRow,
  category: CategoryRow | null,
  variants: VariantRow[],
  images: ImageRow[],
): CatalogProduct {
  const active = [...variants].filter((variant) => variant.active).sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    price: num(product.price),
    oldPrice: product.old_price == null ? null : num(product.old_price),
    description: product.description ?? [],
    sizes: product.sizes ?? [],
    colors: active.map((variant) => mapVariant(variant, images)),
    relatedSlugs: product.related_slugs ?? [],
    generatedPalette: product.generated_palette,
    paletteOverride: product.palette_override?.length ? product.palette_override : undefined,
  };
}
