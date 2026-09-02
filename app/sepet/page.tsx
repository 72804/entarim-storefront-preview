import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export const metadata: Metadata = {
  title: "Sepetim",
};

export default function SepetPage() {
  return (
    <StorefrontShell>
      <CartPage />
    </StorefrontShell>
  );
}
