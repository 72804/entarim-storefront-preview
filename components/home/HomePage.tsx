"use client";

import Link from "next/link";
import { ArrowRight, Heart, Leaf, RefreshCw, Sparkles, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { homepageNewArrivalSlugs, productsBySlugs } from "@/data/catalog";
import { homepageCategories } from "@/data/navigation";

export function HomePage() {
  const arrivals = productsBySlugs(homepageNewArrivalSlugs);

  return (
    <main className="site-main pb-24 lg:pb-8">
      <section className="hero-full-bleed relative overflow-hidden bg-gradient-to-br from-white via-[#fbf7f1] to-white px-4 pb-10 pt-6 lg:hidden">
        <div className="relative mx-auto max-w-md text-center">
          <div className="relative mx-auto w-full">
            <div className="absolute inset-x-5 bottom-0 top-8 rounded-[2rem] bg-[#f5ede4]/70" />
            <div className="relative rounded-[1.75rem] bg-white p-3 ring-1 ring-[#eadfd5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="aspect-[16/14] size-full rounded-[1.35rem] object-cover object-top"
                src="/entarim/homepage/hamile-elbise-belmando.jpg"
                alt="Hamilelik stilinizi, konforla buluşturan zarif giysiler"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-rose-800 ring-1 ring-[#eadfd5]">
              <Truck size={16} />
              Ücretsiz kargo fırsatı
            </div>
          </div>
          <div className="mt-10 grid gap-3">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-6 py-3 text-sm font-bold text-white"
              href="/yeni-sezon"
            >
              Koleksiyonu İncele <ArrowRight size={16} />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-900 ring-1 ring-rose-100"
              href="/hamile-elbise"
            >
              Hamile Elbiseleri <Heart size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="hero-full-bleed relative hidden overflow-hidden bg-gradient-to-br from-white via-[#fbf7f1] to-white pb-12 pt-8 sm:pb-16 sm:pt-12 lg:block lg:pb-20 lg:pt-16">
        <div className="relative mx-auto grid w-full max-w-[1360px] items-center gap-9 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 ring-1 ring-[#eadfd5] sm:text-xs sm:tracking-[0.2em]">
              <Sparkles size={16} className="text-[#e21f27]" />
              Yeni Sezon -Anne Adaylarının Koleksiyonu!..
            </span>
            <p className="font-display mt-6 text-4xl italic text-slate-800">
              Yeni yolculuğunuza; zarif bir dokunuş!..
            </p>
            <h1 className="font-display mx-auto mt-6 max-w-[11ch] text-5xl font-semibold leading-[0.98] tracking-tight text-rose-950 sm:mt-7 sm:max-w-none sm:text-6xl lg:mx-0 lg:text-7xl">
              Hamilelik stilinizi, konforla buluşturan zarif giysiler!..
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-slate-500 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
              Günlük elbiselerden; emzirme dostu tasarımlara! Yumuşak, dökümlü, esnek kumaşlarla hamileliğin her
              dönemine uygun şık ve kullanışlı stiliyle ENTARİM Hamile giyim koleksiyonunu keşfet!
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-700"
                href="/yeni-sezon"
              >
                Koleksiyonu İncele <ArrowRight size={16} />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-rose-900 ring-1 ring-rose-100 transition hover:-translate-y-0.5"
                href="/hamile-elbise"
              >
                Hamile Elbiseleri <Heart size={16} />
              </Link>
            </div>
            <div className="mx-auto mt-8 grid max-w-md gap-3 text-left text-sm text-slate-500 sm:mt-9 sm:max-w-none sm:grid-cols-3 lg:mx-0">
              <HeroPerk icon={<Truck size={16} />} label="Ücretsiz kargo fırsatı" />
              <HeroPerk icon={<RefreshCw size={16} />} label="Kolay değişim" />
              <HeroPerk icon={<Leaf size={16} />} label="Yumuşak kumaşlar" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-none">
            <div className="absolute inset-x-5 bottom-3 top-8 rounded-[2.5rem] bg-[#f5ede4]" />
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 ring-1 ring-[#eadfd5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="aspect-[4/5] size-full rounded-[1.5rem] object-cover object-top"
                src="/entarim/homepage/hamile-elbise-belmando.jpg"
                alt="Hamilelik stilinizi, konforla buluşturan zarif giysiler"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-2rem),1360px)] py-16 sm:py-20" aria-labelledby="new-products-title">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-600">İlk sen keşfet</p>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-none text-rose-950 sm:text-4xl" id="new-products-title">
              Yeni Gelenler:
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Yeni sezondan konforlu, zarif ve her döneme uyum sağlayan, favori parçalar.
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-rose-900 shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-0.5"
            href="/yeni-sezon"
          >
            Tümünü Gör <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={arrivals} />
      </section>

      <section className="mx-auto w-[min(calc(100%-2rem),1360px)] pb-16 sm:pb-20" aria-labelledby="categories-title">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-600">Tarzına göre seç,</p>
            <h2 className="font-display mt-2 text-3xl font-semibold leading-none text-rose-950 sm:text-4xl" id="categories-title">
              Tarzına Göre Keşfet.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Hamilelik döneminin, her anına uyum sağlayan kategorileri; keşfet!...
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-rose-900 shadow-sm ring-1 ring-rose-100"
            href="/kategoriler"
          >
            Kategoriler <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {homepageCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={
                category.featured
                  ? "group relative min-h-64 overflow-hidden rounded-[2rem] bg-[#fbf7f1] p-4 ring-1 ring-rose-100 transition duration-300 hover:-translate-y-1 lg:col-span-2 lg:row-span-2 lg:min-h-[430px]"
                  : "group relative min-h-52 overflow-hidden rounded-[2rem] bg-[#fbf7f1] p-4 ring-1 ring-rose-100 transition duration-300 hover:-translate-y-1"
              }
            >
              <span className="absolute inset-0 overflow-hidden rounded-[2rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="category-card-image absolute right-0 top-0 h-full w-[72%] scale-[1.28] object-cover object-center opacity-95 transition duration-700 group-hover:scale-[1.34]"
                  src={category.image}
                  alt=""
                />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#2f2430]/72 via-[#2f2430]/30 to-transparent" />
              <span className="relative z-10 inline-flex rounded-full bg-white/90 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-rose-800">
                {category.badge}
              </span>
              <span className="absolute bottom-5 left-5 right-5 z-10">
                <strong className="font-display block text-3xl font-semibold leading-none text-white lg:text-4xl">
                  {category.title}
                </strong>
                <small className="mt-3 block max-w-xs text-sm leading-6 text-white/85">{category.description}</small>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-rose-900">
                  Keşfet <ArrowRight size={14} />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-rose-900 py-10 text-white sm:py-12">
        <div className="mx-auto w-[min(calc(100%-2rem),1360px)] text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">Haftanın fırsatı</p>
          <h2 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">
            2.500 TL ve üzeri alışverişlerde ücretsiz kargo.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80">
            Yeni sezon! Hamile giyim koleksiyonunda zarif ve konforlu giysileri keşfet!
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-rose-900"
            href="/yeni-sezon"
          >
            Koleksiyonu İncele <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeroPerk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/75 p-3 ring-1 ring-white/80">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700">{icon}</span>
      {label}
    </div>
  );
}
