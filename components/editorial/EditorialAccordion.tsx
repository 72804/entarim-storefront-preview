"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Item = {
  title: string;
  content: string[];
  extra?: ReactNode;
};

type EditorialAccordionProps = {
  items: Item[];
  openId: string | null;
  onChange: (title: string | null) => void;
};

export function EditorialAccordion({ items, openId, onChange }: EditorialAccordionProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="border-t border-neutral-200">
      {items.map((item) => {
        const open = openId === item.title;
        return (
          <div key={item.title} className="border-b border-neutral-200">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-[12px] font-medium uppercase tracking-[0.18em] text-neutral-800 transition duration-200 hover:text-[#e21f27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e21f27]"
              aria-expanded={open}
              onClick={() => onChange(open ? null : item.title)}
            >
              {item.title}
              <span aria-hidden="true" className="text-lg font-light">
                {open ? "–" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  key="content"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-5 text-sm leading-7 text-neutral-600">
                    {item.content.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {item.extra}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
