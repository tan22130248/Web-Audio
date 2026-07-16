import { useLocation, useNavigate } from "react-router-dom";

const ADMIN_NAV_ITEMS = [
  { label: "Tổng quan", icon: "dashboard", to: "/admin" },
  { label: "Quảng lý Audio", icon: "mic_external_on", to: "/admin/audios" },
  { label: "Quảng cáo", icon: "campaign", to: "/admin/ads" },
  { label: "Quản lý người dùng", icon: "group", to: "/admin" },
  { label: "Đăng ký Premium", icon: "workspace_premium", to: "/admin/premium-registrations" },
  { label: "Thống kê Doanh thu", icon: "payments", to: "#" },
  { label: "Cài đặt hệ thống", icon: "settings", to: "#" },
];

export default function AdminSidebar({ activeLabel, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleNav(item) {
    if (item.to && item.to !== "#") {
      navigate(item.to);
    }
  }

  return (
    <aside className="hidden w-[252px] shrink-0 flex-col border-r border-white/9 bg-[#111026] px-4 py-5 md:flex">
      <div className="flex items-center gap-3">
        <div className="primary-gradient flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-primary-container/25">
          <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_stories
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display-lg text-[17px] font-extrabold leading-5">StoryStream</h1>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-outline">Super Admin</p>
        </div>
      </div>

      <nav className="mt-9 flex-1 space-y-2 overflow-y-auto hide-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = activeLabel === item.label || (item.to !== "#" && location.pathname === item.to);
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item)}
              className={`group flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] font-extrabold transition-all duration-200 ${
                isActive
                  ? "bg-primary-container text-white shadow-lg shadow-primary-container/25"
                  : "text-white/68 hover:translate-x-1 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span
                className="material-symbols-outlined text-[17px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white/9 text-[11px] font-extrabold text-error transition hover:bg-white/14"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Đăng xuất
        </button>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white/9 text-[11px] font-extrabold transition hover:bg-white/14"
        >
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          Support Ticket
        </button>
      </div>
    </aside>
  );
}
