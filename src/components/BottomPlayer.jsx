export default function BottomPlayer() {
  return (
    <div className="fixed bottom-[4.5rem] left-4 right-4 z-50 md:bottom-4 md:left-44 md:right-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-panel relative flex items-center gap-3 rounded-2xl border border-white/12 bg-[#101026]/85 p-2 shadow-2xl md:rounded-full">
          <div className="absolute bottom-0 left-7 right-7 h-0.5 overflow-hidden rounded-full bg-white/12">
            <div className="h-full w-[45%] primary-gradient" id="player-progress" />
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="h-9 w-9 flex-none overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyp8CEUdhiGMK24CBI4UmJ6PYE7j_EokQlYCWUCyXKeCA95LIC87FfVQKL9KRm-K5RJSqm7MgHRO1G77QRWhHLN6rahUAdPuFPJm_FTurRNI8tMZueLqpTPL39uG87xf1Z1i88R87GuHJwBCSrkbI7XblDZsCzqpI4XT_WZtDobOQxQ4hqRH1O3Xq2FxXxw6S4i8PAbCMG-By4K9dYxzDz_TUzPrAEp6PH_SJP_k9bQUOmoh33pXMrpGQXSAMYQrA3VMO3UZpXCvM"
                alt="Mộng Hoa Lục"
              />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[11px] font-extrabold text-white">Mộng Hoa Lục - Chương 12</h4>
              <p className="truncate text-[9px] font-semibold text-white/58">Thiên Diệp - Giọng đọc: Ngọc Linh</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <button className="hidden text-white/65 transition-colors hover:text-white sm:block">
              <span className="material-symbols-outlined text-[17px]">skip_previous</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full primary-gradient text-white shadow-md transition-transform active:scale-90">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>
            <button className="hidden text-white/65 transition-colors hover:text-white sm:block">
              <span className="material-symbols-outlined text-[17px]">skip_next</span>
            </button>
            <button className="text-white/65 transition-colors hover:text-white">
              <span className="material-symbols-outlined text-[17px]">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
