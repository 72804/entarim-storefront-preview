"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";
import type { ProductColor } from "@/data/types";

type ProductVariantSwatchesProps = {
  colors: ProductColor[];
  selectedId: string;
  productName: string;
  onSelect: (id: string) => void;
};

export function ProductVariantSwatches({
  colors,
  selectedId,
  productName,
  onSelect,
}: ProductVariantSwatchesProps) {
  const handleSelect = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${productName} renk seçimi`}>
      {colors.map((color) => {
        const selected = color.id === selectedId;
        const preview = color.images[0];

        return (
          <button
            key={color.id}
            type="button"
            aria-pressed={selected}
            aria-label={`${color.name} rengini göster`}
            className={cn(
              "relative size-[30px] shrink-0 overflow-hidden rounded-[5px] bg-[#fbf7f1] transition duration-200 sm:size-9",
              selected
                ? "shadow-sm ring-2 ring-[#e21f27] ring-offset-1"
                : "ring-1 ring-[#eadfd5] hover:ring-[#2f2430]/35",
            )}
            onClick={(event) => handleSelect(event, color.id)}
            onPointerDown={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              className="size-full origin-center scale-[2.2] object-cover object-[50%_28%]"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
