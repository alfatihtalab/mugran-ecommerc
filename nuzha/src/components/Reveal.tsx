"use client";
import { useEffect, useRef, useState } from "react";

/** Fades content in when it scrolls into view. `delay` staggers items in a grid. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!("IntersectionObserver" in window)) { const id = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(id); }
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as "div";
  return <T ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</T>;
}
