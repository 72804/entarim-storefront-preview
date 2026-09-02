"use client";

import { useEffect, useRef, useState } from "react";

const HIDE_AFTER = 80;
const SHOW_AT = 10;

export function useHeaderAtTop() {
  const [visible, setVisible] = useState(true);
  const visibleRef = useRef(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const next = visibleRef.current ? y <= HIDE_AFTER : y <= SHOW_AT;
      if (next === visibleRef.current) return;
      visibleRef.current = next;
      setVisible(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
