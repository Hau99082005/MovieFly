import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  PlayCircle,
  Plus,
  Upload,
  X,
  Film,
  Tv,
  HardDrive,
  Loader2,
} from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import toast from "react-hot-toast";

interface VideoSource {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    type: string;
  };
  episodeId?: {
    _id: string;
    title: string;
    episode_number: number;
  };
  quality: number;
  format: string;
  url: string;
  bunny_file_path: string;
  bunny_storage_zone: string;
  cdn_region: string;
  file_size_mb: number;
  is_default: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Movie {
  _id: string;
  title: string;
  type: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const CHUNK_SIZE = 5 * 1024 * 1024;

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoSource[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [qualityFilter, setQualityFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoSource | null>(null);
  const [formData, setFormData] = useState({
    movieId: "",
    quality: 720,
    format: "mp4",
    cdn_region: "asia",
    is_default: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  useEffect(() => {
    fetchVideos();
    fetchMovies();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/video-sources`);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách video");
      }

      const result = await response.json();
      setVideos(result.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách video");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/movies?limit=100`);
      if (response.ok) {
        const result = await response.json();
        setMovies(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching movies");
    }
  };

  const openCreateModal = () => {
    setFormData({
      movieId: "",
      quality: 720,
      format: "mp4",
      cdn_region: "asia",
      is_default: false,
    });
    setVideoFile(null);
    setUploadProgress(0);
    setCurrentChunk(0);
    setTotalChunks(0);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (video: VideoSource) => {
    setEditingVideo(video);
    setFormData({
      movieId: video.movieId._id,
      quality: video.quality,
      format: video.format,
      cdn_region: video.cdn_region,
      is_default: video.is_default,
    });
    setVideoFile(null);
    setUploadProgress(0);
    setIsEditModalOpen(true);
  };

  const uploadVideoInChunks = async (
    file: File,
  ): Promise<{ uploadId: string; totalChunks: number }> => {
    const chunks = Math.ceil(file.size / CHUNK_SIZE);
    setTotalChunks(chunks);
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("chunkIndex", chunkIndex.toString());
      chunkFormData.append("totalChunks", chunks.toString());
      chunkFormData.append("uploadId", uploadId);
      chunkFormData.append("fileName", file.name);

      const response = await fetch(`${API_URL}/video-sources/upload-chunk`, {
        method: "POST",
        body: chunkFormData,
      });

      if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex + 1} upload failed`);
      }

      setCurrentChunk(chunkIndex + 1);
      const progress = Math.round(((chunkIndex + 1) / chunks) * 100);
      setUploadProgress(progress);
    }

    return { uploadId, totalChunks: chunks };
  };

  const handleSubmit = async () => {
    if (!formData.movieId) {
      toast.error("Vui lòng chọn phim");
      return;
    }

    if (!editingVideo && !videoFile) {
      toast.error("Vui lòng chọn file video");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (videoFile) {
        const { uploadId, totalChunks: chunks } =
          await uploadVideoInChunks(videoFile);

        const finalizeData = {
          uploadId: uploadId,
          fileName: videoFile.name,
          totalChunks: chunks,
          movieId: formData.movieId,
          quality: formData.quality,
          format: formData.format,
          cdn_region: formData.cdn_region,
          is_default: formData.is_default,
        };

        const response = await fetch(
          `${API_URL}/video-sources/finalize-upload`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalizeData),
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Không thể hoàn tất upload");
        }

        await fetchVideos();
        setIsCreateModalOpen(false);
        toast.success("Thêm video thành công");
      } else if (editingVideo) {
        const updateFormData = new FormData();
        updateFormData.append("movieId", formData.movieId);
        updateFormData.append("quality", formData.quality.toString());
        updateFormData.append("format", formData.format);
        updateFormData.append("cdn_region", formData.cdn_region);
        updateFormData.append("is_default", formData.is_default.toString());

        const response = await fetch(
          `${API_URL}/video-sources/${editingVideo._id}`,
          {
            method: "PUT",
            body: updateFormData,
          },
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Không thể cập nhật video");
        }

        await fetchVideos();
        setIsEditModalOpen(false);
        toast.success("Cập nhật video thành công");
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi xử lý video");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentChunk(0);
      setTotalChunks(0);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa video này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/video-sources/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchVideos();
        toast.success("Xóa video thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.movieId?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesQuality =
      qualityFilter === "all" || video.quality.toString() === qualityFilter;

    return matchesSearch && matchesQuality;
  });

  const formatFileSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Quản lý Video</h1>
            <p className="text-gray-400 text-sm mt-1">
              Quản lý nguồn video cho phim (Chunk Upload)
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm Video
          </button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm placeholder-gray-500"
                />
              </div>
            </div>

            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
            >
              <option value="all">Tất cả chất lượng</option>
              <option value="360">360p</option>
              <option value="480">480p</option>
              <option value="720">720p (HD)</option>
              <option value="1080">1080p (Full HD)</option>
              <option value="1440">1440p (2K)</option>
              <option value="2160">2160p (4K)</option>
            </select>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Phim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Chất lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Định dạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Kích thước
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Vùng CDN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Mặc định
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredVideos.map((video, index) => (
                  <tr key={video._id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {video.movieId?.type === "series" ? (
                          <Tv className="w-5 h-5 text-purple-400" />
                        ) : (
                          <Film className="w-5 h-5 text-blue-400" />
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {video.movieId?.title || "N/A"}
                          </p>
                          {video.episodeId && (
                            <p className="text-gray-500 text-xs">
                              Tập {video.episodeId.episode_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          video.quality >= 1080
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : video.quality >= 720
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        <PlayCircle className="w-3 h-3" />
                        {video.quality}p
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm uppercase">
                        {video.format}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <HardDrive className="w-4 h-4" />
                        {formatFileSize(video.file_size_mb)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm capitalize">
                        {video.cdn_region}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {video.is_default ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Mặc định
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(video)}
                          className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <PlayCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchTerm || qualityFilter !== "all"
                  ? "Không tìm thấy video"
                  : "Chưa có video"}
              </p>
            </div>
          )}
        </div>

        {filteredVideos.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-400 bg-zinc-900 px-6 py-3 rounded-lg border border-zinc-800">
            <span>
              Tổng:{" "}
              <span className="text-white font-medium">
                {filteredVideos.length}
              </span>{" "}
              video
            </span>
            <span>
              Tổng dung lượng:{" "}
              <span className="text-white font-medium">
                {formatFileSize(
                  videos.reduce((sum, v) => sum + v.file_size_mb, 0),
                )}
              </span>
            </span>
          </div>
        )}
      </div>

      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg max-w-lg w-full border border-zinc-800">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">
                {editingVideo ? "Chỉnh sửa Video" : "Thêm Video Mới"}
              </h2>
              <button
                onClick={() => {
                  if (!isUploading) {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }
                }}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Chọn phim <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.movieId}
                  onChange={(e) =>
                    setFormData({ ...formData, movieId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  disabled={isUploading}
                >
                  <option value="">Chọn phim</option>
                  {movies.map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Chất lượng
                  </label>
                  <select
                    value={formData.quality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quality: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                    disabled={isUploading}
                  >
                    <option value="360">360p</option>
                    <option value="480">480p</option>
                    <option value="720">720p (HD)</option>
                    <option value="1080">1080p (Full HD)</option>
                    <option value="1440">1440p (2K)</option>
                    <option value="2160">2160p (4K)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Định dạng
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                    disabled={isUploading}
                  >
                    <option value="mp4">MP4</option>
                    <option value="mkv">MKV</option>
                    <option value="webm">WEBM</option>
                    <option value="avi">AVI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  File video{" "}
                  {!editingVideo && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="video-upload"
                    className={`flex flex-col items-center ${isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <Upload className="w-10 h-10 text-gray-500 mb-2" />
                    <span className="text-gray-400 text-sm">
                      {videoFile ? videoFile.name : "Chọn file video"}
                    </span>
                    {videoFile && (
                      <span className="text-gray-500 text-xs mt-1">
                        {formatFileSize(videoFile.size / (1024 * 1024))}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Đang upload...</span>
                    <span className="text-white font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Chunk {currentChunk}/{totalChunks} - Mỗi chunk 5MB
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0"
                  disabled={isUploading}
                />
                <span className="text-sm text-gray-300">
                  Đặt làm video mặc định
                </span>
              </label>
            </div>

            <div className="flex gap-3 p-5 border-t border-zinc-800">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-white text-sm font-medium"
                disabled={isUploading}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>{editingVideo ? "Cập nhật" : "Thêm"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
