import { assets } from "@/assets/assets";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { bannersApi } from "@/lib/api";

interface BannerData {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  is_active: boolean;
  order: number;
}

const DURATION = 6000;

const Banner = () => {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);

  const loadBanners = async () => {
    try {
      const data = await bannersApi.getActive();

      if (
        data &&
        data.banners &&
        Array.isArray(data.banners) &&
        data.banners.length > 0
      ) {
        setBannerData(data.banners);
        setError(null);
      } else {
        setError("No banners available. Please add banners from admin panel.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load banners";
      setError("Failed to connect to server: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goTo((current + 1) % bannerData.length);
    }, DURATION);
  };

  useEffect(() => {
    if (!isLoading && bannerData.length > 0) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [current, isLoading, bannerData.length]);

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

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || bannerData.length === 0) {
    return (
      <div className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">
            No Banners Available
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            {error ||
              "There are no active banners to display. Please add some banners."}
          </p>
          <button
            onClick={loadBanners}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull text-black font-semibold rounded-full transition-all duration-200 active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-black">
      <style>
        {`
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
        `}
      </style>

      {bannerData.map((item, idx) => {
        const isActive = idx === current;
        const isLeaving = idx === prev;
        if (!isActive && !isLeaving) return null;

        return (
          <div
            key={item._id}
            className={
              "absolute inset-0 " +
              (isActive ? "anim-slide-in z-10" : "anim-slide-out z-0")
            }
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                key={animKey}
                src={item.image_url}
                alt={item.title}
                className={
                  "w-full h-full object-cover object-center " +
                  (isActive ? "anim-kenburns" : "")
                }
                style={{ transformOrigin: "center center" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          </div>
        );
      })}

      <div
        key={"content-" + current}
        className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-5 sm:px-10 md:px-16 lg:px-20 pb-8 sm:pb-10 pointer-events-none z-20"
      >
        <div className="max-w-lg mb-4 sm:mb-5">
          <img
            src={assets.marvelLogo}
            alt="studio logo"
            className="h-6 sm:h-7 md:h-9 mb-3 object-contain object-left anim-fade-up-1"
          />
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm md:text-base text-gray-300 anim-fade-up-3">
            <span
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "36px",
                fontWeight: 700,
                fontStyle: "Bold",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              {bannerData[current].description}
            </span>
          </div>
          <button
            onClick={() => navigate(bannerData[current].link || "/movies")}
            className="pointer-events-auto mt-5 sm:mt-6 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary hover:bg-primary-dull active:scale-95 transition-all duration-200 rounded-full font-semibold text-black cursor-pointer anim-fade-up-4"
          >
            Khám phá xem phim <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto anim-fade-up-4">
          {bannerData.map((_, idx) => {
            const isCurrentSlide = idx === current;
            const baseClasses =
              "rounded-full transition-all duration-300 cursor-pointer p-1.5 focus:outline-none focus:ring-2 focus:ring-primary ";
            const sizeClasses = isCurrentSlide
              ? "w-8 h-3 bg-primary"
              : "w-3 h-3 bg-white/40 hover:bg-white/60";

            return (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                aria-label={"Go to slide " + (idx + 1)}
                className={baseClasses + sizeClasses}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Banner;
