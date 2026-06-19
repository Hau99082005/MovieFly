import { assets } from "@/assets/assets";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const bannerData = [
  {
    image: assets.bachXa,
    logo: assets.marvelLogo,
    title: "Bạch Xà",
    genres: "Hành động | Phiêu lưu | Fantasy",
    year: "2026",
    duration: "2h 15m",
  },
  {
    image: assets.doraemon,
    logo: assets.marvelLogo,
    title: "Doraemon",
    genres: "Hoạt hình | Gia đình | Phiêu lưu",
    year: "2026",
    duration: "1h 50m",
  },
  {
    image: assets.maXo,
    logo: assets.marvelLogo,
    title: "Ma Xó",
    genres: "Hành động | Tình cảm | Kinh dị",
    year: "2026",
    duration: "2h 30m",
  },
  {
    image: assets.ocMuonHon,
    logo: assets.marvelLogo,
    title: "Ốc Mượn Hồn",
    genres: "Hài | Tình cảm | Hoạt hình",
    year: "2026",
    duration: "1h 45m",
  },
];

const DURATION = 6000;

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goTo((current + 1) % bannerData.length);
    }, DURATION);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current]);

  const goTo = (idx: number) => {
    if (isAnimating.current || idx === current) return;
    isAnimating.current = true;
    setPrev(current);
    setCurrent(idx);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      setPrev(null);
      isAnimating.current = false;
    }, 800);
  };

  return (
    <div className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-black">
      <style>{`
        @keyframes kenburns {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-15px); }
        }
        @keyframes slideInRight {
          0%   { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          0%   { transform: translateX(0);     opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes fadeUp {
          0%   { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .anim-kenburns {
          animation: kenburns ${DURATION}ms ease-in-out forwards;
        }
        .anim-slide-in {
          animation: slideInRight 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .anim-slide-out {
          animation: slideOutLeft 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .anim-fade-up-1 {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.15s;
        }
        .anim-fade-up-2 {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.3s;
        }
        .anim-fade-up-3 {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.45s;
        }
        .anim-fade-up-4 {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.6s;
        }
        .anim-fade-in {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards 0.1s;
        }
      `}</style>

      {bannerData.map((item, idx) => {
        const isActive = idx === current;
        const isLeaving = idx === prev;
        if (!isActive && !isLeaving) return null;
        return (
          <div
            key={idx}
            className={`absolute inset-0 ${isActive ? "anim-slide-in z-10" : "anim-slide-out z-0"}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                key={animKey}
                src={item.image}
                alt={item.title}
                className={`w-full h-full object-cover object-center ${isActive ? "anim-kenburns" : ""}`}
                style={{ transformOrigin: "center center" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </div>
        );
      })}

      <div
        key={`content-${current}`}
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-5 sm:px-10 md:px-16 lg:px-20 pb-8 sm:pb-10 pointer-events-none z-20"
      >
        <div className="max-w-lg mb-4 sm:mb-5">
          <img
            src={bannerData[current].logo}
            alt="studio logo"
            className="h-6 sm:h-7 md:h-9 mb-3 object-contain object-left anim-fade-up-1"
          />
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 sm:mb-3 drop-shadow-lg anim-fade-up-2">
            {bannerData[current].title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-300 anim-fade-up-3">
            <span>{bannerData[current].genres}</span>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{bannerData[current].year}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              <span>{bannerData[current].duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto anim-fade-up-4">
          {bannerData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                idx === current
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
