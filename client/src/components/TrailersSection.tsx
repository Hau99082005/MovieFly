import { useState, useEffect, useRef } from "react";
import { PlayIcon } from "lucide-react";
import { moviesApi } from "@/lib/api";

interface Movie {
  _id: string;
  title: string;
  trailer_url: string;
  poster_url: string;
}

const SLIDE_DURATION = 6000;

const TrailersSection = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimating = useRef(false);

  const loadMovies = async () => {
    try {
      const response = await moviesApi.getAll({ limit: 10 });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const moviesWithTrailers = response.data.filter((m: Movie) => m.trailer_url);
        setMovies(moviesWithTrailers);
      }
    } catch (err) {
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const goTo = (idx: number) => {
    if (isAnimating.current || idx === currentIdx || movies.length === 0) return;
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
    if (movies.length === 0) return;
    intervalRef.current = setInterval(() => {
      if (!isPlaying) {
        goTo((currentIdx + 1) % movies.length);
      }
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    if (movies.length > 0) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIdx, isPlaying, movies.length]);

  if (isLoading) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="px-6 md:px-16 lg:px-24 xl:px-44">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="px-6 md:px-16 lg:px-24 xl:px-44">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">No trailers available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <div className="w-1 h-6 sm:h-7 rounded-full bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
            Trailers
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-8 xl:col-span-9">
            <div
              className="relative w-full overflow-hidden bg-zinc-900 rounded-lg shadow-2xl"
              style={{ paddingTop: "56.25%" }}
            >
              {movies.map((movie, idx) => {
                const isActive = idx === currentIdx;
                const isLeaving = idx === prevIdx;
                if (!isActive && !isLeaving) return null;

                return (
                  <div
                    key={movie._id}
                    className="absolute inset-0 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: "translateX(" + ((idx - currentIdx) * 100) + "%)",
                    }}
                  >
                    {isPlaying && isActive ? (
                      <video
                        className="w-full h-full object-contain bg-black"
                        src={movie.trailer_url}
                        controls
                        autoPlay
                        onEnded={() => setIsPlaying(false)}
                      />
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        <img
                          key={animKey}
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        {isActive && (
                          <button
                            onClick={() => setIsPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                            aria-label="Play trailer"
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/20 animate-ping" />
                              <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 animate-pulse" />
                              <div className="relative z-10 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/50 backdrop-blur-sm group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                                <PlayIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white ml-1" />
                              </div>
                            </div>
                          </button>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none">
                          <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg line-clamp-2">
                            {movie.title}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                {currentIdx + 1} / {movies.length}
              </span>
              <div className="flex gap-2 sm:gap-3">
                {movies.map((_, idx) => {
                  const isActive = idx === currentIdx;
                  const baseClasses = "rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ";
                  const sizeClasses = isActive ? "w-6 sm:w-8 h-2 sm:h-3 bg-primary" : "w-2 sm:w-3 h-2 sm:h-3 bg-white/30 hover:bg-white/60";
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      aria-label={"Go to trailer " + (idx + 1)}
                      className={baseClasses + sizeClasses}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-1 gap-3 sm:gap-4">
              {movies.map((movie, idx) => {
                const isActive = idx === currentIdx;
                const activeClasses = isActive
                  ? "ring-2 ring-primary shadow-[0_0_20px_rgba(0,212,255,0.25)]"
                  : "opacity-60 hover:opacity-100";

                return (
                  <button
                    key={movie._id}
                    onClick={() => goTo(idx)}
                    aria-label={"Select trailer " + (idx + 1)}
                    className={
                      "group relative overflow-hidden rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary bg-black " +
                      activeClasses
                    }
                  >
                    <div className="relative w-full aspect-[16/9] lg:aspect-video">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={
                          "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 " +
                          (isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                        }
                      >
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 animate-ping" />
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/40 backdrop-blur-sm shadow-[0_0_16px_rgba(0,212,255,0.4)] group-hover:border-primary/80 group-hover:bg-primary/20 transition-all duration-200">
                            <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 sm:px-2.5 sm:py-2 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span
                            className={
                              "text-xs font-bold tabular-nums flex-shrink-0 " +
                              (isActive ? "text-primary" : "text-gray-400")
                            }
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs text-gray-200 truncate font-medium">
                            {movie.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute left-0 inset-y-0 w-1 bg-primary rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrailersSection;
