import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const FILENAME_TERMS = [
  "beden-tablosu",
  "beden",
  "olcu",
  "ölçü",
  "size-chart",
  "sizechart",
  "chart",
  "tablo",
  "guide",
  "measurement",
  "measure",
  "logo",
  "banner",
  "icon",
  "kargo",
  "cargo",
  "payment",
  "odeme",
  "ödeme",
  "iyzico",
];

export function filenameScore(src) {
  const hay = src.toLocaleLowerCase("tr");
  const tokens = hay.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean);
  const hits = FILENAME_TERMS.filter((term) => {
    if (term.includes("-")) return hay.includes(term);
    return tokens.some((token) => token === term);
  });
  if (hits.length === 0) return { score: 0, reasons: [] };
  const strong = hits.some((term) =>
    ["beden-tablosu", "size-chart", "sizechart", "measurement", "tablo", "iyzico", "beden"].includes(term),
  );
  return {
    score: strong ? 50 : 28,
    reasons: hits.map((term) => `filename contains ${term}`),
  };
}

export function publicPath(root, src) {
  const relative = src.startsWith("/") ? src.slice(1) : src;
  return path.join(root, "public", relative);
}

export async function fileHash(file) {
  const buf = await fs.readFile(file);
  return createHash("sha256").update(buf).digest("hex");
}

export async function averageHash(file) {
  const { data } = await sharp(file)
    .resize(8, 8, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
  let bits = 0n;
  data.forEach((value, index) => {
    if (value >= avg) bits |= 1n << BigInt(index);
  });
  return bits;
}

export function hamming(a, b) {
  let x = a ^ b;
  let count = 0;
  while (x) {
    count += Number(x & 1n);
    x >>= 1n;
  }
  return count;
}

function luma(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

function rgbToLab(r, g, b) {
  const srgb = [r, g, b].map((channel) => {
    const x = channel / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  const [R, G, B] = srgb;
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function labDist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function hexFromRgb(r, g, b) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

export function isSkinLike(r, g, b) {
  const y = luma(r, g, b);
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return (
    y > 60 &&
    y < 230 &&
    cr > 133 &&
    cr < 178 &&
    cb > 77 &&
    cb < 132 &&
    r > g &&
    g > b - 12 &&
    saturation(r, g, b) < 0.62
  );
}

export async function visualSignals(file) {
  const size = 128;
  const { data } = await sharp(file)
    .resize(size, size, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixel = (x, y) => {
    const i = (y * size + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };

  let white = 0;
  let dark = 0;
  let satSum = 0;
  const lumas = new Float32Array(size * size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const [r, g, b] = pixel(x, y);
      const L = luma(r, g, b);
      lumas[y * size + x] = L;
      satSum += saturation(r, g, b);
      if (L > 232) white += 1;
      if (L < 70) dark += 1;
    }
  }

  const total = size * size;
  const whiteRatio = white / total;
  const darkRatio = dark / total;
  const meanSat = satSum / total;

  let hLines = 0;
  let vLines = 0;
  let hTransitions = 0;
  let vTransitions = 0;

  for (let y = 0; y < size; y += 1) {
    let rowDark = 0;
    let trans = 0;
    for (let x = 1; x < size; x += 1) {
      const a = lumas[y * size + x - 1];
      const b = lumas[y * size + x];
      if ((a < 90) !== (b < 90)) trans += 1;
      if (b < 70) rowDark += 1;
    }
    hTransitions += trans;
    if (trans >= 8 && rowDark > 4 && rowDark < size * 0.55) hLines += 1;
  }

  for (let x = 0; x < size; x += 1) {
    let colDark = 0;
    let trans = 0;
    for (let y = 1; y < size; y += 1) {
      const a = lumas[(y - 1) * size + x];
      const b = lumas[y * size + x];
      if ((a < 90) !== (b < 90)) trans += 1;
      if (b < 70) colDark += 1;
    }
    vTransitions += trans;
    if (trans >= 8 && colDark > 4 && colDark < size * 0.55) vLines += 1;
  }

  const tableLike =
    whiteRatio > 0.58 && hLines >= 6 && vLines >= 3
      ? Math.min(42, hLines * 1.8 + vLines * 1.4)
      : whiteRatio > 0.72 && (hLines >= 4 || vLines >= 3)
        ? 18
        : 0;
  const whiteCanvasScore =
    whiteRatio > 0.72 ? Math.round((whiteRatio - 0.55) * 70) : whiteRatio > 0.62 ? 6 : 0;
  const lowPhotoScore = meanSat < 0.08 && whiteRatio > 0.7 ? 16 : 0;

  const reasons = [];
  if (whiteRatio > 0.7) reasons.push(`${Math.round(whiteRatio * 100)}% near-white pixels`);
  if (tableLike >= 18) reasons.push("high table-line score");
  if (meanSat < 0.08 && whiteRatio > 0.7) reasons.push("low photographic color variance");

  return {
    whiteRatio,
    darkRatio,
    meanSat,
    hLines,
    vLines,
    hTransitions,
    vTransitions,
    tableLineScore: tableLike,
    whiteCanvasScore,
    lowPhotoScore,
    reasons,
    photographicScore: meanSat * 40 + (1 - whiteRatio) * 20,
  };

  return {
    whiteRatio,
    darkRatio,
    meanSat,
    hLines,
    vLines,
    hTransitions,
    vTransitions,
    tableLineScore,
    whiteCanvasScore,
    lowPhotoScore,
    reasons,
    photographicScore: meanSat * 40 + (1 - whiteRatio) * 20,
  };
}

function medianColor(samples) {
  const channel = (index) => {
    const values = samples.map((rgb) => rgb[index]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  return [channel(0), channel(1), channel(2)];
}

function kmeans(points, k, rounds = 12) {
  if (points.length === 0) return [];
  const centroids = [];
  const step = Math.max(1, Math.floor(points.length / k));
  for (let i = 0; i < k; i += 1) centroids.push(points[Math.min(points.length - 1, i * step)].slice());

  const assign = new Array(points.length).fill(0);
  for (let round = 0; round < rounds; round += 1) {
    for (let i = 0; i < points.length; i += 1) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centroids.length; c += 1) {
        const d = labDist(rgbToLab(...points[i]), rgbToLab(...centroids[c]));
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      assign[i] = best;
    }
    const sums = centroids.map(() => [0, 0, 0, 0]);
    assign.forEach((cluster, i) => {
      sums[cluster][0] += points[i][0];
      sums[cluster][1] += points[i][1];
      sums[cluster][2] += points[i][2];
      sums[cluster][3] += 1;
    });
    sums.forEach((sum, c) => {
      if (sum[3] === 0) return;
      centroids[c] = [sum[0] / sum[3], sum[1] / sum[3], sum[2] / sum[3]];
    });
  }

  const clusters = centroids.map((color, index) => ({
    color,
    count: assign.filter((value) => value === index).length,
  }));
  return clusters.filter((cluster) => cluster.count > 0);
}

export async function extractPalette(file) {
  const size = 96;
  const { data } = await sharp(file)
    .resize(size, size, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = [];
  for (let i = 0; i < data.length; i += 3) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  const border = [];
  const push = (x, y) => {
    const i = (y * size + x) * 3;
    border.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let i = 0; i < size; i += 1) {
    push(i, 0);
    push(i, size - 1);
    push(0, i);
    push(size - 1, i);
  }
  const background = medianColor(border);
  const bgLab = rgbToLab(...background);
  const bgIsStudio = luma(...background) > 215 && saturation(...background) < 0.14;

  const garment = [];
  const cx = size / 2;
  const cy = size * 0.58;
  for (let y = 6; y < size - 6; y += 1) {
    for (let x = 8; x < size - 8; x += 1) {
      const rgb = pixels[y * size + x];
      const [r, g, b] = rgb;
      const dist = labDist(rgbToLab(r, g, b), bgLab);
      const sat = saturation(r, g, b);
      const L = luma(r, g, b);
      if (dist < 10 && sat < 0.1) continue;
      if (bgIsStudio && L > 232 && sat < 0.1) continue;
      const inGarmentZone = Math.hypot(x - cx, y - cy) < size * 0.42;
      if (isSkinLike(r, g, b) && y < size * 0.45) continue;
      if (!inGarmentZone && dist < 18 && sat < 0.16) continue;
      const copies = inGarmentZone ? 3 : 1;
      for (let n = 0; n < copies; n += 1) garment.push(rgb);
    }
  }

  const sample = garment.length > 0 ? garment : pixels;
  const clusters = kmeans(sample, 8)
    .map((cluster) => {
      const [r, g, b] = cluster.color;
      return {
        ...cluster,
        r,
        g,
        b,
        sat: saturation(r, g, b),
        luma: luma(r, g, b),
        skin: isSkinLike(r, g, b),
        bg: labDist(rgbToLab(r, g, b), bgLab) < 16,
        nearWhite: luma(r, g, b) > 236 && saturation(r, g, b) < 0.1,
      };
    })
    .sort((a, b) => b.count - a.count);

  const garmentClusters = clusters.filter((cluster) => !cluster.bg);
  const useful = garmentClusters.filter((cluster) => !cluster.nearWhite);
  const hasGarmentColor = useful.some((cluster) => !cluster.skin && cluster.sat > 0.12);

  let picked = useful.filter((cluster) => {
    if (cluster.skin && hasGarmentColor) return false;
    return cluster.count / sample.length >= 0.02;
  });

  if (picked.length === 0) picked = useful.slice(0, 3);
  if (picked.length === 0) picked = clusters.slice(0, 2);

  const merged = [];
  for (const cluster of picked.sort((a, b) => b.sat * 0.6 + (b.count / sample.length) * 0.4 - (a.sat * 0.6 + a.count / sample.length * 0.4))) {
    const duplicate = merged.find((item) => labDist(rgbToLab(item.r, item.g, item.b), rgbToLab(cluster.r, cluster.g, cluster.b)) < 14);
    if (duplicate) {
      duplicate.count += cluster.count;
      continue;
    }
    merged.push({ ...cluster });
  }

  const ranked = merged
    .sort((a, b) => {
      const score = (item) => item.sat * 1.4 + (item.luma < 40 ? 0.35 : 0) + item.count / sample.length;
      return score(b) - score(a);
    })
    .slice(0, 5);

  return ranked.map((item) => hexFromRgb(item.r, item.g, item.b));
}
