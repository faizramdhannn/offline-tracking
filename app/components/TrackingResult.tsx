"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { Check, CircleUserRound, Copy, MapPin } from "lucide-react";
import type { TrackingData } from "@/types/tracking";
import { formatDate, formatTime } from "@/utils/tracking/format";
import { useTrackingData } from "../hooks/useTrackingData";
import CourierLogo from "./CourierLogo";
import ProgressSteps from "./ProgressSteps";
import Timeline from "./Timeline";
import { CARD, rise, stagger } from "./motion";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard bisa ditolak di dalam iframe tanpa izin clipboard-write
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Salin nomor resi"
      title={copied ? "Tersalin" : "Salin"}
      className="grid size-8 shrink-0 place-items-center rounded-lg text-subtle transition hover:bg-surface-2 hover:text-fg active:scale-90"
    >
      {copied ? (
        <Check className="size-4 text-accent-text" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}

function StatusBadge({ label, done }: { label: string; done: boolean }) {
  if (done) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 font-display text-xs text-accent-fg">
        <Check className="size-3.5" strokeWidth={3} />
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 font-display text-xs text-accent-text">
      <span className="relative grid size-2 place-items-center">
        <span className="absolute inset-0 animate-ring rounded-full bg-current" />
        <span className="relative size-2 rounded-full bg-current" />
      </span>
      {label}
    </span>
  );
}

export default function TrackingResult({ data }: { data: TrackingData }) {
  const { groupedHistory, sortedDates, progressSteps, currentStep, latest } =
    useTrackingData(data);

  const statusLabel = progressSteps[currentStep]?.label ?? "Sedang Diproses";

  const meta = [
    latest?.dateTime && {
      label: "Update terakhir",
      value: `${formatDate(latest.dateTime)} · ${formatTime(latest.dateTime)}`,
    },
    data.weight > 0 && { label: "Berat", value: `${data.weight} kg` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <m.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid gap-4"
    >
      <m.section variants={rise} className={`${CARD} overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 p-5 pb-0 sm:p-6 sm:pb-0">
          <div className="flex min-w-0 items-center gap-3">
            <CourierLogo courier={data.courier} />
            <div className="min-w-0">
              <p className="truncate font-display text-sm">{data.courier}</p>
              {data.service && (
                <p className="truncate text-xs text-muted">{data.service}</p>
              )}
            </div>
          </div>

          <StatusBadge
            label={statusLabel}
            done={currentStep === progressSteps.length - 1}
          />
        </div>

        <div className="px-5 pt-5 sm:px-6">
          <p className="text-xs text-muted">Nomor resi</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <p className="break-all font-mono text-xl tracking-tight sm:text-2xl">
              {data.waybillNumber}
            </p>
            <CopyButton text={data.waybillNumber} />
          </div>
        </div>

        <div className="px-1 pb-6 pt-7 sm:px-4">
          <ProgressSteps steps={progressSteps} currentStep={currentStep} />
        </div>

        {meta.length > 0 && (
          <dl className="flex divide-x divide-line border-t border-line">
            {meta.map(({ label, value }) => (
              <div key={label} className="flex-1 px-5 py-3.5 sm:px-6">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </m.section>

      <m.section variants={rise} className={`${CARD} p-5 sm:p-6`}>
        <h2 className="text-base">Rute pengiriman</h2>

        <ol className="mt-4">
          <li className="relative flex gap-3 pb-5">
            <span className="absolute bottom-1 left-[15px] top-9 border-l border-dashed border-subtle/60" />
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted">
              <CircleUserRound className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted">Alamat pengirim</p>
              <p className="mt-0.5 text-sm uppercase leading-relaxed">
                {data.origin || "-"}
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-text">
              <MapPin className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted">Alamat penerima</p>
              <p className="mt-0.5 text-sm uppercase leading-relaxed">
                {data.destination || "-"}
              </p>
            </div>
          </li>
        </ol>
      </m.section>

      {sortedDates.length > 0 && (
        <Timeline groupedHistory={groupedHistory} sortedDates={sortedDates} />
      )}
    </m.div>
  );
}
