import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { apiUrl } from "../config/api";

const API_BASE = apiUrl("/api/users");

const GENDER_OPTIONS = [
  { value: "", label: "Chưa chọn" },
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [profile, setProfile] = useState({
    email: "",
    fullName: "",
    phone: "",
    birthday: "",
    gender: "",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    const t = localStorage.getItem("token");
    if (t) headers["Authorization"] = "Bearer " + t;
    return headers;
  }

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success && data.data) {
        setProfile({
          email: data.data.email || "",
          fullName: data.data.fullName || "",
          phone: data.data.phone || "",
          birthday: data.data.birthday || "",
          gender: data.data.gender || "",
          avatar: data.data.avatar || "",
        });
      } else {
        toast.error(data?.message || "Không thể tải thông tin.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleProfileChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error("Họ tên không được để trống.");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
        birthday: profile.birthday || null,
        gender: profile.gender || null,
      };

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        toast.success("Cập nhật thông tin thành công!");
        const fullName = data.data?.fullName || profile.fullName;
        localStorage.setItem("fullName", fullName);
        window.dispatchEvent(new Event("auth-change"));
      } else {
        toast.error(data?.message || "Cập nhật thất bại.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarClick() {
    if (uploadingAvatar) return;
    fileInputRef.current?.click();
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const token = localStorage.getItem("token");
      const headers = {};
      if (token) headers["Authorization"] = "Bearer " + token;

      const res = await fetch(`${API_BASE}/upload-avatar`, {
        method: "POST",
        headers,
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && data.data?.avatar) {
        setProfile((prev) => ({ ...prev, avatar: data.data.avatar }));
        toast.success("Đổi ảnh đại diện thành công!");
      } else {
        toast.error(data?.message || "Upload ảnh thất bại.");
      }
    } catch {
      toast.error("Không thể kết nối khi upload.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (newPassword.length <= 6 || !newPassword.match(/.*[A-Z].*/) || !newPassword.match(/.*\d.*/)) {
      toast.error("Mật khẩu mới phải từ 7 ký tự, có ít nhất 1 chữ hoa và 1 số.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        toast.success(data?.message || "Đổi mật khẩu thành công!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        localStorage.removeItem("token");
        localStorage.removeItem("fullName");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("planType");
        window.dispatchEvent(new Event("auth-change"));
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data?.message || "Đổi mật khẩu thất bại.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setChangingPassword(false);
    }
  }

  const inputClass =
    "h-8 w-full rounded-md border-0 bg-[#19182d] px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/42 focus:ring-2 focus:ring-primary-container";

  return (
    <main className="w-full px-4 pb-28 pt-[4.9rem] text-white md:pl-44 md:pr-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {loading ? (
          <div className="py-8 text-center text-[11px] text-white/58">Đang tải thông tin...</div>
        ) : (
          <>
            <div className="rounded-xl border border-white/10 bg-[#211f35]/96 p-5 shadow-2xl">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  type="button"
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/20 shadow-lg transition hover:border-primary/60 disabled:opacity-60"
                >
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/10 text-[28px] text-white/40">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="material-symbols-outlined text-[20px] text-white animate-pulse">progress_activity</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-center">
                    <span className="text-[9px] font-extrabold text-white">Đổi ảnh</span>
                  </div>
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-extrabold text-white">{profile.fullName || "Người dùng"}</p>
                  <p className="truncate text-[11px] font-semibold text-white/62">{profile.email}</p>
                  <p className="mt-1 text-[10px] font-semibold text-white/45">Nhấn vào ảnh để đổi avatar (JPG/PNG, tối đa 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="rounded-xl border border-white/10 bg-[#211f35]/96 p-5 shadow-2xl">
              <h3 className="mb-4 text-[13px] font-extrabold text-white">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Họ tên *</label>
                  <input className={inputClass} name="fullName" value={profile.fullName} onChange={handleProfileChange} placeholder="Nhập họ tên" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Email</label>
                  <input className={inputClass} name="email" value={profile.email} readOnly disabled />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Số điện thoại</label>
                  <input className={inputClass} name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="VD: 0909123456" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Giới tính</label>
                  <select className={inputClass} name="gender" value={profile.gender} onChange={handleProfileChange}>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Ngày sinh</label>
                  <input className={inputClass} type="date" name="birthday" value={profile.birthday} onChange={handleProfileChange} />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={saving} className="primary-gradient h-9 rounded-md px-5 text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60">
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>

            <form onSubmit={handleChangePassword} className="rounded-xl border border-white/10 bg-[#211f35]/96 p-5 shadow-2xl">
              <h3 className="mb-4 text-[13px] font-extrabold text-white">Đổi mật khẩu</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Mật khẩu hiện tại *</label>
                  <input className={inputClass} type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu hiện tại" autoComplete="current-password" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Mật khẩu mới *</label>
                  <input className={inputClass} type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Ít nhất 7 ký tự, 1 chữ hoa, 1 số" autoComplete="new-password" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Xác nhận mật khẩu mới *</label>
                  <input className={inputClass} type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={changingPassword} className="flex h-9 items-center gap-1.5 rounded-md bg-white/9 px-4 text-[11px] font-extrabold text-white transition hover:bg-white/14 disabled:opacity-60">
                  {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
