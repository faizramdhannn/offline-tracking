import { TrackingData } from "@/types/tracking";
import type {
  CourierApiResponse,
  LionResponse,
  SicepatResponse,
} from "@/types/courierApi";
import { cleanRemarks } from "./cleanRemarks";

export const parseLionData = (
  data: LionResponse,
  stt: string
): TrackingData | null => {
  const t = data.stts?.[0];
  if (!t) return null;

  return {
    courier: "Lion Parcel",
    waybillNumber: stt,
    sender: t.sender_name,
    receiver: t.recipient_name,
    origin: t.sender_address || t.origin,
    destination: t.recipient_address || t.destination,
    weight: t.chargeable_weight,
    service: t.product_type,
    currentStatus: t.current_status,
    history: t.history.map((h) => ({
      dateTime: h.datetime,
      status: h.current_status,
      statusCode: h.status_code,
      description: cleanRemarks(h.remarks),
      location: `${h.location} - ${h.city}`,
      courierName: h.courier_name,
      receivedBy: h.received_by,
      attachment: h.attachment,
    })),
  };
};

export const parseSicepatData = (
  data: SicepatResponse,
  stt: string
): TrackingData | null => {
  const t = data.sicepat?.result;
  if (!t) return null;

  const lastStatus = t.last_status;
  const currentStatusText =
    lastStatus?.receiver_name || lastStatus?.status || "";

  return {
    courier: "SiCepat",
    waybillNumber: t.waybill_number || stt,
    sender: t.sender || "",
    receiver: t.receiver_name || "",
    origin: t.sender_address || "",
    destination: t.receiver_address || "",
    weight: t.weight || 0,
    service: t.service || "",
    currentStatus: currentStatusText,
    podReceiver: t.POD_receiver || null,
    podTime: t.POD_receiver_time || null,
    podImage: t.pod_img_path || null,
    history: (t.track_history || []).map((h, index) => ({
      dateTime: h.date_time,
      status: h.status,
      statusCode: h.status,

      description:
        index === 0 && /pick\s*up\s*dari/i.test(h.city ?? "")
          ? "Paketmu Telah Diproses"
          : h.status === "DELIVERED" && h.receiver_name
          ? h.receiver_name
          : h.city || "",

      location: h.city || "",
      receivedBy: h.status === "DELIVERED" ? h.receiver_name ?? null : null,

      attachment:
        h.status === "DELIVERED" && t.pod_img_path
          ? [t.pod_img_path, t.pod_sign_img_path].filter(
              (url): url is string => Boolean(url)
            )
          : [],
    })),
  };
};

export const parseTrackingData = (
  result: CourierApiResponse | null,
  stt: string
) => {
  if (!result) return null;
  if (result.stts) return parseLionData(result, stt);
  if (result.sicepat) return parseSicepatData(result, stt);
  return null;
};
