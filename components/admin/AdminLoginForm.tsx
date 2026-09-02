"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/app/admin/auth-actions";

export function AdminLoginForm({ setupError }: { setupError: string | null }) {
  const [state, action, pending] = useActionState(loginAdmin, { error: "" });
  const error = setupError ?? (state.error || null);

  return (
    <form action={action} className="mt-8 grid gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <label className="grid gap-1 text-sm font-medium">
        E-posta
        <input
          className="h-11 rounded-md border border-neutral-300 px-3 text-sm"
          type="email"
          name="email"
          required
          autoComplete="username"
          disabled={Boolean(setupError)}
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Şifre
        <input
          className="h-11 rounded-md border border-neutral-300 px-3 text-sm"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          disabled={Boolean(setupError)}
        />
      </label>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        className="h-11 rounded-md bg-[#e21e28] text-sm font-semibold text-white disabled:opacity-50"
        type="submit"
        disabled={pending || Boolean(setupError)}
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
