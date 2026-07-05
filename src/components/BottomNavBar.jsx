import { Link } from "react-router-dom";

export default function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 shadow-lg rounded-t-xl">
      <Link to="/" className="flex flex-col items-center justify-center text-primary">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-label-bold text-[10px]">Trang chủ</span>
      </Link>

      <Link to="/explore" className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined">search</span>
        <span className="font-label-bold text-[10px]">Khám phá</span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant">
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-bold text-[10px]">Cá nhân</span>
      </Link>
    </nav>
  );
}
