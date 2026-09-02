"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ColorComparison } from "@/components/product/ColorComparison";
import { cn } from "@/lib/cn";
import { getVariantImage, type ProductColor } from "@/data/catalog";
import { pointerOrigin, usePointerZoom } from "@/components/product/ProductZoom";

type ProductGalleryProps = {
  color?: ProductColor;
  leftColor?: ProductColor;
  rightColor?: ProductColor;
  imageIndex: number;
  onImageIndexChange: (index: number) => void;
  appearance?: "classic" | "editorial";
  productName: string;
  showThumbs?: boolean;
  showArrows?: boolean;
  compareEnabled?: boolean;
};

export function ProductGallery({
  color,
  leftColor,
  rightColor,
  imageIndex,
  onImageIndexChange,
  appearance = "classic",
  productName,
  showThumbs = true,
  showArrows = true,
  compareEnabled = false,
}: ProductGalleryProps) {
  const activeColor = color ?? leftColor;
  if (!activeColor) return null;

  const thumbs = activeColor.images;
  const count = compareEnabled
    ? Math.max(leftColor?.images.length ?? 0, rightColor?.images.length ?? 0, 1)
    : Math.max(activeColor.images.length, 1);
  const editorial = appearance === "editorial";
  const src = getVariantImage(activeColor, imageIndex);

  return (
    <div className="grid gap-4">
      <div
        className={cn(
          editorial
            ? "relative"
            : "overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-[#eadfd5]",
        )}
      >
        <div className={cn("relative", !editorial && "overflow-hidden rounded-[1.5rem]")}>
          {compareEnabled && leftColor && rightColor ? (
            <ColorComparison
              leftSrc={getVariantImage(leftColor, imageIndex)}
              rightSrc={getVariantImage(rightColor, imageIndex)}
              leftLabel={leftColor.name}
              rightLabel={rightColor.name}
              alt={productName}
              appearance={appearance}
              radiusClassName={editorial ? "rounded-none" : "rounded-[1.5rem]"}
            />
          ) : (
            <ZoomStage
              key={src}
              src={src}
              alt={productName}
              editorial={editorial}
            />
          )}

          {showArrows ? (
            <>
              <button
                type="button"
                className={cn(
                  "absolute left-3 top-1/2 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#2f2430] shadow-sm ring-1 ring-[#eadfd5] transition duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  editorial && "left-4 bg-white/80",
                )}
                aria-label="Önceki ürün görseli"
                onClick={() => onImageIndexChange((imageIndex - 1 + count) % count)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={cn(
                  "absolute right-3 top-1/2 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#2f2430] shadow-sm ring-1 ring-[#eadfd5] transition duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  editorial && "right-4 bg-white/80",
                )}
                aria-label="Sonraki ürün görseli"
                onClick={() => onImageIndexChange((imageIndex + 1) % count)}
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          {editorial ? (
            <p className="pointer-events-none absolute right-4 top-4 z-20 text-[11px] tracking-[0.18em] text-white drop-shadow">
              {String(imageIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </p>
          ) : null}
        </div>
      </div>

      {showThumbs ? (
        <div
          className={cn(
            "grid grid-cols-4 gap-3 sm:grid-cols-5",
            editorial ? "lg:grid-cols-5" : "lg:grid-cols-6",
          )}
          role="listbox"
          aria-label="Ürün görselleri"
        >
          {thumbs.map((thumb, index) => {
            const active = index === imageIndex;
            return (
              <button
                key={`${thumb}-${index}`}
                type="button"
                role="option"
                aria-selected={active}
                aria-label={`${productName} görsel ${index + 1}`}
                className={cn(
                  "overflow-hidden bg-white p-1 ring-1 transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red",
                  editorial ? "rounded-none" : "rounded-2xl",
                  active ? "ring-brand-red" : "ring-[#eadfd5] hover:ring-[#d5c6bb]",
                )}
                onClick={() => onImageIndexChange(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb}
                  alt=""
                  width={200}
                  height={200}
                  className={cn(
                    "aspect-square size-full object-cover object-center",
                    editorial ? "rounded-none" : "rounded-xl",
                  )}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ZoomStage({ src, alt, editorial }: { src: string; alt: string; editorial: boolean }) {
  const zoom = usePointerZoom();

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-[#fbf7f1]",
        zoom.zoom.active ? "cursor-zoom-out" : "cursor-zoom-in",
        editorial ? "rounded-none" : "rounded-[1.5rem]",
      )}
      onClick={(event) => {
        if (event.button !== 0) return;
        const origin = pointerOrigin(event, event.currentTarget.getBoundingClientRect());
        zoom.toggleAt(origin.x, origin.y);
      }}
      onPointerMove={(event) => {
        if (!zoom.zoom.active) return;
        const origin = pointerOrigin(event, event.currentTarget.getBoundingClientRect());
        zoom.panTo(origin.x, origin.y);
      }}
      onPointerUp={(event) => {
        if (event.button !== 2) return;
        const origin = pointerOrigin(event, event.currentTarget.getBoundingClientRect());
        zoom.toggleAt(origin.x, origin.y);
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="size-full object-cover object-center" style={zoom.style} />
    </div>
  );
}
