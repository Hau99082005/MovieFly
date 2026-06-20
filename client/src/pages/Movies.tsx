import { dummyShowsData } from "@/assets/assets";
import BlurCircle from "@/components/BlurCircle";
import MovieCard from "@/components/MovieCard";

const Movies = () => {
  return dummyShowsData.length > 0 ? (
    <section className="relative py-20 overflow-hidden min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="relative px-6 md:px-16 lg:px-24 xl:px-44">
        <BlurCircle top="-20px" right="-100px" />
        <BlurCircle top="300px" left="-100px" />
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-7 rounded-full bg-primary shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Đặt vé ngay bây giờ
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {dummyShowsData.map((movie) => (
            <MovieCard movie={movie} key={movie._id} />
          ))}
        </div>
      </div>
    </section>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">
        không có kết quả hiển thị.
      </h1>
    </div>
  );
};

export default Movies;
