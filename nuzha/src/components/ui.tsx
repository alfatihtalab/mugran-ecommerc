"use client";
import Link from "next/link";
import { forwardRef } from "react";

type BtnProps = { variant?: "primary" | "secondary" | "ghost"; size?: "md" | "sm"; href?: string; className?: string; children: React.ReactNode } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const btnBase = "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed select-none";
const btnSize = { md: "px-5 py-3 text-sm", sm: "px-4 py-2 text-xs" };
const btnVariant = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover disabled:bg-muted disabled:text-disabled",
  secondary: "border-[1.5px] border-line-strong text-ink hover:bg-muted disabled:border-line disabled:text-disabled",
  ghost: "text-ink hover:bg-muted disabled:text-disabled",
};

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button({ variant = "primary", size = "md", href, className = "", children, ...rest }, ref) {
  const cls = `${btnBase} ${btnSize[size]} ${btnVariant[variant]} ${className}`;
  if (href) return <Link href={href} className={cls} onClick={rest.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}>{children}</Link>;
  return <button ref={ref} className={cls} {...rest}>{children}</button>;
});

export function Badge({ tone = "accent", children, className = "" }: { tone?: "accent" | "secondary" | "highlight" | "neutral" | "error"; children: React.ReactNode; className?: string }) {
  const tones = {
    accent: "bg-accent-subtle text-accent",
    secondary: "bg-secondary-subtle text-success",
    highlight: "bg-highlight-subtle text-ink",
    neutral: "bg-muted text-ink",
    error: "bg-error-subtle text-error",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}>{children}</span>;
}

export function Input({ label, helper, error, className = "", ...rest }: { label: string; helper?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-xs font-medium text-ink-2">{label}</span>
      <input
        className={`w-full rounded-sm border bg-surface px-4 py-3 text-base text-ink outline-none placeholder:text-ink-2/70 focus:border-focus focus:ring-2 focus:ring-focus/20 disabled:bg-muted disabled:text-disabled ${error ? "border-error" : "border-line"}`}
        {...rest}
      />
      {(error || helper) && <span className={`text-sm ${error ? "text-error" : "text-ink-2"}`}>{error || helper}</span>}
    </label>
  );
}

export function Chip({ active, children, onClick, href }: { active?: boolean; children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls = `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${active ? "bg-inverse text-ink-inv" : "border border-line-strong text-ink hover:bg-muted"}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md border border-line bg-surface p-6 ${className}`}>{children}</div>;
}

export function Overline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-2 ${className}`}>{children}</div>;
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-accent" : "bg-muted"}`}>
      <span className={`absolute top-1 h-3 w-3 rounded-full bg-surface transition-all ${on ? "start-5" : "start-1"}`} />
    </button>
  );
}

export function Radio({ on }: { on: boolean }) {
  return <span className={`inline-block h-[18px] w-[18px] shrink-0 rounded-full border ${on ? "border-[5px] border-accent" : "border-[1.5px] border-line-strong"}`} />;
}

export function Checkbox({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input type="checkbox" className="peer sr-only" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span className={`flex h-4 w-4 items-center justify-center rounded-[4px] border-[1.5px] text-[10px] ${on ? "border-accent bg-accent text-on-accent" : "border-line-strong bg-surface"}`}>{on ? "✓" : ""}</span>
      {label}
    </label>
  );
}
