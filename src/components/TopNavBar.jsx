import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config/api";

const AUTH_CHANGE_EVENT = "auth-change";
const DEBOUNCE_MS = 120;

function syncFullName() {
  const savedName = localStorage.getItem("fullName");
  return savedName || "";
}

function syncPlanType() {
  const savedPlan = localStorage.getItem("planType");
  return (savedPlan || "FREE").toUpperCase();
}

function syncEmail() {
  return localStorage.getItem("email") || "";
}

function mapAudioToItem(audio) {
  return {
    id: audio.id,
    title: audio.title,
    author: audio.author,
    genre: audio.genre,
    duration: audio.duration || "0:00",
    image: audio.coverImageUrl || "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=128",
    audioUrl: audio.audioUrl,
    viewCount: audio.viewCount || 0,
    likeCount: audio.likeCount || 0,
  };
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function TopNavBar({ onSearchSelect }) {
  const [fullName, setFullName] = useState("");
  const [planType, setPlanType] = useState(() => syncPlanType());
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [togglingNotif, setTogglingNotif] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      setFullName(syncFullName());
      setPlanType(syncPlanType());
    };
    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;
    fetch(apiUrl(`/api/auth/me?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          const pt = (data.data.planType || "FREE").toUpperCase();
          setPlanType(pt);
          localStorage.setItem("planType", pt);
        }
      })
      .catch(() => {})
      .finally(() => {
        fetchNotifications();
        fetchNotifSettings();
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (value) => {
    const q = value.trim();
    if (!q) {
      setSuggestions([]);
      setIsSearchOpen(false);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(apiUrl(`/api/audios/search?q=${encodeURIComponent(q)}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success && Array.isArray(data.data)) {
        const mapped = data.data.map(mapAudioToItem);
        setSuggestions(mapped);
        setIsSearchOpen(mapped.length > 0);
      } else {
        setSuggestions([]);
        setIsSearchOpen(false);
      }
    } catch {
      setSuggestions([]);
      setIsSearchOpen(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  function handleQueryChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setIsSearchOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, DEBOUNCE_MS);
  }

  function handleSelectSuggestion(audio) {
    setQuery("");
    setSuggestions([]);
    setIsSearchOpen(false);
    if (onSearchSelect && audio) {
      onSearchSelect(mapAudioToItem(audio));
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setQuery("");
      setSuggestions([]);
    }
  }

  async function fetchNotifications() {
    const email = syncEmail();
    if (!email) return;
    setNotifLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/notifications?email=${encodeURIComponent(email)}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setNotifications(Array.isArray(data.data) ? data.data : []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    } finally {
      setNotifLoading(false);
    }
  }

  async function fetchNotifSettings() {
    const email = syncEmail();
    if (!email) return;
    try {
      const res = await fetch(apiUrl(`/api/notifications/settings?email=${encodeURIComponent(email)}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success && data?.data) {
        setNotificationEnabled(Boolean(data.data.notificationEnabled));
      }
    } catch {
      // ignore
    }
  }

  function handleBellClick() {
    const email = syncEmail();
    if (!email) return;
    setIsNotifOpen((prev) => !prev);
    if (!isNotifOpen) {
      fetchNotifications();
    }
  }

  async function handleMarkRead(id) {
    try {
      await fetch(apiUrl(`/api/notifications/${id}/read`), { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  }

  async function handleMarkAllRead() {
    const email = syncEmail();
    if (!email) return;
    try {
      await fetch(apiUrl(`/api/notifications/read-all?email=${encodeURIComponent(email)}`), { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }

  async function handleToggleNotification() {
    const email = syncEmail();
    if (!email) return;
    setTogglingNotif(true);
    try {
      const newValue = !notificationEnabled;
      const res = await fetch(apiUrl(`/api/notifications/settings?email=${encodeURIComponent(email)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newValue }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setNotificationEnabled(newValue);
      }
    } catch {
      // ignore
    } finally {
      setTogglingNotif(false);
    }
  }

  const planLabel = planType === "VIP" ? "(VIP)" : planType === "PREMIUM" ? "(Premium)" : "(Free)";
  const planClass = "text-white";

  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-[#0b0b1f]/90 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-xl md:pl-44 md:pr-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Link to="/" className="font-display-lg-mobile text-lg font-extrabold text-white md:hidden">
            AudioStory
          </Link>
          <div className="relative hidden w-full max-w-[360px] md:block" ref={searchRef}>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-white/55">
              search
            </span>
            <input
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setIsSearchOpen(true)}
              className="h-8 w-full rounded-full border border-white/10 bg-white/7 pl-9 pr-10 text-[11px] font-semibold text-white outline-none placeholder:text-white/45 transition-all focus:border-primary/60 focus:bg-white/10 focus:ring-2 focus:ring-primary/35"
              placeholder="Tìm kiếm truyện, tác giả..."
              type="text"
              autoComplete="off"
            />
            {isSearching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-[14px] text-white/60 animate-pulse">progress_activity</span>
              </span>
            )}
            {!isSearching && query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSuggestions([]); setIsSearchOpen(false); }}
                className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition hover:text-white"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}

            {isSearchOpen && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-xl border border-white/10 bg-[#121126] shadow-2xl scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
              >
                {suggestions.map((audio) => (
                  <button
                    key={audio.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(audio)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 transition hover:bg-white/[0.08] active:bg-white/[0.12]"
                  >
                    <img
                      src={audio.image}
                      alt=""
                      className="h-9 w-9 flex-none rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[12px] font-extrabold text-white">{audio.title}</p>
                      <p className="truncate text-[10px] font-semibold text-white/58">{audio.author}</p>
                    </div>
                    <span className="material-symbols-outlined text-[15px] text-white/35">play_circle</span>
                  </button>
                ))}
              </div>
            )}

            {isSearchOpen && suggestions.length === 0 && !isSearching && query && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#121126] px-4 py-6 text-center shadow-2xl">
                <span className="material-symbols-outlined text-[28px] text-white/25">search_off</span>
                <p className="mt-2 text-[11px] font-semibold text-white/42">Không tìm thấy kết quả cho "{query}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/premium" className="premium-shimmer flex h-7 items-center gap-1 rounded-full px-3 text-[10px] font-extrabold text-white shadow-lg shadow-primary-container/20 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            <span className="hidden sm:inline">Nâng cấp Premium</span>
          </Link>

          <button onClick={handleBellClick} className="relative flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition-all hover:bg-white/10 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[9px] font-extrabold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div ref={notifRef} className="absolute right-4 top-full z-50 mt-3 w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-white/10 bg-[#121126] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <h3 className="text-[13px] font-extrabold text-white">Thông báo</h3>
                {notifications.length > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[10px] font-extrabold text-primary transition hover:text-primary/80">Đánh dấu tất cả đã đọc</button>
                )}
              </div>
              <div className="max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {notifLoading ? (
                  <div className="px-4 py-8 text-center text-[11px] text-white/58">Đang tải...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[11px] text-white/58">Không có thông báo mới.</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`flex gap-3 px-4 py-3 transition hover:bg-white/[0.06] ${!n.isRead ? "bg-white/[0.03]" : ""}`}>
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <span className="material-symbols-outlined text-[20px]">audiotrack</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-extrabold text-white">{n.audioTitle}</p>
                        <p className="truncate text-[10px] font-semibold text-white/58">{n.message}</p>
                        <p className="mt-1 text-[9px] font-semibold text-white/35">{formatDate(n.createdAt)}</p>
                      </div>
                      {!n.isRead && (
                        <button onClick={() => handleMarkRead(n.id)} className="flex-none self-center rounded-full bg-white/10 px-2 py-1 text-[9px] font-extrabold text-white transition hover:bg-white/18">Đọc</button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {(planType === "VIP") && (
                <div className="border-t border-white/8 px-4 py-3">
                  <button onClick={handleToggleNotification} disabled={togglingNotif} className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 transition hover:bg-white/[0.08] disabled:opacity-60">
                    <div className="text-left">
                      <p className="text-[11px] font-extrabold text-white">Thông báo email</p>
                      <p className="text-[9px] font-semibold text-white/45">Nhận email khi có audio mới</p>
                    </div>
                    <div className={`relative h-5 w-9 rounded-full transition-colors ${notificationEnabled ? "bg-primary" : "bg-white/15"}`}>
                      <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notificationEnabled ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {fullName ? (
            <Link to="/profile" className="flex items-center gap-2 transition hover:opacity-80">
              <div className="text-right">
                <p className="text-[11px] font-extrabold text-white">{fullName}</p>
                <p className={`text-[9px] font-extrabold ${planClass}`}>{planLabel}</p>
              </div>
              <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/20 shadow-md">
                <img
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIuBN1zy52wRs9rnYcmKKKvjVdOmcKPz4_CV_IaticrnUtjpogQ2g_RdhzgcxL3Q136bvNulN2pnuA-Jho5wF4nPd9sJBg3_CablcfWf_JuOXGWnxK9389jfxFdeNJVkFQgUQToaoGYuSRNoVH5qAJ7HrKi_S09mOTE67xncb685mfZwm18sOy0f8U7ljs6KHiTfuNMgjiBadmt94u3zv4V-L0OWYi1cm8knZGypLJyvAEbookJyHrTwxfKNDobjuQ1ZSpbXeiTzx4"
                  alt="Tài khoản"
                />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-[10px] font-extrabold text-white/80 transition-colors hover:text-white"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-[10px] font-extrabold text-white transition-colors hover:text-white"
              >
                Đăng ký
              </Link>
              <div className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-white/20 shadow-md">
                <img
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIuBN1zy52wRs9rnYcmKKKvjVdOmcKPz4_CV_IaticrnUtjpogQ2g_RdhzgcxL3Q136bvNulN2pnuA-Jho5wF4nPd9sJBg3_CablcfWf_JuOXGWnxK9389jfxFdeNJVkFQgUQToaoGYuSRNoVH5qAJ7HrKi_S09mOTE67xncb685mfZwm18sOy0f8U7ljs6KHiTfuNMgjiBadmt94u3zv4V-L0OWYi1cm8knZGypLJyvAEbookJyHrTwxfKNDobjuQ1ZSpbXeiTzx4"
                  alt="Tài khoản"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
