import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPalette, publicPath } from "./lib/image-analysis.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = path.join(root, "data", "scraped-catalog.json");

async function main() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  let processed = 0;
  let failed = 0;

  for (const product of catalog.products) {
    const primary = product.colors.flatMap((color) => color.images)[0];
    if (!primary) {
      product.generatedPalette = [];
      continue;
    }
    try {
      product.generatedPalette = await extractPalette(publicPath(root, primary));
      processed += 1;
    } catch (error) {
      failed += 1;
      product.generatedPalette = product.generatedPalette ?? [];
      console.warn(`palette failed for ${product.slug}:`, error.message);
    }
  }

  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Processed ${processed} products (${failed} failed)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
