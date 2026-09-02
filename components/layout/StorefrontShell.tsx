"use client";

import { ClassicMobileNav, StorefrontHeader } from "@/components/classic/ClassicHeader";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";

export function StorefrontShell({
  children,
  hideHeaderOnScroll = false,
}: {
  children: React.ReactNode;
  hideHeaderOnScroll?: boolean;
}) {
  return (
    <div className="classic-page min-h-screen bg-[#fbf7f1] text-[#2f2430]">
      <StorefrontHeader hideOnScroll={hideHeaderOnScroll} />
      {children}
      <StorefrontFooter />
      <ClassicMobileNav />
    </div>
  );
}
