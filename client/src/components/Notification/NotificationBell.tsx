import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, BellRing, CheckCheck, Trash2, Wifi, WifiOff } from "lucide-react";
import NotificationItem from "./NotificationItem";
import NotificationDetail from "./NotificationDetail";
import type { UseNotificationsReturn } from "@/hooks/useNotifications";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationBellProps
  extends Pick<
    UseNotificationsReturn,
    | "notifications"
    | "unreadCount"
    | "isConnected"
    | "isLoading"
    | "markAsRead"
    | "markAllAsRead"
    | "deleteNotification"
    | "deleteAll"
    | "fetchNotifications"
  > {
  userId: string;
}

type TabType = "all" | "unread";

const NotificationBell = ({
  notifications,
  unreadCount,
  isConnected,
  isLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
  fetchNotifications,
  userId,
}: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Đóng panel khi click ngoài
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        bellRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !bellRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const togglePanel = () => setIsOpen((v) => !v);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "unread") {
      fetchNotifications({ isRead: false, limit: 20 });
    } else {
      fetchNotifications({ limit: 20 });
    }
  };

  const handleMarkAllRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleDeleteAll = useCallback(async () => {
    if (window.confirm("Xóa tất cả thông báo?")) {
      await deleteAll();
    }
  }, [deleteAll]);

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="relative">
      {/* ── Bell Button ── */}
      <button
        ref={bellRef}
        id="notification-bell-btn"
        aria-label="Thông báo"
        onClick={togglePanel}
        className={`relative w-11 h-11 flex items-center justify-center rounded-full
          transition-all duration-200
          ${isOpen ? "bg-white/10 text-white" : "text-white/80 hover:text-white hover:bg-white/5"}`}
      >
        {unreadCount > 0 ? (
          <BellRing
            className={`w-5 h-5 ${isOpen ? "text-white" : "text-white/90"}`}
            style={{ animation: unreadCount > 0 ? "bellRing 2s ease-in-out infinite" : undefined }}
          />
        ) : (
          <Bell className="w-5 h-5" />
        )}

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
              bg-[#00d4ff] rounded-full text-[10px] font-bold text-white
              flex items-center justify-center
              transition-transform duration-200 ${unreadCount > 0 ? "scale-100" : "scale-0"}`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {isOpen && (
        <div
          ref={panelRef}
          id="notification-panel"
          className={`absolute right-0 top-[calc(100%+12px)] z-[999]
            w-[380px] max-w-[calc(100vw-24px)]
            bg-[#141414] border border-white/10 rounded-xl
            overflow-hidden`}
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
            animation: "panelIn 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-white tracking-tight">
                Thông báo
              </h3>
              {/* Connection status */}
              <span title={isConnected ? "Đang kết nối realtime" : "Offline"}>
                {isConnected ? (
                  <Wifi className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-red-400/70" />
                )}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                    text-xs text-white/60 hover:text-white hover:bg-white/8
                    transition-all duration-150"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Đọc tất cả</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                    text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/8
                    transition-all duration-150"
                  title="Xóa tất cả"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {(["all", "unread"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-all duration-200
                  ${
                    activeTab === tab
                      ? "text-white border-b-2 border-[#00d4ff]"
                      : "text-white/40 hover:text-white/70"
                  }`}
              >
                {tab === "all" ? "Tất cả" : `Chưa đọc${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              </button>
            ))}
          </div>

          {/* List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "420px" }}
          >
            {isLoading ? (
              <div className="flex flex-col gap-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-white/8 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/8 rounded w-3/4" />
                      <div className="h-2.5 bg-white/5 rounded w-full" />
                      <div className="h-2 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-12 h-12 text-white/15 mb-3" />
                <p className="text-sm text-white/40 font-medium">
                  {activeTab === "unread"
                    ? "Không có thông báo chưa đọc"
                    : "Không có thông báo nào"}
                </p>
                <p className="text-xs text-white/25 mt-1">
                  Thông báo mới sẽ hiện ở đây
                </p>
              </div>
            ) : (
              displayedNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                  onViewDetail={(n) => {
                    setSelectedNotification(n);
                    setIsOpen(false);
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {displayedNotifications.length > 0 && (
            <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => fetchNotifications({ limit: 50 })}
                className="text-xs text-[#00d4ff] hover:text-[#00d4ff]/60 font-semibold transition-colors"
              >
                Xem thêm
              </button>
              <span className="text-[11px] text-white/25">
                {notifications.length} thông báo
              </span>
            </div>
          )}
        </div>
      )}

      {/* Notification Detail Modal */}
      <NotificationDetail
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkRead={markAsRead}
      />

      {/* Bell ring + panel animation */}
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(8deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(6deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(0deg); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
