import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/data/catalog";

export function SearchPage({ query }: { query: string }) {
  const results = searchProducts(query);

  return (
    <main className="mx-auto w-[min(calc(100%-2rem),1360px)] pb-28 pt-8 lg:pb-16">
      <h1 className="font-display text-4xl font-semibold text-rose-950 sm:text-5xl">Arama</h1>
      {query ? (
        <p className="mt-4 text-sm text-slate-500">
          “{query}” için <strong className="text-[#2f2430]">{results.length}</strong> sonuç
        </p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Ürün adı, kategori veya renk arayabilirsiniz.</p>
      )}

      {!query ? (
        <Link className="mt-8 inline-flex text-sm font-bold text-brand-red" href="/yeni-sezon">
          Yeni sezonu incele
        </Link>
      ) : results.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500">Bu aramaya uygun ürün bulunamadı.</p>
      ) : (
        <div className="mt-8">
          <ProductGrid products={results} />
        </div>
      )}
    </main>
  );
}
