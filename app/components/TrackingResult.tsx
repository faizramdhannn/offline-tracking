"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as m from "motion/react-m";
import { Check, CircleUserRound, Copy, MapPin, Share2 } from "lucide-react";
import type { TrackingData } from "@/types/tracking";
import {
  formatDate,
  formatRelative,
  formatTime,
  toTitleCase,
} from "@/utils/tracking/format";
import { buildRoute } from "@/utils/tracking/route";
import { useTrackingData } from "../hooks/useTrackingData";
import CourierLogo from "./CourierLogo";
import ProgressSteps from "./ProgressSteps";
import RouteMap from "./RouteMap";
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

// Link yang dibagikan selalu ke domain tracking aslinya, bukan situs induk
const SHARE_BASE_URL =
  process.env.NEXT_PUBLIC_SHARE_BASE_URL ?? "https://offline-tracking.vercel.app";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API ditolak di dalam iframe tanpa izin clipboard-write;
    // execCommand tetap jalan di sana.
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(field);
    field.select();

    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }
};

const shareLink = (resi: string) =>
  `${SHARE_BASE_URL}/${encodeURIComponent(resi)}`;

const CONFETTI_COLORS = ["#abc82e", "#d4e86a", "#06334d", "#ffffff"];

function DeliveredCheck() {
  const ref = useRef<HTMLSpanElement>(null);

  // Confetti menyembur dari ikon centang, tepat setelah centangnya tergambar.
  // Library dimuat hanya saat paket memang sudah sampai.
  useEffect(() => {
    const timer = setTimeout(async () => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const { default: confetti } = await import("canvas-confetti");

      confetti({
        particleCount: 90,
        spread: 75,
        startVelocity: 38,
        ticks: 160,
        scalar: 0.9,
        colors: CONFETTI_COLORS,
        disableForReducedMotion: true,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <m.span
      ref={ref}
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
  const route = useMemo(() => buildRoute(data, delivered), [data, delivered]);

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
              <>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                  {toTitleCase(latest.description)}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-subtle">
                  {!delivered ? (
                    <span className="relative grid size-2 place-items-center text-accent">
                      <span className="absolute inset-0 animate-ring rounded-full bg-current" />
                      <span className="relative size-2 rounded-full bg-current" />
                    </span>
                  ) : null}
                  {formatRelative(latest.dateTime, now)}
                </p>
              </>
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
              label="Salin link pelacakan"
              icon={Share2}
              action={() => copyText(shareLink(data.waybillNumber))}
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
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base">Rute pengiriman</h2>
          {route ? (
            <span className="text-xs text-subtle">Perkiraan antar kota</span>
          ) : null}
        </div>

        {route ? <RouteMap route={route} /> : null}

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
