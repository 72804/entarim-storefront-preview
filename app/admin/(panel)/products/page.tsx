import Link from "next/link";
import { fetchAdminCategories, fetchAdminProducts } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const { q = "", category = "", status = "" } = await searchParams;
  const [products, categories] = await Promise.all([fetchAdminProducts(), fetchAdminCategories()]);
  const filtered = products.filter((product) => {
    const hay = `${product.name} ${product.slug}`.toLocaleLowerCase("tr");
    if (q && !hay.includes(q.toLocaleLowerCase("tr"))) return false;
    if (category && product.category_id !== category) return false;
    if (status === "published" && !product.published) return false;
    if (status === "draft" && product.published) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Ürünler</h1>
        <Link className="rounded-md bg-[#e21e28] px-4 py-2 text-sm font-semibold text-white" href="/admin/products/new">
          Yeni Ürün Ekle
        </Link>
      </div>
      <form className="mt-5 grid gap-3 sm:grid-cols-3">
        <input className="h-10 rounded-md border px-3 text-sm" name="q" defaultValue={q} placeholder="Ara" />
        <select className="h-10 rounded-md border px-3 text-sm" name="category" defaultValue={category}>
          <option value="">Kategori</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <select className="h-10 rounded-md border px-3 text-sm" name="status" defaultValue={status}>
          <option value="">Tüm durumlar</option>
          <option value="published">Yayında</option>
          <option value="draft">Taslak</option>
        </select>
        <button className="h-10 rounded-md border bg-white text-sm sm:col-span-3 sm:w-32" type="submit">
          Filtrele
        </button>
      </form>
      <div className="mt-5 overflow-x-auto rounded-xl bg-white ring-1 ring-neutral-200">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-3 py-3">Ürün</th>
              <th className="px-3 py-3">Kategori</th>
              <th className="px-3 py-3">Fiyat</th>
              <th className="px-3 py-3">Renk</th>
              <th className="px-3 py-3">Durum</th>
              <th className="px-3 py-3">Liste</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const thumb =
                product.variants.flatMap((variant) => variant.images).find((image) => image.is_primary)?.url ??
                product.variants[0]?.images[0]?.url;
              const onHome = product.placements.some((item) => item.placement_key === "homepage_new_arrivals") || product.show_on_homepage;
              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="size-12 overflow-hidden rounded-md bg-neutral-100">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="size-full object-cover" />
                        ) : null}
                      </span>
                      <span>
                        <strong className="block font-medium">{product.name}</strong>
                        <small className="text-neutral-500">{product.slug}</small>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">{product.category?.name ?? "—"}</td>
                  <td className="px-3 py-3">{formatPrice(Number(product.price))}</td>
                  <td className="px-3 py-3">{product.variants.length}</td>
                  <td className="px-3 py-3">{product.published ? "Yayında" : "Taslak"}</td>
                  <td className="px-3 py-3">{onHome ? "Yeni Gelenler" : "—"}</td>
                  <td className="px-3 py-3 text-right">
                    <Link className="text-sm font-medium text-[#e21e28]" href={`/admin/products/${product.id}`}>
                      Düzenle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className="px-4 py-8 text-sm text-neutral-500">Ürün bulunamadı. Katalog henüz içe aktarılmamış olabilir.</p> : null}
      </div>
    </div>
  );
}
