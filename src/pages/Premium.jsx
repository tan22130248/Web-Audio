import { Link } from "react-router-dom";

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
    features: ["Nghe truyện miễn phí", "Quảng cáo ngắn", "Chất lượng âm thanh chuẩn", "Tối đa 3 truyện yêu thích"],
  },
  {
    name: "Premium",
    price: "45.000đ",
    period: "/tháng",
    description: "Trải nghiệm nghe mượt mà, không quảng cáo và mở khóa truyện độc quyền.",
    icon: "workspace_premium",
    tone: "premium-shimmer border-primary/35 bg-primary-container/20 shadow-2xl shadow-primary-container/25",
    button: "Đăng ký ngay",
    buttonClass: "bg-white text-[#25005a]",
    badge: "Phổ biến",
    features: ["Không quảng cáo", "Nghe truyện Premium", "Tải xuống nghe offline", "Tạo danh sách phát cá nhân"],
  },
  {
    name: "Premium+ VIP",
    price: "99.000đ",
    period: "/tháng",
    description: "Dành cho người nghe chuyên sâu với quyền truy cập sớm và kho VIP.",
    icon: "crown",
    tone: "border-tertiary/35 bg-tertiary/12 shadow-2xl shadow-tertiary/10",
    button: "Trải nghiệm VIP",
    buttonClass: "bg-tertiary text-on-tertiary",
    features: ["Tất cả quyền lợi Premium", "Kho truyện VIP độc quyền", "Nghe tập mới sớm hơn", "Ưu tiên hỗ trợ và đề xuất"],
  },
];

const comparisons = [
  ["Thời lượng nghe mỗi ngày", "2 giờ", "Không giới hạn", "Không giới hạn"],
  ["Không quảng cáo", "Không", "Có", "Có"],
  ["Chất lượng âm thanh", "Chuẩn", "Cao", "Studio Master"],
  ["Nghe truyện độc quyền", "Không", "Premium", "Premium + VIP"],
  ["Tải xuống nghe offline", "Không", "Có", "Có"],
  ["Truy cập tập mới sớm", "Không", "Không", "Có"],
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
            {plans.map((plan) => (
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
                <button className={`mt-6 h-10 w-full rounded-lg text-[12px] font-extrabold transition-transform active:scale-[0.98] ${plan.buttonClass}`} type="button">
                  {plan.button}
                </button>
              </article>
            ))}
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
                    <span className={index === 0 ? "text-white" : ""} key={`${row[0]}-${cell}`}>
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
    </main>
  );
}
