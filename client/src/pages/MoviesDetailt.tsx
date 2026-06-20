import { dummyCinemasData, dummyShowsData } from "@/assets/assets";
import DateSelect from "@/components/DateSelect";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayIcon,
  TicketIcon,
  HeartIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import timeFormat from "@/lib/timeFormat";

interface Cast {
  name: string;
  profile_path: string;
}

interface Movie {
  _id: string;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  overview?: string;
  director?: string;
  casts?: Cast[];
}

interface Showtime {
  time: string;
  type: string;
  price: number;
}

interface Cinema {
  _id: string;
  name: string;
  address: string;
  showtimes: Record<string, Showtime[]>;
}

const MoviesDetailt = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string>(
    Object.keys(dummyCinemasData[0].showtimes)[0],
  );
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(
    dummyCinemasData[0]._id,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    skipSnaps: false,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const getMovie = () => {
    const foundMovie = dummyShowsData.find((s) => s._id === id);
    setMovie(foundMovie);
  };

  useEffect(() => {
    getMovie();
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedCinema = dummyCinemasData.find(
    (c) => c._id === selectedCinemaId,
  ) as Cinema;
  const showtimesForSelectedDate =
    selectedCinema?.showtimes[selectedDate] || [];

  return (
    <div className="min-h-screen">
      <div className="relative h-[85vh] overflow-hidden">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-transparent" />

        <div className="absolute top-28 left-6 md:left-16 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>

        <div className="absolute inset-0 flex items-end pb-20 pt-32 px-6 md:px-16 lg:px-24 xl:px-44">
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full">
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative rounded-xl overflow-hidden shadow-2xl w-64">
                <img
                  src={movie.poster_path || movie.backdrop_path}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-contain bg-zinc-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight">
                  {movie.title}
                </h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full border-2 transition-all duration-200 ${
                    isFavorite
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-white/50 text-white hover:border-white"
                  }`}
                >
                  <HeartIcon
                    className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <span>{timeFormat(movie.runtime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary" />
                  <span>2D, 3D, IMAX</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/30"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                <button className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-xl transition-all duration-300">
                  <PlayIcon className="w-5 h-5" />
                  Xem Trailer
                </button>
                <button className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dull text-black font-bold rounded-xl shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all duration-300 active:scale-95">
                  <TicketIcon className="w-5 h-5" />
                  Đặt Vé Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 px-6 md:px-16 lg:px-24 xl:px-44 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase mb-4">
                  Mô tả
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl font-black text-white uppercase">
                  Lịch chiếu
                </h2>

                <DateSelect
                  dateTime={selectedCinema.showtimes}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onBookNow={() => alert("Đặt vé thành công!")}
                />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm font-medium">
                      Chọn rạp
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCinemaId}
                        onChange={(e) => setSelectedCinemaId(e.target.value)}
                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white font-medium py-3 px-4 rounded-lg appearance-none cursor-pointer hover:border-primary transition-colors"
                      >
                        {dummyCinemasData.map((cinema) => (
                          <option key={cinema._id} value={cinema._id}>
                            {cinema.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {selectedCinema.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {selectedCinema.address}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {showtimesForSelectedDate.map((timeSlot, idx) => (
                        <button
                          key={idx}
                          className="flex flex-col items-center gap-1 px-3 py-3 bg-zinc-700 hover:bg-primary hover:text-black text-white font-medium rounded-lg transition-all duration-200 border border-transparent hover:border-primary"
                        >
                          <span className="text-base font-medium">
                            {new Date(timeSlot.time).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-xs text-gray-400">
                            {timeSlot.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {movie.casts && movie.casts.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-8">
                    <h2
                      className="text-2xl font-black text-white uppercase"
                      style={{
                        fontSize: "22px",
                        fontStyle: "normal",
                        lineHeight: 1.4,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Dàn diễn viên yêu thích của bạn
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={scrollPrev}
                        className="p-2 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous cast"
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={scrollNext}
                        className="p-2 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next cast"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6">
                      {movie.casts.slice(0, 12).map((cast, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 flex flex-col items-center text-center group min-w-[140px] md:min-w-[160px]"
                        >
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-primary rounded-full opacity-0 group-hover:opacity-20 scale-110 transition-all duration-300 blur-xl" />
                            <img
                              src={cast.profile_path}
                              alt={cast.name}
                              className="relative rounded-full h-24 md:h-32 aspect-square object-cover shadow-xl group-hover:scale-105 group-hover:shadow-primary/50 transition-all duration-400"
                            />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300" />
                          </div>
                          <p className="font-semibold text-sm text-gray-200 group-hover:text-primary transition-colors duration-300">
                            {cast.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="md:hidden mb-6">
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={movie.poster_path || movie.backdrop_path}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-contain bg-zinc-900"
                    />
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Thông tin phim
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Đạo diễn:</span>
                      <span className="text-white">
                        {movie.director || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diễn viên:</span>
                      <span className="text-white text-right">
                        {movie.casts
                          ?.slice(0, 3)
                          .map((c) => c.name)
                          .join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thời lượng:</span>
                      <span className="text-white">
                        {timeFormat(movie.runtime)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ngày phát hành:</span>
                      <span className="text-white">
                        {movie.release_date
                          ? new Date(movie.release_date).toLocaleDateString(
                              "vi-VN",
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đánh giá:</span>
                      <span className="text-white">
                        {movie.vote_average?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesDetailt;
