import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { shouldShowAds } from "../hooks/useAdRequirement";
import AdStickyBar from "../components/AdStickyBar";
import { apiUrl } from "../config/api";

const GENRE_TONE = {
  "Tổng tài": "bg-primary/20 text-primary border-primary/25",
  "Tiên hiệp": "bg-tertiary/20 text-tertiary border-tertiary/25",
  "Ngôn tình": "bg-secondary/20 text-secondary border-secondary/25",
  "Kinh dị": "bg-red-500/20 text-red-300 border-red-500/25",
  "Hài hước": "bg-emerald-500/20 text-emerald-300 border-emerald-500/25",
  "Trinh thám": "bg-surface-variant/70 text-on-surface border-outline-variant/25",
  "Đời Sống": "bg-orange-500/20 text-orange-300 border-orange-500/25",
  "Lịch Sử": "bg-amber-500/20 text-amber-300 border-amber-500/25",
  "Huyền Huyễn": "bg-purple-500/20 text-purple-300 border-purple-500/25",
};

function getGenreTone(genre) {
  return GENRE_TONE[genre] || "bg-white/10 text-white/80 border-white/20";
}

function mapAudioToStory(audio) {
  return {
    id: audio.id,
    title: audio.title,
    author: audio.author,
    genre: audio.genre,
    duration: audio.duration || "0:00",
    currentTime: "0:00",
    image: audio.coverImageUrl || "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=256",
    audioUrl: audio.audioUrl,
    viewCount: audio.viewCount || 0,
    likeCount: audio.likeCount || 0,
  };
}

function StoryAddPlaylistButton({ story, onOpenAddModal }) {
  return (
    <div
      className="absolute right-2 bottom-2 z-10 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      onClick={(e) => {
        e.stopPropagation();
        onOpenAddModal(story);
      }}
    >
      <div
        role="button"
        tabIndex={0}
        title="Thêm vào danh sách phát"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 hover:scale-105 hover:bg-black/80"
      >
        <span className="material-symbols-outlined text-[17px]">more_vert</span>
      </div>
    </div>
  );
}

function AddToPlaylistModal({ isOpen, audio, playlists, addedPlaylistIds, userPlanType, onCreateAndAdd, onAddToPlaylist, onClose }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [creName, setCreName] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen || !audio) return null;

  const activePlaylists = (playlists || []).filter((p) => addedPlaylistIds.has(p.id));
  const availablePlaylists = (playlists || []).filter((p) => !addedPlaylistIds.has(p.id));

  function handleCreateSubmit(e) {
    e.preventDefault();
    if (!creName.trim() || creating) return;
    setCreating(true);
    onCreateAndAdd(creName.trim(), () => {
      setCreName("");
      setCreateOpen(false);
      setCreating(false);
    });
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-h-[80vh] overflow-hidden rounded-t-2xl border border-white/10 bg-[#121126] shadow-2xl sm:max-w-[400px] sm:rounded-2xl"
        style={{ animation: "modalIn 0.22s ease-out" }}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <h3 className="text-[13px] font-extrabold text-white">Thêm vào danh sách phát</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/18" type="button">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="border-b border-white/6 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] font-extrabold uppercase text-white/42">Đang thêm</p>
          <div className="flex items-center gap-2.5 mt-1.5 overflow-hidden">
            <img src={audio.image} alt="" className="h-10 w-10 flex-none rounded-lg object-cover shadow ring-1 ring-white/10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-extrabold text-white">{audio.title}</p>
              <p className="truncate text-[10px] font-semibold text-white/58">{audio.author}</p>
            </div>
          </div>
          {userPlanType && userPlanType !== "VIP" && (
            <p className="mt-1.5 text-[9px] font-bold text-amber-300/80">
              {userPlanType === "PREMIUM"
                ? "Gói PREMIUM: tối đa 3 audio mỗi danh sách phát"
                : "Gói FREE: không được phép thêm audio vào danh sách phát"}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2.5">
          {availablePlaylists.length === 0 && activePlaylists.length === 0 && !createOpen && (
            <p className="py-6 text-center text-[11px] font-semibold text-white/42">
              Chưa có danh sách phát nào. Tạo một danh sách mới bên dưới.
            </p>
          )}

          {availablePlaylists.length > 0 && !createOpen && (
            <div className="flex flex-col gap-1">
              {availablePlaylists.map((p) => {
                const isLimited = userPlanType != null && userPlanType !== "VIP";
                const maxAllowed = userPlanType === "PREMIUM" ? 3 : 0;
                const atLimit = isLimited && (p.audioCount || 0) >= maxAllowed;
                return (
                  <button
                    key={p.id}
                    onClick={() => !atLimit && onAddToPlaylist(p.id)}
                    disabled={atLimit}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 transition active:scale-[0.98] ${
                      atLimit
                        ? "border-white/06 bg-white/[0.02] opacity-50 cursor-not-allowed"
                        : "border-white/08 bg-white/[0.055] hover:bg-white/[0.095]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-white/40">queue_music</span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-[12px] font-extrabold text-white">{p.name}</p>
                      <p className={`text-[10px] font-semibold ${atLimit ? "text-red-300/70" : "text-white/48"}`}>
                        {atLimit ? (userPlanType === "FREE" ? "FREE: không được thêm audio" : `Đã đạt giới hạn 3/${3} (PREMIUM)`) : `${p.audioCount || 0} audio`}
                      </p>
                    </div>
                    {atLimit ? (
                      <span className="material-symbols-outlined text-[16px] text-red-300/60">lock</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-primary-fixed">add_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activePlaylists.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 text-[10px] font-extrabold uppercase text-white/35">Đã thêm</p>
              <div className="flex flex-col gap-1">
                {activePlaylists.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/8 px-3 py-2.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary-fixed">queue_music</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-extrabold text-white">{p.name}</p>
                      <p className="text-[10px] font-semibold text-white/48">{p.audioCount} audio</p>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-primary-fixed">check_circle</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/8 bg-white/[0.03] px-4 py-3">
          {!createOpen ? (
            <button
              onClick={() => { setCreateOpen(true); setCreName(""); }}
              type="button"
              className="primary-gradient flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Tạo danh sách phát mới
            </button>
          ) : (
            <form onSubmit={handleCreateSubmit}>
              <div className="flex items-center gap-2">
                <input
                  value={creName}
                  onChange={(e) => setCreName(e.target.value)}
                  placeholder="VD: Truyện hay tháng 7"
                  className="flex-1 h-10 rounded-xl border border-white/10 bg-[#1d1b33] px-3 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-primary/45"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={creating || !creName.trim()}
                  className="primary-gradient flex h-10 items-center gap-1 rounded-xl px-3.5 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Lưu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home({ activeStory, onActiveStoryChange, onPlayStory, currentTrack, onTogglePlay, onSeek, onLike, likesMap, likedAudioIds, playlists, refreshPlaylists, addToPlaylist, userPlanType, adViewCount, adRequiredViews, adIsUnlocked, onAdWatch, adLoading }) {
  function isLiked(id) {
    return likedAudioIds ? likedAudioIds.has(id) : false;
  }

  function handleLike(id, e) {
    if (e) e.stopPropagation();
    if (onLike) onLike(id);
  }
  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [recommendedStory, setRecommendedStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedMap, setWatchedMap] = useState({});
  const [allAudios, setAllAudios] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addTargetAudio, setAddTargetAudio] = useState(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState(new Set());

  const availableGenres = useMemo(() => {
    const map = new Map();
    for (const a of allAudios) {
      if (a.genre && !map.has(a.genre)) map.set(a.genre, a.genre);
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare("vi", "vi"));
  }, [allAudios]);

  const displayedLatestStories = useMemo(() => {
    if (!selectedGenre) return latestStories;
    return latestStories.filter((s) => (s.genre || "").toLowerCase() === selectedGenre.toLowerCase());
  }, [latestStories, selectedGenre]);

  function openAddModal(story) {
    setAddTargetAudio(story);
    setAddedPlaylistIds(new Set());
    setAddModalOpen(true);
    if (refreshPlaylists) refreshPlaylists();
  }

  function closeAddModal() {
    setAddModalOpen(false);
    setAddTargetAudio(null);
    setAddedPlaylistIds(new Set());
  }

  async function handleAddToPlaylist(playlistId) {
    if (!addToPlaylist || !addTargetAudio) return;
    const data = await addToPlaylist(playlistId, addTargetAudio.id);
    if (data?.duplicate) {
      toast.error(data?.message || "Audio đã có trong danh sách phát.");
    } else if (data?.success) {
      setAddedPlaylistIds((prev) => new Set(prev).add(playlistId));
      if (refreshPlaylists) refreshPlaylists(localStorage.getItem("email"));
    } else {
      toast.error(data?.message || "Không thể thêm audio vào danh sách phát.");
    }
  }

  async function handleCreateAndAddFromModal(playlistName, doneCallback) {
    const email = localStorage.getItem("email");
    if (!email || !addToPlaylist) return;
    try {
      const res = await fetch(apiUrl("/api/playlists"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playlistName, userEmail: email }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success && data.data?.id) {
        await addToPlaylist(data.data.id, addTargetAudio.id);
        setAddedPlaylistIds((prev) => new Set(prev).add(data.data.id));
        if (refreshPlaylists) refreshPlaylists(email);
      }
    } finally {
      doneCallback();
    }
  }

  useEffect(() => {
    if (!addModalOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeAddModal();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [addModalOpen]);

  useEffect(() => {
    fetch(apiUrl("/api/audios"))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const all = data.data.map(mapAudioToStory);
          setAllAudios(all);
          setFeaturedStories(all.slice(0, 3));
          setLatestStories(all.slice(0, 8));
          setRecommendedStory(all[3] || all[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;
    fetch(apiUrl(`/api/history?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          const map = {};
          data.data.forEach((item) => {
            map[item.audioId] = item.progress || 0;
          });
          setWatchedMap(map);
        }
      })
      .catch(() => {});
  }, []);

  function handleStoryClick(story) {
    onPlayStory(story);
  }

  function handleMenuClick(story, e) {
    e.stopPropagation();
    openAddModal(story);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-white">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary-fixed animate-spin" />
        <p className="text-[13px] font-bold tracking-wide text-white/65">Đang tải...</p>
        <div className="home-loading-bar h-1 w-40 overflow-hidden rounded-full bg-white/10" />
      </main>
    );
  }

  return (
    <>
      {/* UI: clearer page rhythm, softer section spacing */}
      <main className="w-full px-4 pb-32 pt-[4.9rem] text-white sm:px-5 md:pl-44 md:pr-8 lg:pr-10">
        {shouldShowAds() && (
          <AdStickyBar
            viewCount={adViewCount}
            requiredViews={adRequiredViews}
            isUnlocked={adIsUnlocked}
            onWatchAd={onAdWatch}
            isLoading={adLoading}
          />
        )}
        <div className="mx-auto w-full max-w-6xl">
          {featuredStories.length > 0 && (
            <section className="home-fade-up mb-8">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-headline-md text-[20px] font-extrabold leading-tight tracking-tight text-white sm:text-[22px]">
                    Nổi bật
                  </h2>
                  <p className="mt-0.5 text-[12px] font-medium text-white/45">Những audio được yêu thích nhất</p>
                </div>
                <a
                  className="flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[12px] font-bold text-primary-fixed transition-all duration-200 hover:bg-white/8 hover:text-white"
                  href="#"
                >
                  Xem tất cả
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
              </div>

              <div className="home-stagger grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-[1.15fr_1.15fr_0.85fr]">
                {featuredStories.map((story) => (
                  <button
                    className="home-card home-featured group relative min-h-[168px] cursor-pointer overflow-hidden rounded-2xl text-left shadow-xl ring-1 ring-white/10 sm:min-h-[180px]"
                    key={story.title}
                    onClick={() => handleStoryClick(story)}
                    type="button"
                  >
                    <img
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      src={story.image}
                      alt={story.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
                    <div className="home-play-overlay absolute inset-0 z-[5] flex items-center justify-center bg-black/25 pointer-events-none">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full primary-gradient text-white shadow-xl ring-2 ring-white/30">
                        <span className="material-symbols-outlined text-[30px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                          play_arrow
                        </span>
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4">
                      <p className="mb-1.5 inline-flex rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-tertiary backdrop-blur-sm ring-1 ring-white/10">
                        {story.genre}
                      </p>
                      <h3 className="font-headline-md line-clamp-1 text-[16px] font-extrabold leading-snug tracking-tight text-white sm:text-[17px]">
                        {story.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-[12px] font-medium text-white/75">Tác giả: {story.author}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">visibility</span>
                          {(story.viewCount || 0).toLocaleString("vi-VN")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">favorite</span>
                          {(likesMap && likesMap[story.id] !== undefined ? likesMap[story.id] : (story.likeCount || 0)).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      {watchedMap[story.id] > 0 && (
                        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/20">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400" style={{ width: `${watchedMap[story.id]}%` }} />
                        </div>
                      )}
                    </div>
                    <StoryAddPlaylistButton story={story} onOpenAddModal={openAddModal} />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="home-fade-up mb-7" style={{ animationDelay: "0.08s" }}>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1.5">
              <button
                onClick={() => setSelectedGenre(null)}
                type="button"
                className={`home-chip rounded-full border px-3.5 py-2 text-[12px] font-extrabold whitespace-nowrap shadow-sm active:scale-95 ${
                  selectedGenre === null
                    ? "border-white/30 bg-white/18 text-white shadow-md shadow-white/5"
                    : "border-white/10 bg-white/[0.06] text-white/65 hover:border-white/18 hover:bg-white/12 hover:text-white"
                }`}
              >
                Tất cả
              </button>
              {availableGenres.map((genre) => {
                const tone = getGenreTone(genre);
                const isActive = selectedGenre !== null && selectedGenre.toLowerCase() === genre.toLowerCase();
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(isActive ? null : genre)}
                    type="button"
                    className={`home-chip rounded-full border px-3.5 py-2 text-[12px] font-extrabold whitespace-nowrap shadow-sm active:scale-95 ${
                      isActive
                        ? "border-primary/50 bg-primary/30 text-primary-fixed shadow-md shadow-primary/15"
                        : tone
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </section>

          {displayedLatestStories.length > 0 ? (
            <section className="home-fade-up mb-9" style={{ animationDelay: "0.12s" }}>
              <div className="mb-4">
                <h2 className="font-headline-md text-[20px] font-extrabold leading-tight tracking-tight text-white sm:text-[22px]">
                  {selectedGenre ? `Thể loại: ${selectedGenre}` : "Mới cập nhật"}
                </h2>
                <p className="mt-0.5 text-[12px] font-medium text-white/45">
                  {selectedGenre ? `Danh sách audio thuộc ${selectedGenre}` : "Vừa được thêm vào thư viện"}
                </p>
              </div>
              <div className="home-stagger grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {displayedLatestStories.map((story) => (
                  <button
                    className="home-card group relative min-w-0 cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.045] p-2.5 text-left shadow-lg shadow-black/20 ring-1 ring-transparent hover:border-primary/25 hover:bg-white/[0.08] hover:ring-primary/20"
                    key={story.title}
                    onClick={() => handleStoryClick(story)}
                    type="button"
                  >
                    <div className="relative mb-2.5 aspect-square overflow-hidden rounded-xl shadow-md">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        src={story.image}
                        alt={story.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white backdrop-blur-md ring-1 ring-white/10">
                        {story.duration}
                      </div>
                      <div className="home-play-overlay absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full primary-gradient text-white shadow-lg ring-2 ring-white/25">
                          <span className="material-symbols-outlined text-[24px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                          </span>
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-end p-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                        <div
                          className="flex h-8 items-center gap-1 rounded-full bg-black/65 px-2.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md ring-1 ring-white/15 transition hover:bg-black/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddModal(story);
                          }}
                        >
                          <span className="material-symbols-outlined text-[16px]">playlist_add</span>
                          <span className="hidden xs:inline sm:inline">Danh sách</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="line-clamp-1 text-[13px] font-extrabold leading-snug tracking-tight text-white transition-colors duration-200 group-hover:text-primary-fixed sm:text-[14px]">
                      {story.title}
                    </h3>
                    <p className="mt-0.5 mb-1.5 line-clamp-1 text-[11px] font-medium text-white/55 sm:text-[12px]">{story.author}</p>
                    <div className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] font-semibold text-white/50 sm:text-[11px]">
                      <span className="inline-flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">visibility</span>
                        {(story.viewCount || 0).toLocaleString("vi-VN")}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">favorite</span>
                        {(likesMap && likesMap[story.id] !== undefined ? likesMap[story.id] : (story.likeCount || 0)).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-white/55">
                      <span className="text-white/35">—</span>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold text-primary-fixed ring-1 ring-primary/20">
                        Free
                      </span>
                    </div>
                    {watchedMap[story.id] > 0 ? (
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400" style={{ width: `${watchedMap[story.id]}%` }} />
                      </div>
                    ) : (
                      <div className="h-1 overflow-hidden rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full primary-gradient" style={{ width: "0%" }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="home-fade-up mb-9">
              <h2 className="mb-4 font-headline-md text-[20px] font-extrabold leading-tight text-white sm:text-[22px]">
                {selectedGenre ? `Thể loại: ${selectedGenre}` : "Mới cập nhật"}
              </h2>
              <div className="rounded-2xl border border-white/8 bg-white/[0.04] py-12 text-center text-[13px] font-medium text-white/45">
                <span className="material-symbols-outlined mb-2 block text-[40px] text-white/25">search_off</span>
                Không có audio nào thuộc thể loại &ldquo;{selectedGenre}&rdquo;.
              </div>
            </section>
          )}

          {recommendedStory && (
            <section className="home-fade-up" style={{ animationDelay: "0.16s" }}>
              <div className="mb-4">
                <h2 className="font-headline-md text-[20px] font-extrabold leading-tight tracking-tight text-white sm:text-[22px]">
                  Gợi ý cho bạn
                </h2>
                <p className="mt-0.5 text-[12px] font-medium text-white/45">Dựa trên xu hướng nghe gần đây</p>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
                <button
                  className="home-card glass-panel group relative overflow-hidden rounded-2xl p-5 text-left ring-1 ring-white/10 hover:bg-white/[0.09] hover:ring-primary/30 sm:p-6"
                  onClick={() => handleStoryClick(recommendedStory)}
                  type="button"
                >
                  <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="relative shrink-0">
                      <img
                        className="h-28 w-28 rounded-xl object-cover shadow-2xl ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.03] sm:h-32 sm:w-32"
                        src={recommendedStory.image}
                        alt={recommendedStory.title}
                      />
                      <span className="home-play-overlay absolute inset-0 flex items-center justify-center rounded-xl bg-black/25 pointer-events-none">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full primary-gradient text-white shadow-lg ring-2 ring-white/25">
                          <span className="material-symbols-outlined text-[26px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                          </span>
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-secondary-fixed-dim">Đang thịnh hành</p>
                      <h3 className="mt-1 text-[20px] font-extrabold leading-snug tracking-tight text-white sm:text-[22px]">
                        {recommendedStory.title}
                      </h3>
                      <p className="mb-3 mt-1.5 text-[12px] font-medium leading-relaxed text-white/65 sm:text-[13px]">
                        Cuộc hành trình hào hùng về lịch sử dân tộc qua giọng đọc truyền cảm của NSƯT Thanh Hải.
                      </p>
                      <div className="mb-3.5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-white/55 sm:text-[12px]">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          {(recommendedStory.viewCount || 0).toLocaleString("vi-VN")} người xem
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">favorite</span>
                          {(likesMap && likesMap[recommendedStory.id] !== undefined
                            ? likesMap[recommendedStory.id]
                            : recommendedStory.likeCount || 0
                          ).toLocaleString("vi-VN")}{" "}
                          lượt thích
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="primary-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-primary/25 transition-transform duration-200 group-hover:scale-[1.02]">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_arrow
                          </span>
                          Nghe ngay
                        </span>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddModal(recommendedStory);
                          }}
                          className="flex h-10 items-center gap-1.5 rounded-full border border-white/12 bg-white/8 px-3.5 text-[11px] font-extrabold text-white transition-all duration-200 hover:border-primary/40 hover:bg-white/14"
                        >
                          <span className="material-symbols-outlined text-[16px]">playlist_add</span>
                          Danh sách phát
                        </div>
                      </div>
                    </div>
                  </div>
                  {watchedMap[recommendedStory.id] > 0 && (
                    <div className="relative z-10 mt-4 h-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                        style={{ width: `${watchedMap[recommendedStory.id]}%` }}
                      />
                    </div>
                  )}
                </button>

                <aside className="home-card flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/15 via-white/[0.06] to-white/[0.04] p-6 text-center shadow-lg">
                  <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/25 text-primary-fixed shadow-inner ring-1 ring-primary/20">
                    <span className="material-symbols-outlined text-[30px]">workspace_premium</span>
                  </div>
                  <h3 className="text-[16px] font-extrabold tracking-tight text-white">Gói Hội Viên</h3>
                  <p className="my-2.5 max-w-[220px] text-[12px] font-medium leading-relaxed text-white/65">
                    Mở khóa toàn bộ kho truyện VIP không giới hạn.
                  </p>
                  <Link
                    className="mt-1 w-full rounded-full bg-white px-4 py-2.5 text-[12px] font-extrabold text-[#1a1030] shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-primary-fixed hover:shadow-lg active:scale-[0.98]"
                    to="/premium"
                  >
                    Nâng cấp ngay
                  </Link>
                </aside>
              </div>
            </section>
          )}
        </div>
      </main>

      <AddToPlaylistModal
        isOpen={addModalOpen}
        audio={addTargetAudio}
        playlists={playlists}
        addedPlaylistIds={addedPlaylistIds}
        userPlanType={userPlanType}
        onCreateAndAdd={handleCreateAndAddFromModal}
        onAddToPlaylist={handleAddToPlaylist}
        onClose={closeAddModal}
      />
    </>
  );
}
