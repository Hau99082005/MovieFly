import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayIcon,
  PlusIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  XIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  type: string;
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

interface Season {
  _id: string;
  seasonNumber: number;
  title: string;
}

interface Episode {
  _id: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  thumbnailUrl: string;
  durationSeconds: number;
  viewCount: number;
  releaseDate: string;
  isFree: boolean;
}

const MovieDetailMovieFly = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [directors, setDirectors] = useState<Cast[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadMovieDetails = async () => {
    if (!id) return;

    try {
      const [movieRes, genresRes, castRes] = await Promise.all([
        fetch(`${API_URL}/movies/${id}`).then((r) => r.json()),
        fetch(`${API_URL}/moviegenres/movie/${id}`).then((r) => r.json()),
        fetch(`${API_URL}/movie-cast/movie/${id}`)
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
      ]);

      if (movieRes?.data) {
        setMovie(movieRes.data as Movie);

        if (movieRes.data.type === "series") {
          const seasonsRes = await fetch(`${API_URL}/seasons/movie/${id}`).then(
            (r) => r.json(),
          );
          if (seasonsRes?.data && seasonsRes.data.length > 0) {
            setSeasons(seasonsRes.data);
            setSelectedSeason(seasonsRes.data[0]._id);

            const episodesRes = await fetch(
              `${API_URL}/episodes/season/${seasonsRes.data[0]._id}`,
            ).then((r) => r.json());
            if (episodesRes?.data) {
              setEpisodes(episodesRes.data);
            }
          }
        }

        const similarRes = await fetch(`${API_URL}/movies?limit=8`).then((r) =>
          r.json(),
        );
        if (similarRes?.data) {
          setSimilarMovies(similarRes.data.filter((m: Movie) => m._id !== id));
        }
      }

      if (genresRes?.data && Array.isArray(genresRes.data)) {
        const extractedGenres = genresRes.data
          .map((item: any) => item.genreId)
          .filter((g: any) => g && g._id && g.name);
        setGenres(extractedGenres);
      }

      if (castRes?.data && Array.isArray(castRes.data)) {
        const validCast = castRes.data.filter(
          (item: any) => item && item.personId && item.personId._id,
        );
        setCast(validCast.filter((c: Cast) => c.role === "actor"));
        setDirectors(validCast.filter((c: Cast) => c.role === "director"));
      }
    } catch (err) {
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEpisodesBySeason = async (seasonId: string) => {
    try {
      const episodesRes = await fetch(
        `${API_URL}/episodes/season/${seasonId}`,
      ).then((r) => r.json());
      if (episodesRes?.data) {
        setEpisodes(episodesRes.data);
      }
    } catch (err) {
      setEpisodes([]);
    }
  };

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  useEffect(() => {
    if (selectedSeason) {
      loadEpisodesBySeason(selectedSeason);
    }
  }, [selectedSeason]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-white mb-4">
            Không tìm thấy phim!
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-primary text-black font-semibold rounded hover:bg-primary-dull transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const releaseYear = new Date(movie.release_date).getFullYear();
  const formattedDuration =
    movie.duration_min > 0
      ? `${Math.floor(movie.duration_min / 60)}h ${movie.duration_min % 60}m`
      : "";

  const ageRating = "T16";
  const quality = "Full HD";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full h-screen">
        <div className="absolute inset-0">
          {movie.trailer_url ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={movie.trailer_url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
            />
          ) : (
            <img
              src={movie.backdrop_url}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-32 right-6 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
          <button
            onClick={toggleMute}
            className="text-white hover:text-primary transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeXIcon className="w-5 h-5" />
            ) : (
              <Volume2Icon className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider w-20"
            style={{
              background: `linear-gradient(to right, #00d4ff 0%, #00d4ff ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.4) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.4) 100%)`,
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1
              className="text-4xl md:text-6xl font-bold mb-2"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "36px",
                fontWeight: "700",
                fontStyle: "normal",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              {movie.title}
            </h1>
            {movie.tagline && (
              <p
                className="text-base md:text-lg text-gray-300 italic mb-4"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "18px",
                  fontWeight: "400",
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  letterSpacing: "0.01em",
                }}
              >
                {movie.tagline}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: 1.5,
                letterSpacing: "0.01em",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => movie.trailer_url && setShowTrailer(true)}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-all"
            >
              <PlayIcon className="w-6 h-6 fill-current" />
              Xem ngay
            </button>

            <button
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: 1.5,
                letterSpacing: "0.01em",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => setIsInWatchlist(!isInWatchlist)}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded border border-white/30 hover:bg-white/20 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Danh sách
            </button>
          </div>

          <div
            className="flex flex-wrap items-center gap-3 text-sm md:text-base mb-4"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "16px",
              fontWeight: "400",
              fontStyle: "normal",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            <span className="font-semibold">
              {movie.view_count.toLocaleString()} lượt xem
            </span>
            <span className="flex items-center gap-1">
              {movie.rating > 0 && (
                <>
                  <span className="font-bold">{movie.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(movie.rating / 2) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </span>
            <span className="px-2 py-1 border border-white/40 rounded text-xs font-semibold">
              {ageRating}
            </span>
            {releaseYear && <span>{releaseYear}</span>}
            <span>{movie.country_code.toUpperCase()}</span>
            {movie.type === "series" ? (
              <span>{seasons.length} Phần</span>
            ) : (
              formattedDuration && <span>{formattedDuration}</span>
            )}
            <span>{quality}</span>
          </div>

          <div
            className="flex flex-wrap items-center gap-6 text-sm"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "16px",
              fontWeight: "400",
              fontStyle: "normal",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex flex-col items-center gap-1 hover:text-primary transition-colors"
            >
              <HeartIcon
                className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
              <span
                className="text-xs"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                  fontStyle: "normal",
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}
              >
                49
              </span>
            </button>

            <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
              <ShareIcon className="w-6 h-6" />
              <span
                className="text-xs"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                  fontStyle: "normal",
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}
              >
                Chia sẻ
              </span>
            </button>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs md:text-sm text-gray-400 md:divide-x divide-gray-600"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              fontStyle: "normal",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            {cast.length > 0 && (
              <div className="flex flex-col md:pr-4">
                <span className="font-semibold text-white mb-1">
                  Diễn viên:
                </span>
                <span>
                  {cast
                    .slice(0, 3)
                    .map((c) => c.personId.name)
                    .join(", ")}
                </span>
              </div>
            )}
            {directors.length > 0 && (
              <div className="flex flex-col md:px-4">
                <span className="font-semibold text-white mb-1">Đạo diễn:</span>
                <span>{directors[0].personId.name}</span>
              </div>
            )}
            {genres.length > 0 && (
              <div className="flex flex-col md:pl-4">
                <span className="font-semibold text-white mb-1">Thể loại:</span>
                <span>{genres.map((g) => g.name).join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {movie.type === "series" && seasons.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl font-bold">Danh sách tập</h2>
              <span className="text-gray-400 text-sm">
                {episodes.length}/{episodes.length} tập
              </span>
            </div>

            {seasons.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {seasons.map((season) => (
                  <button
                    key={season._id}
                    onClick={() => setSelectedSeason(season._id)}
                    className={`px-4 py-2 rounded font-semibold whitespace-nowrap transition-colors ${
                      selectedSeason === season._id
                        ? "bg-primary text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Phần {season.seasonNumber}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {episodes.slice(0, 8).map((episode) => (
                <div
                  key={episode._id}
                  className="flex gap-4 p-4 bg-zinc-900/50 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => {}}
                >
                  <div className="relative w-32 md:w-48 flex-shrink-0">
                    <img
                      src={episode.thumbnailUrl}
                      alt={episode.title}
                      className="w-full aspect-video object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded hover:bg-black/20 transition-colors">
                      <PlayIcon className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-base mb-1">
                      Tập {episode.episodeNumber}. {episode.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="px-2 py-0.5 border border-white/40 rounded">
                        {ageRating}
                      </span>
                      <span>{quality}</span>
                      {episode.durationSeconds > 0 && (
                        <span>
                          {Math.floor(episode.durationSeconds / 60)}ph
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2">
                      {episode.synopsis}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {movie.trailer_url && (
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "24px",
                fontWeight: "700",
                fontStyle: "Bold",
                lineHeight: 1.6,
                letterSpacing: "0.02em",
              }}
            >
              Video liên quan
            </h2>
            <div
              className="relative w-full md:w-80 cursor-pointer group"
              onClick={() => setShowTrailer(true)}
            >
              <img
                src={movie.poster_url}
                alt="Trailer"
                className="w-full aspect-video object-cover rounded-none"
                style={{
                  borderRadius: "5px",
                }}
              />
              <div className="absolute bottom-12 inset-0 flex items-center justify-center">
                <PlayIcon className="w-10 h-10 text-white fill-white" />
              </div>
              <div className="mt-2">
                <h3
                  className="font-bold text-sm"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontStyle: "Bold",
                    lineHeight: 1.6,
                    letterSpacing: "0.02em",
                  }}
                >
                  Trailer: {movie.title}
                </h3>
                <div
                  className="flex items-center gap-2 text-xs text-gray-400 mt-1"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    fontWeight: "600",
                    fontStyle: "Bold",
                    lineHeight: 1.6,
                    letterSpacing: "0.02em",
                  }}
                >
                  <span className="px-2 py-0.5 border border-white/40 rounded">
                    {ageRating}
                  </span>
                  <span>{quality}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {similarMovies.length > 0 && (
          <div>
            <h2
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "24px",
                fontWeight: "700",
                fontStyle: "Bold",
                lineHeight: 1.6,
                letterSpacing: "0.02em",
              }}
            >
              Đề xuất cho bạn
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.slice(0, 10).map((similar) => (
                <div
                  key={similar._id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/movies/${similar._id}`)}
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg mb-2">
                    <img
                      src={similar.poster_url}
                      alt={similar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {similar.is_featured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                          TOP 10
                        </span>
                      </div>
                    )}
                    {!similar.is_free && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                          PRO
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div
                      className="flex items-center gap-2 text-xs text-gray-400"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontStyle: "normal",
                        lineHeight: 1.6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      <span>
                        {new Date(similar.release_date).getFullYear()}
                      </span>
                      <span className="px-1.5 py-0.5 border border-white/40 rounded">
                        {ageRating}
                      </span>
                      <span>{similar.country_code.toUpperCase()}</span>
                    </div>
                    <p
                      className="text-xs text-gray-400"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontStyle: "normal",
                        lineHeight: 1.6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {similar.type === "series" ? "1 Phần" : "1 Phần"} |{" "}
                      {quality}
                    </p>
                    <p
                      className="text-xs text-gray-400 line-clamp-2"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "14px",
                        fontWeight: "500",
                        fontStyle: "italic",
                        lineHeight: 1.6,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {similar.synopsis}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTrailer && movie.trailer_url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-10"
          >
            <XIcon className="w-10 h-10" />
          </button>
          <div className="w-full max-w-6xl mx-4 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <video
              className="w-full h-full"
              src={movie.trailer_url}
              controls
              autoPlay
              muted={isMuted}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailMovieFly;
