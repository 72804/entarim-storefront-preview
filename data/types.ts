export type SwatchCrop = {
  scale?: number;
  x?: number;
  y?: number;
};

export type VariantSwatchConfig = {
  sourceImage: string;
  x: number;
  y: number;
  zoom: number;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  images: string[];
  swatchImage?: string;
  swatchCrop?: SwatchCrop;
  swatchConfig?: VariantSwatchConfig;
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
  swatchCrop?: SwatchCrop;
};

export type InfoPage = {
  slug: string;
  title: string;
  paragraphs: string[];
};
