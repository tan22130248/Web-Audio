function StoryPlayerModal({ story, isPlaying, currentTime, duration, progress, likeCount, liked, onLike, onTogglePlay, onClose, onSeek }) {
  if (!story) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-5 backdrop-blur-md">
      <section className="modal-card relative flex max-h-[90dvh] w-full max-w-[340px] flex-col overflow-y-auto rounded-[28px] border border-white/10 bg-[#0b0b20]/92 px-5 py-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.75),0_0_42px_rgba(124,58,237,0.28)]">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-28 rounded-full bg-primary-container/25 blur-3xl" />
        <div className="relative mb-4 flex items-center justify-between">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/18 hover:scale-105"
            onClick={onClose}
            type="button"
            aria-label="Đóng trình phát"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">Đang phát</p>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/18 hover:scale-105"
            type="button"
            aria-label="Mở tuỳ chọn"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>

        <img
          className="relative mx-auto h-[176px] w-[176px] rounded-2xl object-cover shadow-[0_18px_50px_rgba(0,0,0,0.5),0_0_28px_rgba(124,58,237,0.38)] ring-1 ring-white/12"
          src={story.image}
          alt={story.title}
        />

        <div className="relative mt-5 text-center">
          <h2 className="text-[25px] font-extrabold leading-7 text-white">{story.title}</h2>
          <p className="mt-1 text-[15px] font-bold text-white/72">{story.author}</p>
          <span className="mt-2 inline-flex rounded-full bg-tertiary/20 px-3 py-1 text-[10px] font-extrabold text-tertiary">
            {story.genre}
          </span>
        </div>

        <div className="relative mt-6">
          <div className="mb-2 flex h-14 items-center justify-center gap-1">
            {[10,15,22,16,30,42,24,36,48,28,54,40,20].map((height, index) => (
              <span
                className="modal-wave w-1 rounded-full bg-primary"
                key={`${height}-${index}`}
                style={{
                  height,
                  animationDelay: `${index * 80}ms`,
                  opacity: index % 3 === 0 ? 0.55 : 0.9,
                  background:
                    index > 7
                      ? "linear-gradient(180deg, #ffb783 0%, #d2bbff 100%)"
                      : "linear-gradient(180deg, #d2bbff 0%, #7c3aed 100%)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-extrabold">
            <span>{currentTime}</span>
            <span>{duration || story.duration}</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-bold text-white/55">
            <span className="material-symbols-outlined text-[12px]">visibility</span>
            <span>{(story.viewCount || 0).toLocaleString("vi-VN")} người xem</span>
            <span className="mx-1 text-white/30">|</span>
            <span className="material-symbols-outlined text-[12px]">favorite</span>
            <span>{(likeCount || 0).toLocaleString("vi-VN")} lượt thích</span>
          </div>
        </div>

        <div className="relative mt-2">
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
            className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10 p-0"
            aria-label="Chỉnh thời gian phát"
          >
            <div className="h-full w-full rounded-full primary-gradient transition-none" style={{ width: `${progress}%` }} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center justify-center gap-3">
          <button className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/18 hover:text-white" type="button" aria-label="Phát ngẫu nhiên">
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>
          <button className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/18 hover:text-white" type="button" aria-label="Danh sách tập">
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          <button
            className="flex h-[58px] w-[58px] flex-none items-center justify-center rounded-full text-primary-container shadow-[0_16px_36px_rgba(255,176,205,0.3)] transition-transform hover:scale-105 active:scale-95"
            type="button"
            aria-label={isPlaying ? "Tạm dừng" : "Phát"}
            onClick={onTogglePlay}
            style={{ background: "linear-gradient(135deg, #ffb0cd 0%, #ffb783 100%)" }}
          >
            <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          <button
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-white/90 transition-all hover:bg-white/18 hover:text-white active:scale-90"
            type="button"
            aria-label="Thích"
            onClick={(e) => {
              e.stopPropagation();
              if (!liked) onLike && onLike(story.id, e);
            }}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0", color: liked ? '#ffffff' : 'inherit' }}>favorite</span>
          </button>
          <button className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/18 hover:text-white" type="button" aria-label="Lặp lại">
            <span className="material-symbols-outlined text-[20px]">repeat</span>
          </button>
        </div>

        <div className="relative mt-4 rounded-2xl bg-white/[0.075] p-2 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.055] p-3">
            <p className="text-[10px] font-bold leading-4 text-white/72">Mở khóa toàn bộ tập với Premium</p>
            <a
              className="rounded-xl px-4 py-2 text-[10px] font-extrabold text-primary-container shadow-lg"
              href="/premium"
              style={{ background: "linear-gradient(135deg, #e9c5ff 0%, #ffb783 100%)" }}
            >
              Nâng cấp ngay
            </a>
          </div>
        </div>

        <div className="relative mt-auto flex justify-around pt-4 text-[10px] font-bold text-white/58">
          <button className="text-white" type="button">Danh sách tập</button>
          <button type="button">Bình luận</button>
          <button type="button">Giới thiệu</button>
        </div>
      </section>
    </div>
  );
}

export default StoryPlayerModal;
