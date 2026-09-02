import Link from "next/link";
import { fetchAdminStats } from "@/lib/admin/queries";
import { supabaseSetupMessage } from "@/lib/admin/auth";

export default async function AdminHomePage() {
  const setup = supabaseSetupMessage();
  const stats = setup ? { total: 0, published: 0, drafts: 0, categories: 0 } : await fetchAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Özet</h1>
      <p className="mt-1 text-sm text-neutral-500">Mağaza kataloğunu buradan yönetin.</p>
      {setup ? <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{setup}</p> : null}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ürünler" value={stats.total} />
        <Stat label="Kategoriler" value={stats.categories} />
        <Stat label="Yayındaki Ürünler" value={stats.published} />
        <Stat label="Taslak Ürünler" value={stats.drafts} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-md bg-[#e21e28] px-4 py-2 text-sm font-semibold text-white" href="/admin/products/new">
          Yeni Ürün Ekle
        </Link>
        <Link className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm" href="/admin/products">
          Ürünleri Yönet
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-neutral-200">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
