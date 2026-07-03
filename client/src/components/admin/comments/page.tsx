"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  MessageSquare,
  Calendar,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Clock,
  Film,
} from "lucide-react";
import AdminLayout from "../../../pages/admin/AdminLayout";
import toast from "react-hot-toast";

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatar_url: string;
  };
  movieId: {
    _id: string;
    title: string;
  };
  episodeId?: {
    _id: string;
    title: string;
    episodeNumber: number;
  };
  content: string;
  status: "pending" | "approved" | "rejected";
  like_count: number;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("Bạn chưa đăng nhập. Vui lòng đăng xuất và đăng nhập lại.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/comments`, {
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
        throw new Error("Không thể tải danh sách bình luận");
      }

      const data = await response.json();
      setComments(data.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách bình luận. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/comments/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await fetchComments();
        toast.success("Duyệt bình luận thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/comments/${id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await fetchComments();
        toast.success("Từ chối bình luận thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchComments();
        toast.success("Xóa bình luận thành công");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.userId.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      comment.movieId.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || comment.status === statusFilter;

    return matchesSearch && matchesStatus;
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
            Quản lý Bình luận
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
            Quản lý và duyệt bình luận của người dùng
          </p>
        </div>

        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bình luận..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm placeholder-gray-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-zinc-600 text-white text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
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
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Phim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Thích
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredComments.map((comment, index) => (
                  <tr key={comment._id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {comment.userId.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {comment.userId.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-[150px]">
                            {comment.movieId.title}
                          </p>
                          {comment.episodeId && (
                            <p className="text-gray-500 text-xs">
                              Tập {comment.episodeId.episodeNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm line-clamp-2 max-w-[200px]">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          comment.status === "approved"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : comment.status === "rejected"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        {comment.status === "approved" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : comment.status === "rejected" ? (
                          <XCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {comment.status === "approved"
                          ? "Đã duyệt"
                          : comment.status === "rejected"
                            ? "Đã từ chối"
                            : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.like_count}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(comment.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {comment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(comment._id)}
                              className="p-1.5 hover:bg-green-900/50 rounded transition-colors"
                              title="Duyệt"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button
                              onClick={() => handleReject(comment._id)}
                              className="p-1.5 hover:bg-red-900/50 rounded transition-colors"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(comment._id)}
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

          {filteredComments.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Không tìm thấy bình luận"
                  : "Chưa có bình luận"}
              </p>
            </div>
          )}
        </div>

        {filteredComments.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-400 bg-zinc-900 px-6 py-3 rounded-lg border border-zinc-800">
            <span>
              Tổng:{" "}
              <span className="text-white font-medium">
                {filteredComments.length}
              </span>{" "}
              bình luận
            </span>
            <div className="flex gap-4">
              <span>
                Chờ duyệt:{" "}
                <span className="text-yellow-400 font-medium">
                  {comments.filter((c) => c.status === "pending").length}
                </span>
              </span>
              <span>
                Đã duyệt:{" "}
                <span className="text-green-400 font-medium">
                  {comments.filter((c) => c.status === "approved").length}
                </span>
              </span>
              <span>
                Đã từ chối:{" "}
                <span className="text-red-400 font-medium">
                  {comments.filter((c) => c.status === "rejected").length}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
