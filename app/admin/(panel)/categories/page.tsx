import { saveCategoryForm } from "@/app/admin/actions";
import { fetchAdminCategories } from "@/lib/admin/queries";

export default async function AdminCategoriesPage() {
  const categories = await fetchAdminCategories();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Kategoriler</h1>
      <p className="mt-1 text-sm text-neutral-500">Mevcut mağaza navigasyonu korunur. Buradan atama, ekleme ve yeniden adlandırma yapılır.</p>
      <form action={saveCategoryForm} className="mt-6 grid gap-3 rounded-xl bg-white p-5 ring-1 ring-neutral-200 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-base font-semibold">Yeni kategori</h2>
        <input className="h-10 rounded-md border px-3 text-sm" name="name" placeholder="Ad" required />
        <input className="h-10 rounded-md border px-3 text-sm" name="slug" placeholder="slug" />
        <input className="h-10 rounded-md border px-3 text-sm sm:col-span-2" name="description" placeholder="Açıklama" />
        <select className="h-10 rounded-md border px-3 text-sm" name="active" defaultValue="true">
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>
        <button className="h-10 rounded-md bg-[#e21e28] text-sm font-semibold text-white" type="submit">
          Ekle
        </button>
      </form>
      <div className="mt-6 space-y-3">
        {categories.map((category, index) => (
          <form key={category.id} action={saveCategoryForm} className="grid gap-3 rounded-xl bg-white p-4 ring-1 ring-neutral-200 sm:grid-cols-2">
            <input type="hidden" name="id" value={category.id} />
            <input className="h-10 rounded-md border px-3 text-sm" name="name" defaultValue={category.name} />
            <input className="h-10 rounded-md border px-3 text-sm" name="slug" defaultValue={category.slug} />
            <input className="h-10 rounded-md border px-3 text-sm sm:col-span-2" name="description" defaultValue={category.description} />
            <input type="hidden" name="sortOrder" value={index} />
            <select className="h-10 rounded-md border px-3 text-sm" name="active" defaultValue={category.active ? "true" : "false"}>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
            <button className="h-10 rounded-md border text-sm" type="submit">
              Kaydet
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
