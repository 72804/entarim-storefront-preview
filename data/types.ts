export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  images: string[];
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice: number | null;
  description: string[];
  sizes: string[];
  colors: ProductColor[];
  relatedSlugs: string[];
  generatedPalette?: string[];
  paletteOverride?: string[];
};

export type InfoPage = {
  slug: string;
  title: string;
  paragraphs: string[];
};
