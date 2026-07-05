import { useState } from "react";
import { Link } from "react-router-dom";

const featuredStories = [
  {
    title: "Mộng Hoa Lục",
    author: "Thiên Diệp",
    genre: "Huyền Huyễn",
    duration: "45:00",
    currentTime: "12:45",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqm6nP4DuoQ4ki4UY8FXZKz1dcCPk_3MRh6l2eABCOjrFiBzoo4fb0Jc0aQM80oJt1TP5eFW19twK_9m-OHJmR0oY9XlUQYUNJIFLbOcJvobUSnI-Fx5mtXL68IlpJxOaFY0v9xfKZkZEmmrPUTMIimOZRTv9xbb1qAbG7U3rDwzV9rB0GOvHgrLLE7ftG4TcD3N2VZE5ieySHbPy_H1RGkutqsGzv3SsElA3D_-YfL1lVsIsZRnRGIPpNvvGph0vDKj6S63kPGYMD",
  },
  {
    title: "Sài Gòn Mưa Rơi",
    author: "Mộc Trà",
    genre: "Ngôn Tình",
    duration: "38:20",
    currentTime: "09:18",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCT_rzd5vuDSpjCvD_NT0OdCh6kIEzqV0gTBYpQUBU4nIIscrTbwDLngM6qqtxwshTc1qANWqJyqKDxSTltvHTzeBWVauRclAYVvCAK0uO8ZvSpN54zRnkZyZgZp0fidZ4GsTnIA1Z_wUroekchwJXtP5o8q5atWQlWVg8G5DyE5hhTI25EREAS_a9zDL6N3M-aCTyzh7w4JIVqgO8DvamZDwHGOdhtom3psK-DRVZkdCbmkbhUY59KpgqynO8rU2AcfyqaWbuS-QfX",
  },
  {
    title: "Oán Hồn Xóm Nhỏ",
    author: "Kỳ Án",
    genre: "Kinh Dị",
    duration: "52:10",
    currentTime: "18:03",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcUSs_dM3RebTuKfJh0SZPgj3-iOjsCk-Vw9lGuCGDCzg4thK_xmc8C5PNiBcd2_LQgdMFPS1L1iO_hmkI0hbgnUQ5kOmxxixZtX-nKYVUr8U-ShmaBjnytqg7__ajJCKxSnvjmsR91dUY42METdNTKsdwnve7FSRBbLKbiCPfUbqW0UqDJq2FN3GjlMxgfiFjDmsY4krS3lx7PsG9PdHtQnijDvfbB8hEfH-k3-bX9py3Qk70NfoA6BGhrTCJ0ZaOib6rBHoO28dA",
  },
];

const categories = [
  ["Tổng tài", "bg-primary/20 text-primary border-primary/25"],
  ["Tiên hiệp", "bg-tertiary/20 text-tertiary border-tertiary/25"],
  ["Ngôn tình", "bg-secondary/20 text-secondary border-secondary/25"],
  ["Kinh dị", "bg-red-500/20 text-red-300 border-red-500/25"],
  ["Hài hước", "bg-emerald-500/20 text-emerald-300 border-emerald-500/25"],
  ["Trinh thám", "bg-surface-variant/70 text-on-surface border-outline-variant/25"],
];

const latestStories = [
  {
    title: "Vụ Án Đêm Trăng",
    author: "Hoàng Nam",
    genre: "Trinh Thám",
    duration: "12:45:00",
    currentTime: "12:45",
    listens: "12.4k",
    progress: "75%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwqG5MIBfNOV6IRC-INlrCr1JpRAH4tB0KJnJipHOf4PCETZq9Km4qPWwaTo5VBqFM2oQrWZF3Q-1Y6exlolnlI8yPevLwJB7jOC2GohknyZthT1dzbZlfHzhJST5avf4Ku4-BbgYmJnBx0BG5VY4jZMCiFKSnO8O2hhi9dqK5Pn4uBUjqNzYakkAdvC0cb-u3hqiLvatzHSM9b2jMaVXxRBBrOmHxKKuALLoTkI8v6YQACkr0qYBvtxSf7lBTSJxQZnyhDf5ROdXn",
  },
  {
    title: "Yêu Lại Từ Đầu",
    author: "An Nhiên",
    genre: "Ngôn Tình",
    duration: "08:30:12",
    currentTime: "08:30",
    listens: "45.2k",
    progress: "20%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8ZlJ5UeV5VnKS21rf721NvdykFZHV4DH703Tn8DPuR-MZj2emvngiqTOfmg5zxXxUZqUh_HNZNa4RJE6Xu4Ua6x_ZDLnfGwXUT5XA51XkxdggrIwOwf3IALB8JeOKPAJqQYnavWWOzC_xaabm7Z9bFIEFTz4IPmvfrXNH66hnOh443ouqCQz7GfahANxFPrInMCzQbb-br_MpGy5yxGq3Xk-w_-fYYCOVvdWtjX5qTzw6Adjn78KGLLzb6d95OEkTXOVb7ceYoGIp",
  },
  {
    title: "Vạn Cổ Đệ Nhất",
    author: "Huyết Long",
    genre: "Tiên Hiệp",
    duration: "42:15:00",
    currentTime: "42:15",
    listens: "1.2M",
    progress: "95%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBU9DqJC4TNyyul1SbHwfrRJZNuTukDpMCljSDCkKADOpy1rDBL2gwdvPkpA06fFDMZgJYLZaL0RpVMBd9_cXSFU9YI7p4Q0siRZY_E8n9IEIPA08tlrvY4APZAvzvYv_82LDb4WtAXo_GLZ1MZO9Tns47XuHHr8Sc7z1vjjcBBXKuV9rNZhsyP4-KqTMxppcyKwdyd5TVXhH-lKZOvyF9-LTb_7mIxGl6PVSL8nmBtmzxEV0HJ-zo0i1igWwUA_bZOzYern1EGeAK1",
  },
  {
    title: "Chuyện Ở Phố",
    author: "Tâm Anh",
    genre: "Đời Sống",
    duration: "05:20:45",
    currentTime: "05:20",
    listens: "8.9k",
    progress: "10%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXWBh1GGwZRFry_ECs0Hfpl0gyCjwfj1kIPinLPANqknqZVZr1W4bwmylsAFNteKW_4yrHIyCwQ31LFQ1YCSw_n6wQKSw_byclhYAwbUUEaBlVsrIGXsSye6yOZmCkmXoHIIaPwm5-I_z_Lqo7UlK1IK2uFShgczfCSYUgfNySkZGF7tYdN_1_kRihBJRAU05DY_HjNU9_Ce2KJ9Wz7tza-s7MdTULerqF6Q8AW_lUHOS2SE-b1QtAsXnfwatgXnJS0o2ZdmGZAqfZ",
  },
];

const recommendedStory = {
  title: "Hào Khí Thăng Long",
  author: "Thanh Hải",
  genre: "Lịch Sử",
  duration: "45:00",
  currentTime: "12:45",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAd8g6RYo3xAFdWcBh49CW4bkMjXanU_PnfQrsyMtkPJI_4Etch8dWN6vx6CtPrSD-LSL1BYEM8x5v7w0mgo7GvINHGHgGfiRmMefTi_MyzFJdc5V9lIgLcs88XUkOK_zeG766mFEV9xMDhICM7kiSObSKKD0q-T3xkEolVHgryi4fPvAVSY2nsLYPN6YPYw3Zef-TrNLmP8YdX9WL8nqbp9zeb82O52pFV-8__bi0M_qNW0qz5MKOU_HleNe4PPZAgSWy7yHtc2QRX",
};

const waveBars = [10, 15, 22, 16, 30, 42, 24, 36, 48, 28, 54, 40, 20];

function StoryPlayerModal({ story, onClose }) {
  if (!story) {
    return null;
  }

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
            {waveBars.map((height, index) => (
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
            <span>{story.currentTime}</span>
            <span>{story.duration}</span>
          </div>
        </div>

        <div className="relative mt-4 flex items-center justify-between px-2">
          <button className="text-white/80 transition-colors hover:text-white" type="button" aria-label="Phát ngẫu nhiên">
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>
          <button className="text-white/80 transition-colors hover:text-white" type="button" aria-label="Danh sách tập">
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
          </button>
          <button
            className="flex h-[58px] w-[58px] items-center justify-center rounded-full text-primary-container shadow-[0_16px_36px_rgba(255,176,205,0.3)] transition-transform hover:scale-105"
            type="button"
            aria-label="Phát"
            style={{ background: "linear-gradient(135deg, #ffb0cd 0%, #ffb783 100%)" }}
          >
            <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </button>
          <button className="text-white/80 transition-colors hover:text-white" type="button" aria-label="Tập kế tiếp">
            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
          </button>
          <button className="text-white/80 transition-colors hover:text-white" type="button" aria-label="Lặp lại">
            <span className="material-symbols-outlined text-[20px]">repeat</span>
          </button>
        </div>

        <div className="relative mt-4 rounded-2xl bg-white/[0.075] p-2 ring-1 ring-white/10">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.055] p-3">
            <p className="text-[10px] font-bold leading-4 text-white/72">Mở khóa toàn bộ tập với Premium</p>
            <Link
              className="rounded-xl px-4 py-2 text-[10px] font-extrabold text-primary-container shadow-lg"
              to="/premium"
              style={{ background: "linear-gradient(135deg, #e9c5ff 0%, #ffb783 100%)" }}
            >
              Nâng cấp ngay
            </Link>
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

export default function Home() {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <>
      <main className="w-full px-4 pb-28 pt-[4.9rem] text-white md:pl-44 md:pr-8">
        <div className="mx-auto w-full max-w-6xl">
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-md text-[19px] leading-6 text-white">Nổi bật</h2>
            <a className="flex items-center gap-0.5 text-[11px] font-extrabold text-primary-fixed transition-colors hover:text-white" href="#">
              Xem tất cả
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_1.2fr_0.75fr]">
            {featuredStories.map((story) => (
              <button
                className="group relative min-h-[156px] cursor-pointer overflow-hidden rounded-xl text-left shadow-xl ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
                key={story.title}
                onClick={() => setActiveStory(story)}
                type="button"
              >
                <img
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={story.image}
                  alt={story.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="mb-1 text-[9px] font-extrabold uppercase text-tertiary">{story.genre}</p>
                  <h3 className="font-headline-md line-clamp-1 text-[15px] leading-4 text-white">{story.title}</h3>
                  <p className="line-clamp-1 text-[10px] font-semibold text-white/78">Tác giả: {story.author}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(([label, tone]) => (
              <button
                className={`rounded-full border px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap shadow-sm transition-transform active:scale-95 ${tone}`}
                key={label}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 font-headline-md text-[19px] leading-6 text-white">Mới cập nhật</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {latestStories.map((story) => (
              <button
                className="group min-w-0 cursor-pointer rounded-xl bg-white/[0.055] p-2 text-left ring-1 ring-white/10 transition-all hover:bg-white/[0.08] hover:ring-primary/35"
                key={story.title}
                onClick={() => setActiveStory(story)}
                type="button"
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg shadow-md">
                  <img className="h-full w-full object-cover" src={story.image} alt={story.title} />
                  <div className="absolute top-1.5 left-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[8px] text-white backdrop-blur-md">
                    {story.duration}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full primary-gradient text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                  </div>
                </div>
                <h3 className="line-clamp-1 text-[12px] font-extrabold leading-4 text-white group-hover:text-primary-fixed">{story.title}</h3>
                <p className="mb-1 line-clamp-1 text-[10px] font-semibold text-white/62">{story.author}</p>
                <div className="mb-1 flex items-center justify-between text-[9px] font-bold text-white/60">
                  <span>{story.listens}</span>
                  <span className="font-extrabold text-primary-fixed">{story.progress}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full primary-gradient" style={{ width: story.progress }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-headline-md text-[19px] leading-6 text-white">Gợi ý cho bạn</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
            <button
              className="glass-panel relative overflow-hidden rounded-xl p-6 text-left ring-1 ring-white/10 transition-all hover:bg-white/[0.085] hover:ring-primary/35"
              onClick={() => setActiveStory(recommendedStory)}
              type="button"
            >
              <div className="relative z-10 flex items-center gap-4">
                <img
                  className="h-32 w-32 flex-none rounded-lg object-cover shadow-2xl"
                  src={recommendedStory.image}
                  alt={recommendedStory.title}
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase text-secondary-fixed-dim">Đang thịnh hành</p>
                  <h3 className="text-[22px] font-extrabold leading-6 text-white">{recommendedStory.title}</h3>
                  <p className="mb-3 mt-1 text-[11px] font-semibold leading-4 text-white/68">
                    Cuộc hành trình hào hùng về lịch sử dân tộc qua giọng đọc truyền cảm của NSƯT Thanh Hải.
                  </p>
                  <span className="primary-gradient inline-flex items-center gap-1 rounded-full px-4 py-2 text-[11px] font-bold text-white shadow-lg shadow-primary/25">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      play_arrow
                    </span>
                    Nghe ngay
                  </span>
                </div>
              </div>
            </button>

            <aside className="flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-5 text-center shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary-fixed">
                <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-white">Gói Hội Viên</h3>
              <p className="my-2 text-[10px] font-semibold leading-4 text-white/68">
                Mở khóa toàn bộ kho truyện VIP không giới hạn.
              </p>
              <Link className="w-full rounded-full bg-white px-3 py-2 text-[11px] font-bold text-black" to="/premium">
                Nâng cấp ngay
              </Link>
            </aside>
          </div>
        </section>
        </div>
      </main>

      <StoryPlayerModal story={activeStory} onClose={() => setActiveStory(null)} />
    </>
  );
}
