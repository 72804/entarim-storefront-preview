import Link from "next/link";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default function NotFound() {
  return (
    <StorefrontShell>
      <main className="mx-auto w-[min(calc(100%-2rem),720px)] py-24 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">404</p>
        <h1 className="font-display mt-3 text-4xl text-[#2f2430]">Sayfa bulunamadı</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          Aradığınız sayfa bu önizleme sitesinde yok veya taşınmış olabilir.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white"
          href="/"
        >
          Ana sayfaya dön
        </Link>
      </main>
    </StorefrontShell>
  );
}
