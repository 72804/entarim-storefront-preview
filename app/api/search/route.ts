import { NextResponse } from "next/server";
import { searchPublishedProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const products = await searchPublishedProducts(q);
  return NextResponse.json({
    products: products.slice(0, 8).map((product) => ({
      slug: product.slug,
      name: product.name,
      price: product.price,
      colors: product.colors.map((color) => ({ images: color.images.slice(0, 1) })),
    })),
  });
}
