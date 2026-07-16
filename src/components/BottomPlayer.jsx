export default function BottomPlayer({ currentTrack, onTogglePlay, onStop, onOpenStory, onSeek }) {
  const story = currentTrack?.story;
  const isPlaying = currentTrack?.isPlaying;
  const currentTime = currentTrack?.currentTime || "0:00";
  const duration = currentTrack?.duration || story?.duration || "0:00";
  const progress = currentTrack?.progress ?? 0;

  if (!story) return null;

  return (
    <div className="fixed bottom-[4.5rem] left-4 right-4 z-50 md:bottom-4 md:left-44 md:right-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-panel relative flex items-center gap-3 rounded-2xl border border-white/12 bg-[#101026]/85 p-2 shadow-2xl md:rounded-full">
          <div className="absolute bottom-0 left-7 right-7 h-2 overflow-hidden rounded-full bg-white/12">
            <button
              type="button"
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                if (onSeek) onSeek(pct);
                const onPointerMove = (ev) => {
                  const rect = ev.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
                  if (onSeek) onSeek(pct);
                };
                const onPointerUp = () => {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                  e.currentTarget.removeEventListener("pointermove", onPointerMove);
                  e.currentTarget.removeEventListener("pointerup", onPointerUp);
                };
                e.currentTarget.addEventListener("pointermove", onPointerMove);
                e.currentTarget.addEventListener("pointerup", onPointerUp);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              className="h-full w-full cursor-pointer bg-transparent p-0"
              aria-label="Chỉnh thời gian phát"
            >
              <div className="h-full primary-gradient" style={{ width: `${progress}%` }} />
            </button>
          </div>

          <button
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={onOpenStory}
            type="button"
          >
            <div className="h-9 w-9 flex-none overflow-hidden rounded-lg shadow-lg ring-1 ring-white/10">
              <img
                className="h-full w-full object-cover"
                src={story.image}
                alt={story.title}
              />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[11px] font-extrabold text-white">{story.title}</h4>
              <p className="truncate text-[9px] font-semibold text-white/58">{story.author}</p>
            </div>
          </button>

          <div className="flex items-center gap-2 pr-2">
            <span className="text-[10px] font-extrabold text-white/65">{currentTime} / {duration}</span>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full primary-gradient text-white shadow-md transition-transform active:scale-90"
              onClick={onTogglePlay}
              type="button"
              aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              className="text-white/65 transition-colors hover:text-white"
              onClick={onStop}
              type="button"
              aria-label="Dừng"
            >
              <span className="material-symbols-outlined text-[17px]">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
