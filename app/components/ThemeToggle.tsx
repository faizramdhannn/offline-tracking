"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage bisa diblokir saat halaman dimuat di dalam iframe
    return null;
  }
};

const applyTheme = (theme: "light" | "dark") => {
  const apply = () => {
    document.documentElement.dataset.theme = theme;
  };

  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
};

export default function ThemeToggle() {
  // Selama user belum memilih sendiri, ikuti perubahan tema perangkat
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (!readStored()) applyTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti tema terang atau gelap"
      title="Ganti tema"
      className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface text-muted shadow-card transition hover:text-fg active:scale-95"
    >
      <Sun className="absolute size-[18px] transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0" />
      <Moon className="absolute size-[18px] rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" />
    </button>
  );
}
