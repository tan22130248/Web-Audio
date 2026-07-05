import { Link } from "react-router-dom";

export default function BottomNavBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around rounded-t-xl border-t border-white/10 bg-[#0b0b1f]/95 shadow-2xl backdrop-blur-xl">
      <Link to="/" className="flex flex-col items-center justify-center text-white">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        <span className="font-label-bold text-[10px]">Trang chủ</span>
      </Link>

      <Link to="/explore" className="flex flex-col items-center justify-center text-white/65">
        <span className="material-symbols-outlined">search</span>
        <span className="font-label-bold text-[10px]">Khám phá</span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center justify-center text-white/65">
        <span className="material-symbols-outlined">person</span>
        <span className="font-label-bold text-[10px]">Cá nhân</span>
      </Link>
    </nav>
  );
}
