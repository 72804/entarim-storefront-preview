"use client";

import { useLayoutEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Gift,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { searchProducts } from "@/data/catalog";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useHeaderAtTop } from "@/hooks/useHeaderAtTop";
import { useStore } from "@/store/StoreProvider";

const iconMap = {
  sparkle: Sparkles,
  heart: Heart,
  shirt: Shirt,
  gift: Gift,
  sparkle2: Sparkles,
};

export function StorefrontHeader({ hideOnScroll = false }: { hideOnScroll?: boolean }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = useHeaderAtTop();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const router = useRouter();
  const { cartCount, cartTotal } = useStore();
  const results = useMemo(() => (query.trim().length >= 2 ? searchProducts(query).slice(0, 6) : []), [query]);

  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const update = () => setHeaderHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    setQuery("");
    router.push(`/arama?q=${encodeURIComponent(q)}`);
  };

  const headerVisible = hideOnScroll ? visible : true;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          hideOnScroll
            ? "classic-site-header fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.04)]"
            : "site-header sticky top-0 z-50 bg-white shadow-[0_2px_14px_rgba(15,23,42,0.04)]",
          hideOnScroll && !headerVisible && "is-away",
        )}
        aria-hidden={hideOnScroll ? !headerVisible : undefined}
      >
        <div className="relative overflow-hidden bg-[#fbf7f1] text-[#2f2430] ring-1 ring-[#eadfd5]">
          <div className="announcement-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="mx-auto flex min-h-10 w-full max-w-[1392px] items-center justify-center gap-3 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[#e21f27] ring-1 ring-[#eadfd5]">
              <Sparkles size={12} />
            </span>
            <p>
              <span className="font-extrabold text-[#2f2430]">Anne adaylarına özel:</span>{" "}
              2.500 TL ve üzeri alışverişlerde ücretsiz kargo.
            </p>
            <Link
              className="hidden rounded-full bg-[#e21f27] px-3 py-1 text-[11px] font-bold text-white transition duration-200 hover:bg-[#b9141b] sm:inline-flex"
              href="/kategoriler"
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1392px] px-4">
          <div className="flex min-h-20 flex-wrap items-center gap-x-3 gap-y-4 py-4 sm:gap-x-6 sm:py-5 md:grid md:grid-cols-[1fr_minmax(280px,36rem)_1fr]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid size-10 place-items-center rounded-full text-[#2f2430] lg:hidden"
                aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
                onClick={() => setMenuOpen((value) => !value)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link className="flex shrink-0 items-center" href="/" aria-label="Entarim Hamile Giyim ana sayfa">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-8 w-auto object-contain sm:h-10"
                  src="/entarim/logo/logo.png"
                  alt="Entarim Hamile Giyim"
                />
              </Link>
            </div>

            <form
              className="relative order-last w-full md:order-none md:justify-self-center"
              role="search"
              onSubmit={onSearch}
            >
              <div className="flex h-11 w-full items-center rounded-xl border border-rose-100 bg-rose-50/60 transition duration-200 focus-within:border-rose-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-50">
                <label className="sr-only" htmlFor="header-search-input">
                  Ürün ara
                </label>
                <input
                  className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  id="header-search-input"
                  name="q"
                  type="search"
                  placeholder="Ürün veya kategori ara..."
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button
                  className="grid size-10 shrink-0 place-items-center text-[#e21f27] transition duration-200 hover:text-[#b9141b]"
                  type="submit"
                  aria-label="Ara"
                >
                  <Search size={18} />
                </button>
              </div>
              {results.length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-[#eadfd5]">
                  {results.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/${product.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#fbf7f1]"
                      onClick={() => setQuery("")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.colors[0]?.images[0]}
                        alt=""
                        className="size-12 rounded-xl object-cover"
                      />
                      <span className="min-w-0">
                        <strong className="block truncate text-[#2f2430]">{product.name}</strong>
                        <small className="text-slate-500">{formatPrice(product.price)}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-4 md:ml-0 md:justify-self-end">
              <Link className="group flex items-center gap-2.5 text-slate-700" href="/giris-yap">
                <span className="grid size-9 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27] transition duration-200 group-hover:bg-[#e21f27] group-hover:text-white sm:size-10">
                  <User size={18} />
                </span>
                <span className="hidden leading-tight xl:grid">
                  <small className="text-[11px] text-slate-500">Hesabım</small>
                  <strong className="mt-0.5 text-[13px] font-bold">Giriş Yap</strong>
                </span>
              </Link>
              <Link className="group flex items-center gap-2.5 text-slate-700" href="/sepet">
                <span className="relative grid size-9 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27] transition duration-200 group-hover:bg-[#e21f27] group-hover:text-white sm:size-10">
                  <ShoppingBag size={18} />
                  <span className="absolute -right-1 -top-1 grid size-[18px] place-items-center rounded-full border-2 border-white bg-[#e21f27] text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                </span>
                <span className="hidden leading-tight xl:grid">
                  <small className="text-[11px] text-slate-500">Sepetim</small>
                  <strong className="mt-0.5 text-[13px] font-bold">{formatPrice(cartTotal)}</strong>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <nav
          className="relative z-40 border-t border-[#eadfd5] bg-gradient-to-r from-[#fbf7f1] via-white to-[#fbf7f1]"
          aria-label="Ürün kategorileri"
        >
          <div className="relative mx-auto w-full max-w-[1392px] px-4">
            <ul className="hidden py-3 lg:flex lg:items-center lg:justify-center lg:gap-2">
              {navItems.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <li key={item.label} className="group relative">
                    <Link
                      className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[#2f2430] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-[#e21f27] hover:ring-1 hover:ring-[#eadfd5]"
                      href={item.href}
                    >
                      <Icon size={16} />
                      {item.label}
                      {item.children ? (
                        <ChevronDown size={16} className="transition duration-200 group-hover:rotate-180" />
                      ) : null}
                    </Link>
                    {item.children ? (
                      <div className="invisible absolute left-1/2 top-full z-30 mt-4 grid w-[560px] -translate-x-1/2 translate-y-3 grid-cols-[1.15fr_0.85fr] gap-2 rounded-2xl bg-white p-5 opacity-0 ring-1 ring-[#eadfd5] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="relative grid gap-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              className="flex gap-3 rounded-xl p-3 transition duration-200 hover:bg-[#fbf7f1]"
                              href={child.href}
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27]">
                                <Icon size={18} />
                              </span>
                              <span>
                                <strong className="block text-sm text-slate-800">{child.label}</strong>
                                <small className="mt-1 block text-xs leading-5 text-slate-500">
                                  {child.detail}
                                </small>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#fbf7f1] via-white to-[#f5ede4] p-5 ring-1 ring-[#eadfd5] transition duration-200 hover:-translate-y-0.5"
                          href={item.href}
                        >
                          <span className="mb-10 inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#e21f27]">
                            Koleksiyon
                          </span>
                          <strong className="block text-lg leading-snug text-[#2f2430]">
                            {item.label} kategorisini keşfet
                          </strong>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#e21f27]">
                            Koleksiyonu İncele
                          </span>
                        </Link>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {menuOpen ? (
              <ul className="grid gap-1 py-3 lg:hidden">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-[#2f2430] hover:bg-[#fbf7f1]"
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      <ChevronDown size={16} className="-rotate-90" />
                    </Link>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        className="block px-5 py-2 text-sm text-slate-500 hover:text-[#e21f27]"
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </nav>
      </header>
      {hideOnScroll ? <div style={{ height: headerHeight }} aria-hidden="true" /> : null}
    </>
  );
}

export function ClassicHeader() {
  return <StorefrontHeader hideOnScroll />;
}

export function ClassicMobileNav() {
  const { cartCount } = useStore();
  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-50 rounded-[1.5rem] bg-white/95 px-2 py-2 shadow-2xl shadow-[#2f2430]/10 ring-1 ring-[#eadfd5] backdrop-blur lg:hidden"
      aria-label="Mobil hızlı menü"
    >
      <ul className="grid grid-cols-5 gap-1">
        <MobileItem href="/" label="Ana Sayfa" icon={<Home size={20} />} />
        <MobileItem href="/kategoriler" label="Kategori" icon={<LayoutGrid size={20} />} />
        <li>
          <Link
            className="-mt-5 flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-extrabold text-[#2f2430]"
            href="/arama"
          >
            <span className="grid size-12 place-items-center rounded-full bg-[#e21f27] text-white shadow-lg shadow-[#e21f27]/20 ring-4 ring-white">
              <Search size={22} />
            </span>
            Ara
          </Link>
        </li>
        <MobileItem href="/giris-yap" label="Hesabım" icon={<User size={20} />} />
        <MobileItem
          href="/sepet"
          label="Sepet"
          icon={
            <span className="relative">
              <ShoppingBag size={20} />
              <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[#e21f27] text-[8px] font-black text-white">
                {cartCount}
              </span>
            </span>
          }
        />
      </ul>
    </nav>
  );
}

function MobileItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <li>
      <Link
        className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-extrabold text-slate-500 transition duration-200 hover:bg-[#fbf7f1] hover:text-[#e21f27]"
        href={href}
      >
        <span className="text-[#e21f27]">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
