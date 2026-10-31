"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function ThemeApplier() {
  const theme = useStore((s) => s.theme);
  const hydrated = useStore((s) => s.hydrated);
  useEffect(() => { if (useStore.persist.hasHydrated()) useStore.getState().markHydrated(); return useStore.persist.onFinishHydration(() => useStore.getState().markHydrated()); }, []);
  useEffect(() => { if (hydrated) document.documentElement.dataset.theme = theme; }, [theme, hydrated]);
  return null;
}
