import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { movieGenresApi } from "@/lib/api";
import MovieCard from "./MovieCard";

interface Movie {
  _id: string;
  title: string;
  poster_url: string;
  backdrop_url: string;
  rating: number;
  [key: string]: any;
}

interface MovieForCard {
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

interface Genre {
  _id: string;
  name: string;
  slug: string;
}

interface MovieGenre {
  _id: string;
  movieId: Movie;
  genreId: Genre;
}

interface GroupedMovies {
  [genreName: string]: MovieForCard[];
}

const FutureSection = () => {
  const [groupedMovies, setGroupedMovies] = useState<GroupedMovies>({});
  const [isLoading, setIsLoading] = useState(true);
  const scrollRefs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement | null>;
  }>({});

  const loadMovieGenres = async () => {
    try {
      const response = await movieGenresApi.getAll();
      if (response.data && Array.isArray(response.data)) {
        const grouped: GroupedMovies = {};

        response.data.forEach((item: MovieGenre) => {
          if (item.movieId && item.genreId) {
            const genreName = item.genreId.name;
            if (!grouped[genreName]) {
              grouped[genreName] = [];
            }
            if (!grouped[genreName].find((m) => m._id === item.movieId._id)) {
              const movieForCard: MovieForCard = {
                _id: item.movieId._id,
                title: item.movieId.title,
                backdrop_path:
                  item.movieId.backdrop_url || item.movieId.poster_url,
                poster_path: item.movieId.poster_url,
                vote_average: item.movieId.rating || 0,
                trailerUrl: item.movieId.trailer_url,
                release_date: item.movieId.release_date,
                runtime: item.movieId.duration_min,
              };
              grouped[genreName].push(movieForCard);
            }
          }
        });

        setGroupedMovies(grouped);
      }
    } catch (err) {
      setGroupedMovies({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMovieGenres();
  }, []);

  const getScrollRef = (genreName: string) => {
    if (!scrollRefs.current[genreName]) {
      scrollRefs.current[genreName] = { current: null };
    }
    return scrollRefs.current[genreName];
  };

  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 overflow-hidden pt-10 md:pt-16 lg:pt-20 pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const sections = Object.entries(groupedMovies);

  if (sections.length === 0) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 overflow-hidden pt-10 md:pt-16 lg:pt-20 pb-20">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">No movies available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 overflow-hidden pt-10 md:pt-16 lg:pt-20 pb-20">
      {sections.map(([genreName, movies], sectionIndex) => {
        const scrollRef = getScrollRef(genreName);

        return (
          <div key={sectionIndex} className="relative mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
                {genreName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollLeft(scrollRef)}
                  aria-label="Scroll left"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollRight(scrollRef)}
                  aria-label="Scroll right"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef as any}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="flex-shrink-0 w-48 md:w-56 lg:w-64"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FutureSection;
