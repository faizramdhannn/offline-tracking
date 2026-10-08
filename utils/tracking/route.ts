import type { TrackingData } from "@/types/tracking";
import { CITY_ALIASES, CITY_COORDS } from "./cities";

export interface RoutePoint {
  name: string;
  lng: number;
  lat: number;
}

export interface RouteData {
  points: RoutePoint[];
  /** Index titik terakhir yang sudah dilewati paket. */
  current: number;
  delivered: boolean;
}

const normalize = (text: string) =>
  text
    .toUpperCase()
    .replace(/[^A-Z\s]/g, " ")
    .replace(/\b(KOTA|KABUPATEN|KAB|ADM)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toPoint = (name: string): RoutePoint => {
  const [lng, lat] = CITY_COORDS[name];
  return { name, lng, lat };
};

const exact = (text: string): RoutePoint | null => {
  const key = normalize(text);
  const name = CITY_ALIASES[key] ?? key;
  return name in CITY_COORDS ? toPoint(name) : null;
};

// Nama pendek (Solo, Palu, Pati, ...) terlalu sering muncul sebagai kata lain
// di teks bebas, jadi hanya dicocokkan lewat `exact`.
const FUZZY_NAMES = [...Object.keys(CITY_COORDS), ...Object.keys(CITY_ALIASES)]
  .filter((name) => name.length >= 5)
  .sort((a, b) => b.length - a.length);

/** Nama kota yang muncul paling akhir di teks; di alamat, kota ada di ujung. */
const lastMention = (text: string): RoutePoint | null => {
  const haystack = ` ${normalize(text)} `;
  let best: { name: string; at: number } | null = null;

  for (const name of FUZZY_NAMES) {
    const at = haystack.lastIndexOf(` ${name} `);
    if (at > (best?.at ?? -1)) best = { name, at };
  }

  return best ? toPoint(CITY_ALIASES[best.name] ?? best.name) : null;
};

/** "KECAMATAN, KABUPATEN, KOTA" atau alamat lengkap → kota paling spesifik. */
const fromAddress = (address: string): RoutePoint | null => {
  const parts = address.split(",");

  for (let i = parts.length - 1; i >= 0; i--) {
    const match = exact(parts[i]);
    if (match) return match;
  }

  return lastMention(address);
};

export const buildRoute = (
  data: TrackingData,
  delivered: boolean
): RouteData | null => {
  const points: RoutePoint[] = [];

  const push = (point: RoutePoint | null) => {
    if (point && points.at(-1)?.name !== point.name) points.push(point);
  };

  push(fromAddress(data.origin ?? ""));

  for (const item of data.history) {
    push(exact(item.location ?? "") ?? lastMention(item.location ?? ""));
  }

  let current = points.length - 1;

  push(fromAddress(data.destination ?? ""));
  if (delivered) current = points.length - 1;

  return points.length >= 2 ? { points, current, delivered } : null;
};
