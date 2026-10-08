"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "recent_resi";
const MAX_RECENT = 5;
const EMPTY: string[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedList: string[] = EMPTY;

// Snapshot harus stabil: array baru hanya dibuat kalau isi storage berubah
const getSnapshot = () => {
  let raw: string | null = null;

  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage bisa diblokir saat halaman dimuat di dalam iframe
    return cachedList;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;

    try {
      const parsed: unknown = JSON.parse(raw ?? "[]");
      cachedList = Array.isArray(parsed)
        ? parsed
            .filter((r): r is string => typeof r === "string")
            .slice(0, MAX_RECENT)
        : EMPTY;
    } catch {
      cachedList = EMPTY;
    }
  }

  return cachedList;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const write = (list: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}

  listeners.forEach((listener) => listener());
};

export function useRecentResi() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const remember = useCallback((resi: string) => {
    const current = getSnapshot();
    if (current[0] === resi) return;

    write([resi, ...current.filter((r) => r !== resi)].slice(0, MAX_RECENT));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { recent, remember, clear };
}
