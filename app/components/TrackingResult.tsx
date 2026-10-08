"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { Check, CircleUserRound, Copy, MapPin, Share2 } from "lucide-react";
import type { TrackingData } from "@/types/tracking";
import {
  formatDate,
  formatRelative,
  formatTime,
  toTitleCase,
} from "@/utils/tracking/format";
import { useTrackingData } from "../hooks/useTrackingData";
import CourierLogo from "./CourierLogo";
import ProgressSteps from "./ProgressSteps";
import Timeline from "./Timeline";
import { CARD, EASE, rise, stagger } from "./motion";

// Urutannya mengikuti tahap di utils/tracking/progress.ts
const HEADLINES = [
  "Pesanan sudah dibuat",
  "Paketmu dalam perjalanan",
  "Paketmu sedang diantar kurir",
  "Paketmu sudah sampai",
];

function IconAction({
  label,
  icon: Icon,
  action,
}: {
  label: string;
  icon: typeof Copy;
  action: () => Promise<boolean>;
}) {
  const [done, setDone] = useState(false);

  const run = async () => {
    if (!(await action())) return;
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={run}
      aria-label={label}
      title={done ? "Tersalin" : label}
      className="grid size-9 shrink-0 place-items-center rounded-lg text-subtle transition hover:bg-surface hover:text-fg active:scale-90"
    >
      {done ? (
        <Check className="size-4 text-accent-text" />
      ) : (
        <Icon className="size-4" />
      )}
    </button>
  );
}

// Clipboard bisa ditolak di dalam iframe tanpa izin clipboard-write
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const shareResi = async (resi: string) => {
  const url = `${window.location.origin}/${encodeURIComponent(resi)}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: `Lacak resi ${resi}`, url });
    } catch {
      // Dibatalkan user
    }
    return false;
  }

  return copyText(url);
};

function DeliveredCheck() {
  return (
    <m.span
      aria-hidden
      className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-fg"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.5 }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
      >
        <m.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.8 }}
        />
      </svg>
    </m.span>
  );
}

export default function TrackingResult({ data }: { data: TrackingData }) {
  const { groupedHistory, sortedDates, progressSteps, currentStep, latest } =
    useTrackingData(data);
  const [now] = useState(() => Date.now());

  const delivered = currentStep === progressSteps.length - 1;
  const headline = HEADLINES[currentStep] ?? "Paketmu sedang diproses";

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
        {/* Kilau sekali lewat saat paket sudah sampai */}
        {delivered ? (
          <m.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-accent/25 to-transparent"
            initial={{ x: "-120%" }}
            animate={{ x: "420%" }}
            transition={{ duration: 1.3, ease: "easeInOut", delay: 1 }}
          />
        ) : null}

        <div className="flex items-center gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <CourierLogo courier={data.courier} className="h-9 w-[60px]" />
          <p className="min-w-0 truncate text-sm text-muted">
            <span className="font-display text-fg">{data.courier}</span>
            {data.service ? ` · ${data.service}` : ""}
          </p>
        </div>

        <div className="flex items-start gap-3.5 px-5 pt-5 sm:px-6">
          {delivered ? <DeliveredCheck /> : null}

          <div className="min-w-0">
            <h2 className="text-2xl leading-tight sm:text-[28px]">
              {headline}
            </h2>

            {latest ? (
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                {!delivered ? (
                  <span className="relative grid size-2 place-items-center text-accent">
                    <span className="absolute inset-0 animate-ring rounded-full bg-current" />
                    <span className="relative size-2 rounded-full bg-current" />
                  </span>
                ) : null}
                <span>{toTitleCase(latest.description)}</span>
                <span className="text-subtle">
                  · {formatRelative(latest.dateTime, now)}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mx-5 mt-5 flex items-center justify-between gap-2 rounded-xl bg-surface-2 py-1.5 pl-3.5 pr-1.5 sm:mx-6">
          <div className="min-w-0">
            <p className="text-[11px] text-muted">Nomor resi</p>
            <p className="break-all font-mono text-base tracking-tight">
              {data.waybillNumber}
            </p>
          </div>

          <div className="flex shrink-0">
            <IconAction
              label="Salin nomor resi"
              icon={Copy}
              action={() => copyText(data.waybillNumber)}
            />
            <IconAction
              label="Bagikan link pelacakan"
              icon={Share2}
              action={() => shareResi(data.waybillNumber)}
            />
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
