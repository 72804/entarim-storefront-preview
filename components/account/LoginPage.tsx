"use client";

import { useState, type FormEvent } from "react";

export function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Demo sürümünde üyelik ve giriş işlemi devre dışıdır. Alışverişe devam edebilirsiniz.");
  };

  return (
    <main className="mx-auto w-[min(calc(100%-2rem),480px)] pb-28 pt-12 lg:pb-16">
      <h1 className="font-display text-4xl font-semibold text-rose-950">Giriş Yap</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Hesabınız yoksa da ürünleri inceleyebilir, sepete ekleyebilir ve favorilere kaydedebilirsiniz.
      </p>
      <form className="mt-8 grid gap-4 rounded-[1.75rem] bg-white p-6 ring-1 ring-[#eadfd5]" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-bold text-[#2f2430]">
          E-posta
          <input
            className="h-12 rounded-xl bg-[#fbf7f1] px-4 text-sm font-medium outline-none ring-1 ring-[#eadfd5] focus:ring-rose-300"
            type="email"
            name="email"
            required
            autoComplete="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#2f2430]">
          Şifre
          <input
            className="h-12 rounded-xl bg-[#fbf7f1] px-4 text-sm font-medium outline-none ring-1 ring-[#eadfd5] focus:ring-rose-300"
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        <button
          className="mt-2 h-12 rounded-full bg-rose-800 text-sm font-bold text-white"
          type="submit"
        >
          Giriş Yap
        </button>
        {message ? <p className="text-center text-xs leading-5 text-slate-500">{message}</p> : null}
      </form>
    </main>
  );
}
