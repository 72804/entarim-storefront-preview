import Link from "next/link";
import { PrototypeMark } from "@/components/product/PrototypeMark";

export function EditorialFooter() {
  return (
    <footer className="border-t border-neutral-200 px-4 py-12 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[0.24em]">ENTARİM</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-500">
            Anne adayları için konforu, zarafeti ve günlük kullanımı bir araya getiren hamile giyim koleksiyonu.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm text-neutral-600 sm:grid-cols-3">
          <div className="grid gap-2">
            <Link href="/hamile-elbise" className="hover:text-brand-red">
              Hamile Elbise
            </Link>
            <Link href="/yeni-sezon" className="hover:text-brand-red">
              Yeni Sezon
            </Link>
            <Link href="/lohusa" className="hover:text-brand-red">
              Lohusa
            </Link>
          </div>
          <div className="grid gap-2">
            <Link href="/iletisim" className="hover:text-brand-red">
              İletişim
            </Link>
            <Link href="/kargo-teslimat" className="hover:text-brand-red">
              Kargo
            </Link>
            <Link href="/iade-politikasi" className="hover:text-brand-red">
              İade
            </Link>
          </div>
          <div className="grid gap-2">
            <a href="tel:+902122331837">+90 (212) 233 18 37</a>
            <a href="mailto:info@entarim.com">info@entarim.com</a>
            <p>Osmanbey, İstanbul</p>
          </div>
        </div>
      </div>
      <p className="mt-10 text-xs text-neutral-400">© 2026 Entarim Hamile Giyim. Tüm hakları saklıdır.</p>
      <PrototypeMark />
    </footer>
  );
}
