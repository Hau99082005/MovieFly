import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "@/assets/assets";
import useEmblaCarousel from "embla-carousel-react";

interface SimilarMoviesProps {
  currentMovieId: string;
}

const SimilarMovies = ({ currentMovieId }: SimilarMoviesProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    skipSnaps: false,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <p className="text-2xl font-bold text-white uppercase">Bạn cũng có thể</p>
        <div className="flex gap-3">
          <button
            onClick={scrollPrev}
            className="p-3 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="p-3 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {dummyShowsData.filter(m => m._id !== currentMovieId).slice(0, 6).map((movieItem) => (
            <div key={movieItem._id} className="flex-shrink-0 w-72">
              <MovieCard movie={movieItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarMovies;
