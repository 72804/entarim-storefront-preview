import type { ProductColor, SwatchCrop } from "@/data/types";

export const DEFAULT_SWATCH_CROP = {
  scale: 4,
  x: 50,
  y: 44,
} as const;

const swatchCropOverrides: Record<string, SwatchCrop> = {
  "e114-m04-hamile-elbise-ekose::mavi": { x: 38 },
  "e114-m04-hamile-elbise-ekose::kirmizi-mavi": { x: 38 },
  "6019-m010-hamile-uzun-sifon-elbise::pembe": { scale: 4.4, y: 48 },
};

export function resolveSwatchCrop(
  productSlug: string,
  color: ProductColor,
  productCrop?: SwatchCrop,
): { scale: number; x: number; y: number } {
  const keyed = swatchCropOverrides[`${productSlug}::${color.id}`];
  const bySlug = swatchCropOverrides[productSlug];

  return {
    scale: color.swatchCrop?.scale ?? productCrop?.scale ?? keyed?.scale ?? bySlug?.scale ?? DEFAULT_SWATCH_CROP.scale,
    x: color.swatchCrop?.x ?? productCrop?.x ?? keyed?.x ?? bySlug?.x ?? DEFAULT_SWATCH_CROP.x,
    y: color.swatchCrop?.y ?? productCrop?.y ?? keyed?.y ?? bySlug?.y ?? DEFAULT_SWATCH_CROP.y,
  };
}
