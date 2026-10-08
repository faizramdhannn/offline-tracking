// Bentuk mentah respons API kurir (hanya field yang dipakai aplikasi)

export interface LionHistoryRaw {
  datetime: string;
  current_status: string;
  status_code: string;
  remarks: string;
  location: string;
  city: string;
  courier_name?: string;
  received_by?: string | null;
  attachment?: string[] | null;
}

export interface LionSttRaw {
  sender_name: string;
  recipient_name: string;
  sender_address?: string;
  recipient_address?: string;
  origin: string;
  destination: string;
  chargeable_weight: number;
  product_type: string;
  current_status: string;
  history: LionHistoryRaw[];
}

export interface LionResponse {
  stts?: LionSttRaw[];
}

export interface SicepatHistoryRaw {
  date_time: string;
  status: string;
  city?: string;
  receiver_name?: string;
}

export interface SicepatResultRaw {
  waybill_number?: string;
  sender?: string;
  sender_address?: string;
  receiver_name?: string;
  receiver_address?: string;
  weight?: number;
  service?: string;
  POD_receiver?: string | null;
  POD_receiver_time?: string | null;
  pod_img_path?: string | null;
  pod_sign_img_path?: string | null;
  last_status?: { status?: string; receiver_name?: string };
  track_history?: SicepatHistoryRaw[];
}

export interface SicepatResponse {
  sicepat?: { result?: SicepatResultRaw };
}

export type CourierApiResponse = LionResponse & SicepatResponse;
