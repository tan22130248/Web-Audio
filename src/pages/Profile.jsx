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
        const avatarUrl = data.data.avatar || "";
        setProfile({
          email: data.data.email || "",
          fullName: data.data.fullName || "",
          phone: data.data.phone || "",
          birthday: data.data.birthday || "",
          gender: data.data.gender || "",
          avatar: avatarUrl,
        });
        if (avatarUrl) {
          localStorage.setItem("avatar", avatarUrl);
          window.dispatchEvent(new Event("auth-change"));
        }
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
        const avatarUrl = data.data.avatar;
        setProfile((prev) => ({ ...prev, avatar: avatarUrl }));
        localStorage.setItem("avatar", avatarUrl);
        window.dispatchEvent(new Event("auth-change"));
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
        localStorage.removeItem("avatar");
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
    "h-11 w-full rounded-xl border border-white/10 bg-[#121125]/80 px-3.5 text-[13px] font-medium text-white shadow-inner shadow-black/10 outline-none transition placeholder:text-white/35 hover:border-white/18 focus:border-primary-container/70 focus:ring-4 focus:ring-primary-container/15 disabled:cursor-not-allowed disabled:border-white/6 disabled:bg-white/[0.035] disabled:text-white/48";

  return (
    <main className="min-h-screen w-full px-4 pb-28 pt-20 text-white sm:px-6 md:pl-48 md:pr-10 lg:pr-12">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {loading ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center text-[13px] font-medium text-white/58">
            <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
            Đang tải thông tin...
          </div>
        ) : (
          <>
            <header className="flex flex-col gap-2 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary/85">Tài khoản</p>
                <h1 className="font-headline-md text-[26px] font-extrabold tracking-[-0.025em] text-white sm:text-[30px]">Thông tin cá nhân</h1>
                <p className="mt-1 max-w-xl text-[13px] leading-5 text-white/55">Quản lý hồ sơ, ảnh đại diện và bảo mật tài khoản của bạn.</p>
              </div>
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary-fixed">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                Hồ sơ bảo mật
              </div>
            </header>

            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1d1b34]/90 p-5 shadow-xl shadow-black/20 ring-1 ring-white/[0.03] sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-container/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-40 w-40 rounded-full bg-secondary-container/20 blur-3xl" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  type="button"
                  className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#121125] shadow-xl shadow-black/30 transition duration-200 hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-primary-container/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-container/25 disabled:opacity-60 sm:h-24 sm:w-24"
                >
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/10 text-white/40">
                      <span className="material-symbols-outlined text-[34px]">person</span>
                    </div>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="material-symbols-outlined text-[20px] text-white animate-pulse">progress_activity</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/65 py-1.5 text-center transition duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <span className="text-[10px] font-extrabold text-white">Đổi ảnh</span>
                  </div>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[20px] font-extrabold tracking-[-0.02em] text-white">{profile.fullName || "Người dùng"}</p>
                  <p className="mt-1 truncate text-[13px] font-medium text-white/62">{profile.email}</p>
                  <p className="mt-2 text-[11px] leading-5 text-white/48">Nhấn vào ảnh để thay avatar JPG hoặc PNG, dung lượng tối đa 5MB.</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </section>

            <form onSubmit={handleSaveProfile} className="rounded-2xl border border-white/10 bg-[#1b1a31]/90 p-5 shadow-xl shadow-black/20 transition-shadow duration-200 hover:shadow-2xl hover:shadow-black/25 sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/16 text-primary-fixed"><span className="material-symbols-outlined text-[20px]">badge</span></div>
                <div><h2 className="text-[17px] font-extrabold text-white">Thông tin cơ bản</h2><p className="mt-0.5 text-[12px] leading-5 text-white/50">Cập nhật các thông tin hiển thị trong hồ sơ của bạn.</p></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Họ tên <span className="text-secondary">*</span></label>
                  <input className={inputClass} name="fullName" value={profile.fullName} onChange={handleProfileChange} placeholder="Nhập họ tên" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Email</label>
                  <input className={inputClass} name="email" value={profile.email} readOnly disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Số điện thoại</label>
                  <input className={inputClass} name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="VD: 0909123456" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Giới tính</label>
                  <select className={inputClass} name="gender" value={profile.gender} onChange={handleProfileChange}>
                    {GENDER_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Ngày sinh</label>
                  <input className={inputClass} type="date" name="birthday" value={profile.birthday} onChange={handleProfileChange} />
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-white/42">Các trường có dấu <span className="text-secondary">*</span> là bắt buộc.</p>
                <button type="submit" disabled={saving} className="primary-gradient inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-5 text-[12px] font-extrabold text-white shadow-lg shadow-primary-container/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-primary-container/35 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>

            <form onSubmit={handleChangePassword} className="rounded-2xl border border-white/10 bg-[#1b1a31]/90 p-5 shadow-xl shadow-black/20 transition-shadow duration-200 hover:shadow-2xl hover:shadow-black/25 sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/20 text-secondary-fixed"><span className="material-symbols-outlined text-[20px]">lock</span></div>
                <div><h2 className="text-[17px] font-extrabold text-white">Đổi mật khẩu</h2><p className="mt-0.5 text-[12px] leading-5 text-white/50">Dùng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Mật khẩu hiện tại <span className="text-secondary">*</span></label>
                  <input className={inputClass} type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Nhập mật khẩu hiện tại" autoComplete="current-password" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Mật khẩu mới <span className="text-secondary">*</span></label>
                  <input className={inputClass} type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Ít nhất 7 ký tự, 1 chữ hoa, 1 số" autoComplete="new-password" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-white/72">Xác nhận mật khẩu mới <span className="text-secondary">*</span></label>
                  <input className={inputClass} type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" autoComplete="new-password" />
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] leading-5 text-white/42">Tối thiểu 7 ký tự, gồm ít nhất 1 chữ hoa và 1 số.</p>
                <button type="submit" disabled={changingPassword} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.08] px-5 text-[12px] font-extrabold text-white shadow-lg shadow-black/15 transition duration-200 hover:-translate-y-0.5 hover:border-secondary/35 hover:bg-white/[0.13] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
                  <span className="material-symbols-outlined text-[16px]">key</span>
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
