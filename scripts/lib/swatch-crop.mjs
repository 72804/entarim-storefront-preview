import sharp from "sharp";
import { isSkinLike, labDist } from "./image-analysis.mjs";

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
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

function medianColor(samples) {
  const channel = (index) => {
    const values = samples.map((rgb) => rgb[index]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  };
  return [channel(0), channel(1), channel(2)];
}

function isLikelyBackground(r, g, b, bgLab, bgLuma, bgSat) {
  const L = luma(r, g, b);
  const sat = saturation(r, g, b);
  const dist = labDist(rgbToLab(r, g, b), bgLab);
  if (L > 236 && sat < 0.08) return true;
  if (dist < 12 && sat < 0.12) return true;
  if (bgLuma > 210 && bgSat < 0.12 && L > 215 && sat < 0.1 && dist < 22) return true;
  return false;
}

function namedRegions() {
  return [
    { name: "upper-torso", cx: 0.5, cy: 0.32, size: 0.2 },
    { name: "mid-torso", cx: 0.5, cy: 0.42, size: 0.22 },
    { name: "waist", cx: 0.5, cy: 0.52, size: 0.22 },
    { name: "lower-torso", cx: 0.5, cy: 0.58, size: 0.2 },
    { name: "upper-skirt", cx: 0.5, cy: 0.62, size: 0.24 },
    { name: "mid-skirt", cx: 0.5, cy: 0.7, size: 0.24 },
    { name: "left-torso", cx: 0.38, cy: 0.42, size: 0.18 },
    { name: "right-torso", cx: 0.62, cy: 0.42, size: 0.18 },
    { name: "left-skirt", cx: 0.4, cy: 0.64, size: 0.2 },
    { name: "right-skirt", cx: 0.6, cy: 0.64, size: 0.2 },
    { name: "bust", cx: 0.5, cy: 0.36, size: 0.16 },
    { name: "side-front", cx: 0.42, cy: 0.46, size: 0.16 },
    { name: "side-back", cx: 0.58, cy: 0.46, size: 0.16 },
    { name: "belly", cx: 0.48, cy: 0.5, size: 0.18 },
  ];
}

function gridRegions() {
  const regions = [];
  const sizes = [0.16, 0.2, 0.24, 0.3];
  const xs = [0.36, 0.42, 0.5, 0.58, 0.64];
  const ys = [0.32, 0.4, 0.48, 0.56, 0.64, 0.72];
  for (const size of sizes) {
    for (const cx of xs) {
      for (const cy of ys) {
        regions.push({ name: `grid-${cx}-${cy}-${size}`, cx, cy, size });
      }
    }
  }
  return regions;
}

export function candidateRegions() {
  const seen = new Set();
  const out = [];
  for (const region of [...namedRegions(), ...gridRegions()]) {
    const key = `${region.cx.toFixed(2)}:${region.cy.toFixed(2)}:${region.size.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(region);
  }
  return out;
}

function scoreRegion(stats) {
  const { skin, background, sat, texture, chroma, edgeSkin, topSkin, bottomSkin, sideSkin, cy, meanLuma, split } = stats;
  const garment = Math.max(0, 1 - skin - background);

  let skinPenalty = skin * 70;
  if (skin > 0.1) skinPenalty += 90 + (skin - 0.1) * 240;
  else if (skin > 0.02) skinPenalty += (skin - 0.02) * 110;

  let backgroundPenalty = background * 55;
  if (background > 0.35) backgroundPenalty += 80 + (background - 0.35) * 180;
  if (background > 0.5) backgroundPenalty += 70;

  const emptyStudio = meanLuma > 220 && sat < 0.1 && texture < 0.045;
  if (emptyStudio) backgroundPenalty += 120;

  const limbPenalty = edgeSkin * 130 + sideSkin * 110 + topSkin * 80 + bottomSkin * 90;
  const facePenalty = cy < 0.28 ? (0.28 - cy) * 90 : 0;
  const floorPenalty = cy > 0.78 && background > 0.2 ? (cy - 0.78) * 90 : 0;
  const mixedPenalty = split > 24 && texture < 0.085 ? 20 + (split - 24) * 2.4 : split > 40 ? 14 : 0;
  const lowCropPenalty = cy > 0.6 && texture < 0.08 ? (cy - 0.6) * 90 : 0;
  const legsPenalty = stats.betweenLegs ? 95 + (cy > 0.5 ? 30 : 0) : 0;
  const torsoBonus = cy >= 0.34 && cy <= 0.54 ? 12 : 0;

  const garmentColorScore = garment * 120 + chroma * 40;
  const textureScore = Math.min(texture, 0.32) * 190;
  const saturationScore = Math.min(sat, 0.55) * 45;
  const patternBonus = texture > 0.08 && chroma > 0.07 ? 24 : 0;
  const solidBonus = garment > 0.78 && skin < 0.05 && background < 0.14 && texture > 0.025 ? 16 : 0;
  const flatPenalty = texture < 0.03 && sat < 0.08 ? 36 : 0;

  return (
    garmentColorScore +
    textureScore +
    saturationScore +
    patternBonus +
    solidBonus +
    torsoBonus -
    skinPenalty -
    backgroundPenalty -
    limbPenalty -
    facePenalty -
    floorPenalty -
    mixedPenalty -
    lowCropPenalty -
    legsPenalty -
    flatPenalty
  );
}

function isLimbPixel(r, g, b, refs) {
  const lab = rgbToLab(r, g, b);
  const dGarment = labDist(lab, refs.garmentLab);
  const dFace = labDist(lab, refs.faceLab);
  if (dGarment < 14) return false;
  if (dFace < 16 && dFace + 5 < dGarment) return true;
  if (isSkinLike(r, g, b) && dGarment > 18) return true;
  return false;
}

function analyzeCrop(data, width, height, left, top, size, refs) {
  const { lab: bgLab, luma: bgLuma, sat: bgSat } = refs.background;
  let skin = 0;
  let background = 0;
  let satSum = 0;
  let chromaSum = 0;
  let lumaSum = 0;
  let textureSum = 0;
  let textureCount = 0;
  let edgeSkin = 0;
  let edgeCount = 0;
  let topSkin = 0;
  let topCount = 0;
  let bottomSkin = 0;
  let bottomCount = 0;
  let sideSkin = 0;
  let sideCount = 0;
  let count = 0;
  const topLab = [0, 0, 0];
  const botLab = [0, 0, 0];
  let topN = 0;
  let botN = 0;
  let leftBg = 0;
  let midBg = 0;
  let rightBg = 0;
  let leftN = 0;
  let midN = 0;
  let rightN = 0;
  const edge = Math.max(1, Math.round(size * 0.18));

  const pixel = (x, y) => {
    const i = (y * width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };

  for (let y = top; y < top + size; y += 1) {
    for (let x = left; x < left + size; x += 1) {
      const [r, g, b] = pixel(x, y);
      const lx = x - left;
      const ly = y - top;
      const sat = saturation(r, g, b);
      satSum += sat;
      lumaSum += luma(r, g, b);
      chromaSum += sat * (1 - Math.abs(luma(r, g, b) / 255 - 0.5));
      const lab = rgbToLab(r, g, b);
      if (ly < size * 0.4) {
        topLab[0] += lab[0];
        topLab[1] += lab[1];
        topLab[2] += lab[2];
        topN += 1;
      }
      if (ly > size * 0.6) {
        botLab[0] += lab[0];
        botLab[1] += lab[1];
        botLab[2] += lab[2];
        botN += 1;
      }
      const skinPx = isLimbPixel(r, g, b, refs);
      const bgPx = isLikelyBackground(r, g, b, bgLab, bgLuma, bgSat);
      if (skinPx) skin += 1;
      if (bgPx) background += 1;
      count += 1;
      if (lx < size / 3) {
        leftN += 1;
        if (bgPx) leftBg += 1;
      } else if (lx > (size * 2) / 3) {
        rightN += 1;
        if (bgPx) rightBg += 1;
      } else {
        midN += 1;
        if (bgPx) midBg += 1;
      }

      const onEdge = lx < edge || ly < edge || lx >= size - edge || ly >= size - edge;
      if (onEdge) {
        edgeCount += 1;
        if (skinPx) edgeSkin += 1;
      }
      if (ly < edge) {
        topCount += 1;
        if (skinPx) topSkin += 1;
      }
      if (ly >= size - edge) {
        bottomCount += 1;
        if (skinPx) bottomSkin += 1;
      }
      if (lx < edge || lx >= size - edge) {
        sideCount += 1;
        if (skinPx) sideSkin += 1;
      }

      if (x + 1 < left + size) {
        const next = pixel(x + 1, y);
        textureSum += Math.abs(luma(r, g, b) - luma(...next));
        textureCount += 1;
      }
      if (y + 1 < top + size) {
        const next = pixel(x, y + 1);
        textureSum += Math.abs(luma(r, g, b) - luma(...next));
        textureCount += 1;
      }
    }
  }

  return {
    skin: skin / count,
    background: background / count,
    sat: satSum / count,
    chroma: chromaSum / count,
    meanLuma: lumaSum / count,
    texture: textureCount ? textureSum / textureCount / 255 : 0,
    edgeSkin: edgeCount ? edgeSkin / edgeCount : 0,
    topSkin: topCount ? topSkin / topCount : 0,
    bottomSkin: bottomCount ? bottomSkin / bottomCount : 0,
    sideSkin: sideCount ? sideSkin / sideCount : 0,
    split:
      topN && botN
        ? labDist(
            [topLab[0] / topN, topLab[1] / topN, topLab[2] / topN],
            [botLab[0] / botN, botLab[1] / botN, botLab[2] / botN],
          )
        : 0,
    betweenLegs:
      midN && leftN && rightN
        ? midBg / midN > 0.18 && leftBg / leftN < 0.12 && rightBg / rightN < 0.12
        : false,
  };
}

function sampleRect(data, width, height, x0, y0, x1, y1) {
  const samples = [];
  const left = Math.max(0, Math.floor(x0 * width));
  const right = Math.min(width - 1, Math.ceil(x1 * width));
  const top = Math.max(0, Math.floor(y0 * height));
  const bottom = Math.min(height - 1, Math.ceil(y1 * height));
  for (let y = top; y <= bottom; y += 2) {
    for (let x = left; x <= right; x += 2) {
      const i = (y * width + x) * 3;
      samples.push([data[i], data[i + 1], data[i + 2]]);
    }
  }
  return samples.length ? medianColor(samples) : [210, 200, 190];
}

function sampleBackground(data, width, height) {
  const samples = [];
  const push = (x, y) => {
    const i = (y * width + x) * 3;
    samples.push([data[i], data[i + 1], data[i + 2]]);
  };
  const inset = 2;
  for (let i = 0; i < width; i += 2) {
    push(i, inset);
    push(i, height - 1 - inset);
  }
  for (let i = 0; i < height; i += 2) {
    push(inset, i);
    push(width - 1 - inset, i);
  }
  push(inset, inset);
  push(width - 1 - inset, inset);
  push(inset, height - 1 - inset);
  push(width - 1 - inset, height - 1 - inset);
  const bg = medianColor(samples);
  return {
    rgb: bg,
    lab: rgbToLab(...bg),
    luma: luma(...bg),
    sat: saturation(...bg),
  };
}

export async function loadAnalysisImage(file) {
  const meta = await sharp(file).metadata();
  const analysis = await sharp(file)
    .resize({ width: 280, height: 280, fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = analysis;
  const background = sampleBackground(data, info.width, info.height);
  const face = sampleRect(data, info.width, info.height, 0.38, 0.04, 0.62, 0.18);
  const garment = sampleRect(data, info.width, info.height, 0.4, 0.34, 0.6, 0.54);
  const lower = sampleRect(data, info.width, info.height, 0.4, 0.68, 0.6, 0.82);
  const separateBottoms = labDist(rgbToLab(...garment), rgbToLab(...lower)) > 26;

  return {
    origWidth: meta.width ?? info.width,
    origHeight: meta.height ?? info.height,
    width: info.width,
    height: info.height,
    data,
    background,
    faceLab: rgbToLab(...face),
    garmentLab: rgbToLab(...garment),
    separateBottoms,
  };
}

function clampCrop(cx, cy, size, width, height) {
  const side = Math.max(8, Math.round(size * Math.min(width, height)));
  let left = Math.round(cx * width - side / 2);
  let top = Math.round(cy * height - side / 2);
  left = Math.min(Math.max(0, left), Math.max(0, width - side));
  top = Math.min(Math.max(0, top), Math.max(0, height - side));
  return { left, top, side };
}

function isUsable(stats, strict) {
  if (stats.background > (strict ? 0.38 : 0.55)) return false;
  if (stats.skin > (strict ? 0.16 : 0.32) && stats.edgeSkin > 0.12) return false;
  if (stats.meanLuma > 224 && stats.sat < 0.09 && stats.texture < 0.04) return false;
  if (strict && stats.texture < 0.02 && stats.sat < 0.07) return false;
  if (strict && stats.split > 32 && stats.texture < 0.08) return false;
  if (strict && stats.betweenLegs) return false;
  return true;
}

export function scoreCandidates(analysis, regions = candidateRegions(), options = {}) {
  const { data, width, height, background, faceLab, garmentLab, separateBottoms } = analysis;
  const refs = { background, faceLab, garmentLab };
  const scored = [];
  const skipLower = Boolean(options.isTop || separateBottoms);

  for (const region of regions) {
    if (skipLower && region.cy > 0.5) continue;
    const crop = clampCrop(region.cx, region.cy, region.size, width, height);
    if (crop.top < height * 0.12 && region.cy < 0.24) continue;
    const stats = analyzeCrop(data, width, height, crop.left, crop.top, crop.side, refs);
    const score = scoreRegion({ ...stats, cy: region.cy });
    scored.push({
      ...region,
      ...crop,
      ...stats,
      score,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const strict = scored.filter((item) => isUsable(item, true));
  if (strict.length > 0) return strict;
  const relaxed = scored.filter((item) => isUsable(item, false));
  if (relaxed.length > 0) return relaxed;
  return scored;
}

export function toOriginalExtract(analysis, candidate) {
  const scaleX = analysis.origWidth / analysis.width;
  const scaleY = analysis.origHeight / analysis.height;
  const left = Math.max(0, Math.round(candidate.left * scaleX));
  const top = Math.max(0, Math.round(candidate.top * scaleY));
  let width = Math.round(candidate.side * scaleX);
  let height = Math.round(candidate.side * scaleY);
  width = Math.min(width, analysis.origWidth - left);
  height = Math.min(height, analysis.origHeight - top);
  const side = Math.min(width, height);
  return { left, top, width: side, height: side };
}

export function extractFromPercent(analysis, override) {
  const left = Math.round(((override.x ?? 0) / 100) * analysis.origWidth);
  const top = Math.round(((override.y ?? 0) / 100) * analysis.origHeight);
  const width = Math.round(((override.width ?? 18) / 100) * analysis.origWidth);
  const height = Math.round(((override.height ?? override.width ?? 18) / 100) * analysis.origHeight);
  const side = Math.max(16, Math.min(width, height, analysis.origWidth - left, analysis.origHeight - top));
  return {
    left: Math.min(Math.max(0, left), analysis.origWidth - side),
    top: Math.min(Math.max(0, top), analysis.origHeight - side),
    width: side,
    height: side,
  };
}

export async function writeSwatch(file, extract, dest) {
  await sharp(file)
    .extract(extract)
    .resize(160, 160, { fit: "cover" })
    .webp({ quality: 82 })
    .toFile(dest);
}
