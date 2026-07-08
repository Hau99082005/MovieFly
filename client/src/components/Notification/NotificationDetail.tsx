import { useEffect, useRef } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  X,
  ExternalLink,
  Film,
  Tag,
  CreditCard,
  Settings,
  Heart,
  MessageCircle,
  Crown,
  PlaySquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationDetailProps {
  notification: Notification | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; gradient: string; label: string }
> = {
  movie: { icon: Film, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", gradient: "from-blue-500/20 to-transparent", label: "Phim" },
  promotion: { icon: Tag, color: "#eab308", bg: "rgba(234,179,8,0.12)", gradient: "from-yellow-500/20 to-transparent", label: "Uu dai" },
  payment: { icon: CreditCard, color: "#22c55e", bg: "rgba(34,197,94,0.12)", gradient: "from-green-500/20 to-transparent", label: "Thanh toan" },
  system: { icon: Settings, color: "#94a3b8", bg: "rgba(148,163,184,0.12)", gradient: "from-slate-500/20 to-transparent", label: "He thong" },
  favorite: { icon: Heart, color: "#ec4899", bg: "rgba(236,72,153,0.12)", gradient: "from-pink-500/20 to-transparent", label: "Yeu thich" },
  comment: { icon: MessageCircle, color: "#a855f7", bg: "rgba(168,85,247,0.12)", gradient: "from-purple-500/20 to-transparent", label: "Binh luan" },
  subscription: { icon: Crown, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", gradient: "from-amber-500/20 to-transparent", label: "Goi VIP" },
  new_episode: { icon: PlaySquare, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", gradient: "from-cyan-500/20 to-transparent", label: "Tap moi" },
};

const PRIORITY_CONFIG = {
  high: { label: "Uu tien cao", color: "#ef4444", dot: "bg-red-500" },
  normal: { label: "Thong thuong", color: "#3b82f6", dot: "bg-blue-500" },
  low: { label: "Thap", color: "#6b7280", dot: "bg-gray-500" },
};

const NotificationDetail = ({ notification, onClose, onMarkRead }: NotificationDetailProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notification) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [notification, onClose]);

  if (!notification) return null;

  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;
  const priority = PRIORITY_CONFIG[notification.priority] || PRIORITY_CONFIG.normal;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  };

  const handleGoToLink = () => {
    if (!notification.isRead) onMarkRead(notification._id);
    if (notification.link && notification.link !== "/") window.location.href = notification.link;
    onClose();
  };

  const handleMarkRead = () => {
    if (!notification.isRead) onMarkRead(notification._id);
    onClose();
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi });
  const fullDate = format(new Date(notification.createdAt), "HH:mm - dd/MM/yyyy");

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md overflow-hidden"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          boxShadow: `0 32px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${config.color}18`,
          animation: "ndModalIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${config.gradient} pointer-events-none`} />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative p-6">
          <div className="flex items-start gap-4 mb-5">
            {notification.image ? (
              <img src={notification.image} alt={notification.title} className="w-16 h-20 rounded-lg object-cover shrink-0 shadow-lg"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ background: config.bg, border: `1px solid ${config.color}30` }}>
                <Icon className="w-7 h-7" style={{ color: config.color }} />
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: config.bg, color: config.color }}>{config.label}</span>
                <span className="flex items-center gap-1 text-[11px]" style={{ color: priority.color }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />{priority.label}
                </span>
                {notification.isRead && (
                  <span className="flex items-center gap-1 text-[11px] text-green-400/80">
                    <CheckCircle2 className="w-3 h-3" />Da doc
                  </span>
                )}
              </div>
              <h2 className="text-[17px] font-bold text-white leading-tight pr-8">{notification.title}</h2>
            </div>
          </div>

          <div className="w-full h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />

          <div className="mb-5">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{notification.message}</p>
          </div>

          <div className="flex items-center gap-2 mb-6 px-3 py-2.5 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Clock className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-xs text-white/40">{timeAgo}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/30">{fullDate}</span>
          </div>

          <div className="flex gap-2.5">
            {notification.link && notification.link !== "/" && (
              <button onClick={handleGoToLink}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-black transition-all duration-200 active:scale-95"
                style={{ background: config.color, boxShadow: `0 0 20px ${config.color}40` }}>
                <ExternalLink className="w-4 h-4" />Xem chi tiet
              </button>
            )}
            {!notification.isRead ? (
              <button onClick={handleMarkRead}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 active:scale-95">
                <CheckCircle2 className="w-4 h-4" />Danh dau da doc
              </button>
            ) : (
              (!notification.link || notification.link === "/") && (
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200">
                  Dong
                </button>
              )
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes ndModalIn { from { opacity:0; transform:scale(0.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
};

export default NotificationDetail;