import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "/api/auth";

const illustrationUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmVF3EZkGzfd8phkX1k09h_TlFiAmPPyc9aFFBXF3u13fLR_jGZxW9p-3JUhC6Xu5_MAVQylMzlxiefRO4PtgLw6mJKu0MGyjw2likqkjJyk3o2xasa1vH0h7EESK8SG8ShOqxPovQ6FzzjiP1VFbZnHWbNamVGNbwgfM_VQNXNzfptk_zGIuSjl3eNY6Tjt8iFBfa2ugyPi1zKdMcJUHs9QeiCvXsdqocaaCsWxmpiIzSt11qXXs0hKZJW5tklStYhgEuNCiK6jCB";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4" fill="#000000" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05 1.78-3.32 1.78-1.24 0-1.63-.76-3.12-.76-1.5 0-1.93.74-3.12.76-1.25 0-2.39-.88-3.41-1.85-2.08-1.98-3.18-5.33-1.07-8.91 1.05-1.78 2.88-2.91 4.54-2.91 1.25 0 2.18.72 3.12.72s1.87-.72 3.12-.72c1.37 0 2.76.62 3.65 1.69-2.28 1.36-1.92 4.67.45 5.61-.43 1.25-1.14 2.59-1.84 3.59zM12.03 7.25c-.15-2.23 1.66-4.07 3.32-4.25.26 2.37-1.81 4.25-3.32 4.25z" />
    </svg>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[8px] font-extrabold uppercase text-[#6f6a82]">{label}</span>
      {children}
    </label>
  );
}

export default function Auth({ initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();
  const isRegister = mode === "register";

  const inputClass =
    "h-8 w-full rounded-md border-0 bg-[#19182d] px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/42 focus:ring-2 focus:ring-primary-container";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password) {
          toast.error("Vui lòng điền đầy đủ thông tin.");
          setLoading(false);
          return;
        }

        if (!/^[^@]+@gmail\..+$/.test(email.trim())) {
          toast.error("Email phải có đuôi @gmail.");
          setLoading(false);
          return;
        }

        if (password.length <= 6) {
          toast.error("Mật khẩu phải lớn hơn 6 ký tự. VD: \"Matkhau2\"");
          setLoading(false);
          return;
        }

        if (!/[A-Z]/.test(password)) {
          toast.error("Mật khẩu phải có ít nhất 1 chữ hoa.");
          setLoading(false);
          return;
        }

        if (!/\d/.test(password)) {
          toast.error("Mật khẩu phải có ít nhất 1 số.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp.");
          setLoading(false);
          return;
        }

        if (!agreeTerms) {
          toast.error("Bạn cần đồng ý với điều khoản dịch vụ.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          const message = data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
          toast.error(message);
          setLoading(false);
          return;
        }

        toast.success(data?.message || "Đăng ký thành công! Vui lòng đăng nhập.");
        setMode("login");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreeTerms(false);
      } else {
        if (!email.trim() || !password) {
          toast.error("Vui lòng nhập email và mật khẩu.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          const message = data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
          toast.error(message);
          setLoading(false);
          return;
        }

        const userData = data?.data || {};
        localStorage.setItem("token", userData.token || "");
        localStorage.setItem("fullName", userData.fullName || "");
        localStorage.setItem("email", userData.email || "");
        localStorage.setItem("role", userData.role || "USER");
        localStorage.setItem("planType", userData.planType || "FREE");
        window.dispatchEvent(new Event("auth-change"));

        toast.success("Đăng nhập thành công!");
        const normalizedRole = (userData.role || "").toLowerCase();
        if (normalizedRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f2ff] p-3 text-white sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-6xl overflow-hidden rounded-lg border-[5px] border-[#6b5cff] bg-[#0d0d22] shadow-[0_24px_80px_rgba(23,18,70,0.35)] sm:min-h-[calc(100vh-2.5rem)] md:grid-cols-[1.08fr_1fr]">
        <section className="relative min-h-[430px] overflow-hidden bg-[#071047] md:min-h-full">
          <img
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={illustrationUrl}
            alt="Minh họa nghe truyện audio"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071047] via-[#071047]/18 to-[#071047]/10" />
          <div className="absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-r from-transparent to-[#0d0d22]/45 md:block" />

          <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 pt-7 sm:px-8 md:px-10">
            <div className="max-w-[330px]">
              <Link className="mb-2 inline-flex items-center gap-2 text-white" to="/">
                <span className="material-symbols-outlined text-[28px] text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                  graphic_eq
                </span>
                <span className="font-display-lg text-[25px] font-extrabold leading-7">VOX</span>
              </Link>
              <h1 className="font-display-lg-mobile text-[29px] font-extrabold leading-8 text-white drop-shadow-lg md:text-[33px] md:leading-9">
                Ngàn câu chuyện, một cú chạm
              </h1>
              <div className="mt-5 max-w-[290px] rounded-lg border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
                <p className="text-[11px] font-semibold italic leading-4 text-white/80">
                  "Âm thanh sống động đưa bạn vào thế giới của trí tưởng tượng vô hạn."
                </p>
              </div>
            </div>

            <div className="mt-9 text-center md:text-left">
              <p className="font-display-lg-mobile text-[31px] font-extrabold leading-8 text-[#e8b8dd] drop-shadow-md">
                Welcome!
                <br />
                Listen & Dream.
              </p>
              <div className="mt-5 flex items-center justify-center gap-4 md:justify-start">
                <button
                  className={`h-9 rounded-full px-7 text-[11px] font-extrabold transition-all ${!isRegister ? "bg-primary-container text-white shadow-lg shadow-primary-container/25" : "bg-white/12 text-white hover:bg-white/18"}`}
                  onClick={() => setMode("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`h-9 rounded-full border px-7 text-[11px] font-extrabold transition-all ${isRegister ? "border-tertiary bg-tertiary/10 text-tertiary" : "border-white/25 text-white hover:bg-white/10"}`}
                  onClick={() => setMode("register")}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#0f0f23] px-5 py-10 md:px-8">
          <div className="w-full max-w-[355px] rounded-xl bg-white p-4 text-[#101026] shadow-[0_18px_52px_rgba(0,0,0,0.45)]">
            <Link to="/" className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-primary-container transition-colors hover:opacity-80">
              <span className="material-symbols-outlined text-[16px]">home</span>
              Trang chủ
            </Link>

            <div className="mb-5 grid grid-cols-2 rounded-full bg-[#19182d] p-1">
              <button
                className={`h-7 rounded-full text-[10px] font-extrabold transition-all ${isRegister ? "bg-primary-container text-white" : "text-white/76 hover:text-white"}`}
                onClick={() => setMode("register")}
                type="button"
              >
                Đăng ký
              </button>
              <button
                className={`h-7 rounded-full text-[10px] font-extrabold transition-all ${!isRegister ? "bg-primary-container text-white" : "text-white/76 hover:text-white"}`}
                onClick={() => setMode("login")}
                type="button"
              >
                Đăng nhập
              </button>
            </div>

            <div className="mb-4">
              <h2 className="font-headline-md text-[20px] font-extrabold leading-6 text-[#111125]">
                {isRegister ? "Bắt đầu hành trình" : "Chào mừng trở lại"}
              </h2>
              <p className="mt-1 text-[10px] font-semibold text-[#8a849b]">
                {isRegister ? "Khám phá thế giới âm thanh của riêng bạn." : "Tiếp tục câu chuyện đang nghe dở nhé."}
              </p>
            </div>

            <form className="space-y-2.5" onSubmit={handleSubmit}>
              {isRegister ? (
                <Field label="Họ tên">
                  <input
                    className={inputClass}
                    placeholder="Nhập tên của bạn"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field>
              ) : null}

              <Field label="Email hoặc số điện thoại">
                <input
                  className={inputClass}
                  placeholder="name@example.com"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field label="Mật khẩu">
                <div className="relative">
                  <input
                    className={`${inputClass} pr-9`}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/64" onClick={() => setShowPassword((value) => !value)} type="button" aria-label="Hiện hoặc ẩn mật khẩu">
                    <span className="material-symbols-outlined text-[16px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </Field>

              {isRegister ? (
                <Field label="Xác nhận mật khẩu">
                  <input
                    className={inputClass}
                    placeholder="••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Field>
                ) : (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-[10px] font-bold text-primary-container hover:underline">
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}

              {isRegister ? (
                <label className="flex items-start gap-2 py-1 text-[9px] font-semibold leading-4 text-[#7d778d]">
                  <input
                    className="mt-0.5 h-3.5 w-3.5 rounded text-primary-container focus:ring-primary-container"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    Tôi đồng ý với <a className="font-extrabold text-primary-container hover:underline" href="#">Điều khoản dịch vụ</a> và Chính sách bảo mật.
                  </span>
                </label>
              ) : null}

              <button
                className="primary-gradient h-10 w-full rounded-md text-[12px] font-extrabold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#ded9e8]" />
              <span className="text-[9px] font-extrabold text-[#8a849b]">Hoặc tiếp tục với</span>
              <span className="h-px flex-1 bg-[#ded9e8]" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex h-10 items-center justify-center rounded-md border border-[#d6d1df] transition-colors hover:bg-[#f4f2ff]" type="button" aria-label="Tiếp tục với Google">
                <GoogleIcon />
              </button>
              <button className="flex h-10 items-center justify-center rounded-md border border-[#d6d1df] transition-colors hover:bg-[#f4f2ff]" type="button" aria-label="Tiếp tục với Facebook">
                <FacebookIcon />
              </button>
              <button className="flex h-10 items-center justify-center rounded-md border border-[#d6d1df] transition-colors hover:bg-[#f4f2ff]" type="button" aria-label="Tiếp tục với Apple">
                <AppleIcon />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

