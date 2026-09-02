"use client";

import { useCallback, useMemo, useState } from "react";
import {
  featuredProduct,
  getColor,
  getVariantImage,
  type CatalogProduct,
} from "@/data/catalog";
import { useStore } from "@/store/StoreProvider";

export type CompareSlot = "A" | "B";

export function useEditorialProductState(source: CatalogProduct = featuredProduct) {
  const colors = source.colors;
  const [variantA, setVariantA] = useState(colors[0].id);
  const [variantB, setVariantB] = useState(colors[1]?.id ?? colors[0].id);
  const [nextSlot, setNextSlot] = useState<CompareSlot>("A");
  const [lastSelected, setLastSelected] = useState(colors[0].id);
  const [hoverPreview, setHoverPreview] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string>(source.sizes[0] ?? "38");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const store = useStore();
  const wishlist = store.isFavorite(source.slug);

  const displayA = hoverPreview && nextSlot === "A" ? hoverPreview : variantA;
  const displayB = hoverPreview && nextSlot === "B" ? hoverPreview : variantB;

  const colorA = getColor(source, displayA);
  const colorB = getColor(source, displayB);
  const compareEnabled = colors.length > 1;

  const comparedIds = useMemo(() => new Set<string>([variantA, variantB]), [variantA, variantB]);

  const selectColor = useCallback(
    (id: string) => {
      setLastSelected(id);
      setHoverPreview(null);
      if (!compareEnabled) return;

      if (nextSlot === "A") {
        if (id === variantB) {
          setVariantA(variantB);
          setVariantB(variantA);
        } else {
          setVariantA(id);
        }
        setNextSlot("B");
        return;
      }

      if (id === variantA) {
        setVariantB(variantA);
        setVariantA(variantB);
      } else {
        setVariantB(id);
      }
      setNextSlot("A");
    },
    [compareEnabled, nextSlot, variantA, variantB],
  );

  const previewColor = useCallback(
    (id: string | null) => {
      if (!id || id === variantA || id === variantB) {
        setHoverPreview(null);
        return;
      }
      setHoverPreview(id);
    },
    [variantA, variantB],
  );

  const addToCart = useCallback(() => {
    store.addToCart(source, {
      colorId: lastSelected,
      colorName: getColor(source, lastSelected).name,
      image: getColor(source, lastSelected).images[0],
      quantity,
      size,
    });
    setToast("Ürün sepete eklendi");
  }, [lastSelected, quantity, size, source, store]);

  const goImage = useCallback(
    (next: number) => {
      const count = Math.max(colorA.images.length, colorB.images.length, 1);
      setImageIndex(((next % count) + count) % count);
    },
    [colorA.images.length, colorB.images.length],
  );

  return {
    product: source,
    variantA,
    variantB,
    displayA,
    displayB,
    colorA,
    colorB,
    nextSlot,
    lastSelected,
    comparedIds,
    imageIndex,
    leftSrc: getVariantImage(colorA, imageIndex),
    rightSrc: getVariantImage(colorB, imageIndex),
    size,
    quantity,
    wishlist,
    toast,
    sizeChartOpen,
    maxIndex: Math.max(colorA.images.length, colorB.images.length) - 1,
    compareEnabled,
    setImageIndex,
    goImage,
    selectColor,
    previewColor,
    setSize,
    setQuantity,
    setToast,
    setSizeChartOpen,
    addToCart,
    toggleWishlist: () => store.toggleFavorite(source.slug),
  };
}
