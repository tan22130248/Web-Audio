import { Link } from "react-router-dom";

export default function SideNavBar() {
  return (
    <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 p-md w-64 bg-surface-container-low/95 backdrop-blur-2xl border-r border-outline-variant/10 shadow-xl z-50">
      <div className="flex items-center gap-sm mb-xl px-sm">
        <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic_external_on</span>
        </div>
        <div>
          <h1 className="font-display-lg text-primary text-xl leading-tight">AudioStory</h1>
          <p className="text-xs text-on-surface-variant opacity-70">Phòng thu số</p>
        </div>
      </div>

      <div className="flex-1 space-y-xs overflow-y-auto hide-scrollbar">
        <Link to="/" className="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-full font-bold transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">home</span>
          <span>Trang chủ</span>
        </Link>
        <Link to="/explore" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">explore</span>
          <span>Khám phá</span>
        </Link>
        <Link to="/categories" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">category</span>
          <span>Thể loại</span>
        </Link>
        <Link to="/favorites" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">favorite</span>
          <span>Yêu thích</span>
        </Link>
        <Link to="/history" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">history</span>
          <span>Lịch sử nghe</span>
        </Link>
        <Link to="/premium" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined">workspace_premium</span>
          <span>Premium</span>
        </Link>
      </div>

      <div className="pt-md mt-md border-t border-outline-variant/10 space-y-xs">
        <Link to="/settings" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all">
          <span className="material-symbols-outlined">settings</span>
          <span>Cài đặt</span>
        </Link>
        <Link to="/logout" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 rounded-full transition-all">
          <span className="material-symbols-outlined">logout</span>
          <span>Đăng xuất</span>
        </Link>
      </div>
    </nav>
  );
}
