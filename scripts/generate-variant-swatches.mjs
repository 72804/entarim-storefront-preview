import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicPath } from "./lib/image-analysis.mjs";
import {
  extractFromPercent,
  loadAnalysisImage,
  scoreCandidates,
  toOriginalExtract,
  writeSwatch,
} from "./lib/swatch-crop.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "scraped-catalog.json");
const overridesPath = path.join(root, "data", "swatch-crop-overrides.json");
const outDir = path.join(root, "public", "entarim", "swatches");
const SWATCH_PUBLIC = "/entarim/swatches";

function swatchFilename(slug, colorId) {
  return `${slug}--${colorId}.webp`;
}

async function loadOverrides() {
  try {
    return JSON.parse(await fs.readFile(overridesPath, "utf8"));
  } catch {
    return {};
  }
}

async function pickFromImages(images, override, options = {}) {
  const startIndex = override?.imageIndex ?? 0;
  const ordered = [
    ...images.slice(startIndex),
    ...images.slice(0, startIndex),
  ];
  let best = null;

  for (const src of ordered) {
    const file = publicPath(root, src);
    try {
      await fs.access(file);
    } catch {
      continue;
    }

    const analysis = await loadAnalysisImage(file);

    if (override && (override.x != null || override.width != null)) {
      const extract = extractFromPercent(analysis, override);
      return {
        file,
        src,
        extract,
        automatic: false,
        skin: 0,
        score: Infinity,
        name: "manual-override",
      };
    }

    const ranked = scoreCandidates(analysis, undefined, options);
    const top = ranked[0];
    if (!top) continue;

    const extract = toOriginalExtract(analysis, top);
    const candidate = {
      file,
      src,
      extract,
      automatic: true,
      skin: top.skin,
      score: top.score,
      name: top.name,
      background: top.background,
    };

    if (!best || candidate.score > best.score) best = candidate;
    const goodEnough =
      top.skin < 0.14 &&
      top.background < 0.32 &&
      !top.betweenLegs &&
      (top.split ?? 0) < 34 &&
      top.score > 8;
    if (goodEnough) return candidate;
  }

  return best;
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  const overrides = await loadOverrides();
  await fs.mkdir(outDir, { recursive: true });

  let processed = 0;
  let generated = 0;
  let manual = 0;
  let failed = 0;
  const report = [];

  for (const product of catalog.products) {
    const listingColors = product.colors.filter((color) => Boolean(color.images?.[0]));
    const usesListingSwatches = listingColors.length > 1;

    for (const color of product.colors) {
      if (!usesListingSwatches) {
        if (color.swatchImage) delete color.swatchImage;
        continue;
      }
      if (!color.images?.length) continue;

      processed += 1;
      const key = `${product.slug}::${color.id}`;
      const override = overrides[key] ?? overrides[product.slug];
      const isTop = /tunik|gomlek|bluz|shirt/.test(product.slug);
      const picked = await pickFromImages(color.images, override, { isTop });

      if (!picked) {
        failed += 1;
        delete color.swatchImage;
        report.push({ key, status: "failed" });
        console.warn(`swatch failed for ${key}`);
        continue;
      }

      const filename = swatchFilename(product.slug, color.id);
      const dest = path.join(outDir, filename);
      await writeSwatch(picked.file, picked.extract, dest);
      color.swatchImage = `${SWATCH_PUBLIC}/${filename}`;
      generated += 1;
      if (!picked.automatic) manual += 1;
      report.push({
        key,
        status: picked.automatic ? "automatic" : "override",
        source: picked.src,
        region: picked.name,
        score: Number(picked.score.toFixed?.(1) ?? picked.score),
        skin: Number((picked.skin ?? 0).toFixed(3)),
      });
    }
  }

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

  const automatic = generated - manual;
  console.log(
    JSON.stringify(
      {
        variantsProcessed: processed,
        swatchesGenerated: generated,
        automatic,
        manualOverrides: manual,
        failed,
        output: "public/entarim/swatches/",
      },
      null,
      2,
    ),
  );

  const risky = report.filter((item) => item.status === "automatic" && item.skin > 0.08);
  if (risky.length) {
    console.log("\nHigh skin-ratio automatic crops (review):");
    for (const item of risky.slice(0, 20)) {
      console.log(`  ${item.key} skin=${item.skin} region=${item.region}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
