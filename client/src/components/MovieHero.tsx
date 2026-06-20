import { PlayIcon, TicketIcon, HeartIcon, ClockIcon, CalendarIcon, MapPinIcon, ArrowLeftIcon } from "lucide-react";
import timeFormat from "@/lib/timeFormat";
import { useNavigate } from "react-router-dom";

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
  trailerUrl?: string;
}

interface MovieHeroProps {
  movie: Movie;
  isFavorite: boolean;
  setIsFavorite: (val: boolean) => void;
  setShowTrailer: (val: boolean) => void;
}

const MovieHero = ({ movie, isFavorite, setIsFavorite, setShowTrailer }: MovieHeroProps) => {
  const navigate = useNavigate();
  return (
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
                    ? new Date(movie.release_date).toLocaleDateString(
                        "vi-VN",
                      )
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
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-xl transition-all duration-300"
              >
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
  );
};

export default MovieHero;
