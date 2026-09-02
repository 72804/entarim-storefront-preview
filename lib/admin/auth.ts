import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export function supabaseSetupMessage() {
  if (!isSupabaseConfigured()) {
    return "Supabase henüz bağlanmadı. Lütfen ortam değişkenlerini ekleyin.";
  }
  if (!isSupabaseAdminConfigured()) {
    return "SUPABASE_SERVICE_ROLE_KEY eksik. Admin yazma işlemleri çalışmaz.";
  }
  return null;
}

export async function getAdminSession() {
  const setup = supabaseSetupMessage();
  if (setup) return { user: null, error: setup };
  const supabase = await createServerSupabase();
  if (!supabase) return { user: null, error: "Supabase oturumu oluşturulamadı." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, error: "Giriş gerekli." };
  const admin = createAdminSupabase();
  if (!admin) return { user: null, error: "Admin bağlantısı yok." };
  const { data, error } = await admin.from("admin_users").select("user_id, email").eq("user_id", user.id).maybeSingle();
  if (error || !data) return { user: null, error: "Bu hesap admin yetkisine sahip değil." };
  return { user, error: null };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.user) {
    redirect("/admin/login");
  }
  const admin = createAdminSupabase();
  if (!admin) redirect("/admin/login");
  return { user: session.user, admin };
}
