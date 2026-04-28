import HistoryItem from "./HistoryItem";

export default function HistorySection({
  groupedHistory,
  sortedDates,
  expandedPOD,
  togglePOD,
  formatTime,
}: any) {
  return (
    <>
      <h2 className="text-lg md:text-xl font-bold text-[#06334d] mb-4">
        Riwayat Pengiriman
      </h2>

      <div className="space-y-5">
        {sortedDates.map((date: string, dateIndex: number) => (
          <div key={dateIndex}>
            <h3 className="text-xs md:text-sm font-semibold text-gray-700 px-2 mb-2">
              {date}
            </h3>

            {groupedHistory[date].map((item: any, itemIndex: number) => {
              const podKey = `${dateIndex}-${itemIndex}`;
              const hasPOD =
                Boolean(item.receivedBy) ||
                (item.attachment && item.attachment.length);

              return (
                <HistoryItem
                  key={itemIndex}
                  item={item}
                  itemIndex={itemIndex}
                  dateIndex={dateIndex}
                  podKey={podKey}
                  hasPOD={hasPOD}
                  expandedPOD={expandedPOD}
                  togglePOD={togglePOD}
                  formatTime={formatTime}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}