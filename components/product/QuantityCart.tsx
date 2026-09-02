"use client";

import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";

type QuantityCartProps = {
  quantity: number;
  onQuantityChange: (value: number) => void;
  onAddToCart: () => void;
  wishlist: boolean;
  onToggleWishlist: () => void;
  appearance?: "classic" | "editorial";
  sticky?: boolean;
};

export function QuantityCart({
  quantity,
  onQuantityChange,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  appearance = "classic",
  sticky = false,
}: QuantityCartProps) {
  const editorial = appearance === "editorial";

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3",
        sticky &&
          "fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden",
      )}
    >
      {editorial ? (
        <div className="flex h-12 items-center border border-neutral-300">
          <button
            type="button"
            aria-label="Adeti azalt"
            className="grid size-12 place-items-center text-neutral-700 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e21f27]"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Adeti artır"
            className="grid size-12 place-items-center text-neutral-700 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e21f27]"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-12 w-24 shrink-0 items-center justify-between rounded-full bg-white px-3 text-xs font-bold text-slate-600 ring-1 ring-[#eadfd5] sm:w-32 sm:px-4 sm:text-sm">
          Adet
          <input
            className="w-9 bg-transparent text-center text-sm font-extrabold text-[#e21f27] outline-none sm:w-12"
            type="number"
            min={1}
            value={quantity}
            aria-label="Adet"
            onChange={(event) =>
              onQuantityChange(Math.max(1, Number(event.target.value) || 1))
            }
          />
        </label>
      )}

      <button
        type="button"
        className={cn(
          "inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 px-4 text-xs font-extrabold text-white transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e21f27] sm:px-6 sm:text-sm",
          editorial
            ? "rounded-none bg-[#e21f27] tracking-[0.18em] hover:bg-[#b9141b]"
            : "rounded-full bg-[#e21f27] shadow-lg shadow-[#e21f27]/15 hover:-translate-y-0.5 hover:bg-[#b9141b]",
        )}
        onClick={onAddToCart}
      >
        <span className="truncate">{editorial ? "SEPETE EKLE" : "Sepete Ekle"}</span>
        {editorial ? null : <ShoppingBag size={16} />}
      </button>

      <button
        type="button"
        aria-pressed={wishlist}
        aria-label={wishlist ? "Favorilerden çıkar" : "Favorilere ekle"}
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center text-xl transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e21f27]",
          editorial
            ? wishlist
              ? "border border-[#e21f27] text-[#e21f27]"
              : "border border-neutral-300 text-neutral-700 hover:border-neutral-800"
            : wishlist
              ? "rounded-full bg-[#e21f27] text-white"
              : "rounded-full bg-white text-[#e21f27] ring-1 ring-[#eadfd5] hover:bg-[#fbf7f1]",
        )}
        onClick={onToggleWishlist}
      >
        <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
