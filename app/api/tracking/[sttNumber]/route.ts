import { detectCourier } from "@/lib/couriers/detectCourier";
import { CourierConfig } from "@/config/couriers";
import { jsonError } from "@/config/response/response";

// Handlers
import { fetchLion } from "@/lib/couriers/lion";
import { fetchSicepat } from "@/lib/couriers/sicepat";

export async function GET(
  _req: Request,
  context: { params: Promise<{ sttNumber: string }> }
) {
  try {
    const { sttNumber: raw } = await context.params;
    const sttNumber = (raw ?? "").trim().toUpperCase();

    if (!sttNumber) {
      return jsonError("Tracking number is required", 400);
    }

    const courier = detectCourier(sttNumber);

    // Tolak lebih awal supaya resi ngawur tidak sampai memanggil API kurir
    if (courier === "unknown" || !/^[A-Z0-9-]{5,40}$/.test(sttNumber)) {
      return jsonError("Unknown courier or invalid tracking number.", 400);
    }

    const { LION_API, SICEPAT_API } = CourierConfig;

    if (!LION_API || !SICEPAT_API) {
      return jsonError("Server configuration incomplete.", 500);
    }

    if (courier === "lion") return await fetchLion(sttNumber);
    if (courier === "sicepat") return await fetchSicepat(sttNumber);

    return jsonError("Courier handler not implemented.", 500);
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError("Courier API timed out.", 504);
    }

    if (error instanceof TypeError) {
      return jsonError("Unable to reach the API server.", 503);
    }

    return jsonError("Unexpected server error.", 500, 
      error instanceof Error ? error.message : undefined
    );
  }
}
