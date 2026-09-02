"use client";

import { useCallback, useState } from "react";
import {
  featuredProduct,
  getColor,
  getVariantImage,
  type CatalogProduct,
} from "@/data/catalog";
import { useStore } from "@/store/StoreProvider";

export function useProductState(source: CatalogProduct = featuredProduct) {
  const colors = source.colors;
  const [selectedVariant, setSelectedVariant] = useState(colors[0].id);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string>(source.sizes[0] ?? "38");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const store = useStore();
  const wishlist = store.isFavorite(source.slug);

  const selectedColor = getColor(source, selectedVariant);

  const selectColor = useCallback(
    (id: string) => {
      setSelectedVariant(id);
      setImageIndex(0);
    },
    [],
  );

  const addToCart = useCallback(() => {
    const color = getColor(source, selectedVariant);
    store.addToCart(source, {
      colorId: selectedVariant,
      colorName: color.name,
      image: color.images[0],
      quantity,
      size,
    });
    setToast("Ürün sepete eklendi");
  }, [quantity, selectedVariant, size, source, store]);

  const goImage = useCallback(
    (next: number) => {
      const count = Math.max(selectedColor.images.length, 1);
      setImageIndex(((next % count) + count) % count);
    },
    [selectedColor.images.length],
  );

  return {
    product: source,
    selectedVariant,
    selectedColor,
    lastSelected: selectedVariant,
    imageIndex,
    currentSrc: getVariantImage(selectedColor, imageIndex),
    size,
    quantity,
    wishlist,
    toast,
    sizeChartOpen,
    maxIndex: selectedColor.images.length - 1,
    setImageIndex,
    goImage,
    selectColor,
    setSize,
    setQuantity,
    setToast,
    setSizeChartOpen,
    addToCart,
    toggleWishlist: () => store.toggleFavorite(source.slug),
  };
}
