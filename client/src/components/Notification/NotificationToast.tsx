import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  movie: "#3b82f6",
  promotion: "#eab308",
  payment: "#22c55e",
  system: "#6b7280",
  favorite: "#ec4899",
  comment: "#a855f7",
  subscription: "#f59e0b",
  new_episode: "#06b6d4",
};

const NotificationToast = ({
  notification,
  onClose,
  onMarkRead,
}: NotificationToastProps) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!notification) {
      setVisible(false);
      return;
    }
    // Trigger enter animation
    setExiting(false);
    setVisible(true);

    // Auto dismiss sau 5 giây
    const autoClose = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(autoClose);
  }, [notification]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 300);
  };

  const handleClick = () => {
    if (notification) {
      onMarkRead(notification._id);
      if (notification.link && notification.link !== "/") {
        window.location.href = notification.link;
      }
    }
    handleClose();
  };

  if (!visible || !notification) return null;

  const accentColor = TYPE_COLORS[notification.type] || TYPE_COLORS.system;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[1000] w-[340px] max-w-[calc(100vw-24px)]
        cursor-pointer select-none`}
      style={{
        animation: exiting
          ? "toastExit 0.3s ease-in forwards"
          : "toastEnter 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
      onClick={handleClick}
    >
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
        style={{
          width: "100%",
          background: accentColor,
          animation: "progressBar 5s linear forwards",
          transformOrigin: "left",
        }}
      />

      <div
        className="relative bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), 0 0 20px ${accentColor}22` }}
      >
        {/* Accent bar left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: accentColor }}
        />

        <div className="flex items-start gap-3 pl-4 pr-3 py-3">
          {/* Icon / thumbnail */}
          <div className="shrink-0">
            {notification.image ? (
              <img
                src={notification.image}
                alt=""
                className="w-12 h-14 rounded object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `${accentColor}20` }}
              >
                <Bell style={{ width: 18, height: 18, color: accentColor }} />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <p className="text-[13px] font-bold text-white leading-tight truncate">
                {notification.title}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="shrink-0 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[12px] text-white/55 mt-0.5 line-clamp-2 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-[11px] mt-1.5 font-medium" style={{ color: accentColor }}>
              Thông báo mới • Nhấn để xem
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes toastEnter {
          from { opacity: 0; transform: translateX(100%) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastExit {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(100%) scale(0.9); }
        }
        @keyframes progressBar {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
