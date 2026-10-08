import { MapPin, Package, Truck } from "lucide-react";
import CourierLogo from "./CourierLogo";

const ROUTE = "M50 72 C 105 72 100 22 142 30 S 190 84 230 38";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center px-2 py-12 text-center sm:py-16">
      <div className="relative h-[110px] w-[280px]" aria-hidden>
        <svg
          viewBox="0 0 280 110"
          fill="none"
          className="absolute inset-0 size-full"
        >
          <path
            d={ROUTE}
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-line"
          />
          <path
            d={ROUTE}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 14"
            className="animate-dash stroke-accent"
          />
        </svg>

        <span className="absolute left-[8px] top-[52px] grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted shadow-card">
          <Package className="size-5" />
        </span>
        <span className="absolute left-[232px] top-[18px] grid size-10 place-items-center rounded-xl border border-line bg-surface text-accent-text shadow-card">
          <MapPin className="size-5" />
        </span>

        <span
          className="absolute left-0 top-0 grid size-8 animate-travel place-items-center rounded-full bg-accent text-accent-fg shadow-card"
          style={{ offsetPath: `path("${ROUTE}")`, offsetRotate: "0deg" }}
        >
          <Truck className="size-4" />
        </span>
      </div>

      <h2 className="mt-8 text-xl sm:text-2xl">Paketmu sudah sampai mana?</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Masukkan nomor resi di atas untuk melihat posisi terakhir dan riwayat
        perjalanan paketmu.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <span className="text-xs text-subtle">Kurir yang didukung</span>
        <CourierLogo courier="Lion Parcel" className="h-9 w-16" />
        <CourierLogo courier="SiCepat" className="h-9 w-16" />
      </div>
    </div>
  );
}
