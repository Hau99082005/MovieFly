import { useNavigate } from "react-router-dom";
import { StarIcon, TicketIcon, PlayIcon, XIcon } from "lucide-react";
import { useState } from "react";

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

interface Movie {
  _id: string;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  release_date?: string;
  runtime?: number;
  trailerUrl?: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
    <div
      className="group relative flex flex-col overflow-hidden cursor-pointer w-full"
      onClick={() => {
        navigate(`/movies/${movie._id}`);
        scrollTo(0, 0);
      }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-none">
        <img
          src={movie.poster_path || movie.backdrop_path}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">
            {movie.vote_average?.toFixed(1) ?? "N/A"}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.4)] group-hover:scale-110 group-hover:bg-primary transition-all duration-400">
              <PlayIcon className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 pt-4">
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            fontStyle: "normal",
            lineHeight: 1.4,
            letterSpacing: "0.01em",
          }}
          className="font-bold text-white text-sm text-center leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200"
        >
          {movie.title}
        </h3>

        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {movie.genres?.slice(0, 2).map((g) => (
            <span
              key={g.id}
              className="text-[10px] font-medium text-gray-400 uppercase tracking-wider"
              style={{
                fontSize: "14px",
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-4 w-full">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTrailer(true);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded
            bg-zinc-800 hover:bg-zinc-700 text-white
            text-xs font-bold uppercase tracking-wide
            transition-all duration-200"
          style={{
            fontSize: "12px",
            fontWeight: "600",
            fontStyle: "normal",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
          }}
        >
          <PlayIcon className="w-4.5 h-4" />
          Xem Trailer
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded
            bg-primary hover:bg-primary-dull text-black
            text-xs font-bold uppercase tracking-wide
            shadow-[0_0_15px_rgba(0,212,255,0.4)]
            transition-all duration-200 active:scale-95"
          style={{
            fontSize: "12px",
            fontWeight: "600",
            fontStyle: "normal",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
          }}
        >
          <TicketIcon className="w-4.5 h-4" />
          Đặt Vé Ngay
        </button>
      </div>
      {showTrailer && movie?.trailerUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
          >
            <XIcon className="w-8 h-8" />
          </button>
          <div className="w-full max-w-5xl mx-4 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            {(() => {
              const youtubeId = getYoutubeId(movie.trailerUrl);
              if (youtubeId) {
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title="Trailer"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default MovieCard;
