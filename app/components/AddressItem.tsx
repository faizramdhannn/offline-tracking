export default function AddressItem({ label, value, icon }: any) {
  return (
    <div className="flex gap-3 w-content">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          {icon === "user" ? (
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs md:text-sm text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm md:base font-semibold text-gray-800 uppercase">
          {value}
        </p>
      </div>
    </div>
  );
}