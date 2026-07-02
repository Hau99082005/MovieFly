import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayIcon, PlusIcon, CheckIcon, StarIcon, ClockIcon, CalendarIcon, GlobeIcon, ShareIcon } from "lucide-react";
import { moviesApi, movieGenresApi, movieCastApi } from "@/lib/api";

interface Movie {
  _id: string;
  title: string;
  original_title: string;
  synopsis: string;
  tagline: string;
  poster_url: string;
  backdrop_url: string;
  trailer_url: string;
  release_date: string;
  duration_min: number;
  rating: number;
  imdb_score: number;
  country_code: string;
  language: string;
  view_count: number;
  is_featured: boolean;
  is_free: boolean;
}

interface Genre {
  _id: string;
  name: string;
}

interface Cast {
  _id: string;
  personId: {
    _id: string;
    name: string;
    avatar_url: string;
  };
  role: string;
  character_name?: string;
}

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const loadMovieDetails = async () => {
    if (!id) return;

    try {
      const [movieRes, genresRes, castRes] = await Promise.all([
        moviesApi.getById(id),
        movieGenresApi.getByMovieId(id),
        movieCastApi.getByMovieId(id).catch(() => ({ data: [] })),
      ]);

      if (movieRes?.data) {
        setMovie(movieRes.data as Movie);
      }

      if (genresRes?.data && Array.isArray(genresRes.data)) {
        const extractedGenres = genresRes.data
          .map((item: any) => item.genreId)
          .filter((g: any) => g && g._id && g.name);
        setGenres(extractedGenres);
      }

      if (castRes?.data && Array.isArray(castRes.data)) {
        const validCast = castRes.data.filter((item: any) => item && item.personId && item.personId._id);
        setCast(validCast);
      }
    } catch (err) {
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy phim!</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-black font-semibold rounded-full hover:bg-primary-dull transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const releaseYear = new Date(movie.release_date).getFullYear();
  const formattedDuration = movie.duration_min > 0 ? `${Math.floor(movie.duration_min / 60)}h ${movie.duration_min % 60}m` : "N/A";

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh]">
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
              <div className="flex-shrink-0 hidden md:block">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-48 lg:w-64 rounded-lg shadow-2xl object-cover"
                />
              </div>

              <div className="flex-1 space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
                    {movie.title}
                  </h1>
                  {movie.original_title !== movie.title && (
                    <p className="text-lg sm:text-xl text-gray-300 italic">
                      {movie.original_title}
                    </p>
                  )}
                </div>

                {movie.tagline && (
                  <p className="text-base sm:text-lg text-gray-300 italic max-w-3xl">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base">
                  {movie.rating > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-yellow-500/30">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold">
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {movie.imdb_score > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full">
                      <span className="text-yellow-400 font-bold">IMDb</span>
                      <span className="text-white font-semibold">{movie.imdb_score.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-300">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{releaseYear}</span>
                  </div>

                  {movie.duration_min > 0 && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{formattedDuration}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-300">
                    <GlobeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{movie.country_code.toUpperCase()}</span>
                  </div>
                </div>

                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {genres.slice(0, 5).map((genre) => (
                      <span
                        key={genre._id}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dull text-black font-bold rounded-full shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-200 active:scale-95 text-sm sm:text-base"
                  >
                    <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                    Xem ngay
                  </button>

                  <button
                    onClick={() => setIsInWatchlist(!isInWatchlist)}
                    className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-full border border-white/30 transition-all duration-200 active:scale-95 text-sm sm:text-base"
                  >
                    {isInWatchlist ? (
                      <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                    {isInWatchlist ? "Đã lưu" : "Danh sách"}
                  </button>

                  <button
                    className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full border border-white/30 transition-all duration-200 active:scale-95"
                    aria-label="Share"
                  >
                    <ShareIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-1 h-8 bg-primary rounded-full" />
                Nội dung phim
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            {cast.length > 0 && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  Diễn viên & Ekip
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {cast.slice(0, 10).map((member) => (
                    <div key={member._id} className="group cursor-pointer">
                      <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-lg bg-gray-800">
                        <img
                          src={member.personId.avatar_url}
                          alt={member.personId.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {member.personId.name}
                      </h3>
                      <p className="text-gray-400 text-xs line-clamp-1">
                        {member.character_name || member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Thông tin</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Lượt xem</p>
                  <p className="text-white font-semibold">{movie.view_count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Ngôn ngữ</p>
                  <p className="text-white font-semibold">{movie.language.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Trạng thái</p>
                  <div className="flex gap-2">
                    {movie.is_free && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                        Miễn phí
                      </span>
                    )}
                    {movie.is_featured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
                        Nổi bật
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white hover:text-primary transition-colors z-10"
          >
            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full max-w-6xl mx-4 sm:mx-8 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            {movie.trailer_url && (
              <video
                className="w-full h-full"
                src={movie.trailer_url}
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
