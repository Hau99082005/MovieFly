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
  trailerUrl?: string;
}

interface MovieInfoSidebarProps {
  movie: Movie;
}

const MovieInfoSidebar = ({ movie }: MovieInfoSidebarProps) => {
  return (
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
  );
};

export default MovieInfoSidebar;
