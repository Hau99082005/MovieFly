import { useState } from "react";
import { dummyTrailers } from "@/assets/assets";
import BlurCircle from "./BlurCircle";

const TrailersSection = () => {
  const [currentTrailer, setCurentTrailer] = useState(dummyTrailers[0]);

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(currentTrailer.videoUrl);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-6">
        Trailers
      </p>
      <div className="relative max-w-[960px] mx-auto">
        <BlurCircle top="-100px" right="-100px" />
        <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: "56.25%" }}>
          {videoId ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
              title={`Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-gray-400">
              Không tìm thấy video
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
          {dummyTrailers.map((trailer, idx) => {
            const id = getYoutubeId(trailer.videoUrl);
            return (
              <button
                key={idx}
                onClick={() => setCurentTrailer(trailer)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${trailer.videoUrl === currentTrailer.videoUrl
                    ? "border-primary scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                  }`}
              >
                <img
                  src={id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : trailer.image}
                  alt={`Trailer ${idx + 1}`}
                  className="w-36 h-20 object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrailersSection;
