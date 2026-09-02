import scraped from "@/data/scraped-catalog.json";
import scrapedPages from "@/data/scraped-pages.json";
import { categoryMeta, extraInfoPages } from "@/data/navigation";
import type { CatalogProduct, InfoPage, ProductColor } from "@/data/types";

export type { CatalogProduct, InfoPage, ProductColor };

const catalog = scraped as {
  products: CatalogProduct[];
  homepageNewArrivals: string[];
  categoryProductSlugs: Record<string, string[]>;
};

export const products: CatalogProduct[] = catalog.products;
export const homepageNewArrivalSlugs = catalog.homepageNewArrivals;
export const categoryProductSlugs = catalog.categoryProductSlugs;
export const infoPages = scrapedPages as InfoPage[];

const productBySlug = new Map(products.map((item) => [item.slug, item]));

export function getProduct(slug: string) {
  return productBySlug.get(slug);
}

export function getColor(product: CatalogProduct, id: string): ProductColor {
  return product.colors.find((color) => color.id === id) ?? product.colors[0];
}

export function getVariantImage(color: ProductColor, index: number) {
  return color.images[index] ?? color.images[0];
}

export function primaryCardImage(product: CatalogProduct) {
  return product.colors.find((color) => color.images[0])?.images[0];
}

export function cardPalette(product: CatalogProduct) {
  return product.paletteOverride ?? product.generatedPalette ?? [];
}

export function productsBySlugs(slugs: string[]) {
  return slugs.map((slug) => productBySlug.get(slug)).filter((item): item is CatalogProduct => Boolean(item));
}

export function productsForCategory(slug: string) {
  const mapped =
    slug === "emzirme-giyim"
      ? "emzirmeye-uygun-giyim"
      : slug === "kislik-hamile-elbiseleri"
        ? "hamile-elbise"
        : slug === "pantolon-tayt"
          ? "tunik-bluz"
          : slug;
  const list = categoryProductSlugs[mapped] ?? categoryProductSlugs[slug] ?? [];
  const found = productsBySlugs(list);
  if (found.length > 0) return found;
  return products.slice(0, 8);
}

export function searchProducts(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];
  return products.filter((product) => {
    const haystack = [
      product.name,
      product.category,
      product.slug,
      ...product.colors.map((color) => color.name),
    ]
      .join(" ")
      .toLocaleLowerCase("tr");
    return haystack.includes(q);
  });
}

export function relatedProductsFor(product: CatalogProduct) {
  const related = productsBySlugs(product.relatedSlugs).filter((item) => item.slug !== product.slug);
  if (related.length >= 6) return related.slice(0, 10);
  const extras = productsForCategory(product.categorySlug).filter(
    (item) => item.slug !== product.slug && !related.some((rel) => rel.slug === item.slug),
  );
  return [...related, ...extras].slice(0, 10);
}

export const featuredProduct = getProduct("e186-hamile-sifon-elbise-4")!;

export function getInfoPage(slug: string): InfoPage | undefined {
  const found = infoPages.find((page) => page.slug === slug);
  if (found) return found;
  const extra = extraInfoPages.find((page) => page.slug === slug);
  if (!extra) return undefined;
  return {
    slug: extra.slug,
    title: extra.title,
    paragraphs: [
      `${extra.title} içeriği bu önizleme sitesinde bilgilendirme amaçlıdır.`,
      "Sipariş, üyelik ve ödeme işlemleri demo sürümünde gerçek altyapıya bağlanmaz. Güncel süreçler için Entarim müşteri hizmetleriyle iletişime geçebilirsiniz.",
    ],
  };
}

export function allRoutableSlugs() {
  return [
    ...products.map((product) => product.slug),
    ...Object.keys(categoryMeta),
    ...infoPages.map((page) => page.slug),
    ...extraInfoPages.map((page) => page.slug),
  ];
}
