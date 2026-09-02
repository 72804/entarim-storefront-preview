"use client";

import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { navItems } from "@/data/navigation";

const SCROLL_DISTANCE = 120;

export function EditorialHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;

    let frame = 0;
    const apply = () => {
      const progress =
        open || searchOpen
          ? 1
          : Math.min(1, Math.max(0, window.scrollY / SCROLL_DISTANCE));
      node.style.setProperty("--header-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open, searchOpen]);

  return (
    <header
      ref={headerRef}
      className="editorial-site-header fixed inset-x-0 top-0 z-50 text-neutral-900"
    >
      <div className="grid h-16 grid-cols-3 items-center px-4 sm:h-[72px] sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-[11px] font-medium uppercase tracking-[0.22em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            aria-expanded={open}
            aria-label="Menü"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <span className="hidden sm:inline">Menü</span>}
            <span className="sm:hidden">
              {open ? null : <Menu size={18} />}
            </span>
          </button>
        </div>

        <Link
          href="/concept/editorial"
          className="justify-self-center font-display text-2xl tracking-[0.28em] text-neutral-900 sm:text-[28px]"
          aria-label="Entarim editorial konsept"
        >
          ENTARİM
        </Link>

        <div className="flex items-center justify-end gap-4 sm:gap-6">
          <button
            type="button"
            className="text-[11px] font-medium uppercase tracking-[0.22em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            aria-label="Ara"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <span className="hidden sm:inline">Ara</span>
            <Search size={16} className="sm:hidden" />
          </button>
          <Link
            href="/giris-yap"
            className="hidden text-[11px] font-medium uppercase tracking-[0.22em] sm:inline"
          >
            Hesap
          </Link>
          <Link href="/giris-yap" className="sm:hidden" aria-label="Hesap">
            <User size={16} />
          </Link>
          <Link
            href="/sepet"
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
            aria-label="Sepet"
          >
            <span className="hidden sm:inline">Sepet</span>
            <ShoppingBag size={16} className="sm:hidden" />
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <form
          className="border-t border-neutral-200 bg-white px-4 py-3 sm:px-8"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("q");
            const q = typeof value === "string" ? value.trim() : "";
            if (!q) return;
            setSearchOpen(false);
            router.push(`/arama?q=${encodeURIComponent(q)}`);
          }}
          role="search"
        >
          <label className="sr-only" htmlFor="editorial-search">
            Ürün ara
          </label>
          <input
            id="editorial-search"
            name="q"
            className="h-10 w-full border-b border-neutral-300 bg-transparent text-sm outline-none placeholder:text-neutral-400 focus:border-brand-red"
            placeholder="Ara"
            autoFocus
          />
        </form>
      ) : null}

      {open ? (
        <nav
          className="border-t border-neutral-200 bg-white px-4 py-8 sm:px-8"
          aria-label="Kategoriler"
        >
          <ul className="mx-auto grid max-w-3xl gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-display text-3xl text-neutral-900 transition duration-200 hover:text-brand-red"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
