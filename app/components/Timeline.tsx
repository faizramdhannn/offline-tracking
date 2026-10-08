"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import {
  Bike,
  ChevronDown,
  MapPin,
  Package,
  PackageCheck,
  PackagePlus,
  Truck,
  Warehouse,
  type LucideProps,
} from "lucide-react";
import type { HistoryItem } from "@/types/history";
import { formatTime, toTitleCase } from "@/utils/tracking/format";
import Lightbox from "./Lightbox";
import { CARD, EASE, rise } from "./motion";

// Kode status Lion Parcel dan SiCepat
function EventIcon({
  statusCode,
  ...props
}: { statusCode: string } & LucideProps) {
  switch (statusCode) {
    case "POD":
    case "DELIVERED":
      return <PackageCheck {...props} />;
    case "DEL":
    case "HND":
    case "DEX":
    case "ANT":
      return <Bike {...props} />;
    case "TRANSIT":
    case "INHUB":
    case "OUTHUB":
    case "IN-HUB":
    case "OUT-HUB":
    case "DROPOFF_TRUCKING":
    case "KONDISPATCH":
    case "OUT":
    case "CARGO TRUCK":
    case "PICKUP_TRUCKING":
      return <Truck {...props} />;
    case "STI":
    case "STI-SC":
    case "STI-DEST":
    case "IN":
      return <Warehouse {...props} />;
    case "PICKREQ":
    case "PUP":
      return <PackagePlus {...props} />;
    default:
      return <Package {...props} />;
  }
}

function ProofOfDelivery({ item }: { item: HistoryItem }) {
  const [zoomed, setZoomed] = useState<string | null>(null);
  const attachments = item.attachment ?? [];

  return (
    <div className="mt-3 rounded-xl border border-line bg-surface-2 p-3">
      {item.receivedBy ? (
        <p className="text-xs text-muted sm:text-sm">
          Diterima oleh{" "}
          <span className="font-display text-fg">{item.receivedBy}</span>
        </p>
      ) : null}

      {attachments.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2 first:mt-0">
          {attachments.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Ctrl/Cmd+klik tetap membuka tab baru
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                setZoomed(url);
              }}
              className="cursor-zoom-in overflow-hidden rounded-lg border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Bukti pengiriman ${i + 1}`}
                loading="lazy"
                className="size-28 object-cover transition-transform duration-300 hover:scale-105 sm:size-36"
              />
            </a>
          ))}
        </div>
      ) : null}

      <Lightbox
        src={zoomed}
        alt="Bukti pengiriman"
        onClose={() => setZoomed(null)}
      />
    </div>
  );
}

function TimelineItem({
  item,
  isLatest,
  isLast,
}: {
  item: HistoryItem;
  isLatest: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasPOD = Boolean(item.receivedBy) || Boolean(item.attachment?.length);

  // SiCepat mengisi lokasi dan deskripsi dengan teks yang sama
  const location = (item.location ?? "").replace(/^[\s-]+|[\s-]+$/g, "");
  const showLocation =
    location !== "" &&
    location.toLowerCase() !== (item.description ?? "").toLowerCase();

  return (
    <m.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -24px 0px" }}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative flex gap-3 pb-5 last:pb-0"
    >
      {!isLast ? (
        <span className="absolute bottom-0 left-[13.5px] top-8 w-px bg-line" />
      ) : null}

      <span className="relative grid size-7 shrink-0 place-items-center">
        {isLatest ? (
          <span className="absolute inset-0 animate-ring rounded-full bg-accent" />
        ) : null}
        <span
          className={`relative grid size-7 place-items-center rounded-full ${
            isLatest
              ? "bg-accent text-accent-fg"
              : "bg-surface-2 text-subtle"
          }`}
        >
          <EventIcon
            statusCode={item.statusCode}
            className="size-3.5"
            strokeWidth={isLatest ? 2.2 : 1.8}
          />
        </span>
      </span>

      <div className="min-w-0 flex-1 pt-1 sm:flex sm:gap-4">
        <time
          dateTime={item.dateTime}
          className="block shrink-0 font-mono text-xs text-subtle sm:w-[88px] sm:pt-0.5"
        >
          {item.dateTime ? formatTime(item.dateTime) : ""}
        </time>

        <div className="mt-0.5 min-w-0 flex-1 sm:mt-0">
          <p
            className={`text-sm leading-relaxed ${
              isLatest ? "font-display text-fg" : "text-muted"
            }`}
          >
            {toTitleCase(item.description)}
          </p>

          {showLocation ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-subtle">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{toTitleCase(location)}</span>
            </p>
          ) : null}

          {hasPOD ? (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="mt-1.5 inline-flex items-center gap-1 rounded-md font-display text-sm text-accent-text transition-opacity hover:opacity-75"
              >
                {open ? "Sembunyikan bukti pengiriman" : "Lihat bukti pengiriman"}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <ProofOfDelivery item={item} />
                  </m.div>
                ) : null}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </div>
    </m.li>
  );
}

export default function Timeline({
  groupedHistory,
  sortedDates,
}: {
  groupedHistory: Record<string, HistoryItem[]>;
  sortedDates: string[];
}) {
  const total = sortedDates.reduce(
    (sum, date) => sum + groupedHistory[date].length,
    0
  );

  return (
    <m.section variants={rise} className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base">Riwayat pengiriman</h2>
        <span className="text-xs text-subtle">{total} aktivitas</span>
      </div>

      <div className="mt-5 grid gap-6">
        {sortedDates.map((date, dateIndex) => {
          const items = groupedHistory[date];

          return (
            <div key={date}>
              <h3 className="mb-3 inline-block rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
                {date}
              </h3>

              <ol>
                {items.map((item, itemIndex) => (
                  <TimelineItem
                    key={itemIndex}
                    item={item}
                    isLatest={dateIndex === 0 && itemIndex === 0}
                    isLast={itemIndex === items.length - 1}
                  />
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </m.section>
  );
}
