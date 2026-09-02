"use client";

import Link from "next/link";
import { featuredProduct, relatedProductsFor } from "@/data/catalog";
import { formatPriceShort } from "@/lib/format";

export function EditorialRecommendations() {
  const items = relatedProductsFor(featuredProduct).slice(0, 4);

  return (
    <section className="px-4 py-20 sm:px-8 lg:px-12" aria-labelledby="editorial-related">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
        Sizin için seçtik
      </p>
      <h2
        id="editorial-related"
        className="font-display mt-3 text-3xl text-neutral-900 sm:text-4xl"
      >
        Benzer parçalar
      </h2>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={item.slug} href={`/${item.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.colors[0]?.images[0]}
                alt={item.name}
                className="size-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
              {item.colors[0]?.images[1] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.colors[0].images[1]}
                  alt=""
                  className="absolute inset-0 size-full object-cover object-center opacity-0 transition duration-500 ease-out group-hover:opacity-100"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="mt-4">
              <p className="text-sm text-neutral-800">{item.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{formatPriceShort(item.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
