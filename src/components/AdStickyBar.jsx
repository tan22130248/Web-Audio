export default function AdStickyBar({ viewCount, requiredViews, isUnlocked, onWatchAd, isLoading }) {
  const progressPercent = Math.min(100, Math.round((viewCount / requiredViews) * 100));

  return (
    <div className="sticky top-[57px] z-30 bg-[#0d0c1f]/95 px-4 py-2.5 shadow-lg shadow-black/25 backdrop-blur-xl border-b border-white/6 md:pl-44 md:pr-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-white">
              {isUnlocked
                ? "Bạn đã mở khóa! Có thể nghe thoải mái không cần xem thêm quảng cáo."
                : `Bạn cần xem đủ ${requiredViews} lần quảng cáo để mở khóa nghe không giới hạn.`}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${isUnlocked ? "bg-emerald-400" : "primary-gradient"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="shrink-0 text-[10px] font-extrabold text-white/68">
                Đã xem {viewCount}/{requiredViews} lượt quảng cáo
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={isUnlocked ? undefined : onWatchAd}
          disabled={isUnlocked ? false : isLoading}
          type="button"
          className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-extrabold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 ${
            isUnlocked
              ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
              : "primary-gradient shadow-primary-container/25"
          }`}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-[15px] animate-pulse">progress_activity</span>
              Đang mở...
            </>
          ) : isUnlocked ? (
            <>
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              Đã mở khóa
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[15px]">play_circle</span>
              Nghe audio
            </>
          )}
        </button>
      </div>
    </div>
  );
}
