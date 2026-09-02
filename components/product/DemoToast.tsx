"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type DemoToastProps = {
  message: string | null;
  onDismiss: () => void;
  appearance?: "classic" | "editorial";
};

export function DemoToast({
  message,
  onDismiss,
  appearance = "classic",
}: DemoToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 2600);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  const editorial = appearance === "editorial";

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={cn(
            "fixed bottom-24 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-3 px-4 py-3 shadow-lg lg:bottom-8",
            editorial
              ? "rounded-none border border-neutral-200 bg-white text-sm tracking-[0.04em] text-neutral-800"
              : "rounded-full bg-white text-sm font-bold text-[#2f2430] ring-1 ring-[#eadfd5]",
          )}
        >
          <span
            className={cn(
              "grid size-7 place-items-center",
              editorial
                ? "bg-neutral-100 text-neutral-800"
                : "rounded-full bg-emerald-50 text-emerald-700",
            )}
          >
            <Check size={16} />
          </span>
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
