import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  Film,
  Eye,
  Calendar,
  Star,
  Plus,
  Upload,
  X,
} from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import { getImageUrl } from "@/lib/imageUtils";
import toast from "react-hot-toast";

interface Movie {
  _id: string;
  title: string;
  original_title: string;
  slug: string;
  type: "movie" | "series";
  status: "draft" | "published" | "archived";
  synopsis: string;
  tagline: string;
  poster_url: string;
  backdrop_url: string;
  trailer_url: string;
  release_date: string | null;
  country_code: string;
  language: string;
  duration_min: number;
  rating: number;
  imdb_id: string;
  imdb_score: number;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  is_free: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const CHUNK_SIZE = 5 * 1024 * 1024;

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    original_title: "",
    type: "movie",
    status: "draft",
    synopsis: "",
    tagline: "",
    release_date: "",
    language: "vi",
    duration_min: 0,
    rating: 0,
    imdb_score: 0,
    is_featured: false,
    is_free: false,
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [isUploadingTrailer, setIsUploadingTrailer] = useState(false);
  const [trailerUploadProgress, setTrailerUploadProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies?limit=100`);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách phim");
      }

      const result = await response.json();
      setMovies(result.data || []);
    } catch (error) {
      alert("Lỗi khi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: "",
      original_title: "",
      type: "movie",
      status: "draft",
      synopsis: "",
      tagline: "",
      release_date: "",
      language: "vi",
      duration_min: 0,
      rating: 0,
      imdb_score: 0,
      is_featured: false,
      is_free: false,
    });
    setPosterFile(null);
    setBackdropFile(null);
    setTrailerFile(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      original_title: movie.original_title,
      type: movie.type,
      status: movie.status,
      synopsis: movie.synopsis,
      tagline: movie.tagline,
      release_date: movie.release_date
        ? new Date(movie.release_date).toISOString().split("T")[0]
        : "",
      language: movie.language,
      duration_min: movie.duration_min,
      rating: movie.rating,
      imdb_score: movie.imdb_score,
      is_featured: movie.is_featured,
      is_free: movie.is_free,
    });
    setPosterFile(null);
    setBackdropFile(null);
    setTrailerFile(null);
    setIsEditModalOpen(true);
  };

  const uploadTrailerInChunks = async (file: File): Promise<string> => {
    const chunks = Math.ceil(file.size / CHUNK_SIZE);
    setTotalChunks(chunks);
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const fileName = `trailer-${uploadId}-${file.name}`;

    for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("chunkIndex", chunkIndex.toString());
      chunkFormData.append("totalChunks", chunks.toString());
      chunkFormData.append("uploadId", uploadId);
      chunkFormData.append("fileName", fileName);

      const response = await fetch(`${API_URL}/video-sources/upload-chunk`, {
        method: "POST",
        body: chunkFormData,
      });

      if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex + 1} upload failed`);
      }

      setCurrentChunk(chunkIndex + 1);
      const progress = Math.round(((chunkIndex + 1) / chunks) * 100);
      setTrailerUploadProgress(progress);
    }

    const finalizeData = {
      uploadId: uploadId,
      fileName: fileName,
      totalChunks: chunks,
      folder: "trailers",
    };

    const finalizeResponse = await fetch(`${API_URL}/trailers/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalizeData),
    });

    if (!finalizeResponse.ok) {
      const error = await finalizeResponse.json();
      throw new Error(error.message || "Failed to finalize trailer upload");
    }

    const result = await finalizeResponse.json();
    return result.cdnUrl || result.data?.url || "";
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.original_title) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      let trailerUrl = editingMovie?.trailer_url || "";

      if (trailerFile) {
        setIsUploadingTrailer(true);
        try {
          trailerUrl = await uploadTrailerInChunks(trailerFile);
        } catch (error: any) {
          toast.error(error.message || "Lỗi khi upload trailer");
          return;
        } finally {
          setIsUploadingTrailer(false);
          setTrailerUploadProgress(0);
          setCurrentChunk(0);
          setTotalChunks(0);
        }
      }

      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (trailerUrl) {
        formDataToSend.append("trailer_url", trailerUrl);
      }

      if (posterFile) {
        formDataToSend.append("poster", posterFile);
      }
      if (backdropFile) {
        formDataToSend.append("backdrop", backdropFile);
      }

      const url = editingMovie
        ? `${API_URL}/movies/${editingMovie._id}`
        : `${API_URL}/movies`;
      const method = editingMovie ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchMovies();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        toast.success(
          editingMovie ? "Cập nhật phim thành công" : "Tạo phim thành công",
        );
      } else {
        const error = await response.json();
        toast.error(error.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phim này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/movies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMovies();
        alert("Xóa phim thành công");
      } else {
        alert("Có lỗi xảy ra");
      }
    } catch (error) {
      alert("Có lỗi xảy ra");
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.original_title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || movie.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || movie.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

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
            <h1
              className="text-2xl font-semibold text-white"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "36px",
                fontWeight: "700",
                fontStyle: "normal",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              Quản lý Phim
            </h1>
            <p
              className="text-gray-400 text-sm mt-1"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: "500",
                fontStyle: "italic",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              Quản lý nội dung phim và phim bộ
            </p>
          </div>
          <button
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "20px",
              fontWeight: "500",
              fontStyle: "normal",
              lineHeight: 1.6,
              letterSpacing: "0.01em",
              borderRadius: "5px",
            }}
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm Phim
          </button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm placeholder-gray-500"
                />
              </div>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
            >
              <option value="all">Tất cả loại</option>
              <option value="movie">Phim lẻ</option>
              <option value="series">Phim bộ</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Lưu trữ</option>
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
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredMovies.map((movie, index) => (
                  <tr key={movie._id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                          {movie.poster_url ? (
                            <img
                              src={getImageUrl(movie.poster_url)}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {movie.title}
                          </p>
                          <p className="text-gray-500 text-xs truncate">
                            {movie.original_title}
                          </p>
                          {movie.release_date && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(movie.release_date).getFullYear()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          movie.type === "movie"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {movie.type === "movie" ? "Phim lẻ" : "Phim bộ"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          movie.status === "published"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : movie.status === "draft"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}
                      >
                        {movie.status === "published"
                          ? "Xuất bản"
                          : movie.status === "draft"
                            ? "Bản nháp"
                            : "Lưu trữ"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{movie.view_count.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(movie)}
                          className="p-1.5 hover:bg-zinc-700 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(movie._id)}
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

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Không tìm thấy phim"
                  : "Chưa có phim"}
              </p>
            </div>
          )}
        </div>

        {filteredMovies.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-400 bg-zinc-900 px-6 py-3 rounded-lg border border-zinc-800">
            <span>
              Tổng:{" "}
              <span className="text-white font-medium">
                {filteredMovies.length}
              </span>{" "}
              phim
            </span>
            <div className="flex gap-4">
              <span>
                Phim lẻ:{" "}
                <span className="text-blue-400 font-medium">
                  {movies.filter((m) => m.type === "movie").length}
                </span>
              </span>
              <span>
                Phim bộ:{" "}
                <span className="text-purple-400 font-medium">
                  {movies.filter((m) => m.type === "series").length}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-lg max-w-2xl w-full border border-zinc-800 my-8">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">
                {editingMovie ? "Chỉnh sửa Phim" : "Thêm Phim Mới"}
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                    placeholder="Tên phim"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Tiêu đề gốc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.original_title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        original_title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                    placeholder="Original title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Loại
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "movie" | "series",
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  >
                    <option value="movie">Phim lẻ</option>
                    <option value="series">Phim bộ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="archived">Lưu trữ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Ngày phát hành
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) =>
                      setFormData({ ...formData, release_date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Mô tả
                </label>
                <textarea
                  value={formData.synopsis}
                  onChange={(e) =>
                    setFormData({ ...formData, synopsis: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm resize-none"
                  rows={3}
                  placeholder="Nội dung phim..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Poster
                  </label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPosterFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="poster-upload"
                    />
                    <label
                      htmlFor="poster-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-gray-400 text-xs">
                        {posterFile ? posterFile.name : "Chọn poster"}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Backdrop
                  </label>
                  <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setBackdropFile(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="backdrop-upload"
                    />
                    <label
                      htmlFor="backdrop-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-gray-400 text-xs">
                        {backdropFile ? backdropFile.name : "Chọn backdrop"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Trailer Video
                </label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setTrailerFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                    id="trailer-upload"
                    disabled={isUploadingTrailer}
                  />
                  <label
                    htmlFor="trailer-upload"
                    className={`cursor-pointer flex flex-col items-center ${isUploadingTrailer ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-gray-400 text-xs">
                      {trailerFile ? trailerFile.name : "Chọn video trailer"}
                    </span>
                    {trailerFile && (
                      <span className="text-gray-500 text-xs mt-1">
                        {(trailerFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </label>
                  
                  {isUploadingTrailer && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Đang upload trailer...</span>
                        <span>{trailerUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${trailerUploadProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Chunk {currentChunk}/{totalChunks}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0"
                  />
                  <span className="text-sm text-gray-300">Phim nổi bật</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) =>
                      setFormData({ ...formData, is_free: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0"
                  />
                  <span className="text-sm text-gray-300">Miễn phí</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-zinc-800">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-white text-sm font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white text-sm font-medium"
              >
                {editingMovie ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
