"use client";

import { useCallback, useRef, useState } from "react";
import { detectCourier } from "@/lib/couriers/detectCourier";
import { parseTrackingData } from "@/utils/tracking/parsers";
import { TrackingData } from "@/types/tracking";

export type TrackErrorKind = "format" | "notfound" | "network";

export type TrackState =
  | { status: "idle" }
  | { status: "loading"; resi: string }
  | { status: "success"; resi: string; data: TrackingData }
  | { status: "error"; resi: string; error: TrackErrorKind };

export const normalizeResi = (raw: string) => raw.trim().toUpperCase();

export function useTracking() {
  const [state, setState] = useState<TrackState>({ status: "idle" });
  const controller = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    controller.current?.abort();
    setState({ status: "idle" });
  }, []);

  const track = useCallback(async (raw: string) => {
    const resi = normalizeResi(raw);
    if (!resi) return;

    controller.current?.abort();

    // Format yang tidak dikenali ditolak di browser, tanpa memanggil server
    if (detectCourier(resi) === "unknown") {
      setState({ status: "error", resi, error: "format" });
      return;
    }

    const current = new AbortController();
    controller.current = current;
    setState({ status: "loading", resi });

    try {
      const response = await fetch(
        `/api/tracking/${encodeURIComponent(resi)}`,
        { signal: current.signal }
      );
      const json = await response.json().catch(() => null);
      const data = response.ok ? parseTrackingData(json, resi) : null;

      if (data) {
        setState({ status: "success", resi, data });
      } else {
        setState({
          status: "error",
          resi,
          error: response.status >= 500 ? "network" : "notfound",
        });
      }
    } catch (error) {
      if (current.signal.aborted) return;
      console.error("Tracking error:", error);
      setState({ status: "error", resi, error: "network" });
    }
  }, []);

  return { state, track, reset };
}
