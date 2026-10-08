// config/couriers.ts

export const CourierConfig = {
  LION_API: process.env.NEXT_PUBLIC_LION_API ?? "",
  LION_AUTH: process.env.NEXT_PUBLIC_LION_AUTH_TOKEN ?? "",
  SICEPAT_API: process.env.NEXT_PUBLIC_SICEPAT_API ?? "",
  SICEPAT_KEY: process.env.NEXT_PUBLIC_SICEPAT_API_KEY ?? "",
} as const;

export const UPSTREAM_TIMEOUT_MS = 15000;
