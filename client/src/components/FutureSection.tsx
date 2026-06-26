import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { dummyShowsData } from "@/assets/assets";
import MovieCard from "./MovieCard";

const sections = [
  {
    title: "Phim hoạt hình hay nhất",
    data: dummyShowsData,
  },
  {
    title: "Chương trình truyền hình cho thiếu nhi",
    data: [...dummyShowsData].reverse(),
  },
];

const FutureSection = () => {

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 overflow-hidden pt-10 md:pt-16 lg:pt-20 pb-20">
      {sections.map((section, sectionIndex) => {
        const scrollRef = useRef<HTMLDivElement>(null);
        return (
          <div key={sectionIndex} className="relative mb-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
                {section.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollLeft(scrollRef as any)}
                  aria-label="Scroll left"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollRight(scrollRef as any)}
                  aria-label="Scroll right"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {section.data.map((show) => (
                <div key={show._id} className="flex-shrink-0 w-48 md:w-56 lg:w-64">
                  <MovieCard movie={show} />
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
