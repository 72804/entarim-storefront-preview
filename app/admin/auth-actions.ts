"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseSetupMessage } from "@/lib/admin/auth";

export async function loginAdmin(_prev: { error: string }, formData: FormData): Promise<{ error: string }> {
  const setup = supabaseSetupMessage();
  if (setup) return { error: setup };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createServerSupabase();
  if (!supabase) return { error: "Supabase oturumu oluşturulamadı." };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-posta veya şifre hatalı." };
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminSupabase();
  if (!user || !admin) {
    await supabase.auth.signOut();
    return { error: "Admin bağlantısı yok." };
  }
  const { data: allowed } = await admin.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!allowed) {
    await supabase.auth.signOut();
    return { error: "Bu hesap admin yetkisine sahip değil." };
  }
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
