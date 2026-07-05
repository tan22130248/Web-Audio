export default function BottomPlayer() {
  return (
    <div className="fixed bottom-[4.5rem] md:bottom-gutter left-gutter right-gutter md:left-[18rem] md:right-xl z-50">
      <div className="glass-panel border border-white/10 rounded-2xl md:rounded-full p-2 flex items-center gap-md shadow-2xl">
        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-white/10 overflow-hidden rounded-full">
          <div className="primary-gradient h-full w-[45%]" id="player-progress"></div>
        </div>

        <div className="flex items-center gap-sm flex-1">
          <div className="w-12 h-12 rounded-lg md:rounded-full overflow-hidden flex-none shadow-lg">
            <img
              className="w-full h-full object-cover"
              data-alt="Small thumbnail of a book cover showing a mysterious forest at night, deep teal and silver colors, digital art style."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxyp8CEUdhiGMK24CBI4UmJ6PYE7j_EokQlYCWUCyXKeCA95LIC87FfVQKL9KRm-K5RJSqm7MgHRO1G77QRWhHLN6rahUAdPuFPJm_FTurRNI8tMZueLqpTPL39uG87xf1Z1i88R87GuHJwBCSrkbI7XblDZsCzqpI4XT_WZtDobOQxQ4hqRH1O3Xq2FxXxw6S4i8PAbCMG-By4K9dYxzDz_TUzPrAEp6PH_SJP_k9bQUOmoh33pXMrpGQXSAMYQrA3VMO3UZpXCvM"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold truncate">Mộng Hoa Lục - Chương 12</h4>
            <p className="text-[10px] text-on-surface-variant truncate">Thiên Diệp • Giọng đọc: Ngọc Linh</p>
          </div>
        </div>

        <div className="flex items-center gap-sm md:gap-lg pr-md">
          <button className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">skip_previous</span>
          </button>

          <button className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </button>

          <button className="hidden sm:block text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">skip_next</span>
          </button>

          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
