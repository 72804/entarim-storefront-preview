import type { Metadata } from "next";
import { ClassicProductPage } from "@/components/classic/ClassicProductPage";

export const metadata: Metadata = {
  title: "HAMİLE ŞİFON ELBİSE | Entarim Hamile Giyim",
  description: "Hamile Elbisesi",
};

export default function ClassicPreviewPage() {
  return <ClassicProductPage />;
}
