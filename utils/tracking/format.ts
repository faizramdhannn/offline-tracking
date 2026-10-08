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

export const toTitleCase = (text?: string | null) =>
  (text ?? "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
