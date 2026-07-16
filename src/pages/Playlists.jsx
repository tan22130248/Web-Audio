import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideNavBar from "../components/SideNavBar";
import TopNavBar from "../components/TopNavBar";
import toast from "react-hot-toast";
import { apiUrl } from "../config/api";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function storyFromAudio(audio) {
  return {
    id: audio.id,
    title: audio.title,
    author: audio.author,
    genre: audio.genre,
    duration: audio.duration || "0:00",
    image: audio.coverImageUrl || "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=256",
    audioUrl: audio.audioUrl,
    viewCount: audio.viewCount || 0,
    likeCount: audio.likeCount || 0,
  };
}

export default function Playlists({ playlists: externalPlaylists, refreshPlaylists, onPlayStory, currentTrack, onTogglePlay, onSeek, userPlanType }) {
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
  const [localPlaylists, setLocalPlaylists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudios, setSelectedAudios] = useState([]);
  const [loadingAudios, setLoadingAudios] = useState(false);

  const effectivePlaylists = externalPlaylists && externalPlaylists.length > 0 ? externalPlaylists : localPlaylists;

  useEffect(() => {
    if (externalPlaylists && externalPlaylists.length > 0) {
      setLocalPlaylists(externalPlaylists);
      setLoading(false);
      return;
    }
    if (!email) { setLoading(false); return; }
    fetch(apiUrl(`/api/playlists?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setLocalPlaylists(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [email, externalPlaylists]);

  useEffect(() => {
    fetch(apiUrl("/api/audios"))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) setAudios(data.data);
      })
      .catch(() => {});
  }, []);

  function refreshIfNeeded() {
    if (refreshPlaylists && email) {
      refreshPlaylists(email);
    } else if (!externalPlaylists && email) {
      fetch(apiUrl(`/api/playlists?email=${encodeURIComponent(email)}`))
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data)) setLocalPlaylists(data.data);
        })
        .catch(() => {});
    }
  }

  async function handleCreate() {
    const name = newName.trim();
    if (!name || !email) return;
    const res = await fetch(apiUrl("/api/playlists"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userEmail: email }),
    });
    const data = await res.json().catch(() => ({}));
    if (data?.success) {
      setNewName("");
      setShowCreateModal(false);
      refreshIfNeeded();
      if (data.data?.id) setSelectedPlaylist((prev) => prev ? { ...prev, id: data.data.id, name } : null);
    }
  }

  async function handleDeletePlaylist(id) {
    if (!confirm("Xóa danh sách phát này?")) return;
    try {
      await fetch(apiUrl(`/api/playlists/${id}`), { method: "DELETE" });
    } catch {}
    const updated = effectivePlaylists.filter((p) => p.id !== id);
    if (!externalPlaylists) setLocalPlaylists(updated);
    if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
    refreshIfNeeded();
  }

  async function toggleAudioInPlaylist(playlistId, audioId) {
    const isCurrentlyIn = selectedAudios.some((a) => a.id === audioId);
    if (isCurrentlyIn) {
      try {
        await fetch(apiUrl(`/api/playlists/${playlistId}/audio/${audioId}`), { method: "DELETE" });
      } catch {}
      setSelectedAudios((prev) => prev.filter((a) => a.id !== audioId));
      if (!externalPlaylists) {
        setLocalPlaylists((prev) => prev.map((p) => p.id === playlistId ? { ...p, audioCount: Math.max(0, (p.audioCount || 0) - 1) } : p));
      }
    } else {
      try {
        const res = await fetch(apiUrl(`/api/playlists/${playlistId}/audio/${audioId}`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: email }),
        });
        const data = await res.json().catch(() => ({}));
        if (data?.duplicate) {
          toast.error(data?.message || "Audio đã có trong danh sách phát.");
          return;
        }
        if (data?.limitReached) {
          toast.error(data?.message || "Bạn đã đạt giới hạn audio trong danh sách phát.");
          return;
        }
      } catch {}
      const found = audios.find((a) => a.id === audioId);
      if (found) setSelectedAudios((prev) => [...prev, found]);
      if (!externalPlaylists) {
        setLocalPlaylists((prev) => prev.map((p) => p.id === playlistId ? { ...p, audioCount: (p.audioCount || 0) + 1 } : p));
      }
    }
  }

  function playFromPlaylist(playlistAudios, index) {
    if (!playlistAudios || playlistAudios.length === 0 || index >= playlistAudios.length || !onPlayStory) return;
    const audio = playlistAudios[index];
    onPlayStory(storyFromAudio(audio), { audios: playlistAudios, currentIndex: index });
  }

  function playAudio(audio, index) {
    if (!onPlayStory) return;
    const idx = typeof index === "number" ? index : selectedAudios.findIndex((a) => a.id === audio.id);
    if (idx >= 0 && selectedAudios.length > 0) {
      playFromPlaylist(selectedAudios, idx);
    } else {
      onPlayStory(storyFromAudio(audio));
    }
  }

  async function openPlaylistDetail(playlist) {
    setSelectedPlaylist(playlist);
    setSelectedAudios([]);
    setLoadingAudios(true);
    try {
      const query = email ? `?email=${encodeURIComponent(email)}` : "";
      const res = await fetch(apiUrl(`/api/playlists/${playlist.id}/audios${query}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success && Array.isArray(data.data)) {
        const found = data.data.map((id) => audios.find((a) => a.id === id)).filter(Boolean);
        setSelectedAudios(found);
      }
    } catch {}
    setLoadingAudios(false);
  }

  async function playPlaylist(playlist) {
    if (!playlist || playlist.audioCount === 0) return;
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await fetch(apiUrl(`/api/playlists/${playlist.id}/audios${query}`));
    const data = await res.json().catch(() => ({}));
    let playlistAudios = [];
    if (data?.success && Array.isArray(data.data)) {
      playlistAudios = data.data.map((id) => audios.find((a) => a.id === id)).filter(Boolean);
    }
    if (playlistAudios.length === 0) return;
    setSelectedPlaylist(playlist);
    setSelectedAudios(playlistAudios);
    playFromPlaylist(playlistAudios, 0);
  }

  return (
    <>
      <TopNavBar />
      <SideNavBar />
      <main className="w-full px-4 pb-28 pt-[4.9rem] text-white md:pl-44 md:pr-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="relative z-10 flex min-h-[64px] items-center justify-between border-b border-white/8 bg-[#121126]/84 px-4 py-3 backdrop-blur-xl">
            <h2 className="truncate font-headline-md text-[22px] font-extrabold leading-7 text-primary">
              Danh sách phát
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="primary-gradient flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Tạo danh sách
            </button>
          </header>

          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
            {loading ? (
              <div className="py-8 text-center text-[11px] text-white/58">Đang tải...</div>
            ) : effectivePlaylists.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <span className="material-symbols-outlined text-[48px] text-white/25">queue_music</span>
                <p className="mt-3 text-[12px] font-semibold text-white/58">Bạn chưa có danh sách phát nào.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 primary-gradient h-9 rounded-lg px-5 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95"
                  type="button"
                >
                  Tạo danh sách phát
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {effectivePlaylists.map((playlist) => (
                  <article
                    key={playlist.id}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:-translate-y-1 ${
                      selectedPlaylist?.id === playlist.id
                        ? "border-primary/35 bg-[#211f35]/94 shadow-[0_18px_42px_rgba(124,58,237,0.16)]"
                        : "border-white/10 bg-[#211f35]/94 hover:border-primary/35 hover:shadow-[0_18px_42px_rgba(124,58,237,0.16)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[13px] font-extrabold text-white">{playlist.name}</h3>
                        <p className="mt-1 text-[10px] font-semibold text-white/58">
                          {playlist.audioCount || 0} audio
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => playPlaylist(playlist)}
                          disabled={!(playlist.audioCount > 0)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white disabled:opacity-50"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/70 transition hover:bg-red-500/18 hover:text-red-300"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => openPlaylistDetail(playlist)}
                      className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-white/9 text-[11px] font-extrabold text-white transition hover:bg-white/14"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      Xem chi tiết
                    </button>
                  </article>
                ))}
              </div>
            )}

            {selectedPlaylist && (
              <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#211f35]/96 shadow-2xl">
                <div className="flex h-14 items-center justify-between border-b border-white/8 px-5">
                  <div>
                    <h3 className="text-[13px] font-extrabold text-white">{selectedPlaylist.name}</h3>
                    <p className="text-[10px] font-semibold text-white/58">
                      {selectedAudios.length} audio trong danh sách
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (selectedAudios.length > 0) playFromPlaylist(selectedAudios, 0);
                      }}
                      disabled={selectedAudios.length === 0}
                      className="primary-gradient flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold text-white shadow-lg shadow-primary-container/24 transition-transform active:scale-95 disabled:opacity-50"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                      Phát tất cả
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPlaylist(null);
                        setSelectedAudios([]);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/70 transition hover:bg-white/12 hover:text-white"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>

                <div className="scrollbar-hide overflow-x-auto">
                  {loadingAudios ? (
                    <div className="px-5 py-8 text-center text-[11px] text-white/58">Đang tải...</div>
                  ) : selectedAudios.length === 0 ? (
                    <div className="px-5 py-8 text-center text-[11px] text-white/58">
                      Danh sách trống. Thêm audio từ trang chủ.
                    </div>
                  ) : (
                    <table className="w-full min-w-[560px] text-left">
                      <thead className="bg-[#28263d] text-[9px] font-extrabold uppercase text-outline/75">
                        <tr>
                          <th className="px-5 py-4">#</th>
                          <th className="px-5 py-4">Tên audio</th>
                          <th className="px-5 py-4">Tác giả</th>
                          <th className="px-5 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6">
                        {selectedAudios.map((audio, index) => (
                          <tr key={audio.id} className="group hover:bg-white/[0.055]">
                            <td className="px-5 py-4 text-[11px] font-bold text-white/62">{index + 1}</td>
                            <td className="px-5 py-4 text-[12px] font-extrabold text-white">{audio.title}</td>
                            <td className="px-5 py-4 text-[11px] font-semibold text-white/62">{audio.author}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => playAudio(audio, index)}
                                  className="flex h-8 items-center gap-1 rounded-lg bg-emerald-500/18 px-2.5 text-[10px] font-extrabold text-emerald-300 transition hover:bg-emerald-500/28"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                                  Phát
                                </button>
                                <button
                                  onClick={() => toggleAudioInPlaylist(selectedPlaylist.id, audio.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/60 transition hover:bg-red-500/18 hover:text-red-300"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {showCreateModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#12122a] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[14px] font-extrabold text-white">Tạo danh sách phát</h3>
              <button
                onClick={() => { setShowCreateModal(false); setNewName(""); }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <label className="mb-1 block text-[11px] font-bold text-white/72">
              Tên danh sách phát
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="VD: Truyện hay tháng 7"
              className="mb-4 h-10 w-full rounded-xl border border-white/10 bg-[#1d1b33] px-4 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-primary/45"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />

            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="h-10 w-full rounded-xl bg-white text-[12px] font-extrabold text-[#25005a] transition-transform active:scale-[0.98] disabled:opacity-50"
              type="button"
            >
              Tạo danh sách
            </button>
          </div>
        </div>
      )}
    </>
  );
}
