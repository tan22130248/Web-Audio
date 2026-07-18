export default function AdStickyBar({ viewCount, requiredViews, isUnlocked, onWatchAd, isLoading }) {
  const progressPercent = Math.min(100, Math.round((viewCount / requiredViews) * 100));

  return (
    <div className="sticky top-[57px] z-30 border-b border-white/8 bg-[#0d0c1f]/92 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-xl sm:px-5 md:pl-44 md:pr-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-fixed ring-1 ring-primary/25">
            <span className="material-symbols-outlined text-[20px]">campaign</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold leading-snug text-white sm:text-[13px]">
              {isUnlocked
                ? "Bạn đã mở khóa! Có thể nghe thoải mái không cần xem thêm quảng cáo."
                : `Bạn cần xem đủ ${requiredViews} lần quảng cáo để mở khóa nghe không giới hạn.`}
            </p>
            <div className="mt-1.5 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${isUnlocked ? "bg-emerald-400" : "primary-gradient"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="shrink-0 text-[11px] font-bold tabular-nums text-white/65">
                Đã xem {viewCount}/{requiredViews} lượt quảng cáo
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={isUnlocked ? undefined : onWatchAd}
          disabled={isUnlocked ? false : isLoading}
          type="button"
          className={`flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-extrabold text-white shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60 ${
            isUnlocked
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
              : "primary-gradient shadow-primary-container/30 hover:brightness-110"
          }`}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-pulse text-[16px]">progress_activity</span>
              Đang mở...
            </>
          ) : isUnlocked ? (
            <>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Đã mở khóa
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              Nghe audio
            </>
          )}
        </button>
      </div>
    </div>
  );
}
