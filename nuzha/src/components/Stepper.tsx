export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="flex w-full items-center gap-3">
      {steps.map((s, i) => {
        const st = i + 1 < current ? "done" : i + 1 === current ? "current" : "upcoming";
        return (
          <div key={s} className="contents">
            <div className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${st === "done" ? "bg-success text-on-accent" : st === "current" ? "bg-accent text-on-accent" : "bg-muted text-ink-2"}`}>{st === "done" ? "✓" : i + 1}</span>
              <span className={`text-sm font-medium ${st === "upcoming" ? "text-ink-2" : "text-ink"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${st === "done" ? "bg-success" : "bg-line"}`} />}
          </div>
        );
      })}
    </div>
  );
}
