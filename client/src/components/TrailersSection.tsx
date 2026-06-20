import { useState, useEffect, useRef } from "react";
import { dummyTrailers } from "@/assets/assets";
import { PlayIcon } from "lucide-react";

const SLIDE_DURATION = 6000;

const TrailersSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  const goTo = (idx: number) => {
    if (isAnimating.current || idx === currentIdx) return;
    isAnimating.current = true;
    setPrevIdx(currentIdx);
    setCurrentIdx(idx);
    setIsPlaying(false);
    setAnimKey((k) => k + 1);
    setTimeout(() => {
      setPrevIdx(null);
      isAnimating.current = false;
    }, 700);
  };

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPlaying) {
        goTo((currentIdx + 1) % dummyTrailers.length);
      }
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIdx, isPlaying]);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="px-6 md:px-16 lg:px-24 xl:px-44">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-7 rounded-full bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <h2
            className="text-2xl font-bold text-white tracking-wide"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "32px",
              fontWeight: "bolder",
              fontStyle: "normal",
              lineHeight: 1.6,
              letterSpacing: "0.01em",
            }}
          >
            Trailers
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:items-stretch">
          <div className="flex-1 min-w-0 flex flex-col">
            <div
              className="relative w-full overflow-hidden bg-zinc-900"
              style={{ paddingTop: "56.25%" }}
            >
              {dummyTrailers.map((trailer, idx) => {
                const id = getYoutubeId(trailer.videoUrl);
                const isActive = idx === currentIdx;
                const isLeaving = idx === prevIdx;
                if (!isActive && !isLeaving) return null;
                return (
                  <div
                    key={idx}
                    className="absolute inset-0 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(${(idx - currentIdx) * 100}%)`,
                    }}
                  >
                    {isPlaying && isActive && id ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
                        title="Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          key={animKey}
                          src={
                            id
                              ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
                              : trailer.image
                          }
                          alt="Trailer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        {isActive && (
                          <button
                            onClick={() => setIsPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                            aria-label="Play trailer"
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="absolute w-24 h-24 rounded-full bg-primary/20 animate-ping" />
                              <div className="absolute w-20 h-20 rounded-full bg-primary/10 animate-pulse" />
                              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border-2 border-white/50 backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                                <PlayIcon className="w-7 h-7 text-white fill-white ml-1" />
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mt-4 px-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                {currentIdx + 1} / {dummyTrailers.length}
              </span>
              <div className="flex gap-1.5">
                {dummyTrailers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-0.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIdx
                        ? "w-6 bg-primary"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-0 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-hidden pb-1 lg:pb-0 lg:w-56 xl:w-64 flex-shrink-0 lg:self-stretch">
            {dummyTrailers.map((trailer, idx) => {
              const id = getYoutubeId(trailer.videoUrl);
              const isActive = idx === currentIdx;
              return (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`group relative flex-1 overflow-hidden transition-all duration-200
                    ${
                      isActive
                        ? "ring-2 ring-inset ring-primary shadow-[0_0_20px_rgba(0,212,255,0.25)]"
                        : "opacity-50 hover:opacity-90"
                    }`}
                  style={{ minWidth: 130 }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={
                        id
                          ? `https://img.youtube.com/vi/${id}/mqdefault.jpg`
                          : trailer.image
                      }
                      alt={`Trailer ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-14 h-14 rounded-full bg-primary/20 animate-ping" />
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/40 backdrop-blur-sm shadow-[0_0_16px_rgba(0,212,255,0.4)] group-hover:border-primary/80 group-hover:bg-primary/20 transition-all duration-200">
                          <PlayIcon className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 px-2.5 py-1.5 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
                      <span
                        className={`text-xs font-bold tabular-nums ${isActive ? "text-primary" : "text-gray-400"}`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-gray-200 truncate">
                        Trailer {idx + 1}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute left-0 inset-y-0 w-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrailersSection;
