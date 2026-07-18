import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiUrl } from "../config/api";

const CATEGORIES = [
  { value: "BUG", label: "Lỗi / Bug" },
  { value: "FEATURE", label: "Góp ý tính năng" },
  { value: "ACCOUNT", label: "Tài khoản" },
  { value: "PAYMENT", label: "Thanh toán / Premium" },
  { value: "CONTENT", label: "Nội dung audio" },
  { value: "OTHER", label: "Khác" },
];

const STATUS_META = {
  OPEN: { label: "Chờ xử lý", className: "bg-amber-500/15 text-amber-200 ring-amber-400/30" },
  IN_PROGRESS: { label: "Đang xử lý", className: "bg-sky-500/15 text-sky-200 ring-sky-400/30" },
  RESOLVED: { label: "Đã phản hồi", className: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30" },
  CLOSED: { label: "Đã đóng", className: "bg-white/10 text-white/60 ring-white/15" },
};

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value || "Khác";
}

export default function Support() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "";
  const fullName = localStorage.getItem("fullName") || "";

  const [tab, setTab] = useState("new");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    category: "OTHER",
    subject: "",
    content: "",
  });

  const loadMine = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/feedbacks/mine?email=${encodeURIComponent(email)}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success && Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch {
      toast.error("Không thể tải danh sách góp ý.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      toast.error("Vui lòng đăng nhập để gửi góp ý.");
      navigate("/login");
      return;
    }
    loadMine();
  }, [email, navigate, loadMine]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject.trim() || !form.content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/feedbacks"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          category: form.category,
          subject: form.subject.trim(),
          content: form.content.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Gửi góp ý thất bại.");
        return;
      }
      toast.success(data?.message || "Gửi góp ý thành công!");
      setForm({ category: "OTHER", subject: "", content: "" });
      setTab("history");
      loadMine();
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#17162a] px-3.5 py-2.5 text-[13px] font-semibold text-white outline-none transition placeholder:text-white/35 focus:border-primary/45 focus:ring-2 focus:ring-primary/20";

  return (
    <main className="w-full px-4 pb-32 pt-[4.9rem] text-white sm:px-5 md:pl-44 md:pr-8">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        <div className="home-fade-up rounded-2xl border border-white/10 bg-gradient-to-br from-[#211f35]/98 to-[#18162c] p-5 shadow-2xl sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary-fixed/80">Hỗ trợ</p>
              <h1 className="mt-1 font-headline-md text-[22px] font-extrabold tracking-tight text-white sm:text-[24px]">
                Hỗ trợ &amp; Góp ý
              </h1>
              <p className="mt-1.5 max-w-md text-[13px] font-medium leading-relaxed text-white/55">
                Báo lỗi, đề xuất tính năng hoặc phản ánh vấn đề. Đội ngũ sẽ phản hồi qua thông báo trong app.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary-fixed ring-1 ring-primary/25">
              <span className="material-symbols-outlined text-[26px]">support_agent</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-[#121126] p-1 ring-1 ring-white/8">
            <button
              type="button"
              onClick={() => setTab("new")}
              className={`h-10 rounded-full text-[12px] font-extrabold transition-all ${
                tab === "new" ? "primary-gradient text-white shadow-md shadow-primary-container/25" : "text-white/65 hover:text-white"
              }`}
            >
              Gửi góp ý mới
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("history");
                loadMine();
              }}
              className={`h-10 rounded-full text-[12px] font-extrabold transition-all ${
                tab === "history" ? "primary-gradient text-white shadow-md shadow-primary-container/25" : "text-white/65 hover:text-white"
              }`}
            >
              Lịch sử ({items.length})
            </button>
          </div>
        </div>

        {tab === "new" ? (
          <form onSubmit={handleSubmit} className="home-fade-up space-y-4 rounded-2xl border border-white/10 bg-[#211f35]/96 p-5 shadow-2xl sm:p-6">
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-3.5 py-3 text-[12px] text-white/60">
              Gửi với tài khoản: <span className="font-bold text-white">{fullName || email}</span>
              {fullName ? <span className="text-white/45"> ({email})</span> : null}
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-white/40">Loại góp ý</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-white/40">Tiêu đề *</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
                placeholder="VD: Không phát được audio trên Chrome"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wide text-white/40">Nội dung *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                className={`${inputClass} min-h-[140px] resize-y leading-relaxed`}
                placeholder="Mô tả chi tiết vấn đề hoặc góp ý của bạn..."
                maxLength={4000}
                required
              />
              <p className="mt-1 text-right text-[11px] text-white/35">{form.content.length}/4000</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link to="/profile" className="text-[12px] font-bold text-white/50 transition hover:text-primary-fixed">
                ← Quay lại hồ sơ
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="primary-gradient flex h-11 items-center gap-2 rounded-xl px-5 text-[13px] font-extrabold text-white shadow-lg shadow-primary-container/25 transition active:scale-[0.98] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                {submitting ? "Đang gửi..." : "Gửi góp ý"}
              </button>
            </div>
          </form>
        ) : (
          <div className="home-fade-up space-y-3">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-[#211f35]/96 py-12 text-center text-[13px] text-white/50">
                Đang tải...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#211f35]/96 py-14 text-center">
                <span className="material-symbols-outlined mb-2 block text-[40px] text-white/25">inbox</span>
                <p className="text-[13px] font-semibold text-white/50">Chưa có góp ý nào</p>
                <button
                  type="button"
                  onClick={() => setTab("new")}
                  className="mt-4 text-[12px] font-extrabold text-primary-fixed hover:underline"
                >
                  Gửi góp ý đầu tiên
                </button>
              </div>
            ) : (
              items.map((item) => {
                const st = STATUS_META[item.status] || STATUS_META.OPEN;
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-[#211f35]/96 p-4 shadow-xl transition hover:border-primary/25 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${st.className}`}>
                            {st.label}
                          </span>
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold text-white/55">
                            {categoryLabel(item.category)}
                          </span>
                        </div>
                        <h3 className="text-[15px] font-extrabold leading-snug text-white">{item.subject}</h3>
                        <p className="mt-0.5 text-[11px] font-medium text-white/40">{formatDate(item.createdAt)}</p>
                      </div>
                      <span className="text-[11px] font-bold text-white/35">#{item.id}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-[13px] font-medium leading-relaxed text-white/70">{item.content}</p>
                    {item.adminReply ? (
                      <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-3">
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-fixed">Phản hồi từ AudioStory</p>
                        <p className="whitespace-pre-wrap text-[13px] font-medium leading-relaxed text-white/85">{item.adminReply}</p>
                        {item.repliedAt ? (
                          <p className="mt-1.5 text-[10px] font-semibold text-white/40">{formatDate(item.repliedAt)}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
