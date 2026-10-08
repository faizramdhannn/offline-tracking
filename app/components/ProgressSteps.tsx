"use client";

import * as m from "motion/react-m";
import { Bike, PackageCheck, PackagePlus, Truck } from "lucide-react";
import type { ProgressStep, StepKey } from "@/utils/tracking/progress";
import { EASE } from "./motion";

const ICONS: Record<StepKey, typeof Truck> = {
  created: PackagePlus,
  transit: Truck,
  delivery: Bike,
  completed: PackageCheck,
};

export default function ProgressSteps({
  steps,
  currentStep,
}: {
  steps: ProgressStep[];
  currentStep: number;
}) {
  const lastIndex = steps.length - 1;
  const fill = Math.max(currentStep, 0) / lastIndex;

  return (
    <ol className="relative grid grid-cols-4">
      {/* Jalur: dari tengah node pertama sampai tengah node terakhir */}
      <li
        aria-hidden
        className="absolute left-[12.5%] right-[12.5%] top-[18px] h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <m.div
          className="h-full origin-left rounded-full bg-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: fill }}
          transition={{ duration: 0.5 + fill * 0.9, ease: EASE, delay: 0.25 }}
        />
      </li>

      {steps.map((step, index) => {
        const Icon = ICONS[step.key];
        const reached = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <li
            key={step.key}
            aria-current={isCurrent ? "step" : undefined}
            className="relative flex flex-col items-center"
          >
            <m.span
              className="relative grid size-10 place-items-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 22,
                delay: 0.25 + index * 0.22,
              }}
            >
              {isCurrent && index !== lastIndex && (
                <span className="absolute inset-0 animate-ring rounded-full bg-accent" />
              )}
              <span
                className={`relative grid size-10 place-items-center rounded-full border transition-colors ${
                  reached
                    ? "border-transparent bg-accent text-accent-fg"
                    : "border-line bg-surface text-subtle"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={reached ? 2.2 : 1.8} />
              </span>
            </m.span>

            <span
              className={`mt-2.5 px-1 text-center text-[11px] leading-tight sm:text-xs ${
                isCurrent
                  ? "font-display text-fg"
                  : reached
                  ? "text-fg"
                  : "text-subtle"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
