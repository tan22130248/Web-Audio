import { Link, NavLink } from "react-router-dom";

const mainLinks = [
  ["Trang chủ", "home", "/"],
  ["Khám phá", "explore", "/explore"],
  ["Thể loại", "category", "/categories"],
  ["Yêu thích", "favorite", "/favorites"],
  ["Lịch sử nghe", "history", "/history"],
  ["Premium", "workspace_premium", "/premium"],
];

export default function SideNavBar() {
  return (
    <nav className="hidden md:flex fixed left-0 top-0 z-50 h-screen w-40 flex-col border-r border-white/10 bg-[#09091b]/95 p-3 shadow-2xl backdrop-blur-2xl">
      <div className="mb-6 flex items-center gap-2 rounded-xl bg-white/5 px-2 py-2 ring-1 ring-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg primary-gradient text-white shadow-lg shadow-primary-container/25">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            mic_external_on
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-extrabold leading-4 text-white">AudioStory</h1>
          <p className="truncate text-[9px] font-semibold text-white/55">Phòng thu số</p>
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
        {mainLinks.map(([label, icon, to]) => (
          <NavLink
            className={({ isActive }) => `flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-extrabold transition-all ${
              isActive
                ? "primary-gradient text-white shadow-lg shadow-primary-container/25"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            key={label}
            to={to}
            end={to === "/"}
          >
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="space-y-1 border-t border-white/10 pt-3">
        <Link
          to="/settings"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[16px]">settings</span>
          <span>Cài đặt</span>
        </Link>
        <Link
          to="/logout"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Đăng xuất</span>
        </Link>
      </div>
    </nav>
  );
}
