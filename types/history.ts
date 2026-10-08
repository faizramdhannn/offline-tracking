export interface HistoryItem {
  dateTime: string;
  status: string;
  statusCode: string;
  description: string;
  location: string;
  courierName?: string;
  receivedBy?: string | null;
  attachment?: string[] | null;
}
