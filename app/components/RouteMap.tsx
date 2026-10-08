"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import type { RouteData } from "@/utils/tracking/route";

// MapLibre cukup besar, jadi baru diunduh saat petanya hampir terlihat
const RouteMapCanvas = dynamic(() => import("./RouteMapCanvas"), {
  ssr: false,
  loading: () => <div className="skeleton size-full rounded-none" />,
});

export default function RouteMap({ route }: { route: RouteData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div
      ref={ref}
      className="relative z-[1] mt-4 h-56 overflow-hidden rounded-xl border border-line sm:h-64"
    >
      {inView ? (
        <RouteMapCanvas route={route} />
      ) : (
        <div className="skeleton size-full rounded-none" />
      )}
    </div>
  );
}
