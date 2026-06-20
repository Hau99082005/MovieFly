import { useState } from "react";
import { dummyShowsData, dummyCinemasData } from "@/assets/assets";
import BlurCircle from "@/components/BlurCircle";
import { StarIcon, MapPinIcon, CalendarIcon, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";

const generateDateRange = () => {
  return [
    { value: "2025-07-24", label: "Hôm Nay" },
    { value: "2025-07-25", label: "Ngày mai" },
    { value: "2025-07-26", label: "26/07" },
    { value: "2025-07-27", label: "27/07" },
  ];
};

const Schedule = () => {
  const navigate = useNavigate();
  const dates = generateDateRange();
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedMovie, setSelectedMovie] = useState("all");
  const [selectedCinema, setSelectedCinema] = useState("all");

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredCinemas = dummyCinemasData.filter((cinema) => {
    if (selectedCinema !== "all" && cinema._id !== selectedCinema) return false;
    return true;
  });

  return (
    <section className="relative py-20 overflow-hidden min-h-[90vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.1)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <BlurCircle top="-40px" right="-60px" />
        <BlurCircle top="400px" left="-80px" />
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-primary to-transparent" />
            <h2
              className="text-2xl md:text-3xl font-bold text-white"
              style={{
                fontSize: "28px",
                fontStyle: "normal",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              Lịch chiếu phim
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <span className="text-primary font-semibold text-sm md:text-base">Ngày</span>
                <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-primary ml-auto shrink-0" />
              </div>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-lg px-3 py-2.5 md:py-3 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
              >
                {dates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Movie Selector */}
            <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <span className="text-primary font-semibold text-sm md:text-base">Phim</span>
                <Film className="w-5 h-5 md:w-6 md:h-6 text-primary ml-auto shrink-0" />
              </div>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-lg px-3 py-2.5 md:py-3 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
              >
                <option value="all">Tất cả phim</option>
                {dummyShowsData.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Cinema Selector */}
            <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">3</span>
                </div>
                <span className="text-primary font-semibold text-sm md:text-base">Rạp</span>
                <MapPinIcon className="w-5 h-5 md:w-6 md:h-6 text-primary ml-auto shrink-0" />
              </div>
              <select
                value={selectedCinema}
                onChange={(e) => setSelectedCinema(e.target.value)}
                className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-lg px-3 py-2.5 md:py-3 focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
              >
                <option value="all">Tất cả rạp</option>
                {dummyCinemasData.map((cinema) => (
                  <option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent mb-8" />

        {/* Showtimes List */}
        <div className="space-y-6">
          {filteredCinemas.map((cinema) => {
            const moviesToShow =
              selectedMovie !== "all"
                ? dummyShowsData.filter((m) => m._id === selectedMovie)
                : dummyShowsData;

            return (
              <div key={cinema._id} className="space-y-5">
                {moviesToShow.map((movie) => {
                  // Fix type error for showtimes
                  const showtimes = (cinema.showtimes as any)[selectedDate];
                  if (!showtimes || showtimes.length === 0) return null;

                  return (
                    <div
                      key={movie._id}
                      className="flex flex-col md:flex-row gap-5 bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-zinc-600 hover:shadow-lg"
                    >
                      {/* Movie Poster & Info */}
                      <div className="flex-shrink-0">
                        <img
                          src={movie.poster_path || movie.backdrop_path}
                          alt={movie.title}
                          className="w-36 h-52 object-cover rounded-lg shadow-xl"
                        />
                        <div className="mt-3">
                          <h3 className="text-white font-bold text-sm md:text-base line-clamp-2">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{movie.vote_average?.toFixed(1)}</span>
                            <span>•</span>
                            <span>{movie.runtime} phút</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {movie.genres?.slice(0, 2).map((g) => (
                              <span
                                key={g.id}
                                className="text-[10px] px-2 py-0.5 bg-zinc-700 text-gray-300 rounded-full"
                              >
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cinema & Showtimes */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400 uppercase tracking-wider">
                              Cinestar
                            </span>
                            <span className="text-xs text-zinc-600">•</span>
                            <span className="text-xs text-zinc-400 uppercase tracking-wider">
                              STANDARD
                            </span>
                          </div>
                          <h4 className="text-lg md:text-xl font-bold text-white mb-1">
                            {cinema.name}
                          </h4>
                          <p className="text-gray-400 text-xs md:text-sm">
                            {cinema.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {showtimes.map((showtime: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => {
                                navigate(
                                  `/movies/${movie._id}/${selectedDate}`,
                                );
                                scrollTo(0, 0);
                              }}
                              className="px-4 py-2 bg-zinc-800 hover:bg-primary hover:text-black text-white border border-zinc-700 hover:border-primary font-mono font-bold text-sm rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            >
                              {formatTime(showtime.time)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
