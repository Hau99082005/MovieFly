import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import { dummyShowsData } from "@/assets/assets";
import MovieCard from "./MovieCard";

const FutureSection = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-100" />
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Đặt vé ngay bây giờ
          </h2>
        </div>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-primary font-bold cursor-pointer hover:text-primary-dull transition-colors"
        >
          Xem tất cả
          <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
        {dummyShowsData.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>
      <div className="flex justify-center mt-16">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-12 py-3 bg-primary hover:bg-primary-dull text-black font-bold uppercase tracking-wide rounded shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-200 active:scale-95"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default FutureSection;
