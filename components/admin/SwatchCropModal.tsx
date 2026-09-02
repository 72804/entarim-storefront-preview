"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageRow } from "@/lib/catalog/map";

type Props = {
  images: ImageRow[];
  sourceImageId: string | null;
  x: number;
  y: number;
  zoom: number;
  onClose: () => void;
  onSave: (next: { sourceImageId: string; x: number; y: number; zoom: number }) => Promise<void>;
};

export function SwatchCropModal({ images, sourceImageId, x, y, zoom, onClose, onSave }: Props) {
  const [sourceId, setSourceId] = useState(sourceImageId ?? images[0]?.id ?? "");
  const [posX, setPosX] = useState(x || 50);
  const [posY, setPosY] = useState(y || 44);
  const [scale, setScale] = useState(zoom || 2.4);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const source = images.find((image) => image.id === sourceId) ?? images[0];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const moveBy = (dx: number, dy: number) => {
    setPosX((value) => Math.min(100, Math.max(0, value - dx * 0.18)));
    setPosY((value) => Math.min(100, Math.max(0, value - dy * 0.18)));
  };

  const cropStyle = {
    objectPosition: `${posX}% ${posY}%`,
    transform: `scale(${scale})`,
    transformOrigin: `${posX}% ${posY}%`,
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="max-h-[94vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Listeleme Deseni</h2>
            <p className="mt-1 text-sm text-neutral-500">Kare sabit kalır. Görseli kaydırıp yakınlaştırarak kumaş/deseni hizalayın.</p>
          </div>
          <button className="text-sm text-neutral-500" type="button" onClick={onClose}>
            Kapat
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Kaynak Görsel</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                className={`size-16 overflow-hidden rounded-md ring-2 ${sourceId === image.id ? "ring-[#e21e28]" : "ring-neutral-200"}`}
                onClick={() => setSourceId(image.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={`Kaynak ${index + 1}`} className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
          <div
            className="relative aspect-square max-h-[70vh] w-full touch-none overflow-hidden rounded-lg bg-neutral-100"
            onPointerDown={(event) => {
              (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
              drag.current = { x: event.clientX, y: event.clientY, px: posX, py: posY };
            }}
            onPointerMove={(event) => {
              if (event.pointerType === "touch" && event.nativeEvent instanceof PointerEvent) {
                /* pinch handled below */
              }
              if (!drag.current) return;
              moveBy(event.clientX - drag.current.x, event.clientY - drag.current.y);
              drag.current = { ...drag.current, x: event.clientX, y: event.clientY };
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onWheel={(event) => {
              event.preventDefault();
              setScale((value) => Math.min(8, Math.max(1, value + (event.deltaY < 0 ? 0.15 : -0.15))));
            }}
            onTouchStart={(event) => {
              if (event.touches.length === 2) {
                const [a, b] = [event.touches[0], event.touches[1]];
                pinch.current = {
                  dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
                  scale,
                };
              }
            }}
            onTouchMove={(event) => {
              if (event.touches.length === 2 && pinch.current) {
                const [a, b] = [event.touches[0], event.touches[1]];
                const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
                const next = pinch.current.scale * (dist / pinch.current.dist);
                setScale(Math.min(8, Math.max(1, next)));
              }
            }}
          >
            {source ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={source.url} alt="" draggable={false} className="size-full object-cover" style={cropStyle} />
            ) : null}
            <div className="pointer-events-none absolute inset-[18%] rounded-md ring-2 ring-white/90" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Önizleme</p>
            <div className="mt-2 size-12 overflow-hidden rounded-[7px] ring-1 ring-neutral-300 sm:size-11 lg:size-12">
              {source ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={source.url} alt="" className="size-full object-cover" style={cropStyle} />
              ) : null}
            </div>
            <label className="mt-5 block text-sm">
              Yakınlaştırma
              <input
                className="mt-2 w-44"
                type="range"
                min={1}
                max={8}
                step={0.1}
                value={scale}
                onChange={(event) => setScale(Number(event.target.value))}
              />
            </label>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border px-3 py-1 text-sm" type="button" onClick={() => setScale((v) => Math.max(1, v - 0.2))}>
                −
              </button>
              <button className="rounded-md border px-3 py-1 text-sm" type="button" onClick={() => setScale((v) => Math.min(8, v + 0.2))}>
                +
              </button>
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-md px-4 py-2 text-sm" type="button" onClick={onClose}>
            İptal
          </button>
          <button
            className="rounded-md bg-[#e21e28] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            type="button"
            disabled={saving || !source}
            onClick={async () => {
              if (!source) return;
              setSaving(true);
              setError(null);
              try {
                await onSave({ sourceImageId: source.id, x: posX, y: posY, zoom: scale });
                onClose();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Kaydedilemedi.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
