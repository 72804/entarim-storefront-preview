import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession, supabaseSetupMessage } from "@/lib/admin/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session.user) redirect("/admin");
  const setupError = supabaseSetupMessage();
  const supabase = await createServerSupabase();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const denied = !setupError && user && !session.user ? "Bu hesap admin yetkisine sahip değil." : null;
  return (
    <main className="mx-auto flex min-h-screen w-[min(calc(100%-2rem),420px)] items-center">
      <div className="w-full py-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e21e28]">Entarim</p>
        <h1 className="mt-2 text-3xl font-semibold">Yönetim girişi</h1>
        <p className="mt-2 text-sm text-neutral-500">Bu alan yalnızca yetkili kullanıcılar içindir.</p>
        <AdminLoginForm setupError={setupError ?? denied} />
      </div>
    </main>
  );
}
