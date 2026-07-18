import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";
import { apiUrl } from "../config/api";

const API = apiUrl("/api/feedbacks/admin");

const STATUS_META = {
  OPEN: { label: "Chờ xử lý", className: "bg-amber-500/15 text-amber-200" },
  IN_PROGRESS: { label: "Đang xử lý", className: "bg-sky-500/15 text-sky-200" },
  RESOLVED: { label: "Đã phản hồi", className: "bg-emerald-500/15 text-emerald-200" },
  CLOSED: { label: "Đã đóng", className: "bg-white/10 text-white/55" },
};

const CATEGORY_LABEL = {
  BUG: "Lỗi / Bug",
  FEATURE: "Tính năng",
  ACCOUNT: "Tài khoản",
  PAYMENT: "Thanh toán",
  CONTENT: "Nội dung",
  OTHER: "Khác",
};

function formatDate(iso) {
  if (!iso) return "—";
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

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replyMode, setReplyMode] = useState("USER");
  const [nextStatus, setNextStatus] = useState("RESOLVED");
  const [submitting, setSubmitting] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("planType");
    localStorage.removeItem("avatar");
    navigate("/login");
  }

  function loadList(filter = statusFilter) {
    setLoading(true);
    const q = filter && filter !== "ALL" ? `?status=${encodeURIComponent(filter)}` : "";
    fetch(`${API}${q}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setItems(data.data);
        }
        if (data?.stats) setStats(data.stats);
      })
      .catch(() => toast.error("Không thể tải danh sách góp ý."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDetail(item) {
    setSelected(item);
    setReply(item.adminReply || "");
    setReplyMode(item.isSystemIssue || item.broadcastSent ? "ALL" : "USER");
    setNextStatus(item.status === "OPEN" ? "RESOLVED" : item.status || "RESOLVED");
  }

  function closeDetail() {
    setSelected(null);
    setReply("");
    setReplyMode("USER");
    setNextStatus("RESOLVED");
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!selected) return;
    if (!reply.trim()) {
      toast.error("Nhập nội dung phản hồi.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: reply.trim(),
          replyMode,
          status: nextStatus,
          isSystemIssue: replyMode === "ALL",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Gửi phản hồi thất bại.");
        return;
      }
      toast.success(data?.message || "Đã gửi phản hồi!");
      closeDetail();
      loadList();
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  async function quickStatus(id, status) {
    try {
      const res = await fetch(`${API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Cập nhật thất bại.");
        return;
      }
      toast.success("Đã cập nhật trạng thái.");
      loadList();
      if (selected?.id === id) setSelected(data.data);
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  }

  const filteredHint = useMemo(() => {
    if (statusFilter === "ALL") return `${items.length} góp ý`;
    return `${items.length} góp ý · ${STATUS_META[statusFilter]?.label || statusFilter}`;
  }, [items.length, statusFilter]);

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#19182d] px-3 py-2.5 text-[12px] font-semibold text-white outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20";

  return (
    <main className="min-h-screen bg-[#f7f6ff] text-white sm:p-5">
      <div className="pointer-events-none fixed inset-0 opacity-[0.42] [background-image:radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1180px] overflow-hidden rounded-[18px] bg-[#0d0c1f] shadow-[0_28px_90px_rgba(21,15,55,0.38)] ring-1 ring-[#7c3aed]/20">
        <AdminSidebar activeLabel="Góp ý / Phản hồi" onLogout={handleLogout} />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121126]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

          <header className="relative z-10 flex min-h-[64px] flex-wrap items-center justify-between gap-3 border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl">
            <div>
              <h2 className="font-headline-md text-[22px] font-extrabold leading-7 text-primary">Góp ý &amp; Phản hồi</h2>
              <p className="text-[11px] font-semibold text-white/45">{filteredHint}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                ["ALL", "Tất cả"],
                ["OPEN", "Chờ"],
                ["IN_PROGRESS", "Đang XL"],
                ["RESOLVED", "Đã xong"],
                ["CLOSED", "Đóng"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(key);
                    loadList(key);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold transition ${
                    statusFilter === key
                      ? "bg-primary-container text-white shadow-md shadow-primary-container/25"
                      : "bg-white/8 text-white/65 hover:bg-white/12 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Tổng", stats.total, "text-white"],
                ["Chờ xử lý", stats.open, "text-amber-200"],
                ["Đang xử lý", stats.inProgress, "text-sky-200"],
                ["Đã phản hồi", stats.resolved, "text-emerald-200"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-[#211f35]/90 px-3 py-3">
                  <p className="text-[10px] font-extrabold uppercase text-white/40">{label}</p>
                  <p className={`mt-1 text-[22px] font-extrabold ${color}`}>{value ?? 0}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="py-12 text-center text-[12px] text-white/50">Đang tải...</div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#211f35]/90 py-14 text-center text-[12px] text-white/45">
                Không có góp ý nào.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Người gửi</th>
                      <th className="px-4 py-3">Tiêu đề</th>
                      <th className="px-4 py-3">Loại</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const st = STATUS_META[item.status] || STATUS_META.OPEN;
                      return (
                        <tr key={item.id} className="border-t border-white/6 text-[11px] hover:bg-white/[0.03]">
                          <td className="px-4 py-3 font-bold text-white/50">#{item.id}</td>
                          <td className="px-4 py-3">
                            <p className="font-extrabold text-white">{item.userName || "—"}</p>
                            <p className="text-[10px] text-white/45">{item.userEmail}</p>
                          </td>
                          <td className="max-w-[200px] px-4 py-3">
                            <p className="truncate font-bold text-white">{item.subject}</p>
                            {item.broadcastSent ? (
                              <span className="mt-0.5 inline-flex text-[9px] font-bold text-secondary">Đã broadcast</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-white/70">{CATEGORY_LABEL[item.category] || item.category}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold ${st.className}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/50">{formatDate(item.createdAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => openDetail(item)}
                                className="rounded-lg bg-primary/20 px-2.5 py-1.5 text-[10px] font-extrabold text-primary-fixed transition hover:bg-primary/30"
                              >
                                Xử lý
                              </button>
                              {item.status === "OPEN" ? (
                                <button
                                  type="button"
                                  onClick={() => quickStatus(item.id, "IN_PROGRESS")}
                                  className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[10px] font-extrabold text-white/70 hover:bg-white/12"
                                >
                                  Đang XL
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeDetail} />
          <div
            className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-white/10 bg-[#14122a] shadow-2xl sm:max-w-[520px] sm:rounded-2xl"
            style={{ animation: "modalIn 0.22s ease-out" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/8 bg-[#14122a]/95 px-4 py-3 backdrop-blur">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-white/40">Góp ý #{selected.id}</p>
                <h3 className="text-[15px] font-extrabold text-white">{selected.subject}</h3>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/16"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
                <p className="text-[10px] font-extrabold uppercase text-white/40">Người gửi</p>
                <p className="mt-0.5 text-[13px] font-extrabold text-white">{selected.userName || "—"}</p>
                <p className="text-[11px] text-white/50">{selected.userEmail}</p>
                <p className="mt-1 text-[10px] text-white/40">
                  {CATEGORY_LABEL[selected.category] || selected.category} · {formatDate(selected.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase text-white/40">Nội dung</p>
                <p className="whitespace-pre-wrap rounded-xl border border-white/8 bg-[#1a1830] p-3 text-[12px] leading-relaxed text-white/80">
                  {selected.content}
                </p>
              </div>

              <form onSubmit={handleReply} className="space-y-3 border-t border-white/8 pt-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-extrabold uppercase text-white/40">Nội dung phản hồi *</label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    className={`${inputClass} min-h-[110px] resize-y`}
                    placeholder="Viết phản hồi gửi tới người dùng (hoặc toàn hệ thống)..."
                    required
                  />
                </div>

                <div>
                  <p className="mb-2 text-[10px] font-extrabold uppercase text-white/40">Gửi thông báo tới</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setReplyMode("USER")}
                      className={`rounded-xl border px-3 py-2.5 text-left transition ${
                        replyMode === "USER"
                          ? "border-primary/50 bg-primary/15 ring-1 ring-primary/30"
                          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                      }`}
                    >
                      <p className="text-[12px] font-extrabold text-white">Cá nhân</p>
                      <p className="mt-0.5 text-[10px] text-white/50">Chỉ người gửi góp ý này</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyMode("ALL")}
                      className={`rounded-xl border px-3 py-2.5 text-left transition ${
                        replyMode === "ALL"
                          ? "border-secondary/50 bg-secondary/10 ring-1 ring-secondary/30"
                          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                      }`}
                    >
                      <p className="text-[12px] font-extrabold text-white">Toàn hệ thống</p>
                      <p className="mt-0.5 text-[10px] text-white/50">Broadcast tất cả user (vấn đề hệ thống)</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-extrabold uppercase text-white/40">Trạng thái sau phản hồi</label>
                  <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className={inputClass}>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="RESOLVED">Đã phản hồi</option>
                    <option value="CLOSED">Đóng</option>
                    <option value="OPEN">Mở lại</option>
                  </select>
                </div>

                {replyMode === "ALL" ? (
                  <div className="rounded-xl border border-secondary/25 bg-secondary/10 px-3 py-2.5 text-[11px] font-semibold leading-relaxed text-secondary-fixed-dim">
                    Cảnh báo: thông báo sẽ được tạo cho <b>mọi tài khoản</b> trong hệ thống (chuông thông báo).
                  </div>
                ) : null}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeDetail}
                    className="h-10 rounded-xl bg-white/8 px-4 text-[11px] font-extrabold text-white/80 hover:bg-white/12"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="primary-gradient flex h-10 items-center gap-1.5 rounded-xl px-4 text-[11px] font-extrabold text-white shadow-lg disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    {submitting ? "Đang gửi..." : "Gửi phản hồi + thông báo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
