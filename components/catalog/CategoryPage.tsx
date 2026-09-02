"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { homepageCategories, categoryMeta } from "@/data/navigation";
import type { CatalogProduct } from "@/data/types";

type SortId = "featured" | "price-asc" | "price-desc" | "name";

export function CategoryPage({ slug, products }: { slug: string; products: CatalogProduct[] }) {
  const meta = categoryMeta[slug];
  const [sort, setSort] = useState<SortId>("featured");
  const [color, setColor] = useState("all");

  const colors = useMemo(() => {
    const names = new Set<string>();
    products.forEach((product) => product.colors.forEach((item) => names.add(item.name)));
    return [...names];
  }, [products]);

  const visible = useMemo(() => {
    const filtered =
      color === "all"
        ? products
        : products.filter((product) => product.colors.some((item) => item.name === color));
    const copy = [...filtered];
    if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return copy;
  }, [color, products, sort]);

  if (slug === "kategoriler") {
    return <CategoryIndex />;
  }

  return (
    <main className="mx-auto w-[min(calc(100%-2rem),1360px)] pb-28 pt-8 lg:pb-16">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400" aria-label="Sayfa yolu">
        <Link className="hover:text-[#e21f27]" href="/">
          Ana Sayfa
        </Link>
        <ChevronRight size={14} />
        <span className="font-bold text-[#e21f27]">{meta?.title ?? slug}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold leading-none text-rose-950 sm:text-5xl">
          {meta?.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">{meta?.description}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 border-y border-[#eadfd5] py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          <strong className="text-[#2f2430]">{visible.length}</strong> ürün
        </p>
        <div className="flex flex-wrap gap-3">
          {colors.length > 1 ? (
            <label className="flex items-center gap-2 text-sm text-slate-500">
              Renk
              <select
                className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#2f2430] ring-1 ring-[#eadfd5]"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              >
                <option value="all">Tümü</option>
                {colors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="flex items-center gap-2 text-sm text-slate-500">
            Sırala
            <select
              className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#2f2430] ring-1 ring-[#eadfd5]"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
            >
              <option value="featured">Öne çıkanlar</option>
              <option value="price-asc">Fiyat: artan</option>
              <option value="price-desc">Fiyat: azalan</option>
              <option value="name">İsim</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={visible} />
      </div>
    </main>
  );
}

function CategoryIndex() {
  return (
    <main className="mx-auto w-[min(calc(100%-2rem),1360px)] pb-28 pt-8 lg:pb-16">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400" aria-label="Sayfa yolu">
        <Link className="hover:text-[#e21f27]" href="/">
          Ana Sayfa
        </Link>
        <ChevronRight size={14} />
        <span className="font-bold text-[#e21f27]">Kategoriler</span>
      </nav>
      <h1 className="font-display mt-6 text-4xl font-semibold text-rose-950 sm:text-5xl">Kategoriler</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
        Hamilelik döneminin her anına uyum sağlayan koleksiyonları keşfedin.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homepageCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group overflow-hidden rounded-[2rem] bg-white ring-1 ring-rose-100 transition hover:-translate-y-1"
          >
            <span className="relative block aspect-[5/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt=""
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
            </span>
            <span className="block px-5 py-5">
              <strong className="font-display text-2xl text-[#2f2430]">{category.title}</strong>
              <small className="mt-2 block text-sm leading-6 text-slate-500">{category.description}</small>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
