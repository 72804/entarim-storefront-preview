"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, LayoutDashboard, LogOut, Package, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { logoutAdmin } from "@/app/admin/auth-actions";

const links = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderOpen },
];

export function AdminShell({ children, email }: { children: React.ReactNode; email?: string }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#f4f4f5] text-neutral-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-neutral-200 bg-white lg:w-60 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4 lg:block">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e21e28]">Entarim</p>
              <p className="mt-1 text-sm font-semibold">Yönetim</p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1 rounded-md bg-[#e21e28] px-3 py-2 text-xs font-semibold text-white lg:mt-5 lg:w-full lg:justify-center"
            >
              <Plus size={14} /> Yeni Ürün
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-3">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                    active ? "bg-neutral-100 font-semibold" : "text-neutral-600 hover:bg-neutral-50",
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <form action={logoutAdmin} className="hidden border-t border-neutral-200 px-4 py-4 lg:block">
            <p className="truncate text-xs text-neutral-500">{email}</p>
            <button className="mt-2 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#e21e28]" type="submit">
              <LogOut size={14} /> Çıkış
            </button>
          </form>
        </aside>
        <div className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
