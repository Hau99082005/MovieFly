import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, X, Tag } from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import toast from "react-hot-toast";

interface Genre {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/genres`);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách thể loại");
      }

      const result = await response.json();
      setGenres(result.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách thể loại");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: "", slug: "", description: "" });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({
      name: genre.name,
      slug: genre.slug,
      description: genre.description,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên thể loại");
      return;
    }

    try {
      const url = editingGenre
        ? `${API_URL}/genres/${editingGenre._id}`
        : `${API_URL}/genres`;
      const method = editingGenre ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchGenres();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        toast.success(
          editingGenre
            ? "Cập nhật thể loại thành công"
            : "Thêm thể loại thành công",
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
    if (!confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/genres/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchGenres();
        toast.success("Xóa thể loại thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredGenres = genres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Quản lý Thể loại
            </h1>
            <p className="text-gray-400 mt-1">Quản lý thể loại phim</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            <Plus className="w-5 h-5" />
            Thêm thể loại
          </button>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Đang tải...</div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800">
                  <tr
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    <th className="px-4 py-3 text-left">STT</th>
                    <th className="px-4 py-3 text-left">TÊN THỂ LOẠI</th>
                    <th className="px-4 py-3 text-left">SLUG</th>
                    <th className="px-4 py-3 text-left">MÔ TÃ</th>
                    <th className="px-4 py-3 text-left">NGÀY TẠO</th>
                    <th className="px-4 py-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGenres.map((genre, index) => (
                    <tr
                      key={genre._id}
                      className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors"
                    >
                      <td className="px-4 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-blue-500" />
                          <span
                            className="text-white font-medium"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            {genre.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">{genre.slug}</td>
                      <td className="px-4 py-4 text-gray-400 max-w-xs truncate">
                        {genre.description || "-"}
                      </td>
                      <td className="px-4 py-4 text-gray-400">
                        {new Date(genre.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(genre)}
                            className="p-2 text-blue-400 hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(genre._id)}
                            className="p-2 text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredGenres.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Không tìm thấy thể loại nào
              </div>
            )}

            <div className="bg-zinc-800 px-4 py-3 border-t border-zinc-700">
              <p
                className="text-gray-400 text-sm"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Tổng số:{" "}
                <span className="text-white font-semibold">
                  {filteredGenres.length}
                </span>{" "}
                thể loại
              </p>
            </div>
          </div>
        )}

        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {editingGenre ? "Sửa thể loại" : "Thêm thể loại mới"}
                </h2>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label
                    className="block text-white mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Tên thể loại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Hành động, Kinh dị..."
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-white mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Slug (để trống để tự động tạo)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="hanh-dong, kinh-di..."
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-white mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả về thể loại phim..."
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  {editingGenre ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
