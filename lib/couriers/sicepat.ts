// handlers/couriers/sicepat.ts

import { CourierConfig, UPSTREAM_TIMEOUT_MS } from "@/config/couriers";
import { jsonError, jsonOK } from "@/config/response/response";

export async function fetchSicepat(sttNumber: string) {
  const { SICEPAT_API, SICEPAT_KEY } = CourierConfig;

  if (!SICEPAT_KEY) {
    return jsonError("Sicepat API key is not configured.", 500);
  }

  const res = await fetch(
    `${SICEPAT_API}?waybill=${encodeURIComponent(sttNumber)}`,
    {
      headers: {
        "api-key": SICEPAT_KEY,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => null);

  const code = data?.sicepat?.status?.code;
  const desc = data?.sicepat?.status?.description;

  if (code !== 200) {
    let msg = desc || "Unknown SiCepat error";

    if (desc === "Can't get waybill from database") {
      msg = "Tracking number not found. Please check the STT number.";
    }

    if (desc?.includes("Invalid")) {
      msg = "Invalid API key. Contact admin.";
    }

    return jsonError(msg, 400, desc);
  }

  if (res.status !== 200) {
    return jsonError(`Sicepat API HTTP error: ${res.status}`, res.status);
  }

  return jsonOK({ ...data, courier: "sicepat" });
}
