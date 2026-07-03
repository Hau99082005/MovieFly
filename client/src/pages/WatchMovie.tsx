import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronDown,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface VideoSource {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    poster_url?: string;
  };
  episodeId?: {
    _id: string;
    title: string;
    episode_number: number;
  };
  quality: number;
  format: string;
  url: string;
  cdn_region: string;
  file_size_mb: number;
  is_default: boolean;
  createdAt: string;
}

const WatchMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoSource | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchVideoSources();
    }
  }, [id]);

  useEffect(() => {
    if (videoSources.length > 0) {
      generateThumbnails();
    }
  }, [videoSources]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const generateThumbnails = async () => {
    const newThumbnails: { [key: string]: string } = {};

    for (const source of videoSources) {
      try {
        const thumbnail = await captureVideoFrame(source.url);
        newThumbnails[source._id] = thumbnail;
      } catch (error) {
        console.error("Failed to generate thumbnail for", source._id);
      }
    }

    setThumbnails(newThumbnails);
  };

  const captureVideoFrame = (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = videoUrl;
      video.currentTime = 5;

      video.addEventListener("loadeddata", () => {
        video.currentTime = 5;
      });

      video.addEventListener("seeked", () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
            resolve(thumbnail);
          } else {
            reject(new Error("Could not get canvas context"));
          }
        } catch (error) {
          reject(error);
        }
      });

      video.addEventListener("error", () => {
        reject(new Error("Failed to load video"));
      });
    });
  };

  const fetchVideoSources = async () => {
    try {
      const response = await fetch(`${API_URL}/video-sources/movie/${id}`);
      if (response.ok) {
        const result = await response.json();
        const sources = result.data || [];
        setVideoSources(sources);

        const defaultVideo =
          sources.find((s: VideoSource) => s.is_default) || sources[0];
        if (defaultVideo) {
          setCurrentVideo(defaultVideo);
          setSelectedQuality(defaultVideo.quality);
        }
      }
    } catch (error) {
      console.error("Error fetching video sources");
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const changeQuality = (source: VideoSource) => {
    const currentTimeBeforeChange = videoRef.current?.currentTime || 0;
    setCurrentVideo(source);
    setSelectedQuality(source.quality);
    setShowQualityMenu(false);
    setShowEpisodeList(false);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTimeBeforeChange;
        if (isPlaying) {
          videoRef.current.play();
        }
      }
    }, 100);
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const uniqueQualities = Array.from(
    new Set(videoSources.map((s) => s.quality)),
  ).sort((a, b) => b - a);

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        className="relative w-full bg-black"
        style={{ height: "100vh" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <button
          onClick={() => navigate(`/movie/${id}`)}
          className="absolute top-24 left-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors md:top-4"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute top-36 left-4 z-50 flex items-center gap-2 md:top-20">
          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base md:px-4"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            <span className="truncate max-w-[150px] md:max-w-none">
              {currentVideo.episodeId
                ? `Tập ${currentVideo.episodeId.episode_number}: ${currentVideo.episodeId.title}`
                : currentVideo.movieId.title}
            </span>
            <ChevronDown
              className={`w-4 h-4 md:w-5 md:h-5 transition-transform flex-shrink-0 ${showEpisodeList ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {showEpisodeList && (
          <div className="absolute top-48 left-4 right-4 md:top-32 md:left-4 md:right-auto z-50 w-auto md:w-96 max-h-[60vh] md:max-h-96 bg-black/95 rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-zinc-700">
              <h3
                className="text-white font-semibold text-sm md:text-base"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Danh sách tập
              </h3>
              <button
                onClick={() => setShowEpisodeList(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(60vh - 50px)" }}
            >
              {videoSources.map((source) => (
                <div
                  key={source._id}
                  onClick={() => changeQuality(source)}
                  className={`cursor-pointer p-3 md:p-4 hover:bg-zinc-800 transition-colors border-b border-zinc-800 ${
                    currentVideo._id === source._id ? "bg-zinc-800" : ""
                  }`}
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="relative w-20 h-12 md:w-24 md:h-16 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                      {thumbnails[source._id] ? (
                        <img
                          src={thumbnails[source._id]}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            Loading...
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium text-xs md:text-sm mb-1 line-clamp-2 ${
                          currentVideo._id === source._id
                            ? "text-blue-400"
                            : "text-white"
                        }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {source.episodeId
                          ? `Tập ${source.episodeId.episode_number}: ${source.episodeId.title}`
                          : source.movieId.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-1.5 py-0.5 md:px-2 bg-blue-500/20 text-blue-400 rounded">
                          {source.quality}p
                        </span>
                        <span className="text-xs">
                          {source.format.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          src={currentVideo.url}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={handlePlayPause}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 md:p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full mb-2 md:mb-4 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
            }}
          />

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => skipTime(-10)}
                className="hover:text-blue-500 transition-colors hidden md:block"
              >
                <SkipBack className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={handlePlayPause}
                className="bg-blue-500 hover:bg-blue-600 p-2 md:p-3 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <PlayIcon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>

              <button
                onClick={() => skipTime(10)}
                className="hover:text-blue-500 transition-colors hidden md:block"
              >
                <SkipForward className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={toggleMute}
                  className="hover:text-blue-500 transition-colors"
                >
                  {isMuted ? (
                    <VolumeXIcon className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Volume2Icon className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-12 md:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hidden md:block"
                />
              </div>

              <span className="text-xs md:text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="hover:text-blue-500 transition-colors flex items-center gap-1 md:gap-2"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">{selectedQuality}p</span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 rounded-lg shadow-lg p-2 min-w-[100px] md:min-w-[120px]">
                    {uniqueQualities.map((quality) => {
                      const source = videoSources.find(
                        (s) => s.quality === quality,
                      );
                      if (!source) return null;
                      return (
                        <button
                          key={quality}
                          onClick={() => changeQuality(source)}
                          className={`w-full text-left px-2 md:px-3 py-1.5 md:py-2 rounded hover:bg-zinc-800 transition-colors text-sm ${
                            selectedQuality === quality ? "text-blue-500" : ""
                          }`}
                        >
                          {quality}p
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={handleFullscreen}
                className="hover:text-blue-500 transition-colors"
              >
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
