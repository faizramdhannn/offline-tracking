import type { HistoryItem } from "./history";

export interface TrackingData {
  courier: string;
  waybillNumber: string;
  sender: string;
  receiver: string;
  origin: string;
  destination: string;
  weight: number;
  service: string;
  currentStatus: string;
  history: HistoryItem[];
  podReceiver?: string | null;
  podTime?: string | null;
  podImage?: string | null;
}

export interface TrackingApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: TrackingData | null;
}