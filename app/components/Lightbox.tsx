"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "lucide-react";
import { EASE } from "./motion";

export default function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (typeof document === "undefined") return null;

  // Portal ke body: kartu induk punya transform, yang mematahkan position: fixed
  return createPortal(
    <AnimatePresence>
      {src ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            autoFocus
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <m.img
            src={src}
            alt={alt}
            initial={{ scale: 0.9, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="max-h-[86dvh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
