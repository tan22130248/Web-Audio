function StoryPlayerModal({ story, isPlaying, currentTime, duration, progress, likeCount, liked, onLike, onTogglePlay, onClose, onSeek }) {
  if (!story) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-[#050512]/72 px-4 py-4 backdrop-blur-lg sm:py-6">
      <section className="modal-card relative flex max-h-[92dvh] w-full max-w-[390px] flex-col overflow-y-auto rounded-[28px] border border-white/12 bg-[#0b0b20]/95 px-5 py-5 text-white shadow-[0_30px_100px_rgba(0,0,0,0.78),0_0_56px_rgba(124,58,237,0.26)] ring-1 ring-white/[0.035] sm:max-w-[430px] sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-32 rounded-full bg-primary-container/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-secondary-container/15 blur-3xl" />
        <div className="relative mb-5 flex items-center justify-between">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.08] text-white transition duration-200 hover:scale-105 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25"
            onClick={onClose}
            type="button"
            aria-label="Đóng trình phát"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_#ffb0cd]" />Đang phát</p>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.08] text-white transition duration-200 hover:scale-105 hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25"
            type="button"
            aria-label="Mở tuỳ chọn"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>

        <img
          className="relative mx-auto h-[190px] w-[190px] rounded-[24px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_34px_rgba(124,58,237,0.4)] ring-1 ring-white/15 sm:h-[216px] sm:w-[216px]"
          src={story.image}
          alt={story.title}
        />

        <div className="relative mt-5 text-center sm:mt-6">
          <h2 className="text-[24px] font-extrabold leading-7 tracking-[-0.025em] text-white sm:text-[27px] sm:leading-8">{story.title}</h2>
          <p className="mt-1.5 text-[14px] font-semibold text-white/68 sm:text-[15px]">{story.author}</p>
          <span className="mt-2.5 inline-flex rounded-full border border-tertiary/15 bg-tertiary/15 px-3 py-1 text-[10px] font-extrabold text-tertiary">
            {story.genre}
          </span>
        </div>

        <div className="relative mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-3 py-3 sm:px-4">
          <div className="mb-2 flex h-12 items-center justify-center gap-1 sm:h-14">
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
          <div className="flex items-center justify-between text-[11px] font-extrabold tabular-nums text-white/82">
            <span>{currentTime || "0:00"}</span>
            <span>{duration || story.duration || "0:00"}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-bold text-white/55">
            <span className="material-symbols-outlined text-[12px]">visibility</span>
            <span>{(story.viewCount || 0).toLocaleString("vi-VN")} người xem</span>
            <span className="mx-1 text-white/30">|</span>
            <span className="material-symbols-outlined text-[12px]">favorite</span>
            <span>{(likeCount || 0).toLocaleString("vi-VN")} lượt thích</span>
          </div>
        </div>

        <div className="relative mt-3 px-1">
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
            className="group h-2.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/10 p-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25"
            aria-label="Chỉnh thời gian phát"
          >
            <div className="h-full rounded-full primary-gradient shadow-[0_0_12px_rgba(210,187,255,0.65)] transition-none" style={{ width: `${progress}%` }} />
          </button>
        </div>

        <div className="relative mt-5 flex items-center justify-center gap-2.5 sm:gap-3">
          <button className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/8 bg-white/[0.07] text-white/80 transition duration-200 hover:scale-105 hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25" type="button" aria-label="Phát ngẫu nhiên">
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>
          <button className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/8 bg-white/[0.07] text-white/80 transition duration-200 hover:scale-105 hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25" type="button" aria-label="Danh sách tập">
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          <button
            className="flex h-[62px] w-[62px] flex-none items-center justify-center rounded-full text-primary-container shadow-[0_16px_40px_rgba(255,176,205,0.35)] transition duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/35"
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
            className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border transition duration-200 hover:scale-105 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25 ${liked ? "border-secondary/35 bg-secondary/20 text-secondary" : "border-white/8 bg-white/[0.07] text-white/85 hover:bg-white/[0.16] hover:text-white"}`}
            type="button"
            aria-label="Thích"
            onClick={(e) => {
              e.stopPropagation();
              if (!liked) onLike && onLike(story.id, e);
            }}
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
          </button>
          <button className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/8 bg-white/[0.07] text-white/80 transition duration-200 hover:scale-105 hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25" type="button" aria-label="Lặp lại">
            <span className="material-symbols-outlined text-[20px]">repeat</span>
          </button>
        </div>

        <div className="relative mt-5 rounded-2xl border border-white/[0.09] bg-white/[0.055] p-2">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.045] p-3">
            <p className="text-[11px] font-bold leading-4 text-white/72">Mở khóa toàn bộ tập với Premium</p>
            <a
              className="rounded-xl px-4 py-2 text-[10px] font-extrabold text-primary-container shadow-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-primary-container/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25"
              href="/premium"
              style={{ background: "linear-gradient(135deg, #e9c5ff 0%, #ffb783 100%)" }}
            >
              Nâng cấp ngay
            </a>
          </div>
        </div>

        <div className="relative mt-auto flex justify-around pt-5 text-[11px] font-bold text-white/55">
          <button className="border-b-2 border-primary pb-1 text-white transition hover:text-primary" type="button">Danh sách tập</button>
          <button className="border-b-2 border-transparent pb-1 transition hover:text-white" type="button">Bình luận</button>
          <button className="border-b-2 border-transparent pb-1 transition hover:text-white" type="button">Giới thiệu</button>
        </div>
      </section>
    </div>
  );
}

export default StoryPlayerModal;
