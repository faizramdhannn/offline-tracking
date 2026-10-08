"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
} from "motion/react";
import * as m from "motion/react-m";

import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import ResultSkeleton from "./components/ResultSkeleton";
import TrackingResult from "./components/TrackingResult";
import RecentResi from "./components/RecentResi";
import { useRecentResi } from "./hooks/useRecentResi";
import { normalizeResi, useTracking } from "./hooks/useTracking";

// Harus sama dengan pola rewrite di next.config.ts
const SHAREABLE_RESI = /^[A-Z0-9-]{5,40}$/;

const readResiFromUrl = () => {
  const segment = window.location.pathname.split("/").filter(Boolean)[0] ?? "";

  try {
    return normalizeResi(decodeURIComponent(segment));
  } catch {
    return "";
  }
};

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </m.div>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const { state, track, reset } = useTracking();
  const { recent, remember, clear } = useRecentResi();

  useEffect(() => {
    if (state.status === "success") remember(state.resi);
  }, [state, remember]);

  // ── Resi dari URL (/NOMOR_RESI), termasuk tombol back/forward ──────────
  useEffect(() => {
    const syncFromUrl = () => {
      const resi = readResiFromUrl();
      setInput(resi);

      if (resi) track(resi);
      else reset();
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [track, reset]);

  const submit = useCallback(
    (raw: string) => {
      const resi = normalizeResi(raw);
      if (!resi) return;

      setInput(resi);

      const path = `/${resi}`;
      if (SHAREABLE_RESI.test(resi) && window.location.pathname !== path) {
        window.history.pushState(null, "", path);
      }

      track(resi);
    },
    [track]
  );

  // ── Listener postMessage dari parent app (iframe) ──────────────────────
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Terima dari semua origin karena parent app bisa beda-beda domain,
      // tapi validasi type message-nya
      if (event.data?.type !== "CHECK_RESI") return;

      submit(String(event.data.resi || ""));
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [submit]);

  // Posisi kursor untuk sorotan kartu (utility `spotlight` di globals.css)
  const trackPointer = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;

    const card = (e.target as Element).closest<HTMLElement>(".spotlight");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const showRecent =
    recent.length > 0 &&
    (state.status === "idle" || state.status === "error");

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main
          onPointerMove={trackPointer}
          className="mx-auto w-full max-w-2xl px-4 pb-14 pt-5 sm:pt-8"
        >
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Torch Indonesia</p>
              <h1 className="text-lg sm:text-xl">Lacak Pengiriman</h1>
            </div>
            <ThemeToggle />
          </header>

          <div className="sticky top-3 z-20">
            <SearchBar
              value={input}
              loading={state.status === "loading"}
              onChange={setInput}
              onSubmit={submit}
            />
          </div>

          {showRecent ? (
            <RecentResi recent={recent} onPick={submit} onClear={clear} />
          ) : null}

          <div className="mt-4">
            <AnimatePresence mode="wait" initial={false}>
              {state.status === "idle" && (
                <Stage key="idle">
                  <EmptyState />
                </Stage>
              )}

              {state.status === "loading" && (
                <Stage key="loading">
                  <ResultSkeleton />
                </Stage>
              )}

              {state.status === "success" && (
                <Stage key={`result-${state.resi}`}>
                  <TrackingResult data={state.data} />
                </Stage>
              )}

              {state.status === "error" && (
                <Stage key={`error-${state.resi}-${state.error}`}>
                  <ErrorState
                    resi={state.resi}
                    kind={state.error}
                    onRetry={() => track(state.resi)}
                  />
                </Stage>
              )}
            </AnimatePresence>
          </div>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
