"use client";
import { useEffect, useRef, useState } from "react";

export function SmartImage({ src, alt, seed, className = "", ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { seed?: string }) {
  const [s, setS] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true); }, [s]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={s}
      alt={alt ?? ""}
      loading="lazy"
      className={`img-fade block h-full w-full object-cover ${loaded ? "is-loaded" : ""} ${className}`}
      onLoad={() => setLoaded(true)}
      onError={() => { const fb = `https://picsum.photos/seed/${encodeURIComponent(seed ?? alt ?? "nuzha")}/1000/1000`; if (s !== fb) setS(fb); }}
      {...rest}
    />
  );
}
