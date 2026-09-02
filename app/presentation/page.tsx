import type { Metadata } from "next";
import { PresentationHome } from "@/components/presentation/PresentationHome";

export const metadata: Metadata = {
  title: "Tasarım Önizlemeleri",
  description: "Entarim için hazırlanan tasarım yaklaşımlarını inceleyebilirsiniz.",
  robots: { index: false, follow: false },
};

export default function PresentationPage() {
  return <PresentationHome />;
}
