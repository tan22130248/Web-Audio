import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const AUTH_CHANGE_EVENT = "auth-change";

const mainLinks = [
  ["Trang chủ", "home", "/"],
  ["Khám phá", "explore", "/explore"],
  ["Danh sách phát", "queue_music", "/playlists"],
  ["Yêu thích", "favorite", "/favorites"],
  ["Lịch sử nghe", "history", "/history"],
  ["Premium", "workspace_premium", "/premium"],
];

export default function SideNavBar() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef(null);

  function handleLogout() {
    const savedRole = (localStorage.getItem("role") || "").toLowerCase();
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("planType");
    localStorage.removeItem("avatar");
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    if (savedRole === "admin") {
      navigate("/login");
    } else {
      navigate("/home");
    }
  }

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-extrabold transition-all ${
                isActive
                  ? "primary-gradient text-white shadow-lg shadow-primary-container/25"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
            key={label}
            to={to}
            end={to === "/"}
          >
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="space-y-1 border-t border-white/10 pt-3" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold transition-all ${
              settingsOpen ? "bg-white/12 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="flex-1 text-left">Cài đặt</span>
            <span className={`material-symbols-outlined text-[14px] transition-transform ${settingsOpen ? "rotate-180" : ""}`}>
              expand_more
            </span>
          </button>

          {settingsOpen ? (
            <div className="absolute bottom-full left-0 z-50 mb-1.5 w-full overflow-hidden rounded-xl border border-white/12 bg-[#14122c] py-1 shadow-2xl shadow-black/40 ring-1 ring-primary/15">
              <Link
                to="/profile"
                onClick={() => setSettingsOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold text-white/75 transition hover:bg-white/8 hover:text-white"
              >
                <span className="material-symbols-outlined text-[15px]">person</span>
                Hồ sơ
              </Link>
              <Link
                to="/support"
                onClick={() => setSettingsOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold text-white/75 transition hover:bg-white/8 hover:text-white"
              >
                <span className="material-symbols-outlined text-[15px]">support_agent</span>
                Hỗ trợ &amp; Góp ý
              </Link>
            </div>
          ) : null}
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Đăng xuất</span>
        </button>
      </div>
    </nav>
  );
}
