"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archiveProductAction,
  deleteImageAction,
  deleteProductAction,
  deleteVariantAction,
  reorderImagesAction,
  saveProductAction,
  saveSwatchCropAction,
  saveVariantsAction,
  setPrimaryImageAction,
  setPublishedAction,
  uploadVariantImageAction,
} from "@/app/admin/actions";
import { SwatchCropModal } from "@/components/admin/SwatchCropModal";
import { DEFAULT_SIZES } from "@/lib/admin/helpers";
import type { AdminProduct, CategoryRow, ImageRow, VariantRow } from "@/lib/catalog/map";

type VariantDraft = VariantRow & { images: ImageRow[] };

export function ProductEditor({
  product,
  categories,
}: {
  product: AdminProduct;
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [categoryId, setCategoryId] = useState(product.category_id ?? "");
  const [price, setPrice] = useState(String(product.price));
  const [oldPrice, setOldPrice] = useState(product.old_price == null ? "" : String(product.old_price));
  const [description, setDescription] = useState((product.description ?? []).join("\n"));
  const [sizes, setSizes] = useState<string[]>(product.sizes?.length ? product.sizes : DEFAULT_SIZES);
  const [customSize, setCustomSize] = useState("");
  const [published, setPublished] = useState(product.published);
  const [featured, setFeatured] = useState(product.featured);
  const [showOnHomepage, setShowOnHomepage] = useState(
    product.show_on_homepage || product.placements.some((item) => item.placement_key === "homepage_new_arrivals"),
  );
  const [homepageSort, setHomepageSort] = useState(String(product.homepage_sort ?? 0));
  const [placements, setPlacements] = useState(
    product.placements.filter((item) => item.placement_key !== "homepage_new_arrivals").map((item) => item.placement_key),
  );
  const [variants, setVariants] = useState<VariantDraft[]>(product.variants);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [cropFor, setCropFor] = useState<VariantDraft | null>(null);
  const [busy, setBusy] = useState(false);

  const activeCount = variants.filter((item) => item.active).length;

  useEffect(() => {
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const mark = () => setDirty(true);

  async function saveAll() {
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set("id", product.id);
    form.set("name", name);
    form.set("slug", slug);
    form.set("categoryId", categoryId);
    form.set("price", price);
    form.set("oldPrice", oldPrice);
    form.set("description", description);
    form.set("sizes", sizes.join(","));
    form.set("published", String(published));
    form.set("featured", String(featured));
    form.set("showOnHomepage", String(showOnHomepage));
    form.set("homepageSort", homepageSort);
    form.set("placements", placements.join(","));
    const saved = await saveProductAction(form);
    if (!saved.ok) {
      setBusy(false);
      setError(saved.error);
      return;
    }
    const variantSave = await saveVariantsAction(
      product.id,
      slug,
      variants.map((variant, index) => ({
        id: variant.id,
        name: variant.name,
        hex: variant.hex,
        active: variant.active,
        sortOrder: index,
      })),
    );
    setBusy(false);
    if (!variantSave.ok) {
      setError(variantSave.error);
      return;
    }
    setDirty(false);
    setStatus("Değişiklikler kaydedildi");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{product.name || "Ürün"}</h1>
          <p className="text-sm text-neutral-500">{published ? "Yayında" : "Taslak"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            type="button"
            onClick={async () => {
              await setPublishedAction(product.id, !published, slug);
              setPublished(!published);
              setStatus(!published ? "Ürün yayınlandı" : "Ürün yayından kaldırıldı");
              router.refresh();
            }}
          >
            {published ? "Yayından Kaldır" : "Yayınla"}
          </button>
          <button
            className="rounded-md bg-[#e21e28] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            type="button"
            disabled={busy}
            onClick={() => void saveAll()}
          >
            Kaydet
          </button>
        </div>
      </div>
      {status ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{status}</p> : null}
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <h2 className="text-base font-semibold">Genel</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Ürün Adı
            <input className="h-10 rounded-md border px-3" value={name} onChange={(e) => { setName(e.target.value); mark(); }} />
          </label>
          <label className="grid gap-1 text-sm">
            Slug
            <input className="h-10 rounded-md border px-3" value={slug} onChange={(e) => { setSlug(e.target.value); mark(); }} />
          </label>
          <label className="grid gap-1 text-sm">
            Kategori
            <select className="h-10 rounded-md border px-3" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); mark(); }}>
              <option value="">Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Fiyat
            <input className="h-10 rounded-md border px-3" type="number" value={price} onChange={(e) => { setPrice(e.target.value); mark(); }} />
          </label>
          <label className="grid gap-1 text-sm">
            Eski Fiyat
            <input className="h-10 rounded-md border px-3" type="number" value={oldPrice} onChange={(e) => { setOldPrice(e.target.value); mark(); }} />
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <h2 className="text-base font-semibold">Ürün Açıklaması</h2>
        <textarea
          className="mt-3 min-h-36 w-full rounded-md border p-3 text-sm"
          value={description}
          onChange={(e) => { setDescription(e.target.value); mark(); }}
        />
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <h2 className="text-base font-semibold">Bedenler</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEFAULT_SIZES.concat(sizes.filter((size) => !DEFAULT_SIZES.includes(size))).map((size) => {
            const on = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                className={`rounded-full px-3 py-1 text-sm ring-1 ${on ? "bg-[#e21e28] text-white ring-[#e21e28]" : "bg-white ring-neutral-300"}`}
                onClick={() => {
                  setSizes((current) => (current.includes(size) ? current.filter((item) => item !== size) : [...current, size]));
                  mark();
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input className="h-10 w-28 rounded-md border px-3 text-sm" value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Örn. 48" />
          <button
            className="rounded-md border px-3 text-sm"
            type="button"
            onClick={() => {
              const value = customSize.trim();
              if (!value || sizes.includes(value)) return;
              setSizes((current) => [...current, value]);
              setCustomSize("");
              mark();
            }}
          >
            Ekle
          </button>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <h2 className="text-base font-semibold">Listeleme</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => { setPublished(e.target.checked); mark(); }} />
            Yayında
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => { setFeatured(e.target.checked); mark(); }} />
            Öne çıkan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={showOnHomepage} onChange={(e) => { setShowOnHomepage(e.target.checked); mark(); }} />
            Yeni Gelenler
          </label>
          <label className="grid gap-1 text-sm">
            Ana sayfa sırası
            <input className="h-10 rounded-md border px-3" type="number" value={homepageSort} onChange={(e) => { setHomepageSort(e.target.value); mark(); }} />
          </label>
        </div>
        <p className="mt-4 text-sm font-medium">Kategori listeleri</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => {
            const on = placements.includes(category.slug) || category.id === categoryId;
            return (
              <button
                key={category.id}
                type="button"
                className={`rounded-full px-3 py-1 text-sm ring-1 ${on ? "bg-neutral-900 text-white ring-neutral-900" : "ring-neutral-300"}`}
                onClick={() => {
                  setPlacements((current) =>
                    current.includes(category.slug) ? current.filter((item) => item !== category.slug) : [...current, category.slug],
                  );
                  mark();
                }}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-neutral-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Renk Seçenekleri</h2>
          <button
            className="rounded-md border px-3 py-1.5 text-sm"
            type="button"
            onClick={() => {
              setVariants((current) => [
                ...current,
                {
                  id: "",
                  product_id: product.id,
                  slug: `yeni-${current.length + 1}`,
                  name: "Yeni Renk",
                  hex: "#888888",
                  sort_order: current.length,
                  active: true,
                  listing_image_id: null,
                  swatch_image_url: null,
                  swatch_source_image_id: null,
                  swatch_x: 50,
                  swatch_y: 44,
                  swatch_zoom: 2.4,
                  images: [],
                },
              ]);
              mark();
            }}
          >
            + Renk Ekle
          </button>
        </div>
        <div className="mt-4 space-y-5">
          {variants.map((variant, index) => (
            <VariantBlock
              key={variant.id || `new-${index}`}
              variant={variant}
              slug={slug}
              showSwatch={activeCount > 1}
              onChange={(next) => {
                setVariants((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)));
                mark();
              }}
              onMove={(dir) => {
                setVariants((current) => {
                  const copy = [...current];
                  const target = index + dir;
                  if (target < 0 || target >= copy.length) return current;
                  [copy[index], copy[target]] = [copy[target], copy[index]];
                  return copy;
                });
                mark();
              }}
              onDelete={async () => {
                if (variant.id) {
                  if (!confirm("Bu rengi silmek istiyor musunuz?")) return;
                  const result = await deleteVariantAction(variant.id, slug);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                }
                setVariants((current) => current.filter((_, itemIndex) => itemIndex !== index));
                router.refresh();
              }}
              onRefresh={() => router.refresh()}
              onCrop={() => setCropFor(variant)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 ring-1 ring-red-100">
        <h2 className="text-base font-semibold text-red-800">Silme</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            type="button"
            onClick={async () => {
              await archiveProductAction(product.id, slug);
              router.push("/admin/products");
            }}
          >
            Arşivle
          </button>
          <button
            className="rounded-md bg-red-700 px-3 py-2 text-sm text-white"
            type="button"
            onClick={async () => {
              if (!confirm("Ürün kalıcı olarak silinsin mi? Bu işlem geri alınamaz.")) return;
              await deleteProductAction(product.id, slug);
              router.push("/admin/products");
            }}
          >
            Kalıcı Olarak Sil
          </button>
        </div>
      </section>

      {cropFor ? (
        <SwatchCropModal
          images={cropFor.images}
          sourceImageId={cropFor.swatch_source_image_id}
          x={Number(cropFor.swatch_x ?? 50)}
          y={Number(cropFor.swatch_y ?? 44)}
          zoom={Number(cropFor.swatch_zoom ?? 2.4)}
          onClose={() => setCropFor(null)}
          onSave={async (next) => {
            if (!cropFor.id) throw new Error("Önce rengi kaydedin.");
            const result = await saveSwatchCropAction({
              variantId: cropFor.id,
              sourceImageId: next.sourceImageId,
              x: next.x,
              y: next.y,
              zoom: next.zoom,
              slug,
            });
            if (!result.ok) throw new Error(result.error ?? "Kayıt başarısız");
            setStatus("Desen kaydedildi");
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function VariantBlock({
  variant,
  slug,
  showSwatch,
  onChange,
  onMove,
  onDelete,
  onRefresh,
  onCrop,
}: {
  variant: VariantDraft;
  slug: string;
  showSwatch: boolean;
  onChange: (variant: VariantDraft) => void;
  onMove: (dir: number) => void;
  onDelete: () => void;
  onRefresh: () => void;
  onCrop: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const preview = useMemo(() => {
    if (variant.swatch_source_image_id && variant.swatch_x != null) {
      const source = variant.images.find((image) => image.id === variant.swatch_source_image_id) ?? variant.images[0];
      return { url: source?.url, x: Number(variant.swatch_x), y: Number(variant.swatch_y), zoom: Number(variant.swatch_zoom) };
    }
    return { url: variant.swatch_image_url ?? variant.images[0]?.url, x: 50, y: 50, zoom: 1 };
  }, [variant]);

  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="h-10 rounded-md border px-3 text-sm"
            value={variant.name}
            onChange={(event) => onChange({ ...variant, name: event.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={variant.active}
              onChange={(event) => onChange({ ...variant, active: event.target.checked })}
            />
            Aktif
          </label>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border px-2 text-sm" type="button" onClick={() => onMove(-1)}>Yukarı</button>
          <button className="rounded-md border px-2 text-sm" type="button" onClick={() => onMove(1)}>Aşağı</button>
          <button className="rounded-md border px-2 text-sm text-red-700" type="button" onClick={() => void onDelete()}>Sil</button>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium">Görseller</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {variant.images.map((image, index) => (
            <div
              key={image.id}
              className="w-24"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex == null || dragIndex === index) return;
                const ids = variant.images.map((item) => item.id);
                const [moved] = ids.splice(dragIndex, 1);
                ids.splice(index, 0, moved);
                void reorderImagesAction(variant.id, ids, slug).then(onRefresh);
                setDragIndex(null);
              }}
            >
              <div className={`overflow-hidden rounded-md ring-2 ${image.is_primary ? "ring-[#e21e28]" : "ring-neutral-200"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="aspect-square w-full object-cover" />
              </div>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[10px]">
                <button className="rounded border" type="button" onClick={() => void setPrimaryImageAction(image.id, variant.id, slug).then(onRefresh)}>
                  Ana Görsel
                </button>
                <button className="rounded border" type="button" onClick={() => void reorderImagesAction(variant.id, moveIds(variant.images.map((item) => item.id), index, -1), slug).then(onRefresh)}>
                  ←
                </button>
                <button className="rounded border" type="button" onClick={() => void reorderImagesAction(variant.id, moveIds(variant.images.map((item) => item.id), index, 1), slug).then(onRefresh)}>
                  →
                </button>
                <button
                  className="rounded border text-red-700"
                  type="button"
                  onClick={() => {
                    if (!confirm("Görsel silinsin mi?")) return;
                    void deleteImageAction(image.id, slug).then((result) => {
                      if (!result.ok) alert(result.error);
                      onRefresh();
                    });
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-flex cursor-pointer items-center rounded-md border px-3 py-2 text-sm">
          {uploading ? "Yükleniyor…" : "Görsel Ekle"}
          <input
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!variant.id || uploading}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file || !variant.id) return;
              setUploading(true);
              const form = new FormData();
              form.set("productId", variant.product_id);
              form.set("variantId", variant.id);
              form.set("slug", slug);
              form.set("file", file);
              const result = await uploadVariantImageAction(form);
              setUploading(false);
              if (!result.ok) alert(result.error);
              onRefresh();
            }}
          />
        </label>
        {!variant.id ? <p className="mt-2 text-xs text-neutral-500">Görsel eklemek için önce Kaydet ile rengi oluşturun.</p> : null}
      </div>

      {showSwatch ? (
        <div className="mt-4 rounded-md bg-neutral-50 p-3">
          <p className="text-sm font-medium">Listeleme Deseni</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="size-12 overflow-hidden rounded-[7px] ring-1 ring-neutral-300">
              {preview.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt=""
                  className="size-full object-cover"
                  style={
                    variant.swatch_x != null
                      ? {
                          objectPosition: `${preview.x}% ${preview.y}%`,
                          transform: `scale(${preview.zoom})`,
                          transformOrigin: `${preview.x}% ${preview.y}%`,
                        }
                      : undefined
                  }
                />
              ) : null}
            </div>
            <button className="rounded-md border bg-white px-3 py-1.5 text-sm" type="button" onClick={onCrop} disabled={!variant.images.length}>
              Deseni Düzenle
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function moveIds(ids: string[], index: number, dir: number) {
  const target = index + dir;
  if (target < 0 || target >= ids.length) return ids;
  const copy = [...ids];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}
