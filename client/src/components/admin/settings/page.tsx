"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Palette,
  Mail,
  MessageSquare,
  Star,
  Wrench,
  Image,
  Layout,
  Upload,
} from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import toast from "react-hot-toast";

interface Settings {
  _id?: string;
  site_name: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_twitter: string;
  social_youtube: string;
  social_instagram: string;
  enable_comments: boolean;
  enable_ratings: boolean;
  maintenance_mode: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_name: "MovieFly",
    site_description: "",
    site_logo: "",
    site_favicon: "",
    primary_color: "#3b82f6",
    secondary_color: "#8b5cf6",
    background_color: "#18181b",
    text_color: "#ffffff",
    contact_email: "",
    contact_phone: "",
    social_facebook: "",
    social_twitter: "",
    social_youtube: "",
    social_instagram: "",
    enable_comments: true,
    enable_ratings: true,
    maintenance_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Bạn chưa đăng nhập. Vui lòng đăng xuất và đăng nhập lại.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          return;
        }
        if (response.status === 403) {
          toast.error("Bạn không có quyền truy cập.");
          return;
        }
        throw new Error("Không thể tải cài đặt");
      }

      const data = await response.json();
      if (data.data) {
        setSettings(data.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải cài đặt. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("authToken");

      let logoUrl = settings.site_logo;

      if (logoFile) {
        const formData = new FormData();
        formData.append("image", logoFile);

        const uploadResponse = await fetch(`${API_URL}/banners`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          logoUrl = uploadData.data.image_url;
        } else {
          toast.error("Lỗi khi upload logo");
          setSaving(false);
          return;
        }
      }

      const settingsToSave = {
        ...settings,
        site_logo: logoUrl,
        site_favicon: logoUrl ? logoUrl.replace(/\.(png|jpg|jpeg|webp)$/i, ".ico") : "",
      };

      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      });

      if (response.ok) {
        toast.success("Lưu cài đặt thành công");
        setLogoFile(null);
      } else {
        toast.error("Có lỗi xảy ra khi lưu");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setSaving(false);
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
            Cài đặt Website
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
            Quản lý cài đặt chung của website xem phim
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin chung */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Thông tin chung
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Tên website
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) =>
                    setSettings({ ...settings, site_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Mô tả website
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      site_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Image className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Hình ảnh</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Logo
                </label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-gray-400 text-xs">
                      {logoFile ? logoFile.name : "Chọn logo"}
                    </span>
                  </label>
                </div>
                {settings.site_logo && (
                  <div className="mt-3">
                    <img
                      src={settings.site_logo}
                      alt="Logo preview"
                      className="h-16 object-contain rounded"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Favicon
                </label>
                <p className="text-gray-400 text-sm">
                  Tự động tạo từ logo
                </p>
                {settings.site_favicon && (
                  <div className="mt-3">
                    <img
                      src={settings.site_favicon}
                      alt="Favicon preview"
                      className="h-8 w-8 object-contain rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Màu sắc */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Màu sắc</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Màu chính
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        primary_color: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        primary_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Màu phụ
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        secondary_color: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        secondary_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Màu nền
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.background_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        background_color: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.background_color}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        background_color: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Màu chữ
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.text_color}
                    onChange={(e) =>
                      setSettings({ ...settings, text_color: e.target.value })
                    }
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.text_color}
                    onChange={(e) =>
                      setSettings({ ...settings, text_color: e.target.value })
                    }
                    className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Liên hệ</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={settings.contact_phone}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mạng xã hội */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Mạng xã hội</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Facebook
                </label>
                <input
                  type="text"
                  value={settings.social_facebook}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_facebook: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Twitter
                </label>
                <input
                  type="text"
                  value={settings.social_twitter}
                  onChange={(e) =>
                    setSettings({ ...settings, social_twitter: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  YouTube
                </label>
                <input
                  type="text"
                  value={settings.social_youtube}
                  onChange={(e) =>
                    setSettings({ ...settings, social_youtube: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={settings.social_instagram}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social_instagram: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>
          </div>

          {/* Tính năng */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Wrench className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-semibold text-white">Tính năng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enable_comments}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enable_comments: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-0"
                />
                <div className="flex-1">
                  <MessageSquare className="w-5 h-5 text-blue-400 mb-1" />
                  <p className="text-white text-sm font-medium">Bình luận</p>
                  <p className="text-gray-400 text-xs">
                    Cho phép người dùng bình luận
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.enable_ratings}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enable_ratings: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-0"
                />
                <div className="flex-1">
                  <Star className="w-5 h-5 text-yellow-400 mb-1" />
                  <p className="text-white text-sm font-medium">Đánh giá</p>
                  <p className="text-gray-400 text-xs">
                    Cho phép người dùng đánh giá
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenance_mode: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-0"
                />
                <div className="flex-1">
                  <Wrench className="w-5 h-5 text-red-400 mb-1" />
                  <p className="text-white text-sm font-medium">
                    Chế độ bảo trì
                  </p>
                  <p className="text-gray-400 text-xs">Tắt website tạm thời</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
