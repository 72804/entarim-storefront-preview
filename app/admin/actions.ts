"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, slugify } from "@/lib/admin/helpers";

function touchStorefront(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/arama");
  if (slug) revalidatePath(`/${slug}`);
}

export async function saveProductAction(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const price = Number(formData.get("price") ?? 0);
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").trim();
  const oldPrice = oldPriceRaw ? Number(oldPriceRaw) : null;
  const description = String(formData.get("description") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sizes = String(formData.get("sizes") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const published = String(formData.get("published") ?? "") === "true";
  const featured = String(formData.get("featured") ?? "") === "true";
  const showOnHomepage = String(formData.get("showOnHomepage") ?? "") === "true";
  const homepageSort = Number(formData.get("homepageSort") ?? 0);
  const placements = String(formData.get("placements") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!id || !name || !slug) return { ok: false, error: "Ürün adı ve slug gerekli." };

  const { error } = await admin
    .from("products")
    .update({
      name,
      slug,
      category_id: categoryId,
      price,
      old_price: Number.isFinite(oldPrice as number) ? oldPrice : null,
      description,
      sizes,
      published,
      featured,
      show_on_homepage: showOnHomepage,
      homepage_sort: Number.isFinite(homepageSort) ? homepageSort : 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await admin.from("product_placements").delete().eq("product_id", id);
  const rows = placements.map((key, index) => ({ product_id: id, placement_key: key, sort_order: index }));
  if (showOnHomepage) {
    rows.push({ product_id: id, placement_key: "homepage_new_arrivals", sort_order: homepageSort });
  }
  if (rows.length) {
    const { error: placeError } = await admin.from("product_placements").insert(rows);
    if (placeError) return { ok: false, error: placeError.message };
  }

  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function saveCategoryForm(formData: FormData): Promise<void> {
  const result = await saveCategoryAction(formData);
  if (!result.ok) throw new Error(result.error ?? "Kategori kaydedilemedi.");
}

export async function createProductForm(formData: FormData): Promise<void> {
  const result = await createProductAction(formData);
  if (result && !result.ok) throw new Error(result.error ?? "Ürün oluşturulamadı.");
}

export async function createProductAction(formData: FormData) {
  const { admin } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  if (!name || !slug) return { ok: false, error: "Ürün adı gerekli." };

  const { data, error } = await admin
    .from("products")
    .insert({
      name,
      slug,
      category_id: categoryId,
      price: Number(formData.get("price") ?? 0) || 0,
      published: false,
      sizes: ["38", "40", "42", "44", "46"],
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Ürün oluşturulamadı." };
  touchStorefront();
  redirect(`/admin/products/${data.id}`);
}

export async function setPublishedAction(id: string, published: boolean, slug: string) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("products")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function archiveProductAction(id: string, slug: string) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("products")
    .update({ archived: true, published: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function deleteProductAction(id: string, slug: string) {
  const { admin } = await requireAdmin();
  const { data: images } = await admin.from("product_images").select("storage_path").eq("product_id", id);
  const paths = (images ?? []).map((item) => item.storage_path).filter((item): item is string => Boolean(item));
  if (paths.length) await admin.storage.from("product-assets").remove(paths);
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function saveVariantsAction(
  productId: string,
  slug: string,
  variants: { id?: string; name: string; hex: string; active: boolean; sortOrder: number }[],
) {
  const { admin } = await requireAdmin();
  for (const [index, variant] of variants.entries()) {
    const variantSlug = slugify(variant.name) || `renk-${index + 1}`;
    if (variant.id) {
      const { error } = await admin
        .from("product_variants")
        .update({
          name: variant.name.trim(),
          slug: variantSlug,
          hex: variant.hex || "#888888",
          active: variant.active,
          sort_order: variant.sortOrder,
        })
        .eq("id", variant.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await admin.from("product_variants").insert({
        product_id: productId,
        name: variant.name.trim() || `Renk ${index + 1}`,
        slug: variantSlug,
        hex: variant.hex || "#888888",
        active: variant.active,
        sort_order: variant.sortOrder,
      });
      if (error) return { ok: false, error: error.message };
    }
  }
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function deleteVariantAction(variantId: string, slug: string) {
  const { admin } = await requireAdmin();
  const { data: images } = await admin.from("product_images").select("storage_path").eq("variant_id", variantId);
  const paths = (images ?? []).map((item) => item.storage_path).filter((item): item is string => Boolean(item));
  if (paths.length) await admin.storage.from("product-assets").remove(paths);
  const { error } = await admin.from("product_variants").delete().eq("id", variantId);
  if (error) return { ok: false, error: error.message };
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function uploadVariantImageAction(formData: FormData) {
  const { admin } = await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const variantId = String(formData.get("variantId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || !productId || !variantId) {
    return { ok: false, error: "Görsel veya varyant eksik." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: "Yalnızca JPG, PNG veya WebP yükleyin." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Görsel 8 MB sınırını aşıyor." };
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${productId}/${variantId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage.from("product-assets").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: publicUrl } = admin.storage.from("product-assets").getPublicUrl(path);
  const { data: existing } = await admin
    .from("product_images")
    .select("id, sort_order")
    .eq("variant_id", variantId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
  const isPrimary = !existing?.length;
  const { data: inserted, error } = await admin
    .from("product_images")
    .insert({
      product_id: productId,
      variant_id: variantId,
      url: publicUrl.publicUrl,
      storage_path: path,
      sort_order: nextOrder,
      is_primary: isPrimary,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  if (isPrimary) {
    await admin.from("product_variants").update({ listing_image_id: inserted.id }).eq("id", variantId);
  }
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function deleteImageAction(imageId: string, slug: string) {
  const { admin } = await requireAdmin();
  const { data: image } = await admin.from("product_images").select("*").eq("id", imageId).maybeSingle();
  if (!image) return { ok: false, error: "Görsel bulunamadı." };
  const { count } = await admin
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("variant_id", image.variant_id);
  if ((count ?? 0) <= 1) {
    return { ok: false, error: "Son görseli silmek ürün kartını bozar. Önce başka görsel ekleyin." };
  }
  if (image.storage_path) await admin.storage.from("product-assets").remove([image.storage_path]);
  const { error } = await admin.from("product_images").delete().eq("id", imageId);
  if (error) return { ok: false, error: error.message };
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function setPrimaryImageAction(imageId: string, variantId: string, slug: string) {
  const { admin } = await requireAdmin();
  await admin.from("product_images").update({ is_primary: false }).eq("variant_id", variantId);
  const { error } = await admin.from("product_images").update({ is_primary: true }).eq("id", imageId);
  if (error) return { ok: false, error: error.message };
  await admin.from("product_variants").update({ listing_image_id: imageId }).eq("id", variantId);
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function reorderImagesAction(variantId: string, imageIds: string[], slug: string) {
  const { admin } = await requireAdmin();
  for (const [index, id] of imageIds.entries()) {
    const { error } = await admin.from("product_images").update({ sort_order: index }).eq("id", id).eq("variant_id", variantId);
    if (error) return { ok: false, error: error.message };
  }
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function saveSwatchCropAction(input: {
  variantId: string;
  sourceImageId: string;
  x: number;
  y: number;
  zoom: number;
  slug: string;
}) {
  const { admin } = await requireAdmin();
  const { error } = await admin
    .from("product_variants")
    .update({
      swatch_source_image_id: input.sourceImageId,
      swatch_x: input.x,
      swatch_y: input.y,
      swatch_zoom: input.zoom,
    })
    .eq("id", input.variantId);
  if (error) return { ok: false, error: error.message };
  touchStorefront(input.slug);
  return { ok: true, error: null };
}

export async function saveCategoryAction(formData: FormData) {
  const { admin } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  const description = String(formData.get("description") ?? "").trim();
  const active = String(formData.get("active") ?? "true") === "true";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!name || !slug) return { ok: false, error: "Kategori adı gerekli." };
  if (id) {
    const { error } = await admin
      .from("categories")
      .update({ name, slug, description, active, sort_order: sortOrder, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await admin.from("categories").insert({ name, slug, description, active, sort_order: sortOrder });
    if (error) return { ok: false, error: error.message };
  }
  touchStorefront(slug);
  return { ok: true, error: null };
}

export async function reorderCategoriesAction(ids: string[]) {
  const { admin } = await requireAdmin();
  for (const [index, id] of ids.entries()) {
    await admin.from("categories").update({ sort_order: index }).eq("id", id);
  }
  touchStorefront();
  return { ok: true, error: null };
}
