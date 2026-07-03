import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";

interface Banner {
  _id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  is_active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/banners`);
      const data = await response.json();
      const sortedBanners = (data.banners || []).sort(
        (a: Banner, b: Banner) => a.order - b.order,
      );
      setBanners(sortedBanners);
    } catch (error) {
      console.error("Lỗi khi tải banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      description: "",
      link: "",
      order: 0,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      link: banner.link,
      order: banner.order,
      is_active: banner.is_active,
    });
    setImageFile(null);
    setImagePreview(banner.image_url);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBanner && !imageFile) {
      alert("Vui lòng chọn hình ảnh");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("is_active", formData.is_active.toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = editingBanner
        ? `${API_URL}/banners/${editingBanner._id}`
        : `${API_URL}/banners`;
      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchBanners();
        setIsModalOpen(false);
        alert(
          editingBanner
            ? "Cập nhật banner thành công"
            : "Tạo banner thành công",
        );
      } else {
        const error = await response.json();
        alert(error.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Lỗi khi lưu banner:", error);
      alert("Có lỗi xảy ra khi lưu banner");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchBanners();
        alert("Xóa banner thành công");
      } else {
        alert("Có lỗi xảy ra khi xóa banner");
      }
    } catch (error) {
      console.error("Lỗi khi xóa banner:", error);
      alert("Có lỗi xảy ra khi xóa banner");
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("is_active", (!banner.is_active).toString());

      const response = await fetch(`${API_URL}/banners/${banner._id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchBanners();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
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
            <h1
              className="text-3xl font-bold text-white"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "36px",
                fontWeight: "700",
                fontStyle: "normal",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              Quản lý Banner
            </h1>
            <p
              className="text-gray-400 mt-1"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "20px",
                fontWeight: "400",
                fontStyle: "italic",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              Quản lý các banner hiển thị trên trang chủ
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Thêm Banner
          </button>
        </div>

        <div
          className="bg-zinc-900 shadow-xl overflow-hidden border border-zinc-800"
          style={{ borderRadius: "5px" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-20">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-32">
                    Thứ tự
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-40">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {banners.map((banner, index) => (
                  <tr
                    key={banner._id}
                    className="hover:bg-zinc-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600/20 text-blue-400 font-bold rounded-full text-sm">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-40 h-24 object-cover rounded-lg shadow-md border border-zinc-700"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="font-semibold text-white text-base">
                          {banner.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {banner.description}
                        </p>
                        {banner.link && (
                          <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
                          >
                            {banner.link.substring(0, 50)}...
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-zinc-800 text-white font-bold rounded-lg border border-zinc-700">
                        {banner.order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(banner)}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                          banner.is_active ? "bg-green-600" : "bg-gray-600"
                        }`}
                        title={
                          banner.is_active
                            ? "Bật (Click để tắt)"
                            : "Tắt (Click để bật)"
                        }
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                            banner.is_active ? "translate-x-8" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <p className="text-xs text-gray-400 mt-1">
                        {banner.is_active ? "Đang hiển thị" : "Đã ẩn"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          className="p-2.5 hover:bg-blue-600 rounded-lg transition-colors bg-zinc-800 border border-zinc-700"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="p-2.5 hover:bg-red-600 rounded-lg transition-colors bg-zinc-800 border border-zinc-700"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {banners.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Chưa có banner nào</p>
              <button
                onClick={openCreateModal}
                className="mt-4 text-blue-400 hover:text-blue-300 font-semibold"
              >
                Tạo banner đầu tiên
              </button>
            </div>
          )}
        </div>

        {banners.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-400 bg-zinc-900 px-6 py-4 rounded-lg border border-zinc-800">
            <p>
              Tổng cộng:{" "}
              <span className="font-semibold text-white">{banners.length}</span>{" "}
              banner
            </p>
            <p>
              Đang hiển thị:{" "}
              <span className="font-semibold text-green-400">
                {banners.filter((b) => b.is_active).length}
              </span>
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-700">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingBanner ? "Chỉnh sửa Banner" : "Thêm Banner Mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">
                  Hình ảnh Banner <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 hover:border-blue-500 transition-colors bg-zinc-800/50">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-56 object-cover rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute top-3 right-3 p-2.5 bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-8 h-8 text-blue-400" />
                      </div>
                      <span className="text-gray-300 text-base font-medium mb-1">
                        Nhấp để chọn hình ảnh
                      </span>
                      <span className="text-gray-500 text-sm">
                        PNG, JPG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  placeholder="Nhập tiêu đề banner..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none text-white placeholder-gray-500"
                  placeholder="Nhập mô tả cho banner..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Link liên kết
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số thứ tự càng nhỏ sẽ hiển thị trước
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.is_active ? "bg-blue-600" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      formData.is_active ? "translate-x-7" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <div>
                  <label className="text-sm font-semibold text-white block">
                    Hiển thị banner
                  </label>
                  <p className="text-xs text-gray-500">
                    Bật để banner hiển thị trên trang chủ
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-white font-semibold"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {editingBanner ? "Cập nhật" : "Tạo mới"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
