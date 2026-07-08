import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Film,
  Tag,
  CreditCard,
  Settings,
  Heart,
  MessageCircle,
  Crown,
  PlaySquare,
  Dot,
} from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail?: (notification: Notification) => void;
}

const TYPE_CONFIG = {
  movie: {
    icon: Film,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    label: "Phim",
  },
  promotion: {
    icon: Tag,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    label: "Ưu đãi",
  },
  payment: {
    icon: CreditCard,
    color: "text-green-400",
    bg: "bg-green-400/10",
    label: "Thanh toán",
  },
  system: {
    icon: Settings,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
    label: "Hệ thống",
  },
  favorite: {
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    label: "Yêu thích",
  },
  comment: {
    icon: MessageCircle,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    label: "Bình luận",
  },
  subscription: {
    icon: Crown,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    label: "Gói VIP",
  },
  new_episode: {
    icon: PlaySquare,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    label: "Tập mới",
  },
};

const PRIORITY_DOT = {
  high: "bg-red-500",
  normal: "bg-blue-500",
  low: "bg-gray-500",
};

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  onViewDetail,
}: NotificationItemProps) => {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  const handleClick = () => {
    // Mở modal chi tiết nếu có handler
    if (onViewDetail) {
      if (!notification.isRead) onMarkRead(notification._id);
      onViewDetail(notification);
      return;
    }
    // Fallback: hành vi cũ
    if (!notification.isRead) onMarkRead(notification._id);
    if (notification.link && notification.link !== "/") {
      window.location.href = notification.link;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div
      onClick={handleClick}
      className={`group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-200
        hover:bg-white/5 border-b border-white/5 last:border-0
        ${!notification.isRead ? "bg-white/[0.03]" : ""}`}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span
          className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[notification.priority]}`}
        />
      )}

      {/* Icon hoặc thumbnail */}
      <div className="shrink-0 mt-0.5">
        {notification.image ? (
          <img
            src={notification.image}
            alt={notification.title}
            className="w-12 h-16 rounded object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}
          >
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold leading-snug truncate ${!notification.isRead ? "text-white" : "text-white/70"}`}
          >
            {notification.title}
          </p>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id);
            }}
            className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-150 rounded"
            aria-label="Xóa thông báo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="text-xs text-white/50 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${config.bg} ${config.color}`}
          >
            {config.label}
          </span>
          <Dot className="w-3 h-3 text-white/20" />
          <span className="text-[11px] text-white/35">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
