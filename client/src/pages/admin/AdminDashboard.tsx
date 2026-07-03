import AdminLayout from "./AdminLayout";
import { Shield, Users, Film, BarChart3, Settings, Database } from "lucide-react";

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

                        <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Database</h2>
                                    <p className="text-sm text-gray-400">Quản lý cơ sở dữ liệu</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Settings className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Cài đặt</h2>
                                    <p className="text-sm text-gray-400">Cấu hình hệ thống</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">Hoạt động gần đây</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-300">User mới đăng ký</span>
                                </div>
                                <span className="text-sm text-gray-500">2 phút trước</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-gray-300">Phim mới được thêm</span>
                                </div>
                                <span className="text-sm text-gray-500">15 phút trước</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-gray-300">Cập nhật hệ thống</span>
                                </div>
                                <span className="text-sm text-gray-500">1 giờ trước</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
