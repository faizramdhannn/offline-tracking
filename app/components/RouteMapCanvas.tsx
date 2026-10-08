"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { RouteData } from "@/utils/tracking/route";

type Coord = [number, number];

// OpenFreeMap: tile vektor gratis, tanpa API key
const STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
};

const currentTheme = () =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/** Menghubungkan titik-titik dengan lengkungan halus, bukan garis patah. */
const arc = (coords: Coord[], samples = 24): Coord[] => {
  const line: Coord[] = [];

  for (let i = 0; i < coords.length - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    const cx = (x1 + x2) / 2 - (y2 - y1) * 0.1;
    const cy = (y1 + y2) / 2 + (x2 - x1) * 0.1;

    for (let s = i === 0 ? 0 : 1; s <= samples; s++) {
      const t = s / samples;
      const u = 1 - t;
      line.push([
        u * u * x1 + 2 * u * t * cx + t * t * x2,
        u * u * y1 + 2 * u * t * cy + t * t * y2,
      ]);
    }
  }

  return line;
};

const lineString = (coordinates: Coord[]) => ({
  type: "Feature" as const,
  properties: {},
  geometry: { type: "LineString" as const, coordinates },
});

const markerElement = (kind: "passed" | "current" | "pending", name: string) => {
  const el = document.createElement("div");
  el.title = name;

  if (kind === "current") {
    el.className = "relative grid size-4 place-items-center";
    el.innerHTML =
      '<span class="absolute inset-0 animate-ring rounded-full bg-accent"></span>' +
      '<span class="relative size-4 rounded-full border-2 border-surface bg-accent shadow-card"></span>';
  } else if (kind === "pending") {
    el.className =
      "size-3.5 rounded-full border-2 border-dashed border-primary bg-surface";
  } else {
    el.className = "size-2.5 rounded-full border-2 border-primary bg-surface";
  }

  return el;
};

export default function RouteMapCanvas({ route }: { route: RouteData }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const coords = route.points.map((p): Coord => [p.lng, p.lat]);
    const done = arc(coords.slice(0, route.current + 1));
    const pending = arc(coords.slice(route.current));

    const bounds = new maplibregl.LngLatBounds(coords[0], coords[0]);
    coords.forEach((coord) => bounds.extend(coord));

    const map = new maplibregl.Map({
      container: el,
      style: STYLES[currentTheme()],
      bounds,
      fitBoundsOptions: { padding: 44, maxZoom: 9 },
      // Scroll halaman tidak tersangkut di peta; zoom pakai Ctrl/dua jari
      cooperativeGestures: true,
      attributionControl: { compact: true },
    });

    route.points.forEach((point, index) => {
      const kind =
        index === route.current
          ? "current"
          : index > route.current
          ? "pending"
          : "passed";

      new maplibregl.Marker({ element: markerElement(kind, point.name) })
        .setLngLat([point.lng, point.lat])
        .addTo(map);
    });

    let frame = 0;
    let drawn = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dipanggil ulang tiap ganti tema, karena setStyle membuang layer kustom
    const addRoute = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();

      if (pending.length >= 2) {
        map.addSource("route-pending", {
          type: "geojson",
          data: lineString(pending),
        });
        map.addLayer({
          id: "route-pending",
          type: "line",
          source: "route-pending",
          paint: {
            "line-color": color,
            "line-width": 2,
            "line-opacity": 0.5,
            "line-dasharray": [1, 2.5],
          },
        });
      }

      if (done.length < 2) return;

      map.addSource("route-done", {
        type: "geojson",
        data: lineString(drawn ? done : done.slice(0, 2)),
      });
      map.addLayer({
        id: "route-done",
        type: "line",
        source: "route-done",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": color, "line-width": 3 },
      });

      if (drawn) return;
      drawn = true;

      // Garis rute "tergambar" dari kota asal ke posisi sekarang
      const start = performance.now();
      const draw = (now: number) => {
        const progress = Math.min((now - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const count = Math.max(2, Math.ceil(eased * done.length));
        const source = map.getSource("route-done") as
          | maplibregl.GeoJSONSource
          | undefined;

        source?.setData(lineString(done.slice(0, count)));
        if (progress < 1) frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    };

    map.on("style.load", addRoute);

    const themeObserver = new MutationObserver(() =>
      map.setStyle(STYLES[currentTheme()])
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      themeObserver.disconnect();
      cancelAnimationFrame(frame);
      map.remove();
    };
  }, [route]);

  return <div ref={container} className="size-full" />;
}
