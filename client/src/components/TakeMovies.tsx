"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dummyShowsData } from "@/assets/assets";
import { useNavigate } from "react-router-dom";

const TakeMovies = () => {
  const navigate = useNavigate();
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

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

  const section1Movies = dummyShowsData.slice(0, 4);
  const section2Movies = dummyShowsData.slice(2, 6);

  const renderMovieCard = (movie: (typeof dummyShowsData)[0]) => (
    <div
      key={movie._id}
      className="flex-shrink-0 group cursor-pointer relative overflow-hidden"
      style={{
        width: "280px",
        height: "160px",
      }}
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      <img
        src={movie.backdrop_path}
        alt={movie.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center px-3">
          <p
            className="text-sm font-semibold line-clamp-2"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "18px",
              fontStyle: "Regular",
              fontWeight: "400",
              lineHeight: 1.4,
              letterSpacing: "0.01em",
            }}
          >
            {movie.title}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-black px-4 md:px-8 lg:px-12 py-12">
      <div className="space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "36px",
                fontStyle: "Bold",
                fontWeight: "700",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              NÀO TA CÙNG XEM
            </h2>
            <p
              className="text-xs md:text-sm text-gray-400"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "18px",
                fontStyle: "Regular",
                fontWeight: "400",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              Xem tất cả
            </p>
          </div>

          <div className="relative group">
            <button
              onClick={() => scrollLeft(section1Ref as any)}
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              ref={section1Ref}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {section1Movies.map(renderMovieCard)}
            </div>

            <button
              onClick={() => scrollRight(section1Ref as any)}
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "36px",
                fontStyle: "Bold",
                fontWeight: "700",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              SERIES THIẾU NHI ĐÁNG XEM
            </h2>
            <p
              className="text-xs md:text-sm text-gray-400"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "18px",
                fontStyle: "Regular",
                fontWeight: "400",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              Xem tất cả
            </p>
          </div>

          <div className="relative group">
            <button
              onClick={() => scrollLeft(section2Ref as any)}
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              ref={section2Ref}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {section2Movies.map(renderMovieCard)}
            </div>

            <button
              onClick={() => scrollRight(section2Ref as any)}
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeMovies;
