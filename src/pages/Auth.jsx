import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "/api/auth";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

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

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[8px] font-extrabold uppercase text-[#6f6a82]">{label}</span>
      {children}
    </label>
  );
}

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Không tải được Google SDK.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không tải được Google SDK."));
    document.head.appendChild(script);
  });
}

export default function Auth({ initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate();
  const isRegister = mode === "register";
  const googleReadyRef = useRef(false);
  const googleBtnRef = useRef(null);

  const inputClass =
    "h-8 w-full rounded-md border-0 bg-[#19182d] px-3 text-[10px] font-semibold text-white outline-none placeholder:text-white/42 focus:ring-2 focus:ring-primary-container";

  const completeLogin = useCallback((userData) => {
    localStorage.setItem("token", userData.token || "");
    localStorage.setItem("fullName", userData.fullName || "");
    localStorage.setItem("email", userData.email || "");
    localStorage.setItem("role", userData.role || "USER");
    localStorage.setItem("planType", userData.planType || "FREE");
    if (userData.avatar) {
      localStorage.setItem("avatar", userData.avatar);
    }
    window.dispatchEvent(new Event("auth-change"));
    toast.success("Đăng nhập thành công!");
    const normalizedRole = (userData.role || "").toLowerCase();
    if (normalizedRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  }, [navigate]);

  const handleGoogleCredential = useCallback(async (response) => {
    const idToken = response?.credential;
    if (!idToken) {
      toast.error("Không nhận được token từ Google.");
      return;
    }

    setGoogleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Đăng nhập Google thất bại.");
        return;
      }
      completeLogin(data?.data || {});
    } catch {
      toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setGoogleLoading(false);
    }
  }, [completeLogin]);

  const initGoogle = useCallback(() => {
    if (!window.google?.accounts?.id || !GOOGLE_CLIENT_ID) return false;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: "popup",
    });
    if (googleBtnRef.current) {
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "icon",
        shape: "rectangular",
        theme: "outline",
        size: "large",
      });
    }
    googleReadyRef.current = true;
    return true;
  }, [handleGoogleCredential]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        initGoogle();
      })
      .catch(() => {
        googleReadyRef.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [initGoogle]);

  async function handleGoogleClick() {
    if (!GOOGLE_CLIENT_ID) {
      toast.error("Chưa cấu hình VITE_GOOGLE_CLIENT_ID.");
      return;
    }
    if (googleLoading) return;

    try {
      await loadGoogleScript();
      if (!window.google?.accounts?.id) {
        toast.error("Google SDK chưa sẵn sàng.");
        return;
      }
      if (!googleReadyRef.current) {
        initGoogle();
      }

      const hiddenBtn = googleBtnRef.current?.querySelector("div[role='button']");
      if (hiddenBtn) {
        hiddenBtn.click();
        return;
      }

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          toast.error("Không thể mở đăng nhập Google. Thêm origin http://localhost:5173 vào Google Cloud Console.");
        }
      });
    } catch {
      toast.error("Không tải được Google Sign-In.");
    }
  }

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

        completeLogin(data?.data || {});
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

            <div className="relative">
              <button
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d6d1df] text-[11px] font-extrabold text-[#2b2840] transition-colors hover:bg-[#f4f2ff] disabled:opacity-60"
                type="button"
                aria-label="Tiếp tục với Google"
                onClick={handleGoogleClick}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <span className="text-[10px] font-bold text-[#5f5a72]">Đang đăng nhập...</span>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Đăng nhập với Google</span>
                  </>
                )}
              </button>
              <div ref={googleBtnRef} className="pointer-events-none absolute inset-0 overflow-hidden opacity-0" aria-hidden="true" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

