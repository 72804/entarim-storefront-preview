"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/store/StoreProvider";

export function CartPage() {
  const { cart, cartTotal, setQuantity, removeItem } = useStore();

  return (
    <main className="mx-auto w-[min(calc(100%-2rem),1100px)] pb-28 pt-8 lg:pb-16">
      <h1 className="font-display text-4xl font-semibold text-rose-950 sm:text-5xl">Sepetim</h1>
      {cart.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-white p-10 text-center ring-1 ring-[#eadfd5]">
          <ShoppingBag className="mx-auto text-brand-red" size={32} />
          <p className="mt-4 text-sm text-slate-500">Sepetiniz şu anda boş.</p>
          <Link
            className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white"
            href="/yeni-sezon"
          >
            Alışverişe başla
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="grid gap-4">
            {cart.map((item) => (
              <li
                key={item.key}
                className="flex gap-4 rounded-[1.75rem] bg-white p-4 ring-1 ring-[#eadfd5] sm:p-5"
              >
                <Link href={`/${item.slug}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    className="size-24 rounded-2xl object-cover sm:size-28"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link className="text-sm font-bold text-[#2f2430] hover:text-brand-red" href={`/${item.slug}`}>
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.colorName}
                    {item.size ? ` · Beden ${item.size}` : ""}
                  </p>
                  <strong className="mt-3 block text-sm text-brand-red">{formatPrice(item.price)}</strong>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full bg-[#fbf7f1] ring-1 ring-[#eadfd5]">
                      <button
                        type="button"
                        className="grid size-9 place-items-center"
                        aria-label="Adeti azalt"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        className="grid size-9 place-items-center"
                        aria-label="Adeti artır"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-brand-red"
                      onClick={() => removeItem(item.key)}
                    >
                      <Trash2 size={14} />
                      Kaldır
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-[1.75rem] bg-white p-6 ring-1 ring-[#eadfd5]">
            <h2 className="text-sm font-extrabold text-[#2f2430]">Sipariş özeti</h2>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">Ara toplam</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              2.500 TL ve üzeri alışverişlerde kargo ücretsizdir. Bu demo sürümünde kargo hesaplanmaz.
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white"
            >
              Ödemeye geç
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-slate-400">
              Demo sürümünde ödeme işlemi devre dışıdır.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
