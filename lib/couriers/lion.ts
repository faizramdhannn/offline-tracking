import { CourierConfig, UPSTREAM_TIMEOUT_MS } from "@/config/couriers";
import { jsonError, jsonOK } from "@/config/response/response";

export async function fetchLion(sttNumber: string) {
  const { LION_API, LION_AUTH } = CourierConfig;

  const res = await fetch(`${LION_API}?q=${encodeURIComponent(sttNumber)}`, {
    headers: {
      Authorization: LION_AUTH,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    cache: "no-store",
  });

  if (res.status !== 200) {
    return jsonError(`Lion Parcel API error: ${res.status}`, res.status);
  }

  const data = await res.json();

  return jsonOK({ ...data, courier: "lion" });
}
