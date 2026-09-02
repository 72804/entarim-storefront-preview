import type { Metadata } from "next";
import { EditorialProductPage } from "@/components/editorial/EditorialProductPage";

export const metadata: Metadata = {
  title: "Editorial Konsept",
  description: "Entarim için hazırlanan editorial tasarım konsepti.",
  robots: { index: false, follow: false },
};

export default function EditorialConceptPage() {
  return <EditorialProductPage />;
}
