import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Mail, Phone } from "lucide-react";

const columns = [
  {
    title: "Alışveriş",
    links: [
      { label: "Yeni Sezon", href: "/yeni-sezon" },
      { label: "Hamile Elbise", href: "/hamile-elbise" },
      { label: "Emzirme Giyim", href: "/emzirme-giyim" },
      { label: "Pantolon & Tayt", href: "/pantolon-tayt" },
      { label: "Sipariş Takibi", href: "/siparis-takibi" },
      { label: "Hamile Bluz & Tünik", href: "/tunik-bluz" },
    ],
  },
  {
    title: "Destek",
    links: [
      { label: "İletişim", href: "/iletisim" },
      { label: "Kargo ve Teslimat", href: "/kargo-teslimat" },
      { label: "İade Politikası", href: "/iade-politikasi" },
      { label: "Cayma Hakkı", href: "/cayma-hakki" },
      { label: "Sıkça Sorulan Sorular", href: "/sss" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Satıcı Bilgileri", href: "/satici-bilgileri" },
      { label: "Güvenli Ödeme", href: "/guvenli-odeme" },
      { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    ],
  },
  {
    title: "Sözleşmeler",
    links: [
      { label: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis-sozlesmesi" },
      { label: "Ön Bilgilendirme Formu", href: "/on-bilgilendirme-formu" },
      { label: "Üyelik Sözleşmesi", href: "/uyelik-sozlesmesi" },
      { label: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni" },
      { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
      { label: "Çerez Politikası", href: "/cerez-politikasi" },
    ],
  },
];

export function StorefrontFooter() {
  return (
    <footer className="bg-white shadow-sm ring-1 ring-[#eadfd5]">
      <div className="mx-auto grid w-full max-w-[1640px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_3fr_0.95fr] lg:gap-14 lg:px-10 lg:py-12 xl:px-14">
        <div>
          <Link className="inline-flex items-center" href="/" aria-label="Entarim Hamile Giyim ana sayfa">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-10 w-auto object-contain" src="/entarim/logo/logo.png" alt="Entarim Hamile Giyim" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
            Anne adayları için konforu, zarafeti ve günlük kullanımı bir araya getiren hamile giyim koleksiyonu.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Social href="https://www.instagram.com/entarim/" label="Instagram" icon={<span className="text-[11px] font-bold">in</span>} />
            <Social href="https://www.facebook.com/entarim" label="Facebook" icon={<span className="text-[11px] font-bold">f</span>} />
            <Social href="https://www.pinterest.com/entarim/" label="Pinterest" icon={<span className="text-[11px] font-bold">P</span>} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4 sm:gap-8 lg:gap-10">
          {columns.map((column) => (
            <div key={column.title} className="rounded-2xl border border-[#eadfd5] p-4 sm:border-0 sm:p-0">
              <p className="text-sm font-extrabold text-[#2f2430]">{column.title}</p>
              <ul className="mt-4 grid gap-3 text-sm text-slate-500">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link className="transition duration-200 hover:text-[#e21f27]" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[#fbf7f1] p-5 ring-1 ring-[#eadfd5] lg:p-6">
          <h3 className="text-sm font-extrabold text-[#2f2430]">İletişim Bilgileri</h3>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Adres: Kodaman Sokak 76/1, Osmanbey, 34363 İstanbul / Turkey
          </p>
          <div className="mt-4 grid gap-2">
            <a
              className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm text-slate-600 ring-1 ring-[#eadfd5] transition duration-200 hover:text-[#e21f27] hover:shadow-sm"
              href="tel:+902122331837"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27]">
                <Phone size={16} />
              </span>
              <strong className="text-xs">+90 (212) 233 18 37</strong>
            </a>
            <a
              className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm text-slate-600 ring-1 ring-[#eadfd5] transition duration-200 hover:text-[#e21f27] hover:shadow-sm"
              href="mailto:info@entarim.com"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27]">
                <Mail size={16} />
              </span>
              <strong className="text-xs">info@entarim.com</strong>
            </a>
            <Link
              className="mt-1 inline-flex items-center gap-2 text-xs font-extrabold text-[#e21f27] transition duration-200 hover:text-[#b9141b]"
              href="/iletisim"
            >
              İletişim sayfası
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#eadfd5]">
        <div className="mx-auto flex w-full max-w-[1640px] flex-col gap-4 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 xl:px-14">
          <p>© 2026 Entarim Hamile Giyim. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-slate-600 shadow-sm ring-1 ring-[#eadfd5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="h-4 w-auto" src="/entarim/brand/iyzico-logo.svg" alt="iyzico" />
              <span className="h-3 w-px bg-[#eadfd5]" />
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#e21f27]">Güvenli Ödeme</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      className="grid size-10 place-items-center rounded-full bg-[#fbf7f1] text-[#e21f27] transition duration-200 hover:bg-[#e21f27] hover:text-white"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
