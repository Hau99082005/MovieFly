import { useNavigate } from "react-router-dom";
import { StarIcon, TicketIcon } from "lucide-react";
import timeFormat from "@/lib/timeFormat";

interface Movie {
  _id: string;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  release_date?: string;
  runtime?: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900 border border-white/5
        hover:border-primary/40 hover:shadow-[0_0_24px_rgba(0,212,255,0.15)] hover:-translate-y-2
        transition-all duration-300 cursor-pointer w-56 sm:w-60 flex-shrink-0"
      onClick={() => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={movie.backdrop_path}
          alt={movie.title}
          className="w-full h-52 object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">
            {movie.vote_average?.toFixed(1) ?? "N/A"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3">
        <p className="font-semibold text-white text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {movie.title} 
        </p>

        <p className="text-xs text-gray-400 line-clamp-1">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
          {movie.genres?.length
            ? " · " +
              movie.genres
                .slice(0, 2)
                .map((g) => g.name)
                .join(" | ")
            : ""}
          {timeFormat(movie.runtime)}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg
            bg-primary/15 hover:bg-primary text-primary hover:text-black
            text-xs font-semibold border border-primary/30 hover:border-primary
            transition-all duration-200 active:scale-95"
        >
          <TicketIcon className="w-3.5 h-3.5" />
          Mua vé
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
