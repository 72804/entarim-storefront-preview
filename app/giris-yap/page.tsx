import type { Metadata } from "next";
import { LoginPage } from "@/components/account/LoginPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export const metadata: Metadata = {
  title: "Giriş Yap",
};

export default function GirisYapPage() {
  return (
    <StorefrontShell>
      <LoginPage />
    </StorefrontShell>
  );
}
