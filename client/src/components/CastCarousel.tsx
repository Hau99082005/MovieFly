import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface Cast {
  name: string;
  profile_path: string;
}

interface CastCarouselProps {
  casts: Cast[];
}

const CastCarousel = ({ casts }: CastCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    skipSnaps: false,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold text-white uppercase">
          Dàn diễn viên yêu thích của bạn
        </h2>
        <div className="flex gap-3">
          <button
            onClick={scrollPrev}
            className="p-3 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous cast"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            className="p-3 rounded-full bg-zinc-800 text-white hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next cast"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {casts.slice(0, 12).map((cast, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center text-center group min-w-[150px] md:min-w-[180px]"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary rounded-full opacity-0 group-hover:opacity-20 scale-110 transition-all duration-300 blur-xl" />
                <img
                  src={cast.profile_path}
                  alt={cast.name}
                  className="relative rounded-full h-28 md:h-36 aspect-square object-cover shadow-xl group-hover:scale-105 group-hover:shadow-primary/50 transition-all duration-400"
                />
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-300" />
              </div>
              <p className="font-semibold text-base md:text-lg text-gray-200 group-hover:text-primary transition-colors duration-300">
                {cast.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastCarousel;
