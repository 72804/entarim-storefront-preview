"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export const ZOOM_SCALE = 2.55;
export const ZOOM_DURATION_MS = 300;

export type ZoomState = {
  active: boolean;
  originX: number;
  originY: number;
  panning: boolean;
};

const INITIAL_ZOOM: ZoomState = {
  active: false,
  originX: 0.5,
  originY: 0.5,
  panning: false,
};

export function usePointerZoom() {
  const reducedMotion = usePrefersReducedMotion();
  const [zoom, setZoom] = useState<ZoomState>(INITIAL_ZOOM);

  const reset = useCallback(() => {
    setZoom((current) =>
      current.active
        ? { ...current, active: false, panning: false }
        : current,
    );
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  const activateAt = useCallback((originX: number, originY: number) => {
    setZoom({
      active: true,
      originX: clamp01(originX),
      originY: clamp01(originY),
      panning: false,
    });
  }, []);

  const toggleAt = useCallback((originX: number, originY: number) => {
    setZoom((current) =>
      current.active
        ? { ...current, active: false, panning: false }
        : {
            active: true,
            originX: clamp01(originX),
            originY: clamp01(originY),
            panning: false,
          },
    );
  }, []);

  const panTo = useCallback((originX: number, originY: number) => {
    setZoom((current) => {
      if (!current.active) return current;
      return {
        ...current,
        originX: clamp01(originX),
        originY: clamp01(originY),
        panning: true,
      };
    });
  }, []);

  const style: CSSProperties = {
    transform: `scale(${zoom.active ? ZOOM_SCALE : 1})`,
    transformOrigin: `${zoom.originX * 100}% ${zoom.originY * 100}%`,
    transition:
      zoom.panning || reducedMotion
        ? "none"
        : `transform ${ZOOM_DURATION_MS}ms ease-out`,
    willChange: zoom.active ? "transform" : undefined,
  };

  return {
    zoom,
    scale: zoom.active ? ZOOM_SCALE : 1,
    reducedMotion,
    style,
    reset,
    activateAt,
    toggleAt,
    panTo,
  };
}

export function pointerOrigin(
  event: { clientX: number; clientY: number },
  rect: DOMRect,
) {
  return {
    x: clamp01((event.clientX - rect.left) / rect.width),
    y: clamp01((event.clientY - rect.top) / rect.height),
  };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
