"use client";

import { useMemo } from "react";
import { groupHistoryByDate } from "@/utils/tracking/groupHistory";
import {
  getCurrentStepIndex,
  getProgressSteps,
} from "@/utils/tracking/progress";
import { TrackingData } from "@/types/tracking";

export function useTrackingData(trackingData: TrackingData) {
  return useMemo(() => {
    const reversedHistory = [...trackingData.history].reverse();
    const groupedHistory = groupHistoryByDate(reversedHistory);

    const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
      const firstA = groupedHistory[a][0].dateTime;
      const firstB = groupedHistory[b][0].dateTime;
      return new Date(firstB).getTime() - new Date(firstA).getTime();
    });

    const progressSteps = getProgressSteps(
      trackingData.history,
      trackingData.courier
    );

    return {
      groupedHistory,
      sortedDates,
      progressSteps,
      currentStep: getCurrentStepIndex(progressSteps),
      latest: sortedDates.length ? groupedHistory[sortedDates[0]][0] : null,
    };
  }, [trackingData]);
}
