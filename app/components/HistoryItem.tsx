import HistoryPOD from "./HistoryPOD";

export default function HistoryItem({
  item,
  itemIndex,
  dateIndex,
  podKey,
  hasPOD,
  expandedPOD,
  togglePOD,
  formatTime,
}: any) {
  return (
    <>
      <div className="flex items-center gap-3 md:gap-4 py-2 hover:bg-gray-50 px-2 rounded">
        {/* KOLOM 1: Titik + Jam */}
        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 min-w-[50px] md:min-w-[90px]">
          {/* Titik - selalu di kiri */}
          <div
            className={`w-3.5 h-3.5 rounded-full shrink-0 border-2 border-white shadow md:self-start ${
              dateIndex === 0 && itemIndex === 0 ? "bg-[#06334d]" : "bg-gray-300"
            }`}
          />
          {/* Jam - center vertikal di desktop */}
          <span className="text-xs md:text-sm text-gray-500 text-center md:text-left whitespace-nowrap md:self-center">
            {item?.dateTime ? formatTime(item.dateTime) : ""}
          </span>
        </div>

        {/* KOLOM 2: Deskripsi + POD Button */}
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            {item.description
              ?.toLowerCase()
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </p>

          {!!hasPOD && (
            <button
              onClick={() => togglePOD(podKey)}
              className="text-[#06334d] hover:text-[#acc72f] text-sm md:text-base underline mt-1 cursor-pointer"
            >
              {expandedPOD.includes(podKey)
                ? "Sembunyikan Bukti Pengiriman"
                : "Lihat Bukti Pengiriman"}
            </button>
          )}
        </div>
      </div>

      {!!hasPOD && expandedPOD.includes(podKey) && (
        <div className="ml-[72px] md:ml-[126px] mb-3 p-3 rounded-lg bg-gray-50">
          <HistoryPOD item={item} />
        </div>
      )}
    </>
  );
}