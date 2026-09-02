import Link from "next/link";
import { cn } from "@/lib/cn";

export function PresentationReturnLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "text-[11px] font-medium tracking-[0.14em] text-current transition duration-200 hover:text-[#e21f27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e21f27]",
        className,
      )}
    >
      ← Tasarımlara Dön
    </Link>
  );
}
