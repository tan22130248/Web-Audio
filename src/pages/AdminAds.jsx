import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = "/api/ads/admin";

export default function AdminAds() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    url: "",
    name: "",
  });

  const urlInputRef = useRef(null);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  }

  function loadAds() {
    setLoading(true);
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setAds(data.data);
        }
      })
      .catch(() => toast.error("Không thể tải danh sách quảng cáo."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAds();
  }, []);

  function openAddModal() {
    setEditingAd(null);
    setForm({ url: "", name: "" });
    setModalOpen(true);
  }

  function openEditModal(ad) {
    setEditingAd(ad);
    setForm({ url: ad.url || "", name: ad.name || "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingAd(null);
    setForm({ url: "", name: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.url.trim()) {
      toast.error("Vui lòng nhập URL quảng cáo.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        url: form.url.trim(),
        name: form.name.trim() || null,
      };
      const url = editingAd ? `${API_BASE}/${editingAd.id}` : API_BASE;
      const method = editingAd ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Lưu thất bại.");
        return;
      }
      toast.success(data?.message || "Lưu thành công!");
      closeModal();
      loadAds();
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa link quảng cáo này?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Xóa thất bại.");
        return;
      }
      toast.success("Xóa thành công!");
      loadAds();
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    }
  }

  const inputClass =
    "h-8 w-full rounded-md border-0 bg-[#19182d] px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/42 focus:ring-2 focus:ring-primary-container";

  return (
    <main className="min-h-screen bg-[#f7f6ff] text-white sm:p-5">
      <div className="pointer-events-none fixed inset-0 opacity-[0.42] [background-image:radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1180px] overflow-hidden rounded-[18px] bg-[#0d0c1f] shadow-[0_28px_90px_rgba(21,15,55,0.38)] ring-1 ring-[#7c3aed]/20">
        <AdminSidebar activeLabel="Quảng cáo" onLogout={handleLogout} />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121126]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

          <header className="relative z-10 flex min-h-[64px] items-center justify-between border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <h2 className="truncate font-headline-md text-[22px] font-extrabold leading-7 text-primary">
                Quản lý Quảng cáo
              </h2>
            </div>
            <button onClick={openAddModal} className="primary-gradient flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95" type="button">
              <span className="material-symbols-outlined text-[15px]">add</span>
              Thêm link
            </button>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            {loading ? (
              <div className="px-5 py-8 text-center text-[11px] text-white/58">Đang tải danh sách quảng cáo...</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <table className="w-full min-w-[520px] text-left">
                  <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                    <tr>
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Tên</th>
                      <th className="px-5 py-4">URL</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {ads.map((ad) => (
                      <tr key={ad.id} className="group hover:bg-white/[0.055] transition-all duration-200">
                        <td className="px-5 py-4 text-[11px] font-bold text-white/62">#{ad.id}</td>
                        <td className="px-5 py-4 text-[12px] font-extrabold leading-4 text-white">
                          {ad.name || "—"}
                        </td>
                        <td className="px-5 py-4 text-[11px] font-semibold text-white/68 max-w-[280px] truncate">
                          <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-primary-fixed hover:text-white transition-colors">
                            {ad.url}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(ad)} className="flex h-7 items-center gap-1 rounded-md bg-white/9 px-2 text-[10px] font-extrabold text-white transition hover:bg-white/14" type="button">
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                              Sửa
                            </button>
                            <button onClick={() => handleDelete(ad.id)} className="flex h-7 items-center gap-1 rounded-md bg-error/15 px-2 text-[10px] font-extrabold text-error transition hover:bg-error/25" type="button">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {ads.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-[11px] text-white/58">
                          Chưa có link quảng cáo nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-4 py-5 backdrop-blur-md">
          <section className="modal-card relative flex max-h-[90dvh] w-full max-w-[420px] flex-col overflow-y-auto rounded-[28px] border border-white/10 bg-[#0b0b20]/92 px-5 py-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.75),0_0_42px_rgba(124,58,237,0.28)]">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-28 rounded-full bg-primary-container/25 blur-3xl" />
            <div className="relative mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-extrabold text-white">
                {editingAd ? "Chỉnh sửa quảng cáo" : "Thêm quảng cáo mới"}
              </h3>
              <button onClick={closeModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/18 hover:scale-105" type="button">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">URL quảng cáo *</label>
                <input
                  ref={urlInputRef}
                  className={inputClass}
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://example.com/..."
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Tên (tùy chọn)</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="VD: Quảng cáo tháng 7"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="rounded-md bg-white/9 px-4 py-2 text-[11px] font-extrabold text-white transition hover:bg-white/14">
                  Hủy
                </button>
                <button type="submit" disabled={submitting} className="primary-gradient h-9 rounded-md px-5 text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60">
                  {submitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
