"use client";

import { StoreProvider } from "@/store/StoreProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
