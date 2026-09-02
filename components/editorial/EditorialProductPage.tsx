"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ColorSwatches } from "@/components/product/ColorSwatches";
import { DemoToast } from "@/components/product/DemoToast";
import { ProductGallery } from "@/components/product/ProductGallery";
import { QuantityCart } from "@/components/product/QuantityCart";
import { SizeChartModal } from "@/components/product/SizeChartModal";
import { EditorialAccordion } from "@/components/editorial/EditorialAccordion";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { EditorialHeader } from "@/components/editorial/EditorialHeader";
import { EditorialRecommendations } from "@/components/editorial/EditorialRecommendations";
import { featuredProduct, getVariantImage } from "@/data/catalog";
import { product } from "@/data/product";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useEditorialProductState } from "@/hooks/useEditorialProductState";
import { formatPriceShort } from "@/lib/format";

export function EditorialProductPage() {
  const state = useEditorialProductState();
  const reduced = usePrefersReducedMotion();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const extraImages = collectEditorialImages(state.colorA.id, state.colorB.id, state.imageIndex);

  useEffect(() => {
    featuredProduct.colors.forEach((color) => {
      color.images.forEach((src) => {
        const image = new Image();
        image.src = src;
      });
    });
  }, []);

  const fade = reduced
    ? undefined
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: "easeOut" as const },
      };

  return (
    <div className="editorial-page min-h-screen bg-[#faf8f5] text-neutral-900">
      <EditorialHeader />

      <main>
        <section className="lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.48fr)]">
          <div className="pt-16 lg:pt-0">
            <ProductGallery
              leftColor={state.colorA}
              rightColor={state.colorB}
              imageIndex={state.imageIndex}
              onImageIndexChange={state.setImageIndex}
              productName={product.name}
              appearance="editorial"
              showThumbs={false}
              showArrows={false}
              compareEnabled={state.compareEnabled}
            />

            <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:px-6">
              {state.colorA.images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`${product.name} görsel ${index + 1}`}
                  aria-pressed={state.imageIndex === index}
                  className={`h-16 w-12 shrink-0 overflow-hidden ${
                    state.imageIndex === index ? "ring-1 ring-brand-red" : "ring-1 ring-transparent"
                  }`}
                  onClick={() => state.setImageIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>

            <div className="hidden lg:block">
              <EditorialImageGrid images={extraImages} productName={product.name} />
            </div>
          </div>

          <aside className="px-4 pb-16 pt-8 sm:px-8 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-start lg:overflow-y-auto lg:px-10 lg:pb-10 lg:pt-24">
            <motion.div {...fade}>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">
                Entarim · {product.category}
              </p>
              <h1 className="font-display mt-4 text-[42px] leading-[0.95] text-neutral-900 sm:text-5xl">
                Hamile Şifon
                <br />
                Elbise
              </h1>
              <p className="mt-6 text-lg text-neutral-800">{formatPriceShort(product.price)}</p>

              <div className="mt-10 grid gap-8">
                <ColorSwatches
                  colors={product.colors}
                  lastSelected={state.lastSelected}
                  comparedIds={state.comparedIds}
                  nextSlot={state.nextSlot}
                  onSelect={state.selectColor}
                  onPreview={state.previewColor}
                  appearance="editorial"
                  compareEnabled={state.compareEnabled}
                />
                <QuantityCart
                  quantity={state.quantity}
                  onQuantityChange={state.setQuantity}
                  onAddToCart={state.addToCart}
                  wishlist={state.wishlist}
                  onToggleWishlist={state.toggleWishlist}
                  appearance="editorial"
                />
              </div>

              <div className="mt-10">
                <EditorialAccordion
                  openId={openAccordion}
                  onChange={setOpenAccordion}
                  items={[
                    {
                      title: "ÜRÜN AÇIKLAMASI",
                      content: [
                        ...product.description,
                        "Mevcut bedenler",
                        product.sizes.join(" · "),
                      ],
                      extra: (
                        <button
                          type="button"
                          className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 transition duration-200 hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
                          onClick={() => state.setSizeChartOpen(true)}
                        >
                          Beden Tablosu
                        </button>
                      ),
                    },
                    {
                      title: "KARGO & TESLİMAT",
                      content: [
                        product.shipping.detail,
                        "Siparişler İstanbul Osmanbey’den hazırlanır.",
                      ],
                    },
                    {
                      title: "DEĞİŞİM & İADE",
                      content: [
                        product.exchange.detail,
                        "Beden uyumu için değişim desteği sunulur.",
                      ],
                    },
                    {
                      title: "BEDEN BİLGİSİ",
                      content: [
                        `Mevcut bedenler: ${product.sizes.join(" · ")}.`,
                        "Elbisenin boyu 100 cm olup içi astarlıdır.",
                      ],
                    },
                  ]}
                />
              </div>
            </motion.div>
          </aside>
        </section>

        <div className="lg:hidden">
          <EditorialImageGrid images={extraImages} productName={product.name} />
        </div>

        <EditorialRecommendations />
      </main>

      <EditorialFooter />
      <SizeChartModal open={state.sizeChartOpen} onClose={() => state.setSizeChartOpen(false)} />
      <DemoToast
        message={state.toast}
        onDismiss={() => state.setToast(null)}
        appearance="editorial"
      />
    </div>
  );
}

function EditorialImageGrid({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  if (images.length === 0) return null;

  return (
    <div className="grid gap-3 bg-[#faf8f5] py-3 lg:gap-4 lg:py-6">
      {images[0] ? (
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={`${productName} editorial görsel 1`} className="size-full object-cover object-center" loading="lazy" />
        </div>
      ) : null}
      {images[1] || images[2] ? (
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {images.slice(1, 3).map((src, index) => (
            <div key={src} className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${productName} editorial görsel ${index + 2}`} className="size-full object-cover object-center" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
      {images[3] ? (
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[3]} alt={`${productName} editorial görsel 4`} className="size-full object-cover object-center" loading="lazy" />
        </div>
      ) : null}
      {images[4] || images[5] ? (
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          {images.slice(4, 6).map((src, index) => (
            <div key={src} className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${productName} editorial görsel ${index + 5}`} className="size-full object-cover object-center" loading="lazy" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function collectEditorialImages(
  colorA: string,
  colorB: string,
  currentIndex: number,
) {
  const a = product.colors.find((color) => color.id === colorA);
  const b = product.colors.find((color) => color.id === colorB);
  if (!a || !b) return [];

  const extras: string[] = [];
  const max = Math.max(a.images.length, b.images.length);
  for (let index = 0; index < max; index += 1) {
    if (index === currentIndex) continue;
    extras.push(getVariantImage(a, index), getVariantImage(b, index));
  }
  return extras.slice(0, 6);
}
