import { PackageX, RotateCw, SearchX, WifiOff } from "lucide-react";
import type { TrackErrorKind } from "../hooks/useTracking";
import { CARD } from "./motion";

const COPY: Record<
  TrackErrorKind,
  { icon: typeof PackageX; title: string; body: string }
> = {
  format: {
    icon: SearchX,
    title: "Format resi tidak dikenali",
    body: "Nomor ini bukan format resi Lion Parcel atau SiCepat. Coba cek lagi nomor resi di halaman pesananmu.",
  },
  notfound: {
    icon: PackageX,
    title: "Resi tidak ditemukan",
    body: "Kami belum menemukan data untuk nomor ini. Kalau paket baru saja dikirim, datanya mungkin belum masuk ke sistem kurir.",
  },
  network: {
    icon: WifiOff,
    title: "Gagal memuat data",
    body: "Sambungan ke sistem kurir sedang bermasalah. Coba lagi sebentar lagi.",
  },
};

export default function ErrorState({
  resi,
  kind,
  onRetry,
}: {
  resi: string;
  kind: TrackErrorKind;
  onRetry: () => void;
}) {
  const { icon: Icon, title, body } = COPY[kind];

  return (
    <div
      role="alert"
      className={`${CARD} flex flex-col items-center px-6 py-12 text-center`}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-danger-soft text-danger">
        <Icon className="size-6" />
      </span>

      <h2 className="mt-5 text-lg">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>

      <p className="mt-5 max-w-full break-all rounded-lg bg-surface-2 px-3 py-1.5 font-mono text-sm text-fg">
        {resi}
      </p>

      {kind === "network" && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-line px-4 font-display text-sm text-fg transition hover:bg-surface-2 active:scale-[0.97]"
        >
          <RotateCw className="size-4" />
          Coba lagi
        </button>
      )}
    </div>
  );
}
