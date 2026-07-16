import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import qrImage from "../assets/QR.png";
import { apiUrl } from "../config/api";

const plans = [
  {
    name: "Miễn phí",
    price: "0đ",
    period: "/tháng",
    description: "Khám phá kho truyện cơ bản với trải nghiệm nghe quen thuộc.",
    icon: "headphones",
    tone: "border-white/10 bg-white/[0.055]",
    button: "Đang sử dụng",
    buttonClass: "bg-white/10 text-white",
    features: ["Nghe truyện miễn phí", "Quảng cáo ngắn (1 audio /3 cái quảng cáo)", "Chất lượng âm thanh chuẩn"],
  },
  {
    name: "Premium",
    price: "29.000đ",
    period: "/tháng",
    description: "Trải nghiệm nghe mượt mà, không quảng cáo.",
    icon: "workspace_premium",
    tone: "premium-shimmer border-primary/35 bg-primary-container/20 shadow-2xl shadow-primary-container/25",
    button: "Đăng ký ngay",
    buttonClass: "bg-white text-[#25005a]",
    badge: "Phổ biến",
    features: ["Không quảng cáo", "Tạo danh sách phát cá nhân (các audio trong danh sách sẽ tự động phát tiếp sau khi phát hết mỗi audio, tối đa 3 audio)"],
  },
  {
    name: "Premium+ VIP",
    price: "79.000đ",
    period: "/tháng",
    description: "Dành cho người nghe chuyên sâu với quyền truy cập sớm.",
    icon: "crown",
    tone: "border-tertiary/35 bg-tertiary/12 shadow-2xl shadow-tertiary/10",
    button: "Đăng ký",
    buttonClass: "bg-tertiary text-on-tertiary",
    features: ["Tất cả quyền lợi Premium", "Nghe tập mới sớm hơn (có thông báo khi có truyện mới)", "Tạo danh sách phát cá nhân (không giới hạn số lượng audio thêm vào danh sách)"],
  },
];

const comparisons = [
  ["Quảng cáo", "Có (1/3 audio)", "Không", "Không"],
  ["Chất lượng âm thanh", "Chuẩn", "Chuẩn", "Chuẩn"],
  ["Danh sách phát cá nhân", "Không", "Tối đa 3 audio", "Không giới hạn"],
  ["Nghe tập mới sớm", "Không", "Không", "Có"],
  ["Ưu tiên hỗ trợ & đề xuất", "Không", "Không", "Có"],
];

const faqs = [
  "Có thể hủy gói đăng ký bất cứ lúc nào không?",
  "Thanh toán được hỗ trợ bằng những phương thức nào?",
  "Gói Premium+ VIP khác gì so với Premium?",
];

const paymentMethods = [
  ["credit_card", "Thẻ nội địa"],
  ["account_balance_wallet", "Ví điện tử"],
  ["qr_code_2", "QR Banking"],
  ["payments", "Chuyển khoản"],
];

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [registrationsByPlan, setRegistrationsByPlan] = useState({});
  const [userPlanType, setUserPlanType] = useState("FREE");
  const [planExpiresAt, setPlanExpiresAt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;
    fetch(apiUrl(`/api/premium/registrations?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const map = {};
          for (const reg of data.data) {
            map[reg.planName] = reg;
          }
          setRegistrationsByPlan(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;
    fetch(apiUrl(`/api/auth/me?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setUserPlanType((data.data.planType || "FREE").toUpperCase());
          setPlanExpiresAt(data.data.planExpiresAt || null);
        }
      })
      .catch(() => {});
  }, []);

  function getRemainingDays() {
    if (!planExpiresAt) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exp = new Date(planExpiresAt);
    return Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
  }

  function getButtonState(plan) {
    if (plan.name === "Miễn phí") {
      return { label: "Đang sử dụng", disabled: true, onClick: null };
    }
    const reg = registrationsByPlan[plan.name];
    if (!reg) {
      return { label: plan.button, disabled: false, onClick: () => handleOpenPayment(plan) };
    }
    const status = reg.status;
    if (status === "PENDING") {
      return { label: "Chờ xác nhận", disabled: true, onClick: null };
    }
    if (status === "COMPLETED") {
      const days = getRemainingDays();
      const remainingText = days !== null && days >= 0 ? ` (còn ${days} ngày)` : "";
      return { label: `Đang sử dụng${remainingText}`, disabled: true, onClick: null };
    }
    if (status === "CANCELLED") {
      return { label: "Đăng ký", disabled: false, onClick: () => handleOpenPayment(plan) };
    }
    return { label: plan.button, disabled: false, onClick: () => handleOpenPayment(plan) };
  }

  function handleOpenPayment(plan) {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setReceiptFile(null);
    setReceiptPreview(null);
    setSubmitError(null);
  }

  function handleClosePayment() {
    if (isSubmitting) return;
    setShowPaymentModal(false);
    setSelectedPlan(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setSubmitError(null);
  }

  async function handleConfirmPayment() {
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    if (!email || !selectedPlan || isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("userName", fullName || email);
      formData.append("planName", selectedPlan.name);
      formData.append("price", selectedPlan.price);
      if (receiptFile) formData.append("receipt", receiptFile);

      const res = await fetch(apiUrl("/api/premium/register"), {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setRegistrationsByPlan((prev) => ({
          ...prev,
          [selectedPlan.name]: {
            planName: selectedPlan.name,
            price: selectedPlan.price,
            status: "PENDING",
            registeredAt: new Date().toISOString(),
            receiptImage: data.data?.receiptImage || null,
          },
        }));
        setShowPaymentModal(false);
        setShowSuccessNotification(true);
      } else {
        setSubmitError(data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch {
      setSubmitError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseSuccess() {
    setShowSuccessNotification(false);
    setSelectedPlan(null);
    setReceiptFile(null);
    setReceiptPreview(null);
    setSubmitError(null);
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setReceiptFile(file);
    setSubmitError(null);
    const reader = new FileReader();
    reader.onload = () => setReceiptPreview(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <main className="w-full px-4 pb-32 pt-[4.9rem] text-white md:pl-44 md:pr-8">
      <div className="mx-auto w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0b20]/85 px-4 py-8 shadow-2xl sm:px-7 lg:px-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(255,176,205,0.22),transparent_58%)]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-tertiary/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-primary-fixed ring-1 ring-white/15">
              <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
            </div>
            <h1 className="font-display-lg-mobile text-[28px] font-extrabold leading-9 text-white md:text-[36px] md:leading-[44px]">
              Nâng cấp Premium - Nghe không giới hạn
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[12px] font-semibold leading-5 text-white/68 md:text-[13px]">
              Mở khóa truyện độc quyền, tải xuống nghe offline và tận hưởng không gian nghe không quảng cáo.
            </p>
          </div>

          <div className="relative mt-8 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const btn = getButtonState(plan);
              const reg = registrationsByPlan[plan.name];
              const isActivePlan = reg?.status === "COMPLETED";
              return (
                <article className={`relative overflow-hidden rounded-xl border p-5 ${plan.tone}`} key={plan.name}>
                  {plan.badge ? (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-secondary-fixed px-3 py-1 text-[10px] font-extrabold text-on-secondary">
                      {plan.badge}
                    </div>
                  ) : null}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-primary-fixed">
                      <span className="material-symbols-outlined text-[20px]">{plan.icon}</span>
                    </span>
                    <h2 className="text-[15px] font-extrabold text-white">{plan.name}</h2>
                  </div>
                  {isActivePlan && plan.name !== "Miễn phí" && (() => {
                    const days = getRemainingDays();
                    return days !== null && days >= 0 ? (
                      <p className="mb-2 text-[10px] font-bold text-secondary">Còn {days} ngày sử dụng</p>
                    ) : null;
                  })()}
                  <div className="flex items-end gap-1">
                    <span className="text-[30px] font-extrabold leading-8 text-white">{plan.price}</span>
                    <span className="text-[11px] font-bold text-white/60">{plan.period}</span>
                  </div>
                  <p className="mt-3 min-h-12 text-[11px] font-semibold leading-4 text-white/68">{plan.description}</p>
                  <ul className="mt-5 space-y-2">
                    {plan.features.map((feature) => (
                      <li className="flex items-start gap-2 text-[11px] font-bold leading-4 text-white/78" key={feature}>
                        <span className="material-symbols-outlined mt-0.5 text-[15px] text-tertiary">check_circle</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-6 h-auto min-h-[40px] w-full whitespace-normal rounded-lg py-2 text-[12px] font-extrabold transition-transform active:scale-[0.98] ${btn.disabled ? "cursor-default opacity-70" : "cursor-pointer"} ${
                      btn.label.startsWith("Đang sử dụng") && userPlanType !== "FREE"
                        ? "bg-emerald-500/18 text-emerald-300 ring-1 ring-emerald-500/25"
                        : plan.buttonClass
                    }`}
                    type="button"
                    disabled={btn.disabled}
                    onClick={btn.onClick}
                  >
                    {btn.label}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-center font-headline-md text-[20px] leading-7 text-white">So sánh quyền lợi</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.055] shadow-xl">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr] bg-white/[0.06] px-4 py-3 text-[10px] font-extrabold uppercase text-white/78">
                <span>Tính năng</span>
                <span>Miễn phí</span>
                <span>Premium</span>
                <span>VIP</span>
              </div>
              {comparisons.map((row) => (
                <div className="grid grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr] border-t border-white/10 px-4 py-3 text-[11px] font-bold text-white/70" key={row[0]}>
                  {row.map((cell, index) => (
                    <span className={index === 0 ? "text-white" : ""} key={index}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="mb-4 text-center font-headline-md text-[20px] leading-7 text-white lg:text-left">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {faqs.map((question) => (
                <details className="group rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3" key={question}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-extrabold text-white">
                    <span>{question}</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <p className="mt-3 text-[11px] font-semibold leading-5 text-white/62">
                    Bạn có thể thay đổi hoặc hủy gói trong phần cài đặt tài khoản. Quyền lợi Premium vẫn được giữ đến hết chu kỳ đã thanh toán.
                  </p>
                </details>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-white/10 bg-white/[0.055] p-5">
            <h2 className="font-headline-md text-[20px] leading-7 text-white">Phương thức thanh toán</h2>
            <p className="mt-2 text-[11px] font-semibold leading-5 text-white/62">Hỗ trợ các phương thức phổ biến tại Việt Nam.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {paymentMethods.map(([icon, label]) => (
                <div className="rounded-lg bg-white/[0.06] p-3 ring-1 ring-white/10" key={label}>
                  <span className="material-symbols-outlined text-[22px] text-tertiary">{icon}</span>
                  <p className="mt-2 text-[11px] font-extrabold text-white">{label}</p>
                </div>
              ))}
            </div>
            <Link className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white text-[12px] font-extrabold text-[#25005a]" to="/">
              Quay lại nghe truyện
            </Link>
          </aside>
        </section>
      </div>

      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-[360px] rounded-2xl border border-white/10 bg-[#12122a] p-5 shadow-2xl">
            <button
              onClick={handleClosePayment}
              disabled={isSubmitting}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
              type="button"
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-white">{selectedPlan.name}</h3>
              <span className="text-[15px] font-extrabold text-white">{selectedPlan.price}/tháng</span>
            </div>

            <div className="flex justify-center">
              <div className="rounded-xl border border-white/10 bg-white p-3">
                <img
                  src={qrImage}
                  alt="QR thanh toán"
                  className="h-48 w-48"
                />
              </div>
            </div>

            <p className="mt-4 text-center text-[12px] font-bold text-white">
              Vui lòng thanh toán qua <span className="text-tertiary">mã QR</span> này
            </p>
            <p className="mt-2 text-center text-[11px] font-semibold text-white/62 leading-5">
              Sau khi thanh toán, vui lòng lưu lại ảnh giao dịch để đối chiếu khi cần hỗ trợ.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.04] px-4 py-3 text-[11px] font-bold text-white/78 transition-colors hover:border-white/35 hover:text-white"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
              {receiptFile ? receiptFile.name : "Đính kèm ảnh giao dịch (tùy chọn)"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {receiptPreview && (
              <div className="mt-4 flex justify-center">
                <div className="rounded-xl border border-white/10 bg-white p-2">
                  <img
                    src={receiptPreview}
                    alt="Ảnh giao dịch đã chọn"
                    className="h-32 w-32 object-contain"
                  />
                </div>
              </div>
            )}

            {submitError && (
              <p className="mt-3 text-center text-[11px] font-semibold text-red-400">{submitError}</p>
            )}

            <button
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
              className="mt-4 h-11 w-full rounded-xl text-[13px] font-extrabold text-[#25005a] transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
              style={{ background: "linear-gradient(135deg, #ffb0cd 0%, #ffb783 100%)" }}
              type="button"
            >
              {isSubmitting ? "Đang gửi..." : "Xác nhận"}
            </button>
          </div>
        </div>
      )}

      {showSuccessNotification && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-[340px] rounded-2xl border border-white/10 bg-[#12122a] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-primary-fixed">
              <span className="material-symbols-outlined text-[28px]">schedule</span>
            </div>
            <h3 className="text-[15px] font-extrabold text-white">Đã ghi nhận yêu cầu đăng ký</h3>
            <p className="mt-3 text-[11px] font-semibold leading-5 text-white/68">
              Thời gian xử lý có thể mất khoảng <span className="text-tertiary font-extrabold">5-7 giờ</span>, mong bạn thông cảm. Gói{" "}
              <span className="text-tertiary font-extrabold">{selectedPlan.name}</span> sẽ được kích hoạt ngay sau khi xác nhận thanh toán thành công.
            </p>
            <button
              onClick={handleCloseSuccess}
              className="mt-5 h-10 w-full rounded-xl bg-white/10 text-[12px] font-extrabold text-white transition-colors hover:bg-white/18"
              type="button"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
