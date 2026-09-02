"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import { resolveSwatchCrop } from "@/data/swatch-crops";
import type { ProductColor, SwatchCrop } from "@/data/types";

type ProductVariantSwatchesProps = {
  colors: ProductColor[];
  selectedId: string;
  productName: string;
  productSlug: string;
  productCrop?: SwatchCrop;
  onSelect: (id: string) => void;
};

export function ProductVariantSwatches({
  colors,
  selectedId,
  productName,
  productSlug,
  productCrop,
  onSelect,
}: ProductVariantSwatchesProps) {
  const handleSelect = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2" role="group" aria-label={`${productName} renk seçimi`}>
      {colors.map((color) => {
        const selected = color.id === selectedId;
        const preview = color.images[0];
        const crop = resolveSwatchCrop(productSlug, color, productCrop);

        return (
          <button
            key={color.id}
            type="button"
            aria-pressed={selected}
            aria-label={`${color.name} rengini göster`}
            className={cn(
              "variant-swatch relative size-10 shrink-0 overflow-hidden rounded-[7px] bg-[#fbf7f1] transition duration-200 sm:size-11 lg:size-12",
              selected
                ? "ring-2 ring-brand-red"
                : "ring-1 ring-[#eadfd5] hover:ring-[#2f2430]/35",
            )}
            onClick={(event) => handleSelect(event, color.id)}
            onPointerDown={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              draggable={false}
              className="pointer-events-none size-full max-w-none object-cover"
              style={{
                objectPosition: `${crop.x}% ${crop.y}%`,
                transform: `scale(${crop.scale})`,
                transformOrigin: `${crop.x}% ${crop.y}%`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
