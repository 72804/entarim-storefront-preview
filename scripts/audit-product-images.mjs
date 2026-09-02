import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  averageHash,
  fileHash,
  filenameScore,
  hamming,
  publicPath,
  visualSignals,
} from "./lib/image-analysis.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "scraped-catalog.json");
const reportsDir = path.join(root, "reports");

const EXCLUDE_THRESHOLD = 64;
const REVIEW_THRESHOLD = 42;

async function restoreImagesFromDisk(catalog) {
  for (const product of catalog.products) {
    for (const color of product.colors) {
      const dir = publicPath(root, `/entarim/products/${product.slug}/${color.id}`);
      try {
        const files = (await fs.readdir(dir))
          .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        if (files.length > 0) {
          color.images = files.map(
            (name) => `/entarim/products/${product.slug}/${color.id}/${name}`,
          );
        }
      } catch {
        // Keep existing references for non-cached assets such as demo-assets.
      }
    }
  }
}

function collectRefs(catalog) {
  const refs = [];
  for (const product of catalog.products) {
    for (const color of product.colors) {
      for (const image of color.images) {
        refs.push({ product, color, image });
      }
    }
  }
  return refs;
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  await restoreImagesFromDisk(catalog);
  const refs = collectRefs(catalog);
  const uniqueSrc = [...new Set(refs.map((ref) => ref.image))];

  const analysis = new Map();
  const hashToSrc = new Map();
  const ahashToSrc = [];

  for (const src of uniqueSrc) {
    const file = publicPath(root, src);
    const name = filenameScore(src);
    const entry = {
      src,
      file,
      exists: true,
      sha: null,
      ahash: null,
      filenameScore: name.score,
      filenameReasons: name.reasons,
      visual: null,
      error: null,
    };
    try {
      await fs.access(file);
      entry.sha = await fileHash(file);
      entry.ahash = await averageHash(file);
      entry.visual = await visualSignals(file);
      if (!hashToSrc.has(entry.sha)) hashToSrc.set(entry.sha, []);
      hashToSrc.get(entry.sha).push(src);
      ahashToSrc.push({ src, ahash: entry.ahash });
    } catch (error) {
      entry.exists = false;
      entry.error = String(error);
    }
    analysis.set(src, entry);
  }

  const productCountForSrc = new Map();
  for (const ref of refs) {
    if (!productCountForSrc.has(ref.image)) productCountForSrc.set(ref.image, new Set());
    productCountForSrc.get(ref.image).add(ref.product.slug);
  }

  function duplicateScore(src) {
    const info = analysis.get(src);
    const reasons = [];
    let score = 0;
    if (!info?.sha) return { score, reasons };
    const exact = new Set();
    for (const other of hashToSrc.get(info.sha) ?? []) {
      for (const slug of productCountForSrc.get(other) ?? []) exact.add(slug);
    }
    const visual = analysis.get(src)?.visual;
    const white = visual?.whiteRatio ?? 0;
    if (exact.size >= 4 && white > 0.55) {
      score += exact.size >= 10 ? 42 : exact.size >= 6 ? 32 : 22;
      reasons.push(`image reused across ${exact.size} products`);
    }
    let similar = new Set(exact);
    for (const other of ahashToSrc) {
      if (hamming(info.ahash, other.ahash) <= 5) {
        for (const slug of productCountForSrc.get(other.src) ?? []) similar.add(slug);
      }
    }
    if (similar.size >= 6 && similar.size > exact.size && white > 0.62) {
      score += 16;
      reasons.push(`visually similar image reused across ${similar.size} products`);
    }
    return { score, reasons };
  }

  const decisions = [];
  for (const src of uniqueSrc) {
    const info = analysis.get(src);
    const dup = duplicateScore(src);
    const visual = info.visual;
    const reasons = [
      ...info.filenameReasons,
      ...dup.reasons,
      ...(visual?.reasons ?? []),
    ];
    if (!info.exists) reasons.push("file missing");

    let score = info.filenameScore + dup.score + (visual?.whiteCanvasScore ?? 0) + (visual?.tableLineScore ?? 0) + (visual?.lowPhotoScore ?? 0);
    if (!info.exists) score += 80;
    if ((visual?.whiteRatio ?? 0) > 0.78 && (visual?.meanSat ?? 1) < 0.12) {
      score += 32;
      reasons.push("white graphic canvas");
    }

    let status = "kept";
    if (score >= EXCLUDE_THRESHOLD) status = "removed";
    else if (score >= REVIEW_THRESHOLD) status = "review";

    decisions.push({
      image: src,
      status,
      score: Math.round(score),
      reasons,
      products: [...(productCountForSrc.get(src) ?? [])],
    });
  }

  const bySrc = new Map(decisions.map((item) => [item.image, item]));
  let forcedKeep = 0;

  for (const product of catalog.products) {
    for (const color of product.colors) {
      const ranked = color.images.map((image) => {
        const decision = bySrc.get(image);
        const photoBoost = analysis.get(image)?.visual?.photographicScore ?? 0;
        return { image, decision, photoBoost };
      });
      const kept = ranked.filter((item) => item.decision?.status !== "removed");
      if (kept.length > 0) {
        color.images = kept.map((item) => item.image);
        continue;
      }
      const safest = ranked.sort((a, b) => b.photoBoost - a.photoBoost)[0];
      if (safest) {
        color.images = [safest.image];
        safest.decision.status = "review";
        safest.decision.reasons = [...new Set([...safest.decision.reasons, "retained as only remaining image"])];
        forcedKeep += 1;
      }
    }
    const remaining = product.colors.flatMap((color) => color.images);
    if (remaining.length === 0) {
      throw new Error(`Product ${product.slug} would have zero images`);
    }
  }

  await fs.mkdir(reportsDir, { recursive: true });
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      imagesScanned: uniqueSrc.length,
      kept: decisions.filter((item) => item.status === "kept").length,
      excluded: decisions.filter((item) => item.status === "removed").length,
      needsReview: decisions.filter((item) => item.status === "review").length,
      forcedKeep,
    },
    items: decisions.sort((a, b) => b.score - a.score),
  };
  await fs.writeFile(path.join(reportsDir, "product-image-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

  const review = decisions.filter((item) => item.status !== "kept");
  const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><title>Product image review</title>
<style>
  body{font-family:sans-serif;background:#fbf7f1;color:#2f2430;padding:24px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
  figure{margin:0;background:#fff;padding:10px;border-radius:16px}
  img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px}
  small{display:block;margin-top:8px;color:#64748b;font-size:12px}
</style></head><body>
<h1>Suspicious product images</h1>
<p>Scanned ${report.summary.imagesScanned} · kept ${report.summary.kept} · excluded ${report.summary.excluded} · review ${report.summary.needsReview}</p>
<div class="grid">
${review
  .map(
    (item) => `<figure>
      <img src="${item.image}" alt="">
      <figcaption><strong>${item.status}</strong> (${item.score})<small>${item.reasons.join(" · ")}</small></figcaption>
    </figure>`,
  )
  .join("\n")}
</div></body></html>`;
  await fs.writeFile(path.join(reportsDir, "review-images.html"), html);

  console.log("Images scanned:", report.summary.imagesScanned);
  console.log("Kept:", report.summary.kept);
  console.log("Excluded:", report.summary.excluded);
  console.log("Needs review:", report.summary.needsReview);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
