"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { CatalogProduct } from "@/data/types";

export function ProductCarousel({ products }: { products: CatalogProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    scroller.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button
          className="grid size-10 place-items-center rounded-full bg-white text-[#e21f27] shadow-sm ring-1 ring-[#eadfd5]"
          type="button"
          aria-label="Önceki"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="grid size-10 place-items-center rounded-full bg-white text-[#e21f27] shadow-sm ring-1 ring-[#eadfd5]"
          type="button"
          aria-label="Sonraki"
          onClick={() => scroll(1)}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={product.slug} className="w-[72%] max-w-[230px] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3rem)/4)] lg:max-w-none">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
