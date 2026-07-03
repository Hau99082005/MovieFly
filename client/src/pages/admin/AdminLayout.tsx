import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Users,
  Tv,
  Tag,
  Star,
  MessageSquare,
  PlaySquare,
  BarChart3,
  Database,
  Settings,
  ChevronDown,
  Search,
  Moon,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import Logo from "../../assets/Logo_1.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface MenuItem {
  label: string;
  icon: any;
  path?: string;
  isNew?: boolean;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Quản lý Phim", icon: Film, path: "/admin/movies" },
    { label: "Quản lý User", icon: Users, path: "/admin/users" },
    { label: "Phim Bộ", icon: Tv, path: "/admin/series" },
    { label: "Thể loại", icon: Tag, path: "/admin/genres" },
    { label: "Diễn viên", icon: Star, path: "/admin/actors" },
    { label: "Bình luận", icon: MessageSquare, path: "/admin/comments" },
    { label: "Video", icon: PlaySquare, path: "/admin/videos" },
    { label: "Thống kê", icon: BarChart3, path: "/admin/statistics" },
    { label: "Database", icon: Database, path: "/admin/database" },
  ];

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate("/");
        return;
      }

      try {
        const role = localStorage.getItem("userRole");

        if (!role) {
          const email = user.emailAddresses[0]?.emailAddress;
          const username =
            user.username ||
            email?.split("@")[0] ||
            `user_${user.id.substring(0, 8)}`;
          const full_name =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() || username;

          const syncResponse = await fetch(`${API_URL}/users/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clerkId: user.id,
              username,
              email,
              full_name,
              avatar_url: user.imageUrl || "",
            }),
          });

          const syncData = await syncResponse.json();

          if (syncData.user?.role) {
            localStorage.setItem("userRole", syncData.user.role);

            if (syncData.user.role === "admin") {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              setError("Bạn không có quyền truy cập trang quản trị");
            }
          } else {
            setIsAdmin(false);
            setError("Không thể xác thực quyền truy cập");
          }
        } else {
          if (role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            setError("Bạn không có quyền truy cập trang quản trị");
          }
        }
      } catch (error) {
        setError("Lỗi khi xác thực quyền truy cập");
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [user, isLoaded, navigate]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p
          className="text-white text-lg"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Đang kiểm tra quyền truy cập...
        </p>
      </div>
    );
  }

  if (isAdmin === false || error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6 p-6 text-center">
        <h1
          className="text-3xl font-bold text-red-500"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Truy cập bị từ chối
        </h1>
        <p
          className="text-gray-400 text-lg"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          {error || "Bạn không có quyền truy cập trang quản trị"}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Về trang chủ
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("userRole");
              window.location.reload();
            }}
            className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin === true) {
    return (
      <div
        className="min-h-screen bg-black"
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <div
          className={`fixed left-0 top-0 h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300 z-40 ${isSidebarOpen ? "w-64" : "w-0"} overflow-hidden`}
        >
          <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
            <img src={Logo} alt="MovieFly Logo" className="h-20 w-20" />
          </div>

          <div className="p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">
              MENU
            </p>
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => item.path && navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-zinc-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm flex-1 text-left">
                    {item.label}
                  </span>
                  {item.isNew && (
                    <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded">
                      MỚI
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-6 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm flex-1 text-left">
                  Cài đặt
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        >
          <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-white"
                >
                  {isSidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoặc nhập lệnh..."
                    className="w-full pl-10 pr-20 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-white placeholder-gray-500"
                  />
                  <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-xs text-gray-400">
                    ⌘ K
                  </kbd>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Moon className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                    <img
                      src={user?.imageUrl || "/api/placeholder/32/32"}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-sm text-white">
                      {user?.firstName || "Admin"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800 hidden group-hover:block">
                    <div className="p-4 border-b border-zinc-800">
                      <p className="font-semibold text-white">
                        {user?.fullName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-gray-300">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Chỉnh sửa hồ sơ</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-gray-300">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Cài đặt tài khoản</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-gray-300">
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-sm">Hỗ trợ</span>
                      </button>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          navigate("/");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 rounded-lg text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-white" style={{ fontFamily: "Roboto, sans-serif" }}>
        Đang tải...
      </p>
    </div>
  );
}
