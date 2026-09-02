import Image from "next/image";
import Link from "next/link";

const concepts = [
  {
    href: "/p/entarim-classic-8f31c2",
    title: "Mevcut Tasarım + Geliştirmeler",
    subtitle: "Mevcut Entarim tasarımını koruyarak geliştirilmiş ürün deneyimi",
    description:
      "Mevcut web sitesi yapısı ve görsel dili korunarak; ürün görseli yakınlaştırma, renk karşılaştırma ve kullanıcı deneyimi geliştirmeleri eklenmiştir.",
    image: "/demo-assets/product/haki/01.jpg",
    imageAlt: "Mevcut Entarim tasarımı üzerinde ürün önizlemesi",
    appearance: "classic" as const,
  },
  {
    href: "/p/entarim-editorial-4d72ab",
    title: "Yeni Tasarım Konsepti",
    subtitle: "Entarim için hazırlanan daha modern ve premium bir alternatif",
    description:
      "Moda odaklı, daha sade ve görsel ağırlıklı bir alışveriş deneyimi için hazırlanan özgün tasarım yaklaşımı.",
    image: "/demo-assets/product/petrol/01.jpg",
    imageAlt: "Yeni Entarim tasarım konsepti ürün önizlemesi",
    appearance: "editorial" as const,
  },
];

export function PresentationHome() {
  return (
    <div className="presentation-page min-h-screen bg-[#fbf7f1] text-[#2f2430]">
      <main className="mx-auto flex min-h-screen max-w-[1120px] flex-col px-6 py-16 sm:px-10 sm:py-24 lg:py-28">
        <header className="presentation-enter mx-auto max-w-2xl text-center">
          <Link
            href="/"
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2f2430]/40 transition hover:text-brand-red"
          >
            Mağazaya dön
          </Link>
          <h1 className="font-display mt-5 text-[42px] font-medium leading-none tracking-[0.08em] sm:text-6xl">
            Entarim
          </h1>
          <p className="font-display mt-5 text-2xl font-medium tracking-[0.04em] text-[#2f2430]/80 sm:text-[32px]">
            Tasarım Önizlemeleri
          </p>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-7 text-[#2f2430]/55">
            Sizin için hazırlanan iki farklı yaklaşımı inceleyebilirsiniz.
          </p>
        </header>

        <p className="presentation-enter presentation-enter-delay-1 mx-auto mt-10 max-w-lg text-center text-[13px] leading-6 text-[#2f2430]/40">
          Her iki tasarımda da ürün görsellerini yakınlaştırabilir ve farklı
          renkleri aynı görsel üzerinde karşılaştırabilirsiniz.
        </p>

        <section
          className="mt-14 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 md:gap-8 lg:gap-12"
          aria-label="Tasarım seçenekleri"
        >
          {concepts.map((concept, index) => (
            <Link
              key={concept.href}
              href={concept.href}
              className={`presentation-enter ${index === 0 ? "presentation-enter-delay-2" : "presentation-enter-delay-3"} group block text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red`}
            >
              <article className="border border-[#eadfd5] bg-[#fbf7f1] transition-[border-color,box-shadow] duration-300 ease-out group-hover:border-[#2f2430]/18 group-hover:shadow-[0_10px_30px_rgba(47,36,48,0.04)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5ede4]">
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={concept.image}
                      alt={concept.imageAlt}
                      fill
                      preload={index === 0}
                      className="object-cover object-[center_18%] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  {concept.appearance === "classic" ? (
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center border-b border-[#eadfd5] bg-white px-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/demo-assets/brand/logo.png"
                        alt=""
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="pointer-events-none absolute inset-x-0 top-0 flex h-14 items-center justify-center">
                      <span className="font-display text-xl tracking-[0.28em] text-neutral-900 sm:text-2xl">
                        ENTARİM
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-6 py-7 sm:px-7 sm:py-8">
                  <h2 className="font-display text-[28px] leading-tight tracking-[0.01em]">
                    {concept.title}
                  </h2>
                  <p className="mt-3 text-[13px] leading-6 text-[#2f2430]/55">
                    {concept.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#2f2430]/70">
                    {concept.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">
                    Tasarımı İncele
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </section>

        <p className="presentation-enter presentation-enter-delay-4 mx-auto mt-16 max-w-md text-center text-[12px] leading-6 text-[#2f2430]/38 sm:mt-20">
          Tasarımı incelerken ürün görseline tıklayarak yakınlaştırmayı ve renk
          seçeneklerini değiştirerek karşılaştırma özelliğini deneyebilirsiniz.
        </p>
      </main>
    </div>
  );
}
