"use client";
import { useState } from "react";

export function SmartImage({ src, alt, seed, className = "", ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { seed?: string }) {
  const [s, setS] = useState(src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={s}
      alt={alt ?? ""}
      loading="lazy"
      className={`block h-full w-full object-cover ${className}`}
      onError={() => { const fb = `https://picsum.photos/seed/${encodeURIComponent(seed ?? alt ?? "nuzha")}/1000/1000`; if (s !== fb) setS(fb); }}
      {...rest}
    />
  );
}
