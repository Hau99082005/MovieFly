import { dummyCinemasData, dummyShowsData } from "@/assets/assets";
import DateSelect from "@/components/DateSelect";
import MovieHero from "@/components/MovieHero";
import MovieInfoSidebar from "@/components/MovieInfoSidebar";
import CastCarousel from "@/components/CastCarousel";
import SimilarMovies from "@/components/SimilarMovies";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { ChevronDownIcon, XIcon } from "lucide-react";

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

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
};

const MoviesDetailt = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    Object.keys(dummyCinemasData[0].showtimes)[0],
  );
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>(
    dummyCinemasData[0]._id,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const getMovie = () => {
    setLoading(true);
    // Giả lập delay để thấy loading
    setTimeout(() => {
      const foundMovie = dummyShowsData.find((s) => s._id === id);
      setMovie(foundMovie);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getMovie();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">Không tìm thấy phim!</p>
      </div>
    );
  }

  const selectedCinema = dummyCinemasData.find(
    (c) => c._id === selectedCinemaId,
  ) as Cinema;
  const showtimesForSelectedDate =
    selectedCinema?.showtimes[selectedDate] || [];

  return (
    <>
      <div className="min-h-screen">
        <MovieHero
          movie={movie}
          isFavorite={isFavorite}
          setIsFavorite={setIsFavorite}
          setShowTrailer={setShowTrailer}
        />

        <div className="bg-zinc-900/50 px-6 md:px-16 lg:px-24 xl:px-44 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
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
                      onBookHandler={() => alert("Đặt vé thành công!")}
                    />

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-medium">
                          Chọn rạp
                        </label>
                        <div className="relative">
                          <select
                            value={selectedCinemaId}
                            onChange={(e) =>
                              setSelectedCinemaId(e.target.value)
                            }
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
                                {new Date(timeSlot.time).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
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
                    <CastCarousel casts={movie.casts} />
                  )}
                </div>

                <MovieInfoSidebar movie={movie} />
              </div>

              <SimilarMovies currentMovieId={movie._id} />
            </div>
          </div>
        </div>
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
    </>
  );
};

export default MoviesDetailt;
