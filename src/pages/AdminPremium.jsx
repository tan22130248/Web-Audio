import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { apiUrl } from "../config/api";

const STATUS_MAP = {
  PENDING: { label: "Chờ xác nhận", className: "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/25" },
  COMPLETED: { label: "Đang sử dụng", className: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25" },
  CANCELLED: { label: "Đã từ chối", className: "bg-red-500/15 text-red-300 ring-1 ring-red-500/25" },
};

export default function AdminPremium() {
  const location = useLocation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  function loadRegistrations() {
    setLoading(true);
    fetch(apiUrl("/api/premium/admin/registrations"))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setRegistrations(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  async function handleApprove(id) {
    setProcessingId(id);
    try {
      const res = await fetch(apiUrl(`/api/premium/registrations/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (res.ok) {
        setRegistrations((prev) => prev.map((r) => r.id === id ? { ...r, status: "COMPLETED" } : r));
      }
    } catch {
      // ignore
    } finally {
      setProcessingId(null);
    }
  }

  function openRejectModal(reg) {
    setRejectTarget(reg);
    setRejectReason("");
  }

  async function submitReject() {
    if (!rejectTarget) return;
    setProcessingId(rejectTarget.id);
    try {
      const body = { status: "CANCELLED" };
      if (rejectReason.trim()) body.reason = rejectReason.trim();
      const res = await fetch(apiUrl(`/api/premium/registrations/${rejectTarget.id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setRegistrations((prev) => prev.map((r) => r.id === rejectTarget.id ? { ...r, status: "CANCELLED" } : r));
        setRejectTarget(null);
        setRejectReason("");
      }
    } catch {
      // ignore
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Xóa đăng ký này?")) return;
    setProcessingId(id);
    try {
      await fetch(apiUrl(`/api/premium/registrations/${id}`), { method: "DELETE" });
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    } finally {
      setProcessingId(null);
    }
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN");
  }

  return (
    <main className="min-h-screen bg-[#f7f6ff] text-white sm:p-5">
      <div className="pointer-events-none fixed inset-0 opacity-[0.42] [background-image:radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1180px] overflow-hidden rounded-[18px] bg-[#0d0c1f] shadow-[0_28px_90px_rgba(21,15,55,0.38)] ring-1 ring-[#7c3aed]/20">
        <AdminSidebar activeLabel="Đăng ký Premium" />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121126]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

          <header className="relative z-10 grid min-h-[64px] gap-3 border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl lg:grid-cols-[minmax(190px,1fr)_minmax(280px,360px)_auto] lg:items-center lg:py-0">
            <div className="flex min-w-0 items-center gap-3">
              <h2 className="truncate font-headline-md text-[22px] font-extrabold leading-7 text-primary">
                Quản lý đăng ký Premium
              </h2>
            </div>
            <button
              onClick={loadRegistrations}
              className="primary-gradient flex h-8 w-fit items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              Làm mới
            </button>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            {loading ? (
              <div className="py-8 text-center text-[11px] text-white/58">Đang tải danh sách đăng ký...</div>
            ) : registrations.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <span className="material-symbols-outlined text-[48px] text-white/25">inbox</span>
                <p className="mt-3 text-[12px] font-semibold text-white/58">Chưa có đăng ký Premium nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <table className="w-full min-w-[860px] text-left">
                  <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Người dùng</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Gói</th>
                      <th className="px-4 py-3">Giá</th>
                      <th className="px-4 py-3">Ảnh giao dịch</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {registrations.map((reg) => {
                      const statusInfo = STATUS_MAP[reg.status] || STATUS_MAP.PENDING;
                      const isProcessing = processingId === reg.id;
                      const isPending = reg.status === "PENDING";
                      return (
                        <tr key={reg.id} className={isProcessing ? "opacity-60" : ""}>
                          <td className="px-4 py-3 text-[11px] font-bold text-white/62">#{reg.id}</td>
                          <td className="px-4 py-3 text-[12px] font-extrabold text-white">{reg.userName || "—"}</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-white/62 max-w-[180px] truncate">{reg.userEmail}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                              reg.planName === "Premium+ VIP"
                                ? "bg-tertiary/18 text-tertiary"
                                : "bg-primary/18 text-primary-fixed"
                            }`}>
                              {reg.planName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-bold text-white/78">{reg.price}</td>
                          <td className="px-4 py-3">
                            {reg.receiptImage ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(reg.receiptImage)}
                                className="flex items-center gap-1 rounded-lg bg-white/8 px-2 py-1 text-[10px] font-bold text-white/78 transition hover:bg-white/14 hover:text-white"
                              >
                                <span className="material-symbols-outlined text-[14px]">image</span>
                                Xem
                              </button>
                            ) : (
                              <span className="text-[10px] text-white/38">Không có</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[10px] font-semibold text-white/55 whitespace-nowrap">
                            {formatDate(reg.registeredAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={() => handleApprove(reg.id)}
                                    className="flex h-8 items-center gap-1 rounded-lg bg-emerald-500/18 px-2.5 text-[10px] font-extrabold text-emerald-300 transition hover:bg-emerald-500/28 disabled:opacity-50"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                                    Duyệt
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={() => openRejectModal(reg)}
                                    className="flex h-8 items-center gap-1 rounded-lg bg-red-500/18 px-2.5 text-[10px] font-extrabold text-red-300 transition hover:bg-red-500/28 disabled:opacity-50"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">cancel</span>
                                    Từ chối
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleDelete(reg.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/60 transition hover:bg-red-500/18 hover:text-red-300 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
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

      {rejectTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#12122a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-extrabold text-white">Từ chối đăng ký</h3>
              <button
                type="button"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-white/[0.04] p-3 text-[11px] text-white/68">
              <p><span className="font-bold text-white">Người dùng:</span> {rejectTarget.userName}</p>
              <p><span className="font-bold text-white">Email:</span> {rejectTarget.userEmail}</p>
              <p><span className="font-bold text-white">Gói:</span> {rejectTarget.planName}</p>
              <p><span className="font-bold text-white">Giá:</span> {rejectTarget.price}</p>
            </div>

            <label className="mb-1 block text-[11px] font-bold text-white/72">
              Lý do từ chối <span className="text-white/38">(tùy chọn nhưng nên điền)</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh giao dịch không rõ ràng, chưa nhận được thanh toán..."
              className="mb-4 h-28 w-full rounded-xl border border-white/10 bg-[#1d1b33] px-4 py-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-primary/45"
            />

            <button
              type="button"
              onClick={submitReject}
              disabled={processingId === rejectTarget.id}
              className="h-10 w-full rounded-xl bg-red-500 text-[12px] font-extrabold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {processingId === rejectTarget.id ? "Đang xử lý..." : "Xác nhận từ chối"}
            </button>
            <p className="mt-2 text-center text-[10px] font-semibold text-white/45">
              Người dùng sẽ nhận email thông báo lý do.
            </p>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
          <div className="max-h-[85vh] max-w-[400px] rounded-2xl border border-white/10 bg-[#12122a] p-3 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-[11px] font-bold text-white/62">Ảnh giao dịch</span>
              <button type="button" onClick={() => setPreviewImage(null)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <img src={previewImage} alt="Receipt" className="max-h-[70vh] w-full rounded-xl object-contain" />
            <a
              href={previewImage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-white/10 py-2 text-[11px] font-extrabold text-white transition hover:bg-white/18"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              Mở ảnh gốc
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
