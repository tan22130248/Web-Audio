import { useState, useRef, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import SideNavBar from './components/SideNavBar'
import TopNavBar from './components/TopNavBar'
import BottomNavBar from './components/BottomNavBar'
import BottomPlayer from './components/BottomPlayer'
import Home from './pages/Home'
import Premium from './pages/Premium'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import AdminAudio from './pages/AdminAudio'
import AdminAds from './pages/AdminAds'
import AdminPremium from './pages/AdminPremium'
import AdminFeedback from './pages/AdminFeedback'
import Profile from './pages/Profile'
import Support from './pages/Support'
import ForgotPassword from './pages/ForgotPassword'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Playlists from './pages/Playlists'
import StoryPlayerModal from './components/StoryPlayerModal'
import { useAdRequirement, shouldShowAds } from './hooks/useAdRequirement'
import toast from "react-hot-toast"
import { apiUrl } from "./config/api";

function AdminRouteGuard({ children }) {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  if (!token || (role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  return children;
}

function ProfileRouteGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const audioRef = { current: null };
  const currentTrackRef = useRef(null);
  const progressSaveTimerRef = useRef(0);
  const playlistQueueRef = useRef(null);
  const { pathname } = useLocation();
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  const isAdminRoute = pathname.startsWith('/admin');
  const hideAppShell = isAuthRoute || isAdminRoute;

  const [activeStory, setActiveStory] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [likedAudioIds, setLikedAudioIds] = useState(() => new Set());
  const [likesMap, setLikesMap] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [userPlanType, setUserPlanType] = useState("FREE");
  const [adLoading, setAdLoading] = useState(false);
  const { viewCount, requiredViews, isUnlocked, increment } = useAdRequirement();

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) refreshPlaylists(email);
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;
    fetch(apiUrl(`/api/audios/liked?email=${encodeURIComponent(email)}`))
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setLikedAudioIds(new Set(data.data));
        }
      })
      .catch(() => {});
  }, []);

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function handleAdWatch() {
    try {
      setAdLoading(true);
      const res = await fetch(apiUrl("/api/promotions/random"));
      const data = await res.json().catch(() => ({}));
      if (data?.success && data.data?.url) {
        window.open(data.data.url, "_blank", "noopener,noreferrer");
        increment();
      } else {
        toast.error(data?.message || "Không thể mở quảng cáo lúc này.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setAdLoading(false);
    }
  }

  function onPlayStory(story, playlistQueue) {
    if (shouldShowAds() && !isUnlocked) {
      handleAdWatch();
      return;
    }
    const audio = audioRef.current;
    if (!audio || !story?.audioUrl) return;
    if (currentTrack?.story?.audioUrl === story.audioUrl) {
      togglePlay();
      return;
    }
    if (playlistQueue) {
      playlistQueueRef.current = playlistQueue;
    }
    setCurrentTrack({ story, isPlaying: true, currentTime: "0:00", duration: "0:00" });
    setActiveStory(story);
    audio.src = story.audioUrl;
    audio.load();
    audio.play().catch(() => {});
    saveHistory(story);
    incrementView(story.id);
  }

  async function incrementView(audioId) {
    try {
      await fetch(apiUrl(`/api/audios/${audioId}/view`), { method: "POST" });
    } catch {
      // ignore view count errors
    }
  }

  function onSeek(percentage) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = (percentage / 100) * audio.duration;
  }

  async function incrementLike(audioId) {
    const email = localStorage.getItem("email");
    if (!email) return;
    try {
      const res = await fetch(apiUrl(`/api/audios/${audioId}/like`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setLikedAudioIds((prev) => {
          const next = new Set(prev);
          if (data.liked) {
            next.add(audioId);
          } else {
            next.delete(audioId);
          }
          return next;
        });
        setLikesMap((prev) => {
          const next = { ...prev };
          next[audioId] = data.likeCount;
          return next;
        });
      }
    } catch {
      // ignore like errors
    }
  }

  async function refreshPlaylists(signalEmail) {
    const email = signalEmail || localStorage.getItem("email");
    if (!email) return;
    try {
      const res = await fetch(apiUrl(`/api/playlists?email=${encodeURIComponent(email)}`));
      const data = await res.json().catch(() => ({}));
      if (data?.success && Array.isArray(data.data)) {
        setPlaylists(data.data);
        if (data.userPlanType) setUserPlanType(data.userPlanType);
      } else {
        setPlaylists([]);
      }
    } catch {
      setPlaylists([]);
    }
  }

  async function addToPlaylist(playlistId, audioId) {
    const email = localStorage.getItem("email");
    try {
      const res = await fetch(apiUrl(`/api/playlists/${playlistId}/audio/${audioId}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email }),
      });
      const data = await res.json().catch(() => ({}));
      return data;
    } catch {
      return { success: false };
    }
  }

  async function saveHistory(story) {
    const email = localStorage.getItem("email");
    if (!email || !story?.id) return;
    try {
      await fetch(apiUrl("/api/history"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          audioId: story.id,
          title: story.title,
          author: story.author,
          genre: story.genre,
          duration: story.duration,
          audioUrl: story.audioUrl,
          coverImageUrl: story.image,
        }),
      });
    } catch {
      // ignore history save errors
    }
  }

  async function saveProgress(story, currentTime, duration) {
    const email = localStorage.getItem("email");
    if (!email || !story?.id || !duration) return;
    const progress = Math.max(0, Math.min(100, Math.round((currentTime / duration) * 100)));
    try {
      await fetch(apiUrl("/api/history/progress"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          audioId: story.id,
          progress,
        }),
      });
    } catch {
      // ignore
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setCurrentTrack({ ...currentTrack, isPlaying: true });
    } else {
      audio.pause();
      setCurrentTrack({ ...currentTrack, isPlaying: false });
    }
  }

  function stopPlay() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setCurrentTrack(null);
    setActiveStory(null);
  }

  function attachAudio(audio) {
    audioRef.current = audio;
    const onTime = () => {
      if (!currentTrackRef.current) return;
      const ct = formatDuration(audio.currentTime);
      const dur = formatDuration(audio.duration);
      const prog = audio.duration && Number.isFinite(audio.duration) && audio.duration > 0
        ? (audio.currentTime / audio.duration) * 100
        : 0;
      setCurrentTrack((prev) => prev ? { ...prev, currentTime: ct, duration: dur, progress: prog } : null);

      const now = Date.now();
      if (now - progressSaveTimerRef.current > 3000) {
        progressSaveTimerRef.current = now;
        const story = currentTrackRef.current?.story;
        if (story) saveProgress(story, audio.currentTime, audio.duration);
      }
    };
    const onEnd = () => {
      setCurrentTrack((prev) => prev ? { ...prev, isPlaying: false, progress: 100 } : null);
      const story = currentTrackRef.current?.story;
      if (story) saveProgress(story, audio.duration || 0, audio.duration || 0);

      const queue = playlistQueueRef.current;
      if (queue && queue.audios.length > 0) {
        const nextIndex = queue.currentIndex + 1;
        if (nextIndex < queue.audios.length) {
          const nextAudio = queue.audios[nextIndex];
          const nextStory = {
            id: nextAudio.id,
            title: nextAudio.title,
            author: nextAudio.author,
            genre: nextAudio.genre,
            duration: nextAudio.duration || "0:00",
            image: nextAudio.coverImageUrl || "https://ui-avatars.com/api/?name=Audio&background=7c3aed&color=fff&size=256",
            audioUrl: nextAudio.audioUrl,
            viewCount: nextAudio.viewCount || 0,
            likeCount: nextAudio.likeCount || 0,
          };
          playlistQueueRef.current = { audios: queue.audios, currentIndex: nextIndex };
          setCurrentTrack({ story: nextStory, isPlaying: true, currentTime: "0:00", duration: "0:00" });
          setActiveStory(nextStory);
          audio.src = nextStory.audioUrl;
          audio.load();
          audio.play().catch(() => {});
          saveHistory(nextStory);
          incrementView(nextStory.id);
        } else {
          playlistQueueRef.current = null;
        }
      }
    };
    const onPause = () => {
      const story = currentTrackRef.current?.story;
      if (story) saveProgress(story, audio.currentTime, audio.duration);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("pause", onPause);
    };
  }

  const currentTrackWithProgress = currentTrack ? { ...currentTrack, progress: currentTrack.progress ?? 0 } : null;

  return (
    <div className="text-on-surface font-body-lg overflow-x-hidden">
      {!hideAppShell && <TopNavBar onSearchSelect={onPlayStory} />}
      {!hideAppShell && <SideNavBar />}

      <Routes>
        <Route path="/" element={<Home activeStory={activeStory} onActiveStoryChange={setActiveStory} onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} onSeek={onSeek} onLike={incrementLike} likesMap={likesMap} likedAudioIds={likedAudioIds} playlists={playlists} refreshPlaylists={refreshPlaylists} addToPlaylist={addToPlaylist} userPlanType={userPlanType} adViewCount={viewCount} adRequiredViews={requiredViews} adIsUnlocked={isUnlocked} onAdWatch={handleAdWatch} adLoading={adLoading} />} />
        <Route path="/home" element={<Home activeStory={activeStory} onActiveStoryChange={setActiveStory} onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} onSeek={onSeek} onLike={incrementLike} likesMap={likesMap} likedAudioIds={likedAudioIds} playlists={playlists} refreshPlaylists={refreshPlaylists} addToPlaylist={addToPlaylist} userPlanType={userPlanType} adViewCount={viewCount} adRequiredViews={requiredViews} adIsUnlocked={isUnlocked} onAdWatch={handleAdWatch} adLoading={adLoading} />} />
        <Route path="/explore" element={<Home activeStory={activeStory} onActiveStoryChange={setActiveStory} onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} onSeek={onSeek} onLike={incrementLike} likesMap={likesMap} likedAudioIds={likedAudioIds} playlists={playlists} refreshPlaylists={refreshPlaylists} addToPlaylist={addToPlaylist} userPlanType={userPlanType} adViewCount={viewCount} adRequiredViews={requiredViews} adIsUnlocked={isUnlocked} onAdWatch={handleAdWatch} adLoading={adLoading} />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/history" element={<History onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} />} />
        <Route path="/favorites" element={<Favorites onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} />} />
        <Route path="/playlists" element={<Playlists playlists={playlists} refreshPlaylists={refreshPlaylists} onPlayStory={onPlayStory} currentTrack={currentTrackWithProgress} onTogglePlay={togglePlay} onSeek={onSeek} userPlanType={userPlanType} />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/register" element={<Auth initialMode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileRouteGuard><Profile /></ProfileRouteGuard>} />
        <Route path="/support" element={<ProfileRouteGuard><Support /></ProfileRouteGuard>} />
        <Route path="/admin" element={<AdminRouteGuard><Admin /></AdminRouteGuard>} />
        <Route path="/admin/audios" element={<AdminRouteGuard><AdminAudio /></AdminRouteGuard>} />
        <Route path="/admin/ads" element={<AdminRouteGuard><AdminAds /></AdminRouteGuard>} />
        <Route path="/admin/premium-registrations" element={<AdminRouteGuard><AdminPremium /></AdminRouteGuard>} />
        <Route path="/admin/feedbacks" element={<AdminRouteGuard><AdminFeedback /></AdminRouteGuard>} />
      </Routes>

      {!hideAppShell && <BottomNavBar />}
      {!hideAppShell && (
        <BottomPlayer
          currentTrack={currentTrackWithProgress}
          onTogglePlay={togglePlay}
          onStop={stopPlay}
          onOpenStory={() => currentTrack && setActiveStory(currentTrack.story)}
          onSeek={onSeek}
        />
      )}

      <audio ref={attachAudio} className="hidden" preload="metadata" />

      {activeStory && (
        <StoryPlayerModal
          story={activeStory}
          isPlaying={currentTrack?.isPlaying}
          currentTime={currentTrack?.currentTime}
          duration={currentTrack?.duration}
          progress={currentTrack?.progress}
          likeCount={likesMap && likesMap[activeStory.id] !== undefined ? likesMap[activeStory.id] : (activeStory.likeCount || 0)}
          liked={likedAudioIds.has(activeStory.id)}
          onLike={incrementLike}
          onTogglePlay={togglePlay}
          onClose={() => setActiveStory(null)}
          onSeek={onSeek}
        />
      )}
    </div>
  );
}

export default App
