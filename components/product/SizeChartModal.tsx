"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { product } from "@/data/product";

type SizeChartModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SizeChartModal({ open, onClose }: SizeChartModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Beden tablosu"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-xl text-slate-900 shadow-sm transition hover:bg-[#fbf7f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Beden tablosunu kapat"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.sizeGuide}
          alt="Beden tablosu"
          className="max-h-[82vh] size-full object-contain"
        />
      </div>
    </div>
  );
}
