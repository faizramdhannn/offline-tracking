export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const time = date
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", "."); // ubah jadi 10.57

  return `${time} WIB`;
};

const relative = new Intl.RelativeTimeFormat("id", { numeric: "auto" });

/** "2 jam yang lalu", "kemarin"; lebih dari sebulan kembali ke tanggal biasa. */
export const formatRelative = (dateString: string, now: number) => {
  const diff = new Date(dateString).getTime() - now;
  if (Number.isNaN(diff)) return "";

  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");

  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relative.format(days, "day");

  return formatDate(dateString);
};

export const toTitleCase = (text?: string | null) =>
  (text ?? "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
