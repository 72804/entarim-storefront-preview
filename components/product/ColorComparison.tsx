"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent,
} from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  pointerOrigin,
  ZOOM_DURATION_MS,
  ZOOM_SCALE,
} from "@/components/product/ProductZoom";

type Appearance = "classic" | "editorial";

type ColorComparisonProps = {
  leftSrc: string;
  rightSrc: string;
  leftLabel: string;
  rightLabel: string;
  alt: string;
  appearance?: Appearance;
  className?: string;
  radiusClassName?: string;
};

const DIVIDER_DEFAULT = 50;
const DRAG_THRESHOLD = 5;

export function ColorComparison({
  leftSrc,
  rightSrc,
  leftLabel,
  rightLabel,
  alt,
  appearance = "classic",
  className,
  radiusClassName = "rounded-[1.5rem]",
}: ColorComparisonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef(DIVIDER_DEFAULT);
  const dragPointer = useRef<number | null>(null);
  const activePointer = useRef<number | null>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
  } | null>(null);

  const [divider, setDivider] = useState(DIVIDER_DEFAULT);
  const [hovering, setHovering] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const zoomedRef = useRef(false);
  const originRef = useRef({ x: 0.5, y: 0.5 });

  const writeZoom = useCallback(
    (active: boolean, x: number, y: number, animate: boolean) => {
      zoomedRef.current = active;
      originRef.current = { x, y };
      const node = rootRef.current;
      if (!node) return;
      node.style.setProperty("--zoom", String(active ? ZOOM_SCALE : 1));
      node.style.setProperty("--origin-x", `${x * 100}%`);
      node.style.setProperty("--origin-y", `${y * 100}%`);
      node.style.setProperty(
        "--zoom-transition",
        animate && !reducedMotion
          ? `transform ${ZOOM_DURATION_MS}ms ease-out`
          : "none",
      );
    },
    [reducedMotion],
  );

  const setZoomedUi = useCallback(
    (active: boolean, x: number, y: number) => {
      writeZoom(active, x, y, true);
      setZoomed(active);
    },
    [writeZoom],
  );

  const resetZoom = useCallback(() => {
    setZoomedUi(false, originRef.current.x, originRef.current.y);
  }, [setZoomedUi]);

  const applyDivider = useCallback((value: number) => {
    const next = Math.min(92, Math.max(8, value));
    dividerRef.current = next;
    rootRef.current?.style.setProperty("--divider", `${next}%`);
    return next;
  }, []);

  const commitDivider = useCallback(
    (value: number) => {
      setDivider(applyDivider(value));
    },
    [applyDivider],
  );

  const dividerFromClientX = useCallback((clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return dividerRef.current;
    return ((clientX - rect.left) / rect.width) * 100;
  }, []);

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragPointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    commitDivider(dividerFromClientX(event.clientX));
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragPointer.current !== event.pointerId) return;
    event.preventDefault();
    applyDivider(dividerFromClientX(event.clientX));
  };

  const onHandlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (dragPointer.current !== event.pointerId) return;
    dragPointer.current = null;
    commitDivider(dividerFromClientX(event.clientX));
  };

  const onStagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button === 2 || event.button === 1) {
      event.preventDefault();
    }
    if (dragPointer.current !== null) return;
    activePointer.current = event.pointerId;
    startPoint.current = { x: event.clientX, y: event.clientY };
    moved.current = false;
  };

  const onStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragPointer.current !== null) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (
      activePointer.current === event.pointerId &&
      Math.hypot(
        event.clientX - startPoint.current.x,
        event.clientY - startPoint.current.y,
      ) > DRAG_THRESHOLD
    ) {
      moved.current = true;
    }

    if (zoomedRef.current && dragPointer.current === null) {
      const origin = pointerOrigin(event, rect);
      writeZoom(true, origin.x, origin.y, false);
    }
  };

  const onStagePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragPointer.current !== null) return;
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    if (moved.current) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const origin = pointerOrigin(event, rect);
    setZoomedUi(!zoomedRef.current, origin.x, origin.y);
  };

  const onContextMenu = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      commitDivider(dividerRef.current - (event.shiftKey ? 8 : 2));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      commitDivider(dividerRef.current + (event.shiftKey ? 8 : 2));
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (zoomedRef.current) resetZoom();
      else setZoomedUi(true, dividerRef.current / 100, 0.5);
    }
    if (event.key === "Escape") {
      resetZoom();
    }
    if (event.key === "Home") {
      event.preventDefault();
      commitDivider(8);
    }
    if (event.key === "End") {
      event.preventDefault();
      commitDivider(92);
    }
  };

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resetZoom]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const distance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY,
      );
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        pinchRef.current = {
          startDist: distance(event.touches),
          startScale: zoomedRef.current ? ZOOM_SCALE : 1,
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && pinchRef.current) {
        event.preventDefault();
        const next = distance(event.touches) / pinchRef.current.startDist;
        if (next > 1.12 && !zoomedRef.current) {
          const rect = node.getBoundingClientRect();
          const midX =
            (event.touches[0].clientX + event.touches[1].clientX) / 2;
          const midY =
            (event.touches[0].clientY + event.touches[1].clientY) / 2;
          setZoomedUi(
            true,
            (midX - rect.left) / rect.width,
            (midY - rect.top) / rect.height,
          );
        }
        if (next < 0.88 && zoomedRef.current) {
          resetZoom();
        }
      }
    };

    const onTouchEnd = () => {
      pinchRef.current = null;
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd);
    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
    };
  }, [resetZoom, setZoomedUi]);

  const editorial = appearance === "editorial";
  const showLabels = editorial ? hovering : true;
  const zoomStyle: CSSProperties = {
    transform: "scale(var(--zoom, 1))",
    transformOrigin: "var(--origin-x, 50%) var(--origin-y, 50%)",
    transition: "var(--zoom-transition, none)",
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "comparison-root relative isolate overflow-hidden bg-[#f5ede4] select-none",
        radiusClassName,
        zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in touch-pan-y",
        className,
      )}
      style={{ "--divider": `${divider}%` } as CSSProperties}
      tabIndex={0}
      role="slider"
      aria-label={`${leftLabel} ve ${rightLabel} renk karşılaştırması`}
      aria-valuemin={8}
      aria-valuemax={92}
      aria-valuenow={Math.round(divider)}
      aria-valuetext={`Sol ${leftLabel}, sağ ${rightLabel}, ayırıcı %${Math.round(divider)}`}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onContextMenu={onContextMenu}
      onPointerDown={onStagePointerDown}
      onPointerMove={onStagePointerMove}
      onPointerUp={onStagePointerUp}
      onPointerCancel={onStagePointerUp}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden [container-type:inline-size]">
        <div className="absolute inset-0" style={zoomStyle}>
          <Layer
            src={rightSrc}
            alt={`${alt}, ${rightLabel}`}
            reduced={reducedMotion}
          />
        </div>

        <div
          className="absolute inset-y-0 left-0 z-[1] overflow-hidden"
          style={{ width: "var(--divider)" }}
        >
          <div className="absolute top-0 left-0 h-full w-[100cqw]" style={zoomStyle}>
            <Layer
              src={leftSrc}
              alt={`${alt}, ${leftLabel}`}
              reduced={reducedMotion}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          "absolute top-0 z-20 flex h-full w-10 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center border-0 bg-transparent p-0",
          editorial ? "focus-visible:outline-none" : "",
        )}
        style={{ left: "var(--divider)" }}
        aria-label="Karşılaştırma çizgisini sürükle"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
        onClick={(event) => event.stopPropagation()}
      >
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2",
            editorial ? "bg-white/90 mix-blend-difference" : "bg-white/85",
          )}
        />
        <span
          className={cn(
            "pointer-events-none relative grid place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(15,23,42,0.18)]",
            editorial ? "size-[26px]" : "size-7",
          )}
        >
          <span className="flex gap-[3px]">
            <span className="block h-3 w-px bg-[#2f2430]/50" />
            <span className="block h-3 w-px bg-[#2f2430]/50" />
          </span>
        </span>
      </button>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-black/35 to-transparent px-3 pb-3 pt-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:px-4",
          editorial && "tracking-[0.22em]",
          showLabels ? "opacity-100" : "opacity-0",
        )}
        style={{
          transition: reducedMotion ? "none" : "opacity 200ms ease-out",
        }}
      >
        <span className="max-w-[46%] truncate drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
          {leftLabel}
        </span>
        <span className="max-w-[46%] truncate text-right drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

function Layer({
  src,
  alt,
  reduced,
}: {
  src: string;
  alt: string;
  reduced: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt={alt}
      width={1200}
      height={1800}
      draggable={false}
      className="absolute inset-0 size-full object-cover object-center"
      style={{
        animation: reduced ? undefined : "comparison-fade 220ms ease-out",
      }}
    />
  );
}
