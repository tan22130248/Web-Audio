import { Link } from "react-router-dom";

export default function TopNavBar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#0b0b1f]/90 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-xl md:pl-44 md:pr-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Link to="/" className="font-display-lg-mobile text-lg font-extrabold text-white md:hidden">
            AudioStory
          </Link>
          <div className="relative hidden w-full max-w-[360px] md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-white/55">
              search
            </span>
            <input
              className="h-8 w-full rounded-full border border-white/10 bg-white/7 pl-9 pr-4 text-[11px] font-semibold text-white outline-none placeholder:text-white/45 transition-all focus:border-primary/60 focus:bg-white/10 focus:ring-2 focus:ring-primary/35"
              placeholder="Tìm kiếm truyện, tác giả..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/premium" className="premium-shimmer flex h-7 items-center gap-1 rounded-full px-3 text-[10px] font-extrabold text-white shadow-lg shadow-primary-container/20 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span className="hidden sm:inline">Nâng cấp Premium</span>
          </Link>

          <button className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/10 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>

          <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIuBN1zy52wRs9rnYcmKKKvjVdOmcKPz4_CV_IaticrnUtjpogQ2g_RdhzgcxL3Q136bvNulN2pnuA-Jho5wF4nPd9sJBg3_CablcfWf_JuOXGWnxK9389jfxFdeNJVkFQgUQToaoGYuSRNoVH5qAJ7HrKi_S09mOTE67xncb685mfZwm18sOy0f8U7ljs6KHiTfuNMgjiBadmt94u3zv4V-L0OWYi1cm8knZGypLJyvAEbookJyHrTwxfKNDobjuQ1ZSpbXeiTzx4"
              alt="Tài khoản"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
