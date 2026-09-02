"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { ClassicHeader, ClassicMobileNav } from "@/components/classic/ClassicHeader";
import { ClassicRecommendations } from "@/components/classic/ClassicRecommendations";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { DemoToast } from "@/components/product/DemoToast";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuantityCart } from "@/components/product/QuantityCart";
import { SizeChartModal } from "@/components/product/SizeChartModal";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { featuredProduct, relatedProductsFor, type CatalogProduct } from "@/data/catalog";
import { useProductState } from "@/hooks/useProductState";
import { formatPrice } from "@/lib/format";

export function ClassicProductPage({ product = featuredProduct }: { product?: CatalogProduct }) {
  const state = useProductState(product);

  useEffect(() => {
    const preload = [
      ...product.colors.map((color) => color.images[0]),
      state.currentSrc,
    ];
    preload.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [product, state.currentSrc]);

  return (
    <div className="classic-page min-h-screen bg-[#fbf7f1] text-[#2f2430]">
      <ClassicHeader />
      <main className="site-main mx-auto w-[min(calc(100%-2rem),1360px)] pb-28 lg:pb-8">
        <section className="py-7 sm:py-9">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400" aria-label="Sayfa yolu">
            <Link className="transition duration-200 hover:text-[#e21f27]" href="/">
              Ana Sayfa
            </Link>
            <ChevronRight size={14} />
            <Link className="transition duration-200 hover:text-[#e21f27]" href={`/${product.categorySlug}`}>
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="font-bold text-[#e21f27]">{product.name}</span>
          </nav>
        </section>

        <section className="grid gap-10 pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="lg:sticky lg:top-5 lg:self-start">
            <ProductGallery
              color={state.selectedColor}
              imageIndex={state.imageIndex}
              onImageIndexChange={state.setImageIndex}
              productName={product.name}
              appearance="classic"
            />
          </div>

          <div className="lg:pt-4">
            <span className="inline-flex rounded-full bg-[#fbf7f1] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#e21f27] ring-1 ring-[#eadfd5]">
              ENTARİM
            </span>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-none text-[#2f2430] sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">{product.category}</p>
            <div className="mt-6 flex items-end gap-3">
              <strong className="text-3xl font-extrabold text-[#e21f27]">{formatPrice(product.price)}</strong>
              {product.oldPrice ? (
                <del className="text-base text-slate-400">{formatPrice(product.oldPrice)}</del>
              ) : null}
            </div>

            <div className="mt-8 grid gap-6">
              <ColorSwatches
                colors={product.colors}
                lastSelected={state.lastSelected}
                onSelect={state.selectColor}
              />
              <QuantityCart
                quantity={state.quantity}
                onQuantityChange={state.setQuantity}
                onAddToCart={state.addToCart}
                wishlist={state.wishlist}
                onToggleWishlist={state.toggleWishlist}
              />
            </div>

            <section className="mt-6 rounded-[2rem] bg-white p-5 ring-1 ring-[#eadfd5]">
              <h2 className="text-base font-extrabold text-[#2f2430]">Ürün Açıklaması</h2>
              <ul className="mt-3 grid gap-3 text-sm leading-7 text-slate-500">
                {product.description.map((line) => (
                  <li key={line} className="rounded-2xl border border-[#eadfd5] bg-[#fbf7f1] px-4 py-3">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-[#eadfd5] pt-4 text-sm text-slate-500">
                <p>
                  <span className="font-bold text-[#2f2430]">Mevcut Bedenler: </span>
                  {product.sizes.join(" · ")}
                </p>
                <button
                  type="button"
                  className="text-xs font-bold text-[#e21f27] transition duration-200 hover:text-[#b9141b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e21f27]"
                  onClick={() => state.setSizeChartOpen(true)}
                >
                  Beden Tablosu
                </button>
              </div>
            </section>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Benefit icon={<Truck size={20} />} title="Ücretsiz Kargo" detail="2.500 TL ve üzeri alışverişlerde ücretsiz kargo." />
              <Benefit icon={<RefreshCw size={20} />} title="Kolay Değişim" detail="Beden desteği." />
              <Benefit icon={<ShieldCheck size={20} />} title="Güvenli Ödeme" detail="SSL korumalı." />
            </div>
          </div>
        </section>

        <ClassicRecommendations products={relatedProductsFor(product)} />
      </main>
      <StorefrontFooter />
      <ClassicMobileNav />
      <SizeChartModal open={state.sizeChartOpen} onClose={() => state.setSizeChartOpen(false)} />
      <DemoToast message={state.toast} onDismiss={() => state.setToast(null)} />
    </div>
  );
}

function Benefit({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-[#eadfd5] transition duration-200 hover:-translate-y-0.5">
      <div className="text-[#e21f27]">{icon}</div>
      <strong className="mt-3 block text-sm text-[#2f2430]">{title}</strong>
      <small className="mt-1 block leading-5 text-slate-500">{detail}</small>
    </div>
  );
}
