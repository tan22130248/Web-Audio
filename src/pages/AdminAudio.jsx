import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminSidebar from "../components/AdminSidebar";

import { apiUrl } from "../config/api";

const API_BASE = apiUrl("/api/audios");
const DEFAULT_COVER = "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=128";

const genres = [
  "Huyền Huyễn",
  "Ngôn Tình",
  "Kinh Dị",
  "Tiên Hiệp",
  "Trinh Thám",
  "Đời Sống",
  "Hài hước",
  "Lịch Sử",
];

export default function AdminAudio() {
  const navigate = useNavigate();
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "Huyền Huyễn",
    duration: "0:00",
    audioUrl: "",
    coverImageUrl: DEFAULT_COVER,
    fileSize: 0,
  });

  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  function loadAudios() {
    setLoading(true);
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setAudios(data.data);
        }
      })
      .catch(() => toast.error("Không thể tải danh sách audio."))
      .finally(() => setLoading(false));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  }

  useEffect(() => {
    loadAudios();
  }, []);

  function handleOpenAdd() {
    setEditingId(null);
    setForm({
      title: "",
      author: "",
      genre: "Huyền Huyễn",
      duration: "0:00",
      audioUrl: "",
      coverImageUrl: DEFAULT_COVER,
      fileSize: 0,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(audio) {
    setEditingId(audio.id);
    setForm({
      title: audio.title || "",
      author: audio.author || "",
      genre: audio.genre || "Huyền Huyễn",
      duration: audio.duration || "0:00",
      audioUrl: audio.audioUrl || "",
      coverImageUrl: audio.coverImageUrl || DEFAULT_COVER,
      fileSize: audio.fileSize || 0,
    });
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  async function handleFileSelect(file, folder) {
    if (!file) return;
    if (folder === "audios") {
      const name = (file.name || "").toLowerCase();
      const type = (file.type || "").toLowerCase();
      const ok =
        name.endsWith(".mp3") ||
        name.endsWith(".mp4") ||
        name.endsWith(".m4a") ||
        name.endsWith(".wav") ||
        type.startsWith("audio/") ||
        type === "video/mp4";
      if (!ok) {
        toast.error("Chỉ chấp nhận file MP3 hoặc MP4.");
        return;
      }
      // Đồng bộ backend: mặc định 2GB (audio.max-input-mb / multipart 2GB)
      const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024;
      if (file.size > MAX_UPLOAD_BYTES) {
        toast.error("File quá lớn (tối đa 2GB).");
        return;
      }
    }
    const setUploading = folder === "audios" ? setUploadingAudio : setUploadingCover;
    setUploading(true);
    const toastId = folder === "audios" ? toast.loading("Đang nén & upload audio (FFmpeg)...") : null;
    try {
      if (folder === "audios") {
        const duration = await getAudioDuration(file);
        setForm((f) => ({ ...f, audioUrl: "", fileSize: file.size, duration }));
      }
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = "Bearer " + token;
      const res = await fetch(API_BASE + "/upload", {
        method: "POST",
        headers,
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        if (toastId) toast.error(data?.message || "Upload thất bại.", { id: toastId });
        else toast.error(data?.message || "Upload thất bại.");
        return;
      }
      if (folder === "audios") {
        setForm((f) => ({
          ...f,
          audioUrl: data.url || "",
          duration: data.duration || f.duration,
          fileSize: data.fileSize != null ? data.fileSize : f.fileSize,
        }));
        const orig = data.originalSize;
        const out = data.fileSize;
        const msg =
          orig && out
            ? `Đã nén & upload: ${(orig / 1024 / 1024).toFixed(1)}MB → ${(out / 1024 / 1024).toFixed(1)}MB`
            : data?.message || "Upload audio thành công!";
        if (toastId) toast.success(msg, { id: toastId });
        else toast.success(msg);
      } else {
        setForm((f) => ({ ...f, coverImageUrl: data.url || DEFAULT_COVER }));
        toast.success("Upload thành công!");
      }
    } catch {
      if (toastId) toast.error("Không thể kết nối khi upload.", { id: toastId });
      else toast.error("Không thể kết nối khi upload.");
    } finally {
      setUploading(false);
    }
  }

  function getAudioDuration(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener("loadedmetadata", () => {
        const seconds = audio.duration;
        URL.revokeObjectURL(url);
        if (!Number.isFinite(seconds)) {
          resolve("0:00");
          return;
        }
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        resolve(`${m}:${s.toString().padStart(2, "0")}`);
      });
      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        resolve("0:00");
      });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.audioUrl) {
      toast.error("Vui lòng nhập tiêu đề và upload/nhập link audio.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        genre: form.genre,
        duration: form.duration,
        fileSize: form.fileSize || 0,
        audioUrl: form.audioUrl,
        coverImageUrl: form.coverImageUrl || null,
      };
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";
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
      handleCloseModal();
      loadAudios();
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa audio này?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || "Xóa thất bại.");
        return;
      }
      toast.success("Xóa thành công!");
      loadAudios();
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
        <AdminSidebar activeLabel="Quản lý Audio" />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121126]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

          <header className="relative z-10 flex min-h-[64px] items-center justify-between border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <h2 className="truncate font-headline-md text-[22px] font-extrabold leading-7 text-primary">
                Quản lý Audio
              </h2>
            </div>
            <button onClick={handleOpenAdd} className="primary-gradient flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95" type="button">
              <span className="material-symbols-outlined text-[15px]">add</span>
              Thêm Audio
            </button>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            {loading ? (
              <div className="px-5 py-8 text-center text-[11px] text-white/58">Đang tải danh sách audio...</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                    <tr>
                      <th className="px-5 py-4">Cover</th>
                      <th className="px-5 py-4">Tên truyện</th>
                      <th className="px-5 py-4">Tác giả</th>
                      <th className="px-5 py-4">Thể loại</th>
                      <th className="px-5 py-4">Thời lượng</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {audios.map((audio) => (
                      <tr key={audio.id} className="group hover:bg-white/[0.055] transition-all duration-200">
                        <td className="px-5 py-4">
                          <img className="h-10 w-10 rounded-lg border border-white/12 object-cover shadow-md" src={audio.coverImageUrl || DEFAULT_COVER} alt={audio.title} />
                        </td>
                        <td className="px-5 py-4 text-[12px] font-extrabold leading-4 text-white">{audio.title}</td>
                        <td className="px-5 py-4 text-[12px] font-semibold text-white/62">{audio.author}</td>
                        <td className="px-5 py-4 text-[11px] font-bold text-white/68">{audio.genre}</td>
                        <td className="px-5 py-4 text-[11px] font-bold text-white/68">{audio.duration}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleOpenEdit(audio)} className="flex h-7 items-center gap-1 rounded-md bg-white/9 px-2 text-[10px] font-extrabold text-white transition hover:bg-white/14" type="button">
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                              Sửa
                            </button>
                            <button onClick={() => handleDelete(audio.id)} className="flex h-7 items-center gap-1 rounded-md bg-error/15 px-2 text-[10px] font-extrabold text-error transition hover:bg-error/25" type="button">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {audios.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-[11px] text-white/58">Chưa có audio nào.</td>
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
              <h3 className="text-[13px] font-extrabold text-white">{editingId ? "Chỉnh sửa audio" : "Thêm audio mới"}</h3>
              <button onClick={handleCloseModal} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/18 hover:scale-105" type="button">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Tên truyện</label>
                <input className={inputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Nhập tên truyện" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Tác giả</label>
                  <input className={inputClass} value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Tác giả" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Thể loại</label>
                  <select className={inputClass} value={form.genre} onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}>
                    {genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Thời lượng</label>
                <input className={inputClass} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="VD: 45:00" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">File audio (MP3 / MP4)</label>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/wav,video/mp4,.mp3,.mp4,.m4a,.wav"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files[0], "audios")}
                />
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    value={form.audioUrl}
                    onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                    placeholder="Link MP3 sau khi nén & upload R2"
                    readOnly={!!form.audioUrl && audioInputRef.current?.files?.length === 0}
                  />
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    disabled={uploadingAudio}
                    className="whitespace-nowrap rounded-md bg-white/9 px-3 text-[10px] font-extrabold text-white transition hover:bg-white/14 disabled:opacity-60"
                  >
                    {uploadingAudio ? "Đang nén..." : "Chọn file"}
                  </button>
                </div>
                <p className="mt-1 text-[9px] font-semibold text-white/40">
                  Backend nén bằng FFmpeg (mono, 48kbps, 22.05kHz) rồi mới upload Cloudflare R2. MP4 chỉ lấy âm thanh.
                </p>
                {form.fileSize > 0 && (
                  <p className="mt-0.5 text-[9px] font-bold text-primary-fixed/80">
                    Dung lượng lưu: {(form.fileSize / 1024 / 1024).toFixed(2)} MB
                    {form.duration ? ` · ${form.duration}` : ""}
                  </p>
                )}
                {form.audioUrl && (
                  <audio controls className="mt-2 h-8 w-full" src={form.audioUrl} />
                )}
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Ảnh bìa</label>
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0], "covers")} />
                <div className="flex gap-2">
                  <input className={`${inputClass} flex-1`} value={form.coverImageUrl} onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))} placeholder="Link ảnh bìa" readOnly={!!form.coverImageUrl && form.coverImageUrl !== DEFAULT_COVER && coverInputRef.current?.files?.length === 0} />
                  <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover} className="whitespace-nowrap rounded-md bg-white/9 px-3 text-[10px] font-extrabold text-white transition hover:bg-white/14 disabled:opacity-60">
                    {uploadingCover ? "Đang upload..." : "Chọn ảnh"}
                  </button>
                </div>
                {form.coverImageUrl && (
                  <img className="mt-2 h-16 w-16 rounded-lg border border-white/12 object-cover shadow-md" src={form.coverImageUrl} alt="Cover" />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={handleCloseModal} className="rounded-md bg-white/9 px-4 py-2 text-[11px] font-extrabold text-white transition hover:bg-white/14">
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
