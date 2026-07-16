import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=128";

function PlanBadge({ planType }) {
  const type = (planType || "FREE").toUpperCase();
  const isPremium = type === "PREMIUM";
  const isVip = type === "VIP";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase shadow-sm ${
        isVip
          ? "bg-tertiary/18 text-tertiary"
          : isPremium
            ? "primary-gradient text-white"
            : "bg-white/10 text-white/60 ring-1 ring-white/10"
      }`}
    >
      {type}
    </span>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/auth/users", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const mapped = data.data.map((u) => ({
            ...u,
            avatar: u.avatar || DEFAULT_AVATAR,
            phone: u.phone || "—",
            gender: u.gender || "—",
            birthday: u.birthday || "—",
            status: u.status || "Hoạt động",
            planType: u.planType || u.plan || "FREE",
            planExpiresAt: u.planExpiresAt || null,
          }));
          setUsers(mapped);
          setSelectedUser(mapped[0] || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN");
  }

  function getRemainingDays(expiresAt) {
    if (!expiresAt) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const exp = new Date(expiresAt);
    const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    return diff;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const selectedMeta = useMemo(() => {
    const locked = selectedUser?.status === "Đã khóa";
    return {
      locked,
      statusClass: locked ? "text-error" : "text-secondary",
      statusDot: locked ? "bg-error" : "bg-secondary",
    };
  }, [selectedUser]);

  const stats = useMemo(() => {
    const total = users.length;
    const lockedCount = users.filter((u) => u.status === "Đã khóa").length;
    const activeCount = total - lockedCount;
    return [
      {
        label: "Tổng người dùng",
        value: total.toLocaleString("vi-VN"),
        note: "Từ database",
        icon: "group",
        accent: "text-[#f3b4ff]",
        glow: "from-[#8b5cf6]/35 to-[#ec4899]/10",
      },
      {
        label: "Người dùng hoạt động",
        value: activeCount.toLocaleString("vi-VN"),
        note: "Đang hoạt động",
        icon: "person_add",
        accent: "text-[#ffbd7a]",
        glow: "from-[#f97316]/30 to-[#facc15]/10",
      },
      {
        label: "Tài khoản đã khóa",
        value: lockedCount.toLocaleString("vi-VN"),
        note: "Bị khóa",
        icon: "workspace_premium",
        accent: "text-[#ffb0cd]",
        glow: "from-[#ec4899]/32 to-[#8b5cf6]/10",
      },
      {
        label: "Tỷ lệ Hoạt động",
        value: total > 0 ? Math.round((activeCount / total) * 100) + "%" : "0%",
        note: "Tỷ lệ người dùng",
        icon: "group_remove",
        accent: "text-[#ffb4ab]",
        glow: "from-[#ef4444]/30 to-[#fb7185]/10",
        down: false,
      },
    ];
  }, [users]);

  return (
    <main className="min-h-screen bg-[#f7f6ff] text-white sm:p-5">
      <div className="pointer-events-none fixed inset-0 opacity-[0.42] [background-image:radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1180px] overflow-hidden rounded-[18px] bg-[#0d0c1f] shadow-[0_28px_90px_rgba(21,15,55,0.38)] ring-1 ring-[#7c3aed]/20">
        <AdminSidebar activeLabel="Quản lý người dùng" onLogout={handleLogout} />

        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#121126]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

          <header className="relative z-10 grid min-h-[64px] gap-3 border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl lg:grid-cols-[minmax(190px,1fr)_minmax(280px,360px)_auto] lg:items-center lg:py-0">
            <div className="flex min-w-0 items-center gap-3">
              <h2 className="truncate font-headline-md text-[22px] font-extrabold leading-7 text-primary">
                Quản lý người dùng
              </h2>
            </div>

            <label className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-[#1d1b33] px-4 text-white/58 shadow-inner shadow-black/20">
              <span className="material-symbols-outlined text-[16px]">search</span>
              <input className="min-w-0 flex-1 bg-transparent text-[11px] font-semibold text-white outline-none placeholder:text-white/40" placeholder="Tìm tên hoặc email..." type="text" />
            </label>

            <div className="flex min-w-0 items-center justify-end gap-2">
              <span className="hidden text-[10px] font-bold text-outline sm:inline">Lọc:</span>
              <select className="h-8 max-w-[104px] rounded-lg border border-white/10 bg-[#1d1b33] px-2 text-[11px] font-extrabold text-white outline-none sm:max-w-none sm:px-3">
                <option>Tất cả</option>
                <option>Free</option>
                <option>Premium</option>
                <option>Đã khóa</option>
              </select>
              <button className="primary-gradient flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95" type="button">
                <span className="material-symbols-outlined text-[15px]">file_download</span>
                Export
              </button>
              <button className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white" type="button">
                <span className="material-symbols-outlined text-[17px]">notifications</span>
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-secondary" />
              </button>
              <img
                className="h-8 w-8 rounded-full border border-white/20 object-cover shadow-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL4E___Dkjp0biCxArk2Nqylr2zjhICB0acFHEI8M0_hxTsW9H4_nneCbIm7RCRt6voW0q0t9nb9OfWb2Fea-4ohJ3MPfeUSfx4oXwSQwBRdqY16HR0WgoqvS-SzxTBzOST13vdZEStpoyoaIesRx-4FRCHH806n5dBsc-t_yFxCbWN4S3O17UGq-ow-96aj2JGy5uHgHXX7J5mmJ5aU-frpBP_2Q56TUTFP3mqWp1Z9-VKyGsiWhOl-SLkgIknPuQOdH_Mdmr7rDb"
                alt="Admin"
              />
            </div>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, note, icon, glow, accent, down }) => (
                <article className="group admin-card relative overflow-hidden rounded-xl border border-white/10 bg-[#211f35]/94 p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_42px_rgba(124,58,237,0.16)]" key={label}>
                  <div className={`absolute right-[-18px] top-[-22px] h-24 w-24 rounded-full bg-gradient-to-br ${glow} blur-2xl transition-opacity group-hover:opacity-100`} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-white/68">{label}</p>
                      <h3 className="mt-1 text-[28px] font-extrabold leading-8 text-white">{value}</h3>
                      <p className={`mt-1 flex items-center gap-1 text-[10px] font-bold ${accent}`}>
                        <span className="material-symbols-outlined text-[13px]">{down ? "trending_down" : "trending_up"}</span>
                        <span className="truncate">{note}</span>
                      </p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/8 text-primary ring-1 ring-white/8 transition group-hover:scale-105 group-hover:bg-white/12">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_332px]">
              <section className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <div className="flex h-14 items-center justify-between border-b border-white/8 px-5">
                  <h3 className="text-[13px] font-extrabold text-white">Danh sách tài khoản</h3>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-white/62 transition hover:bg-white/8 hover:text-white" type="button">
                    <span className="material-symbols-outlined text-[17px]">more_vert</span>
                  </button>
                </div>

                 <div className="overflow-x-auto">
                  {loading ? (
                    <div className="px-5 py-8 text-center text-[11px] text-white/58">Đang tải danh sách người dùng...</div>
                  ) : (
                   <table className="w-full min-w-[680px] text-left">
                     <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                       <tr>
                         <th className="px-5 py-4">Avatar</th>
                         <th className="px-5 py-4">Tên người dùng</th>
                         <th className="px-5 py-4">Email</th>
                         <th className="px-5 py-4">Trạng thái</th>
                         <th className="px-5 py-4 text-right">Gói</th>
                         <th className="px-5 py-4 text-right">Hạn sử dụng</th>
                       </tr>
                     </thead>
                      <tbody className="divide-y divide-white/6">
                        {users.map((user) => {
                          const locked = user.status === "Đã khóa";
                          const active = selectedUser?.email === user.email;
                          const remainingDays = getRemainingDays(user.planExpiresAt);
                          const isExpired = remainingDays !== null && remainingDays <= 0;
                          return (
                            <tr
                              className={`group cursor-pointer transition-all duration-200 hover:bg-white/[0.055] ${active ? "bg-primary-container/12 shadow-[inset_3px_0_0_#7c3aed]" : ""}`}
                              key={user.email}
                              onClick={() => setSelectedUser(user)}
                            >
                              <td className="px-5 py-4">
                                <img className={`h-9 w-9 rounded-full border border-white/12 object-cover shadow-md ${locked ? "grayscale opacity-70" : ""}`} src={user.avatar} alt={user.name} />
                              </td>
                             <td className={`px-5 py-4 text-[12px] font-extrabold leading-4 ${locked ? "text-white/44" : "text-white"}`}>
                               <span className="block max-w-[150px] truncate">{user.name}</span>
                             </td>
                             <td className={`px-5 py-4 text-[12px] font-semibold ${locked ? "text-white/34" : "text-white/62"}`}>
                               <span className="block max-w-[220px] truncate">{user.email}</span>
                             </td>
                             <td className="px-5 py-4">
                               <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${locked ? "text-error" : "text-secondary"}`}>
                                 <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-error" : "bg-secondary"}`} />
                                 {user.status}
                               </span>
                             </td>
                             <td className="px-5 py-4 text-right"><PlanBadge planType={user.planType} /></td>
                             <td className={`px-5 py-4 text-right text-[11px] font-semibold ${isExpired ? "text-error" : "text-white/62"}`}>
                               {user.planExpiresAt ? (
                                 <span>
                                   {formatDate(user.planExpiresAt)}
                                   {remainingDays !== null && remainingDays > 0 && (
                                     <span className="ml-1 text-[10px] text-white/45">({remainingDays} ngày)</span>
                                   )}
                                 </span>
                               ) : "—"}
                             </td>
                           </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-5 py-3 text-[10px] font-bold text-white/58">
                  <span>{loading ? "Đang tải..." : `Đang hiển thị 1-${users.length} của ${users.length} người dùng`}</span>
                  <div className="flex items-center gap-1">
                    {["chevron_left", "1", "2", "3", "...", "4289", "chevron_right"].map((item) => (
                      <button className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 transition-colors ${item === "1" ? "bg-primary text-on-primary" : "hover:bg-white/8"}`} key={item} type="button">
                        {item.includes("chevron") ? <span className="material-symbols-outlined text-[15px]">{item}</span> : item}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="relative overflow-hidden rounded-xl border border-white/10 bg-[#2a293e] shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_74%_0%,rgba(255,176,205,0.16),transparent_38%),radial-gradient(circle_at_34%_0%,rgba(124,58,237,0.22),transparent_42%)]" />

                <div className="relative p-5">
                  {!selectedUser ? (
                    <p className="text-center text-[11px] text-white/58">Đang tải...</p>
                  ) : (
                  <>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img className={`h-20 w-20 rounded-xl border-4 border-primary/18 object-cover shadow-xl ${selectedMeta.locked ? "grayscale" : ""}`} src={selectedUser.avatar} alt={selectedUser.name} />
                      <span className={`absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#2a293e] ${selectedMeta.statusDot}`} />
                    </div>
                    <h3 className="mt-4 text-[20px] font-extrabold leading-6 text-white">{selectedUser.name}</h3>
                    <span className={`mt-2 rounded-full px-3 py-1 text-[9px] font-extrabold uppercase text-white shadow-md ${
                      selectedUser.planType === "VIP"
                        ? "bg-tertiary text-on-tertiary"
                        : selectedUser.planType === "PREMIUM"
                          ? "primary-gradient text-white"
                          : "bg-white/10 text-white/60"
                    }`}>
                      {selectedUser.planType === "VIP"
                        ? "Hội viên VIP"
                        : selectedUser.planType === "PREMIUM"
                          ? "Hội viên Premium"
                          : "Tài khoản Free"}
                    </span>
                  </div>

                  <section className="mt-7">
                    <h4 className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-outline">Thông tin cơ bản</h4>
                    <div className="space-y-3 text-[12px] font-bold">
                      {[
                        ["Email", selectedUser.email],
                        ["Số điện thoại", selectedUser.phone],
                        ["Giới tính", selectedUser.gender],
                        ["Ngày sinh", selectedUser.birthday],
                        ["Trạng thái", selectedUser.status, selectedMeta.statusClass],
                      ].map(([label, value, valueClass]) => (
                        <div className="flex items-center justify-between gap-4" key={label}>
                          <span className="text-white/55">{label}</span>
                          <span className={`max-w-[170px] truncate text-right ${valueClass || "text-white"}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mt-7">
                    <h4 className="mb-3 text-[9px] font-extrabold uppercase tracking-[0.16em] text-outline">Lịch sử đăng ký</h4>
                    <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4 transition hover:bg-white/[0.075]">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/13 text-primary">
                          <span className="material-symbols-outlined text-[18px]">payments</span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-extrabold text-white">Gói Năm - Premium Plus</p>
                          <p className="truncate text-[10px] font-semibold text-white/58">999.000đ - Thanh toán ZaloPay</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-white/55">Hết hạn: 12/10/2024</span>
                        <span className="text-secondary">Còn 284 ngày</span>
                      </div>
                    </div>
                  </section>
                  </>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
