import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "/api/auth";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSendOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Không thể gửi OTP.");
        return;
      }
      toast.success(data?.message || "OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "OTP không hợp lệ.");
        return;
      }
      toast.success("Xác nhận OTP thành công!");
      setStep(3);
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length <= 6 || !newPassword.match(/[A-Z]/) || !newPassword.match(/\d/)) {
      toast.error("Mật khẩu phải từ 7 ký tự, có ít nhất 1 chữ hoa và 1 số.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Đổi mật khẩu thất bại.");
        return;
      }
      toast.success(data?.message || "Đổi mật khẩu thành công!");
      navigate("/login");
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-8 w-full rounded-md border-0 bg-[#19182d] px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/42 focus:ring-2 focus:ring-primary-container";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f2ff] p-4 text-white">
      <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#0d0d22] p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="font-headline-lg text-[22px] font-extrabold text-white">Quên mật khẩu</h2>
          <p className="mt-1 text-[11px] font-semibold text-white/58">
            {step === 1 && "Nhập email để nhận mã OTP"}
            {step === 2 && "Nhập mã OTP đã gửi đến email của bạn"}
            {step === 3 && "Tạo mật khẩu mới"}
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-white/38">
            <span className={step >= 1 ? "text-primary-container" : ""}>Bước 1</span>
            <span>{step > 1 ? "→" : ""}</span>
            <span className={step >= 2 ? "text-primary-container" : ""}>Bước 2</span>
            <span>{step > 2 ? "→" : ""}</span>
            <span className={step >= 3 ? "text-primary-container" : ""}>Bước 3</span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="your@gmail.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="primary-gradient h-10 w-full rounded-md text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Gửi OTP"}
            </button>
            <p className="text-center text-[10px] text-white/58">
              Nhớ mật khẩu?{" "}
              <Link to="/login" className="font-extrabold text-primary-container hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Mã OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`${inputClass} text-center tracking-widest`}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="primary-gradient h-10 w-full rounded-md text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Xác nhận OTP"}
            </button>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-extrabold text-white/62 transition hover:text-white"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-[11px] font-extrabold text-primary-container transition hover:underline disabled:opacity-60"
              >
                Gửi lại OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="Nhập mật khẩu mới"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-extrabold uppercase text-white/38">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="primary-gradient h-10 w-full rounded-md text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[11px] font-extrabold text-white/62 transition hover:text-white"
              >
                Quay lại
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
