"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { CatalogProduct } from "@/data/types";

export function ClassicRecommendations({ products }: { products: CatalogProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="related-products-title">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">Birlikte iyi gider</p>
          <h2 className="font-display mt-2 text-3xl font-semibold leading-none text-[#2f2430] sm:text-4xl" id="related-products-title">
            Benzer Ürünler
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            className="grid size-10 place-items-center rounded-full bg-white text-brand-red shadow-sm ring-1 ring-[#eadfd5]"
            type="button"
            aria-label="Önceki ürünler"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="grid size-10 place-items-center rounded-full bg-white text-brand-red shadow-sm ring-1 ring-[#eadfd5]"
            type="button"
            aria-label="Sonraki ürünler"
            onClick={() => scroll(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item) => (
          <div key={item.slug} className="w-[72%] max-w-[230px] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-4rem)/5)] lg:max-w-none">
            <ProductCard product={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
