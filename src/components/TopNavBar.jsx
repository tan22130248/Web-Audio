import { Link } from "react-router-dom";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-40 flex items-center justify-between px-gutter py-xs md:px-xl md:pl-[18rem] bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 shadow-sm transition-all">
      <div className="flex items-center gap-md flex-1">
        <div className="md:hidden font-display-lg-mobile text-primary font-extrabold">AudioStory</div>
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full bg-surface-container/50 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-body-sm transition-all"
            placeholder="Tìm kiếm truyện, tác giả..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-md">
        <button className="premium-shimmer text-white px-md py-2 rounded-full font-label-bold flex items-center gap-xs scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          <span className="hidden sm:inline">Nâng cấp Premium</span>
        </button>

        <button className="p-2 text-on-surface-variant hover:bg-surface-bright/20 rounded-full transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer">
          <img
            className="w-full h-full object-cover"
            data-alt="A portrait of a Gen Z Vietnamese user with a stylish aesthetic, soft neon purple lighting reflecting on their face, high-quality digital photography style with a blurred tech-inspired background."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIuBN1zy52wRs9rnYcmKKKvjVdOmcKPz4_CV_IaticrnUtjpogQ2g_RdhzgcxL3Q136bvNulN2pnuA-Jho5wF4nPd9sJBg3_CablcfWf_JuOXGWnxK9389jfxFdeNJVkFQgUQToaoGYuSRNoVH5qAJ7HrKi_S09mOTE67xncb685mfZwm18sOy0f8U7ljs6KHiTfuNMgjiBadmt94u3zv4V-L0OWYi1cm8knZGypLJyvAEbookJyHrTwxfKNDobjuQ1ZSpbXeiTzx4"
          />
        </div>
      </div>
    </header>
  );
}
