"use client";

import { ArrowRight, Loader2, Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export default function SearchBar({
  value,
  loading,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="group flex items-center gap-1 rounded-2xl border border-line bg-surface/85 p-1.5 shadow-card backdrop-blur-md transition-colors focus-within:border-accent"
    >
      <Search
        aria-hidden
        className="ml-2.5 size-[18px] shrink-0 text-subtle transition-colors group-focus-within:text-accent-text"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Masukkan nomor resi"
        aria-label="Nomor resi"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="search"
        className="h-11 min-w-0 flex-1 bg-transparent px-2 font-mono text-base uppercase text-fg outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-subtle"
      />

      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Hapus nomor resi"
          className="grid size-9 shrink-0 place-items-center rounded-lg text-subtle transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X className="size-4" />
        </button>
      ) : null}

      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="group/btn inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 font-display text-sm text-primary-fg transition hover:brightness-110 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
      >
        Lacak
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
        )}
      </button>
    </form>
  );
}
