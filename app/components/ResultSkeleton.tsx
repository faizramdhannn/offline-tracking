import { CARD } from "./motion";

export default function ResultSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-label="Sedang mencari data">
      <div className={`${CARD} p-5 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton h-11 w-[72px]" />
            <div className="grid gap-2">
              <div className="skeleton h-3.5 w-24" />
              <div className="skeleton h-3 w-14" />
            </div>
          </div>
          <div className="skeleton h-7 w-28 rounded-full" />
        </div>

        <div className="skeleton mt-6 h-3 w-20" />
        <div className="skeleton mt-2 h-7 w-56 max-w-full" />

        <div className="mt-8 grid grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="skeleton size-10 rounded-full" />
              <div className="skeleton h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      <div className={`${CARD} grid gap-5 p-5 sm:p-6`}>
        <div className="skeleton h-4 w-40" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="skeleton size-[15px] rounded-full" />
            <div className="grid flex-1 gap-2">
              <div className="skeleton h-3 w-16" />
              <div className="skeleton h-3.5 w-full max-w-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
