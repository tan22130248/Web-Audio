import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config/api";

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

export default function Favorites({ onPlayStory, currentTrack, onTogglePlay }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setLoading(false);
      return;
    }
    fetch(apiUrl(`/api/favorites?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setFavorites(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stories = favorites.map(mapAudioToStory);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
        <p className="text-[11px] font-extrabold text-white/58">Đang tải...</p>
      </main>
    );
  }

  return (
    <main className="w-full px-4 pb-28 pt-[4.9rem] text-white md:pl-44 md:pr-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-6 font-headline-md text-[19px] leading-6 text-white">Yêu thích</h1>

        {stories.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-white/25">favorite</span>
            <p className="mt-3 text-[12px] font-semibold text-white/58">Bạn chưa yêu thích audio nào.</p>
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
                    onClick={() => onPlayStory && onPlayStory(story)}
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
                    <div className="mb-1 flex items-center gap-1 text-[9px] font-bold text-white/55">
                      <span className="material-symbols-outlined text-[11px]">visibility</span>
                      <span>{(story.viewCount || 0).toLocaleString("vi-VN")} người xem</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-white/55">
                      <span className="material-symbols-outlined text-[11px]">favorite</span>
                      <span>{(story.likeCount || 0).toLocaleString("vi-VN")} lượt thích</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
