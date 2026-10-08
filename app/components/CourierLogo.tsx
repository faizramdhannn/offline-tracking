const LOGOS: Record<string, string> = {
  "Lion Parcel": "/Logo%20Lion.png",
  SiCepat: "/Logo%20Sicepat.png",
};

export default function CourierLogo({
  courier,
  className = "h-11 w-[72px]",
}: {
  courier: string;
  className?: string;
}) {
  // Latar selalu putih: logo kurir tidak punya versi gelap
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border border-line bg-white p-1.5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGOS[courier]}
        alt={`Logo ${courier}`}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
