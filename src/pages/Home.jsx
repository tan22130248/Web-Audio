export default function Home() {
  return (
    <main className="pt-24 pb-32 px-gutter md:pl-[18rem] md:pr-xl max-w-[1600px]">
      {/* Featured Carousel */}
      <section className="mb-xl">
        <div className="flex items-center justify-between mb-md">
          <h2 className="font-headline-md text-headline-md">Nổi bật</h2>
          <a className="text-primary text-sm font-semibold flex items-center gap-1" href="#">
            Xem tất cả <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </a>
        </div>

        <div className="flex gap-md overflow-x-auto hide-scrollbar snap-x pb-4">
          {/* Card 1 */}
          <div className="flex-none w-[280px] md:w-[400px] snap-start group relative cursor-pointer overflow-hidden rounded-[20px] shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              data-alt="Cinematic fantasy illustration of a misty ancient Vietnamese citadel at night, glowing blue lanterns, mysterious atmosphere, high-detail digital painting with deep purple and blue color palette."
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqm6nP4DuoQ4ki4UY8FXZKz1dcCPk_3MRh6l2eABCOjrFiBzoo4fb0Jc0aQM80oJt1TP5eFW19twK_9m-OHJmR0oY9XlUQYUNJIFLbOcJvobUSnI-Fx5mtXL68IlpJxOaFY0v9xfKZkZEmmrPUTMIimOZRTv9xbb1qAbG7U3rDwzV9rB0GOvHgrLLE7ftG4TcD3N2VZE5ieySHbPy_H1RGkutqsGzv3SsElA3D_-YfL1lVsIsZRnRGIPpNvvGph0vDKj6S63kPGYMD')" }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-lg">
              <div className="text-white">
                <span className="bg-primary/20 backdrop-blur-md px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-xs inline-block">Huyền huyễn</span>
                <h3 className="font-headline-md text-xl md:text-2xl">Mộng Hoa Lục</h3>
                <p className="text-white/70 text-sm">Tác giả: Thiên Diệp</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-none w-[280px] md:w-[400px] snap-start group relative cursor-pointer overflow-hidden rounded-[20px] shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              data-alt="Digital art of a neon-lit futuristic Saigon street at night during rain, reflections of pink and orange signs on puddles, cyberpunk aesthetic, highly detailed with a moody atmospheric glow."
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCT_rzd5vuDSpjCvD_NT0OdCh6kIEzqV0gTBYpQUBU4nIIscrTbwDLngM6qqtxwshTc1qANWqJyqKDxSTltvHTzeBWVauRclAYVvCAK0uO8ZvSpN54zRnkZyZgZp0fidZ4GsTnIA1Z_wUroekchwJXtP5o8q5atWQlWVg8G5DyE5hhTI25EREAS_a9zDL6N3M-aCTyzh7w4JIVqgO8DvamZDwHGOdhtom3psK-DRVZkdCbmkbhUY59KpgqynO8rU2AcfyqaWbuS-QfX')" }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-lg">
              <div className="text-white">
                <span className="bg-secondary/20 backdrop-blur-md px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-xs inline-block">Ngôn tình</span>
                <h3 className="font-headline-md text-xl md:text-2xl">Sài Gòn Mưa Rơi</h3>
                <p className="text-white/70 text-sm">Tác giả: Mộc Trà</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-none w-[280px] md:w-[400px] snap-start group relative cursor-pointer overflow-hidden rounded-[20px] shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div
              className="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              data-alt="Eerie horror illustration of an old abandoned house in a Vietnamese rural village, dense fog, pale moonlight filtering through trees, dark muted tones with chilling atmosphere, digital art style."
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAcUSs_dM3RebTuKfJh0SZPgj3-iOjsCk-Vw9lGuCGDCzg4thK_xmc8C5PNiBcd2_LQgdMFPS1L1iO_hmkI0hbgnUQ5kOmxxixZtX-nKYVUr8U-ShmaBjnytqg7__ajJCKxSnvjmsR91dUY42METdNTKsdwnve7FSRBbLKbiCPfUbqW0UqDJq2FN3GjlMxgfiFjDmsY4krS3lx7PsG9PdHtQnijDvfbB8hEfH-k3-bX9py3Qk70NfoA6BGhrTCJ0ZaOib6rBHoO28dA')" }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-lg">
              <div className="text-white">
                <span className="bg-tertiary/20 backdrop-blur-md px-sm py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-xs inline-block">Kinh dị</span>
                <h3 className="font-headline-md text-xl md:text-2xl">Oán Hồn Xóm Nhỏ</h3>
                <p className="text-white/70 text-sm">Tác giả: Kỳ Án</p>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="mb-xl">
        <div className="flex gap-sm overflow-x-auto hide-scrollbar pb-2">
          <button className="px-md py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm whitespace-nowrap hover:bg-primary hover:text-white transition-all">Tổng tài</button>
          <button className="px-md py-2 rounded-full bg-tertiary/20 border border-tertiary/30 text-tertiary font-bold text-sm whitespace-nowrap hover:bg-tertiary hover:text-on-tertiary transition-all">Tiên hiệp</button>
          <button className="px-md py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary font-bold text-sm whitespace-nowrap hover:bg-secondary hover:text-on-secondary transition-all">Ngôn tình</button>
          <button className="px-md py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm whitespace-nowrap hover:bg-red-500 hover:text-white transition-all">Kinh dị</button>
          <button className="px-md py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold text-sm whitespace-nowrap hover:bg-green-500 hover:text-white transition-all">Hài hước</button>
          <button className="px-md py-2 rounded-full bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant font-bold text-sm whitespace-nowrap hover:bg-surface-variant transition-all">Trinh thám</button>
        </div>
      </section>

      {/* Story Grid */}
      <section className="mb-xl">
        <div className="flex items-center justify-between mb-md">
          <h2 className="font-headline-md text-headline-md">Mới cập nhật</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-gutter md:gap-lg">
          {/* Card 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square rounded-[20px] overflow-hidden mb-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                data-alt="A stylized book cover illustration for a mystery novel, featuring a shadowed figure under a street lamp in old Hanoi, rich indigo and gold colors, premium digital illustration."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwqG5MIBfNOV6IRC-INlrCr1JpRAH4tB0KJnJipHOf4PCETZq9Km4qPWwaTo5VBqFM2oQrWZF3Q-1Y6exlolnlI8yPevLwJB7jOC2GohknyZthT1dzbZlfHzhJST5avf4Ku4-BbgYmJnBx0BG5VY4jZMCiFKSnO8O2hhi9dqK5Pn4uBUjqNzYakkAdvC0cb-u3hqiLvatzHSM9b2jMaVXxRBBrOmHxKKuALLoTkI8v6YQACkr0qYBvtxSf7lBTSJxQZnyhDf5ROdXn"
              />

              <div className="absolute bottom-2 right-2 w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>

              <div className="absolute top-2 left-2 px-xs py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>12:45:00</span>
              </div>
            </div>

            <h3 className="font-title-lg text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">Vụ Án Đêm Trăng</h3>
            <p className="text-on-surface-variant text-xs mb-xs">Hoàng Nam</p>

            <div className="flex items-center justify-between mb-xs">
              <div className="flex items-center gap-1 text-[10px] text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-[14px]">headphones</span>
                <span>12.4k</span>
              </div>
              <div className="text-[10px] text-primary font-bold">75%</div>
            </div>

            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="primary-gradient h-full w-[75%] rounded-full"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square rounded-[20px] overflow-hidden mb-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                data-alt="Romantic digital illustration of a couple standing on a flower-filled balcony overlooking a serene lake at sunset, vibrant pastel colors, dreamy soft lighting, high-quality modern art style."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8ZlJ5UeV5VnKS21rf721NvdykFZHV4DH703Tn8DPuR-MZj2emvngiqTOfmg5zxXxUZqUh_HNZNa4RJE6Xu4Ua6x_ZDLnfGwXUT5XA51XkxdggrIwOwf3IALB8JeOKPAJqQYnavWWOzC_xaabm7Z9bFIEFTz4IPmvfrXNH66hnOh443ouqCQz7GfahANxFPrInMCzQbb-br_MpGy5yxGq3Xk-w_-fYYCOVvdWtjX5qTzw6Adjn78KGLLzb6d95OEkTXOVb7ceYoGIp"
              />

              <div className="absolute bottom-2 right-2 w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>

              <div className="absolute top-2 left-2 px-xs py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>08:30:12</span>
              </div>
            </div>

            <h3 className="font-title-lg text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">Yêu Lại Từ Đầu</h3>
            <p className="text-on-surface-variant text-xs mb-xs">An Nhiên</p>

            <div className="flex items-center justify-between mb-xs">
              <div className="flex items-center gap-1 text-[10px] text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-[14px]">headphones</span>
                <span>45.2k</span>
              </div>
              <div className="text-[10px] text-primary font-bold">20%</div>
            </div>

            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="primary-gradient h-full w-[20%] rounded-full"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square rounded-[20px] overflow-hidden mb-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                data-alt="A powerful fantasy landscape with floating islands and massive waterfalls, a young warrior standing at the edge, vibrant green and blue hues, epic scale, high-quality concept art."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU9DqJC4TNyyul1SbHwfrRJZNuTukDpMCljSDCkKADOpy1rDBL2gwdvPkpA06fFDMZgJYLZaL0RpVMBd9_cXSFU9YI7p4Q0siRZY_E8n9IEIPA08tlrvY4APZAvzvYv_82LDb4WtAXo_GLZ1MZO9Tns47XuHHr8Sc7z1vjjcBBXKuV9rNZhsyP4-KqTMxppcyKwdyd5TVXhH-lKZOvyF9-LTb_7mIxGl6PVSL8nmBtmzxEV0HJ-zo0i1igWwUA_bZOzYern1EGeAK1"
              />

              <div className="absolute bottom-2 right-2 w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>

              <div className="absolute top-2 left-2 px-xs py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>42:15:00</span>
              </div>
            </div>

            <h3 className="font-title-lg text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">Vạn Cổ Đệ Nhất</h3>
            <p className="text-on-surface-variant text-xs mb-xs">Huyết Long</p>

            <div className="flex items-center justify-between mb-xs">
              <div className="flex items-center gap-1 text-[10px] text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-[14px]">headphones</span>
                <span>1.2M</span>
              </div>
              <div className="text-[10px] text-primary font-bold">95%</div>
            </div>

            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="primary-gradient h-full w-[95%] rounded-full"></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-square rounded-[20px] overflow-hidden mb-sm shadow-md transition-transform duration-300 group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                data-alt="Minimalist modern apartment interior at night with a glowing laptop screen and a cup of coffee, lo-fi aesthetic, cozy atmosphere with warm orange and deep blue light, flat design illustration."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXWBh1GGwZRFry_ECs0Hfpl0gyCjwfj1kIPinLPANqknqZVZr1W4bwmylsAFNteKW_4yrHIyCwQ31LFQ1YCSw_n6wQKSw_byclhYAwbUUEaBlVsrIGXsSye6yOZmCkmXoHIIaPwm5-I_z_Lqo7UlK1IK2uFShgczfCSYUgfNySkZGF7tYdN_1_kRihBJRAU05DY_HjNU9_Ce2KJ9Wz7tza-s7MdTULerqF6Q8AW_lUHOS2SE-b1QtAsXnfwatgXnJS0o2ZdmGZAqfZ"
              />

              <div className="absolute bottom-2 right-2 w-10 h-10 primary-gradient rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </div>

              <div className="absolute top-2 left-2 px-xs py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">schedule</span>
                <span>05:20:45</span>
              </div>
            </div>

            <h3 className="font-title-lg text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">Chuyện Ở Phố</h3>
            <p className="text-on-surface-variant text-xs mb-xs">Tâm Anh</p>

            <div className="flex items-center justify-between mb-xs">
              <div className="flex items-center gap-1 text-[10px] text-on-surface-variant opacity-70">
                <span className="material-symbols-outlined text-[14px]">headphones</span>
                <span>8.9k</span>
              </div>
              <div className="text-[10px] text-primary font-bold">10%</div>
            </div>

            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div className="primary-gradient h-full w-[10%] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento-style Layout */}
      <section className="mb-xl">
        <h2 className="font-headline-md text-headline-md mb-md">Gợi ý cho bạn</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          <div className="md:col-span-2 glass-panel rounded-[24px] p-xl flex flex-col md:flex-row gap-lg items-center relative overflow-hidden">
            <div className="w-48 h-48 rounded-xl shadow-2xl overflow-hidden flex-none z-10 rotate-3 group-hover:rotate-0 transition-transform">
              <img
                className="w-full h-full object-cover"
                data-alt="Cover art for a historical Vietnamese audiobook, featuring traditional embroidery patterns and a royal fan, elegant and rich textures, warm gold and deep crimson color scheme, premium digital art."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd8g6RYo3xAFdWcBh49CW4bkMjXanU_PnfQrsyMtkPJI_4Etch8dWN6vx6CtPrSD-LSL1BYEM8x5v7w0mgo7GvINHGHgGfiRmMefTi_MyzFJdc5V9lIgLcs88XUkOK_zeG766mFEV9xMDhICM7kiSObSKKD0q-T3xkEolVHgryi4fPvAVSY2nsLYPN6YPYw3Zef-TrNLmP8YdX9WL8nqbp9zeb82O52pFV-8__bi0M_qNW0qz5MKOU_HleNe4PPZAgSWy7yHtc2QRX"
              />
            </div>

            <div className="z-10 text-center md:text-left">
              <span className="text-secondary font-bold text-xs uppercase tracking-widest">Đang thịnh hành</span>
              <h3 className="font-display-lg text-2xl md:text-3xl mb-xs">Hào Khí Thăng Long</h3>
              <p className="text-on-surface-variant mb-md max-w-md">Cuộc hành trình hào hùng về lịch sử dân tộc qua giọng đọc truyền cảm của NSƯT Thanh Hải.</p>

              <button className="primary-gradient px-xl py-3 rounded-full font-bold flex items-center gap-2 mx-auto md:mx-0 shadow-lg shadow-primary/30 transition-transform active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Nghe ngay
              </button>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 primary-gradient rounded-full blur-[80px] opacity-30"></div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-[24px] p-xl flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-md">
              <span className="material-symbols-outlined text-4xl">workspace_premium</span>
            </div>
            <h3 className="font-headline-md text-xl mb-xs">Gói Hội Viên</h3>
            <p className="text-on-surface-variant text-sm mb-md">Mở khóa toàn bộ kho truyện VIP không giới hạn.</p>
            <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-primary-container hover:text-white transition-all">Nâng cấp ngay</button>
          </div>
        </div>
      </section>
    </main>
  );
}
