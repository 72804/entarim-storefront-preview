import { createProductForm } from "@/app/admin/actions";
import { fetchAdminCategories } from "@/lib/admin/queries";

export default async function NewProductPage() {
  const categories = await fetchAdminCategories();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Yeni Ürün</h1>
      <p className="mt-1 text-sm text-neutral-500">Taslak olarak kaydedilir. Görselleri sonraki ekranda ekleyebilirsiniz.</p>
      <form action={createProductForm} className="mt-6 space-y-4 rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <label className="grid gap-1 text-sm">
          Ürün Adı
          <input className="h-10 rounded-md border px-3" name="name" required />
        </label>
        <label className="grid gap-1 text-sm">
          Slug
          <input className="h-10 rounded-md border px-3" name="slug" placeholder="otomatik doldurulabilir" />
        </label>
        <label className="grid gap-1 text-sm">
          Kategori
          <select className="h-10 rounded-md border px-3" name="categoryId">
            <option value="">Seçin</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Fiyat
          <input className="h-10 rounded-md border px-3" type="number" name="price" defaultValue={0} />
        </label>
        <button className="rounded-md bg-[#e21e28] px-4 py-2 text-sm font-semibold text-white" type="submit">
          Taslak Oluştur
        </button>
      </form>
    </div>
  );
}
