import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "/api/history";

function mapHistoryToStory(item) {
  return {
    id: item.audioId,
    title: item.title,
    author: item.author,
    genre: item.genre,
    duration: item.duration || "0:00",
    currentTime: "0:00",
    image: item.coverImageUrl || "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=256",
    audioUrl: item.audioUrl,
    listenedAt: item.listenedAt,
  };
}

export default function History({ onPlayStory, currentTrack: _currentTrack, onTogglePlay: _onTogglePlay }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setHistory(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    const email = localStorage.getItem("email");
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE}/${id}?email=${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // ignore
    }
  }

  async function handleClearAll() {
    const email = localStorage.getItem("email");
    if (!email) return;
    if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử nghe?")) return;
    try {
      const res = await fetch(`${API_BASE}?email=${encodeURIComponent(email)}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.success) {
        setHistory([]);
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
        <p className="text-[11px] font-extrabold text-white/58">Đang tải...</p>
      </main>
    );
  }

  const stories = history.map(mapHistoryToStory);

  return (
    <main className="w-full px-4 pb-28 pt-[4.9rem] text-white md:pl-44 md:pr-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-headline-md text-[19px] leading-6 text-white">Lịch sử nghe</h1>
          {stories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[10px] font-extrabold uppercase tracking-wide text-white/55 transition-colors hover:text-white"
              type="button"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {stories.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-white/25">history</span>
            <p className="mt-3 text-[12px] font-semibold text-white/58">Bạn chưa nghe audio nào.</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary-container px-4 py-2 text-[11px] font-extrabold text-white shadow-lg"
            >
              Khám phá ngay
            </Link>
          </section>
        ) : (
          <section className="mb-7">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stories.map((story) => (
                <div
                  className="group min-w-0 rounded-xl bg-white/[0.055] p-2 text-left ring-1 ring-white/10 transition-all hover:bg-white/[0.08] hover:ring-primary/35"
                  key={story.id}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => onPlayStory(story)}
                    type="button"
                  >
                    <div className="relative mb-2 aspect-square overflow-hidden rounded-lg shadow-md">
                      <img className="h-full w-full object-cover" src={story.image} alt={story.title} />
                      <div className="absolute top-1.5 left-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[8px] text-white backdrop-blur-md">
                        {story.duration}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full primary-gradient text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          play_arrow
                        </span>
                      </div>
                    </div>
                    <h3 className="line-clamp-1 text-[12px] font-extrabold leading-4 text-white group-hover:text-primary-fixed">{story.title}</h3>
                    <p className="mb-1 line-clamp-1 text-[10px] font-semibold text-white/62">{story.author}</p>
                    <p className="text-[9px] font-bold text-white/50">
                      {story.listenedAt ? new Date(story.listenedAt).toLocaleString("vi-VN") : ""}
                    </p>
                  </button>
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="text-[10px] font-bold text-white/50 transition-colors hover:text-error"
                      type="button"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
