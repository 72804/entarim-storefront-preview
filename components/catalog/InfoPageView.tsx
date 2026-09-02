import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { InfoPage } from "@/data/types";

export function InfoPageView({ page }: { page: InfoPage }) {
  return (
    <main className="mx-auto w-[min(calc(100%-2rem),820px)] pb-28 pt-8 lg:pb-16">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-400" aria-label="Sayfa yolu">
        <Link className="hover:text-brand-red" href="/">
          Ana Sayfa
        </Link>
        <ChevronRight size={14} />
        <span className="font-bold text-brand-red">{page.title}</span>
      </nav>
      <h1 className="font-display mt-6 text-4xl font-semibold leading-tight text-rose-950 sm:text-5xl">
        {page.title}
      </h1>
      <div className="mt-8 grid gap-5 text-sm leading-7 text-slate-600 sm:text-base">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
