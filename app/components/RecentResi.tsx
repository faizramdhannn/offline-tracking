"use client";

import * as m from "motion/react-m";
import { History } from "lucide-react";
import { EASE } from "./motion";

export default function RecentResi({
  recent,
  onPick,
  onClear,
}: {
  recent: string[];
  onPick: (resi: string) => void;
  onClear: () => void;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="mt-3 flex flex-wrap items-center gap-2"
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
        <History className="size-3.5" />
        Terakhir dicek
      </span>

      {recent.map((resi) => (
        <button
          key={resi}
          type="button"
          onClick={() => onPick(resi)}
          className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-fg active:scale-95"
        >
          {resi}
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="rounded-md px-1 text-xs text-subtle underline-offset-2 transition-colors hover:text-fg hover:underline"
      >
        Hapus
      </button>
    </m.div>
  );
}
