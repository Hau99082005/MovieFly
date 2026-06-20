import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import { dummyShowsData } from "@/assets/assets";
import MovieCard from "./MovieCard";

const FutureSection = () => {
  const navigate = useNavigate();
  return (
    <div className="px-16 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="0" right="-100" />
        <p
          className="text-gray-300 font-medium text-lg"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "20px",
            fontWeight: "600",
            fontStyle: "bolder",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
          }}
        >
          Đặt vé ngay bây giờ
        </p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer"
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "20px",
            fontWeight: "600",
            fontStyle: "bolder",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
          }}
        >
          Xem tất cả
          <ArrowRight className="group-hover:translate-x-0.5 transition w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-6 mt-6 max-sm:justify-center">
        {dummyShowsData.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default FutureSection;
