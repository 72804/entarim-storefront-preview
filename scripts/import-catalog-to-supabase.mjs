import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();

function loadEnvFile(filePath) {
  return fs
    .readFile(filePath, "utf8")
    .then((text) => {
      for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq < 1) continue;
        const key = trimmed.slice(0, eq);
        let value = trimmed.slice(eq + 1);
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    })
    .catch(() => undefined);
}

async function main() {
  await loadEnvFile(path.join(root, ".env.local"));
  await loadEnvFile(path.join(root, ".env"));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, service, { auth: { persistSession: false } });
  const catalog = JSON.parse(await fs.readFile(path.join(root, "data/scraped-catalog.json"), "utf8"));

  const categoryNames = new Map();
  for (const product of catalog.products) {
    categoryNames.set(product.categorySlug, product.category);
  }
  for (const slug of Object.keys(catalog.categoryProductSlugs ?? {})) {
    if (!categoryNames.has(slug)) categoryNames.set(slug, slug);
  }

  const categoryIds = new Map();
  let sort = 0;
  for (const [slug, name] of categoryNames) {
    const { data, error } = await supabase
      .from("categories")
      .upsert({ slug, name, description: "", sort_order: sort, active: true, updated_at: new Date().toISOString() }, { onConflict: "slug" })
      .select("id, slug")
      .single();
    if (error) throw error;
    categoryIds.set(slug, data.id);
    sort += 1;
  }

  let imported = 0;
  for (const product of catalog.products) {
    const { data: row, error } = await supabase
      .from("products")
      .upsert(
        {
          legacy_id: String(product.id),
          slug: product.slug,
          name: product.name,
          category_id: categoryIds.get(product.categorySlug) ?? null,
          price: product.price,
          old_price: product.oldPrice,
          description: product.description ?? [],
          sizes: product.sizes ?? [],
          published: true,
          featured: false,
          show_on_homepage: (catalog.homepageNewArrivals ?? []).includes(product.slug),
          homepage_sort: (catalog.homepageNewArrivals ?? []).indexOf(product.slug),
          archived: false,
          related_slugs: product.relatedSlugs ?? [],
          generated_palette: product.generatedPalette ?? [],
          palette_override: product.paletteOverride ?? [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;

    await supabase
      .from("product_variants")
      .update({ listing_image_id: null, swatch_source_image_id: null })
      .eq("product_id", row.id);
    await supabase.from("product_images").delete().eq("product_id", row.id);
    await supabase.from("product_variants").delete().eq("product_id", row.id);
    await supabase.from("product_placements").delete().eq("product_id", row.id);

    for (const [index, color] of (product.colors ?? []).entries()) {
      const { data: variant, error: variantError } = await supabase
        .from("product_variants")
        .insert({
          product_id: row.id,
          slug: color.id,
          name: color.name,
          hex: color.hex ?? "#888888",
          sort_order: index,
          active: true,
          swatch_image_url: color.swatchImage ?? null,
        })
        .select("id")
        .single();
      if (variantError) throw variantError;

      let listingId = null;
      for (const [imageIndex, url] of (color.images ?? []).entries()) {
        const { data: image, error: imageError } = await supabase
          .from("product_images")
          .insert({
            product_id: row.id,
            variant_id: variant.id,
            url,
            sort_order: imageIndex,
            is_primary: imageIndex === 0,
          })
          .select("id")
          .single();
        if (imageError) throw imageError;
        if (imageIndex === 0) listingId = image.id;
      }
      if (listingId) {
        await supabase.from("product_variants").update({ listing_image_id: listingId }).eq("id", variant.id);
      }
    }

    const placements = [{ product_id: row.id, placement_key: product.categorySlug, sort_order: 0 }];
    if ((catalog.homepageNewArrivals ?? []).includes(product.slug)) {
      placements.push({
        product_id: row.id,
        placement_key: "homepage_new_arrivals",
        sort_order: catalog.homepageNewArrivals.indexOf(product.slug),
      });
    }
    for (const [key, slugs] of Object.entries(catalog.categoryProductSlugs ?? {})) {
      const order = slugs.indexOf(product.slug);
      if (order >= 0) placements.push({ product_id: row.id, placement_key: key, sort_order: order });
    }
    const unique = [];
    const seen = new Set();
    for (const item of placements) {
      const stamp = `${item.placement_key}`;
      if (seen.has(stamp)) continue;
      seen.add(stamp);
      unique.push(item);
    }
    if (unique.length) {
      const { error: placeError } = await supabase.from("product_placements").insert(unique);
      if (placeError) throw placeError;
    }
    imported += 1;
  }

  console.log(JSON.stringify({ imported, categories: categoryIds.size }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
