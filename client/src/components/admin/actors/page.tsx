import { useState, useEffect } from "react";
import { Search, Edit, Trash2, Plus, X, User, Upload } from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUtils";

interface Person {
  _id: string;
  full_name: string;
  slug: string;
  birth_date: string;
  country_code: string | { code: string; name: string };
  bio: string;
  avatar_url: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function ActorsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    slug: "",
    birth_date: "",
    country_code: "VN",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/people`);

      if (!response.ok) {
        throw new Error("Không thể tải danh sách diễn viên");
      }

      const result = await response.json();
      setPeople(result.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách diễn viên");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      full_name: "",
      slug: "",
      birth_date: "",
      country_code: "VN",
      bio: "",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (person: Person) => {
    setEditingPerson(person);
    const countryCode = typeof person.country_code === 'string' 
      ? person.country_code 
      : person.country_code.code;
    setFormData({
      full_name: person.full_name,
      slug: person.slug,
      birth_date: person.birth_date.split("T")[0],
      country_code: countryCode,
      bio: person.bio,
    });
    setAvatarFile(null);
    setAvatarPreview(getImageUrl(person.avatar_url));
    setIsEditModalOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.full_name.trim()) {
      toast.error("Vui lòng nhập tên diễn viên");
      return;
    }

    if (!formData.birth_date) {
      toast.error("Vui lòng chọn ngày sinh");
      return;
    }

    if (!formData.bio.trim()) {
      toast.error("Vui lòng nhập tiểu sử");
      return;
    }

    if (!editingPerson && !avatarFile) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    try {
      const submitFormData = new FormData();
      submitFormData.append("full_name", formData.full_name);
      submitFormData.append("slug", formData.slug);
      submitFormData.append("birth_date", formData.birth_date);
      submitFormData.append("country_code", formData.country_code);
      submitFormData.append("bio", formData.bio);

      if (avatarFile) {
        submitFormData.append("avatar", avatarFile);
      }

      const url = editingPerson
        ? `${API_URL}/people/${editingPerson._id}`
        : `${API_URL}/people`;
      const method = editingPerson ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitFormData,
      });

      if (response.ok) {
        await fetchPeople();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        toast.success(
          editingPerson
            ? "Cập nhật diễn viên thành công"
            : "Thêm diễn viên thành công",
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
    if (!confirm("Bạn có chắc chắn muốn xóa diễn viên này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/people/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPeople();
        toast.success("Xóa diễn viên thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredPeople = people.filter(
    (person) =>
      person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.slug.toLowerCase().includes(searchTerm.toLowerCase()),
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
              Quản lý Diễn viên
            </h1>
            <p className="text-gray-400 mt-1">
              Quản lý thông tin diễn viên và đạo diễn
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            <Plus className="w-5 h-5" />
            Thêm diễn viên
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
                    <th className="px-4 py-3 text-left">ẢNH</th>
                    <th className="px-4 py-3 text-left">TÊN</th>
                    <th className="px-4 py-3 text-left">SLUG</th>
                    <th className="px-4 py-3 text-left">NGÀY SINH</th>
                    <th className="px-4 py-3 text-left">QUỐC GIA</th>
                    <th className="px-4 py-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map((person, index) => (
                    <tr
                      key={person._id}
                      className="border-b border-zinc-800 hover:bg-zinc-800 transition-colors"
                    >
                      <td className="px-4 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-4 py-4">
                        <img
                          src={getImageUrl(person.avatar_url)}
                          alt={person.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-500" />
                          <span
                            className="text-white font-medium"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            {person.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">{person.slug}</td>
                      <td className="px-4 py-4 text-gray-400">
                        {new Date(person.birth_date).toLocaleDateString(
                          "vi-VN",
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-400">
                        {typeof person.country_code === 'string' 
                          ? person.country_code 
                          : person.country_code.code}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(person)}
                            className="p-2 text-blue-400 hover:bg-zinc-700 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(person._id)}
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

            {filteredPeople.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Không tìm thấy diễn viên nào
              </div>
            )}

            <div className="bg-zinc-800 px-4 py-3 border-t border-zinc-700">
              <p
                className="text-gray-400 text-sm"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Tổng số:{" "}
                <span className="text-white font-semibold">
                  {filteredPeople.length}
                </span>{" "}
                diễn viên
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
                  {editingPerson ? "Sửa diễn viên" : "Thêm diễn viên mới"}
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
                    Ảnh đại diện <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {avatarPreview && (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                      <Upload className="w-5 h-5" />
                      <span style={{ fontFamily: "'Roboto', sans-serif" }}>
                        Chọn ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-white mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Tên đầy đủ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Ví dụ: Nguyễn Văn A"
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
                    placeholder="nguyen-van-a"
                    className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-white mb-2"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) =>
                        setFormData({ ...formData, birth_date: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-white mb-2"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Quốc gia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country_code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          country_code: e.target.value,
                        })
                      }
                      placeholder="VN, US, KR..."
                      className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-white mb-2"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Tiểu sử <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Thông tin về diễn viên..."
                    rows={6}
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
                  {editingPerson ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
