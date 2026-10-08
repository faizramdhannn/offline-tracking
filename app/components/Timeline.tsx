"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronDown } from "lucide-react";
import type { HistoryItem } from "@/types/history";
import { formatTime, toTitleCase } from "@/utils/tracking/format";
import { CARD, EASE, rise } from "./motion";

function ProofOfDelivery({ item }: { item: HistoryItem }) {
  return (
    <div className="mt-3 rounded-xl border border-line bg-surface-2 p-3">
      {item.receivedBy && (
        <p className="text-xs text-muted sm:text-sm">
          Diterima oleh{" "}
          <span className="font-display text-fg">{item.receivedBy}</span>
        </p>
      )}

      {item.attachment?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 first:mt-0">
          {item.attachment.map((url: string, i: number) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden rounded-lg border border-line"
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
      )}
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
  const hasPOD = Boolean(item.receivedBy) || item.attachment?.length > 0;

  return (
    <m.li
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -24px 0px" }}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative flex gap-3 pb-5 last:pb-0"
    >
      {!isLast && (
        <span className="absolute bottom-0 left-[7px] top-5 w-px bg-line" />
      )}

      <span className="relative mt-[3px] grid size-[15px] shrink-0 place-items-center">
        {isLatest && (
          <span className="absolute inset-0 animate-ring rounded-full bg-accent" />
        )}
        <span
          className={`relative rounded-full ${
            isLatest
              ? "size-[11px] bg-accent ring-4 ring-accent-soft"
              : "size-[9px] border-2 border-subtle bg-surface"
          }`}
        />
      </span>

      <div className="min-w-0 flex-1 sm:flex sm:gap-4">
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

          {hasPOD && (
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
                {open && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <ProofOfDelivery item={item} />
                  </m.div>
                )}
              </AnimatePresence>
            </>
          )}
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
