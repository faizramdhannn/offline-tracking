"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronRight, X } from "lucide-react";

import ProgressSteps from "./components/ProgressSteps";
import AddressBlock from "./components/AddressBlock";
import HistorySection from "./components/HistorySection";
import EmptyState from "./components/EmptyState";
import ErrorBox from "./components/ErrorBox";
import { formatTime } from "../utils/tracking/format";
import { useTrackHandler } from "./hooks/useTrackHandler";
import { useTogglePOD } from "./hooks/useTogglePOD";
import { useTrackingData } from "./hooks/useTrackingData";

interface HomeProps {
  onNewTracking?: (sttNumber: string) => void;
}

export default function Home({ onNewTracking }: HomeProps = {}) {
  const [stt, setStt] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { expandedPOD, togglePOD } = useTogglePOD();
  const { loading, result, handleTrack } = useTrackHandler();
  const { trackingData, groupedHistory, sortedDates, progressSteps } =
    useTrackingData(result, stt);

  useEffect(() => {
    const auto = localStorage.getItem("AUTO_STT");
    if (auto) {
      setStt(auto);
      handleTrack(auto);
      localStorage.removeItem("AUTO_STT");
    }
  }, [handleTrack]);

  const handleTrackWithRedirect = useCallback(async (sttNumber: string) => {
    if (!sttNumber.trim()) return;
    setIsDrawerOpen(false);

    if (onNewTracking) {
      onNewTracking(sttNumber.trim());
    } else {
      await handleTrack(sttNumber);
    }
  }, [onNewTracking, handleTrack]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDrawerOpen && stt.trim() === "") {
        setShowHint(true);
      } else {
        setShowHint(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isDrawerOpen, stt]);

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {showHint && !isDrawerOpen && (
        <div onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="cursor-pointer md:hidden fixed left-2 top-[47%] max-w-[120px] -translate-y-1/2 bg-white text-[#06334d] shadow-lg px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 animate-fadePop z-50">
          Masukkan nomor resi di sini
        </div>
      )}

      <div className="max-w-[1200px] mx-auto flex gap-6 relative px-5">
        {isDrawerOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        <div
          className={`
            fixed md:relative 
            inset-y-0 left-0
            w-[85%] max-w-xs md:w-full 
            bg-white md:bg-transparent
            z-40 md:z-auto
            transform transition-transform duration-300 ease-in-out
            ${
              isDrawerOpen
                ? "translate-x-0"
                : "-translate-x-[95%] md:translate-x-0"
            }
          `}
        >
          <button
            className="md:hidden absolute top-1/2 -right-3 bg-white border border-gray-400 rounded-full p-1 transition-all"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <ChevronRight
              className={`w-7 h-7 transition-transform duration-300 ${
                isDrawerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="md:sticky md:top-[35%] h-full md:h-auto bg-white rounded-r-2xl md:rounded-2xl shadow-2xl md:shadow-lg p-6">
            {/* Close drawer (Mobile only) */}
            <button
              className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-md:my-5 md:mb-5">
              <h2 className="text-xl text-center font-bold text-gray-900">
                Cek Resi Kamu
              </h2>
            </div>

            {/* Input fields */}
            <div className="grid gap-3">
              <input
                type="text"
                value={stt}
                onChange={(e) => setStt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleTrackWithRedirect(stt)
                }
                placeholder="Masukkan Nomor Resi"
                className="
                  border-2 border-gray-300 
                  h-11 
                  px-3 
                  rounded-lg 
                  text-sm md:text-base 
                  focus:border-[#abc82e] 
                  focus:outline-none
                  transition-colors
                "
              />

              <button
                onClick={() => handleTrackWithRedirect(stt)}
                disabled={loading}
                className="
                  bg-[#06334d] 
                  text-white 
                  h-11 
                  rounded-lg 
                  px-4 
                  font-semibold 
                  disabled:bg-gray-400 
                  hover:bg-[#052a3f] 
                  text-sm md:text-base
                  transition-colors
                "
              >
                {loading ? "Mencari..." : "Lacak"}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================
         * RESULT SECTION
         * ====================================== */}
        <div className="w-full md:w-[80%]">
          {trackingData && (
            <div className="flex flex-col gap-6 justify-center bg-white min-h-screen shadow-lg p-4 md:p-6">
              <div className="flex justify-center">
                <img
                  src={
                    trackingData.courier === "Lion Parcel"
                      ? "/Logo Lion.png"
                      : "/Logo Sicepat.png"
                  }
                  alt="Courier Logo"
                  className="h-14 md:h-20 object-contain"
                />
              </div>

              <ProgressSteps steps={progressSteps} />
              <div className="grid gap-5">
                <AddressBlock trackingData={trackingData} />

                <HistorySection
                  groupedHistory={groupedHistory}
                  sortedDates={sortedDates}
                  expandedPOD={expandedPOD}
                  togglePOD={togglePOD}
                  formatTime={formatTime}
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-[#06334d] rounded-full animate-spin"></div>
                <p className="text-gray-600 text-sm md:text-base">
                  Sedang mencari data...
                </p>
              </div>
            </div>
          )}

          {!trackingData && !result?.error && <EmptyState />}
          {result?.error && <ErrorBox result={result} />}
        </div>
      </div>
    </main>
  );
}