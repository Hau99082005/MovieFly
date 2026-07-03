import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Film, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoaded) return;

      if (!user) {
        navigate("/");
        return;
      }

      const role = localStorage.getItem("userRole");
      
      if (role !== "admin") {
        navigate("/");
        return;
      }

      setUserRole(role);
      setLoading(false);
    };

    checkAdminAccess();
  }, [user, isLoaded, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Quản lý User</h2>
                <p className="text-sm text-gray-400">Xem và quản lý người dùng</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Quản lý Phim</h2>
                <p className="text-sm text-gray-400">Thêm, sửa, xóa phim</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Thống kê</h2>
                <p className="text-sm text-gray-400">Xem báo cáo và thống kê</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-zinc-900 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Thông tin Admin</h2>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-semibold text-white">Email:</span> {user?.emailAddresses[0]?.emailAddress}</p>
            <p><span className="font-semibold text-white">Role:</span> <span className="text-primary">{userRole}</span></p>
            <p><span className="font-semibold text-white">Status:</span> <span className="text-green-500">Active</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
