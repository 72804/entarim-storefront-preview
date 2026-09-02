import type { Metadata } from "next";
import { EditorialProductPage } from "@/components/editorial/EditorialProductPage";

export const metadata: Metadata = {
  title: "HAMİLE ŞİFON ELBİSE | Entarim",
  description: "Hamile Elbisesi",
};

export default function EditorialPreviewPage() {
  return <EditorialProductPage />;
}
