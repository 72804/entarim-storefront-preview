"use client";

import { cn } from "@/lib/cn";
import type { ProductColor } from "@/data/types";

type ColorSwatchesProps = {
  colors: ProductColor[];
  lastSelected: string;
  onSelect: (id: string) => void;
  comparedIds?: Set<string>;
  nextSlot?: "A" | "B";
  onPreview?: (id: string | null) => void;
  appearance?: "classic" | "editorial";
  compareEnabled?: boolean;
};

export function ColorSwatches({
  colors,
  lastSelected,
  comparedIds,
  nextSlot = "A",
  onSelect,
  onPreview,
  appearance = "classic",
  compareEnabled = false,
}: ColorSwatchesProps) {
  const editorial = appearance === "editorial";

  return (
    <fieldset>
      <legend
        className={cn(
          editorial
            ? "text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500"
            : "text-sm font-extrabold text-[#2f2430]",
        )}
      >
        {editorial ? "Renk" : "Renk Seçimi"}
      </legend>
      <div className={cn("mt-3 flex flex-wrap", editorial ? "gap-2" : "gap-3")}>
        {colors.map((color) => {
          const selected = lastSelected === color.id;
          const compared = comparedIds?.has(color.id) ?? false;
          const nextTarget = nextSlot === "A" ? "sol" : "sağ";

          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={selected}
              aria-label={
                compareEnabled
                  ? `${color.name}${compared ? `, karşılaştırmada ${color.id === [...(comparedIds ?? [])][0] ? "sol" : "sağ"}` : ""}. Sonraki seçim ${nextTarget} görseli günceller.`
                  : color.name
              }
              className={cn(
                "group cursor-pointer text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e21f27]",
                editorial
                  ? "rounded-none"
                  : "rounded-2xl hover:-translate-y-0.5 hover:shadow-sm",
                selected
                  ? editorial
                    ? "ring-1 ring-[#e21f27]"
                    : "ring-2 ring-[#e21f27]"
                  : compared
                    ? editorial
                      ? "ring-1 ring-neutral-400"
                      : "ring-1 ring-[#2f2430]/25"
                    : editorial
                      ? "ring-1 ring-neutral-200"
                      : "ring-1 ring-[#eadfd5]",
              )}
              onClick={() => onSelect(color.id)}
              onMouseEnter={() => onPreview?.(color.id)}
              onMouseLeave={() => onPreview?.(null)}
              onFocus={() => onPreview?.(color.id)}
              onBlur={() => onPreview?.(null)}
            >
              <span
                className={cn(
                  "flex items-center gap-2 bg-white",
                  editorial ? "p-1 pr-2.5" : "rounded-2xl p-1.5 pr-3",
                )}
              >
                <span
                  className={cn(
                    "relative size-12 overflow-hidden bg-[#fbf7f1]",
                    editorial ? "rounded-none" : "rounded-xl ring-1 ring-[#eadfd5]",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={color.images[0]}
                    alt=""
                    width={96}
                    height={96}
                    className="size-full object-cover object-center"
                  />
                  {compared && !selected ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#2f2430]/40" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "max-w-24 truncate text-xs",
                    editorial
                      ? "font-medium tracking-[0.04em] text-neutral-700"
                      : "font-bold text-slate-600",
                  )}
                >
                  {color.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
