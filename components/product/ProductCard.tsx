"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { CatalogProduct } from "@/data/types";
import { useStore } from "@/store/StoreProvider";
import { ProductVariantSwatches } from "@/components/product/ProductVariantSwatches";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const { isFavorite, toggleFavorite } = useStore();
  const favorited = isFavorite(product.slug);
  const variantColors = useMemo(
    () => product.colors.filter((color) => Boolean(color.images[0])),
    [product.colors],
  );
  const defaultColor = variantColors[0];
  const [selectedId, setSelectedId] = useState(defaultColor?.id ?? "");
  const selectedColor = variantColors.find((color) => color.id === selectedId) ?? defaultColor;
  const image = selectedColor?.images[0];
  const hoverImage = selectedColor?.images[1] ?? image;
  const showSwatches = variantColors.length > 1;

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-sm ring-1 ring-rose-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-rose-950/10">
        <button
          className={cn(
            "absolute right-5 top-5 z-20 grid size-9 place-items-center rounded-full text-lg shadow-sm ring-1 transition",
            favorited
              ? "bg-[#e21f27] text-white ring-[#e21f27]"
              : "bg-white text-rose-800 ring-rose-100 hover:bg-rose-50",
          )}
          type="button"
          aria-pressed={favorited}
          aria-label={`${product.name} ürününü ${favorited ? "favorilerden çıkar" : "favorilere ekle"}`}
          onClick={() => toggleFavorite(product.slug)}
        >
          <Heart size={16} fill={favorited ? "currentColor" : "none"} />
        </button>
        <Link
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.35rem] bg-[#fbf7f1]"
          href={`/${product.slug}`}
        >
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-rose-800 shadow-sm">
            ENTARİM
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="size-full scale-[1.14] object-cover object-center transition duration-500 group-hover:scale-[1.2] group-hover:opacity-0"
            src={image}
            alt={product.name}
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-0 size-full scale-[1.14] object-cover object-center opacity-0 transition duration-500 group-hover:scale-[1.2] group-hover:opacity-100"
            src={hoverImage}
            alt=""
            loading="lazy"
          />
          <span className="absolute inset-x-3 bottom-3 translate-y-16 rounded-full bg-rose-900 px-4 py-3 text-center text-xs font-bold text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ürünü İncele
          </span>
        </Link>
      </div>
      <div className="px-1 pt-4">
        {showSwatches && selectedColor ? (
          <div className="mb-3">
            <ProductVariantSwatches
              colors={variantColors}
              selectedId={selectedColor.id}
              productName={product.name}
              onSelect={setSelectedId}
            />
          </div>
        ) : null}
        <div>
          <Link
            className="text-sm font-bold text-slate-800 transition hover:text-rose-800 sm:text-[15px]"
            href={`/${product.slug}`}
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-slate-500">{product.category}</p>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <strong className="text-base font-extrabold text-rose-900">{formatPrice(product.price)}</strong>
          {product.oldPrice ? (
            <del className="text-xs text-slate-400">{formatPrice(product.oldPrice)}</del>
          ) : null}
        </div>
      </div>
    </article>
  );
}
