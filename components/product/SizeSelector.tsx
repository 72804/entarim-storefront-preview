"use client";

import { cn } from "@/lib/cn";
import { product } from "@/data/product";

type SizeSelectorProps = {
  value: string;
  onChange: (size: string) => void;
  onOpenChart?: () => void;
  appearance?: "classic" | "editorial";
};

export function SizeSelector({
  value,
  onChange,
  onOpenChart,
  appearance = "classic",
}: SizeSelectorProps) {
  const editorial = appearance === "editorial";

  return (
    <fieldset>
      <div className="flex items-center justify-between gap-4">
        <legend
          className={cn(
            editorial
              ? "text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500"
              : "text-sm font-extrabold text-[#2f2430]",
          )}
        >
          {editorial ? "Beden" : "Beden Seçimi"}
        </legend>
        {onOpenChart ? (
          <button
            type="button"
            className={cn(
              "text-xs transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
              editorial
                ? "font-medium uppercase tracking-[0.16em] text-neutral-500 hover:text-brand-red"
                : "font-bold text-brand-red hover:text-brand-red-dark",
            )}
            onClick={onOpenChart}
          >
            Beden Tablosu
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-3 grid grid-cols-5 gap-2",
          editorial ? "max-w-none" : "sm:max-w-md",
        )}
      >
        {product.sizes.map((size) => {
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={selected}
              className={cn(
                "grid h-11 place-items-center text-sm transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                editorial
                  ? selected
                    ? "border border-brand-red bg-brand-red font-medium text-white"
                    : "border border-neutral-300 bg-transparent font-medium text-neutral-800 hover:border-neutral-800"
                  : selected
                    ? "rounded-xl bg-brand-red font-bold text-white ring-1 ring-brand-red"
                    : "rounded-xl bg-white font-bold text-slate-600 ring-1 ring-[#eadfd5] hover:ring-[#d5c6bb]",
              )}
              onClick={() => onChange(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
