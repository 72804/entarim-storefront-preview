import overrides from "@/data/swatch-crop-overrides.json";
import type { ProductColor, SwatchCrop } from "@/data/types";

export type SwatchRegionOverride = {
  imageIndex?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  swatchImage?: string;
};

export const DEFAULT_SWATCH_CROP = {
  scale: 4,
  x: 50,
  y: 44,
} as const;

export const swatchCropOverrides = overrides as Record<string, SwatchRegionOverride>;

export function resolveSwatchCrop(
  productSlug: string,
  color: ProductColor,
  productCrop?: SwatchCrop,
): { scale: number; x: number; y: number } {
  return {
    scale: color.swatchCrop?.scale ?? productCrop?.scale ?? DEFAULT_SWATCH_CROP.scale,
    x: color.swatchCrop?.x ?? productCrop?.x ?? DEFAULT_SWATCH_CROP.x,
    y: color.swatchCrop?.y ?? productCrop?.y ?? DEFAULT_SWATCH_CROP.y,
  };
}

export function resolveSwatchImage(productSlug: string, color: ProductColor) {
  const keyed = swatchCropOverrides[`${productSlug}::${color.id}`];
  const bySlug = swatchCropOverrides[productSlug];
  return keyed?.swatchImage ?? bySlug?.swatchImage ?? color.swatchImage ?? null;
}
