export const detectCourier = (
  sttNumber: string
): "lion" | "sicepat" | "unknown" => {
  const upper = sttNumber.trim().toUpperCase();

  if (/^(99LP|19LP|88LP)/.test(upper)) return "lion";
  if (/^(00|99)/.test(upper)) return "sicepat";

  return "unknown";
};