export default function HistoryPOD({ item }: any) {
  return (
    <div className="flex flex-col gap-2">
      {item.receivedBy && (
        <p className="text-xs md:text-sm text-gray-600">
          <span className="font-semibold">Diterima oleh:</span> {item.receivedBy}
        </p>
      )}

      {item.attachment && item.attachment.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {item.attachment.map((url: string, i: number) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={`Bukti pengiriman ${i + 1}`}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}