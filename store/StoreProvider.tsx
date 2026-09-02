"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/data/types";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  colorId: string;
  colorName: string;
  size?: string;
  price: number;
  quantity: number;
};

type StoreValue = {
  cart: CartItem[];
  favorites: string[];
  cartCount: number;
  cartTotal: number;
  addToCart: (
    product: CatalogProduct,
    options: { colorId: string; colorName: string; image: string; quantity: number; size?: string },
  ) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);
const CART_KEY = "entarim-cart";
const FAV_KEY = "entarim-favorites";
const EMPTY_CART: CartItem[] = [];
const EMPTY_FAVORITES: string[] = [];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function createPersistedStore<T>(key: string, fallback: T) {
  let memory: T | undefined;
  const listeners = new Set<() => void>();

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        memory = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const getSnapshot = () => {
    if (memory !== undefined) return memory;
    memory = readJson<T>(key, fallback);
    return memory;
  };

  const set = (updater: T | ((current: T) => T)) => {
    const current = getSnapshot();
    memory = typeof updater === "function" ? (updater as (value: T) => T)(current) : updater;
    window.localStorage.setItem(key, JSON.stringify(memory));
    listeners.forEach((listener) => listener());
  };

  return { subscribe, getSnapshot, set };
}

const cartStore = createPersistedStore<CartItem[]>(CART_KEY, EMPTY_CART);
const favoriteStore = createPersistedStore<string[]>(FAV_KEY, EMPTY_FAVORITES);

export function StoreProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, () => EMPTY_CART);
  const favorites = useSyncExternalStore(
    favoriteStore.subscribe,
    favoriteStore.getSnapshot,
    () => EMPTY_FAVORITES,
  );

  const addToCart = useCallback(
    (
      product: CatalogProduct,
      options: { colorId: string; colorName: string; image: string; quantity: number; size?: string },
    ) => {
      const key = `${product.slug}:${options.colorId}:${options.size ?? ""}`;
      cartStore.set((current) => {
        const existing = current.find((item) => item.key === key);
        if (existing) {
          return current.map((item) =>
            item.key === key ? { ...item, quantity: item.quantity + options.quantity } : item,
          );
        }
        return [
          ...current,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: options.image,
            colorId: options.colorId,
            colorName: options.colorName,
            size: options.size,
            price: product.price,
            quantity: options.quantity,
          },
        ];
      });
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    cartStore.set((current) =>
      current
        .map((item) => (item.key === key ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    cartStore.set((current) => current.filter((item) => item.key !== key));
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    favoriteStore.set((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      favorites,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addToCart,
      setQuantity,
      removeItem,
      isFavorite: (slug) => favorites.includes(slug),
      toggleFavorite,
    }),
    [addToCart, cart, favorites, removeItem, setQuantity, toggleFavorite],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
