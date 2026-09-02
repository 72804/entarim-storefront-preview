import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { fetchAdminCategories, fetchAdminProduct } from "@/lib/admin/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([fetchAdminProduct(id), fetchAdminCategories()]);
  if (!product) notFound();
  return <ProductEditor product={product} categories={categories} />;
}
