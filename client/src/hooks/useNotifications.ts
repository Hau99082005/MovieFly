import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "movie"
    | "promotion"
    | "payment"
    | "system"
    | "favorite"
    | "comment"
    | "subscription"
    | "new_episode";
  priority: "low" | "normal" | "high";
  image: string;
  link: string;
  isRead: boolean;
  deleted: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  pagination: NotificationPagination | null;
  isLoading: boolean;
  isConnected: boolean;
  newNotification: Notification | null; // Thông báo mới nhất để hiện toast
  fetchNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean | "";
  }) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAll: () => Promise<void>;
  clearNewNotification: () => void;
}

const getAuthHeaders = (): Record<string, string> => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Hook quản lý thông báo + kết nối SSE realtime
 * @param userId - MongoDB _id của user (không phải clerkId)
 */
export const useNotifications = (
  userId: string | null | undefined,
): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState<NotificationPagination | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(
    null,
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT = 5;

  // ─── Fetch danh sách notification ─────────────────────────────────────────
  const fetchNotifications = useCallback(
    async (
      params: {
        page?: number;
        limit?: number;
        type?: string;
        isRead?: boolean | "";
      } = {},
    ) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (params.page) query.set("page", String(params.page));
        if (params.limit) query.set("limit", String(params.limit));
        if (params.type) query.set("type", params.type);
        if (params.isRead !== undefined && params.isRead !== "")
          query.set("isRead", String(params.isRead));

        const res = await fetch(
          `${API_URL}/notifications/user/${userId}?${query}`,
          { headers: getAuthHeaders() },
        );
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data || []);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        console.error("❌ fetchNotifications error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  // ─── Fetch unread count ────────────────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/notifications/unread/${userId}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) setUnreadCount(data.unread);
    } catch {
      // silent
    }
  }, [userId]);

  // ─── Mark as Read ──────────────────────────────────────────────────────────
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/notifications/${id}/read`, {
          method: "PATCH",
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error("❌ markAsRead error:", err);
      }
    },
    [],
  );

  // ─── Mark All as Read ──────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${API_URL}/notifications/read-all/${userId}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("❌ markAllAsRead error:", err);
    }
  }, [userId]);

  // ─── Delete one ────────────────────────────────────────────────────────────
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNotifications((prev) => {
          const removed = prev.find((n) => n._id === id);
          if (removed && !removed.isRead) {
            setUnreadCount((c) => Math.max(0, c - 1));
          }
          return prev.filter((n) => n._id !== id);
        });
      }
    } catch (err) {
      console.error("❌ deleteNotification error:", err);
    }
  }, []);

  // ─── Delete all ────────────────────────────────────────────────────────────
  const deleteAll = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/notifications/all/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("❌ deleteAll error:", err);
    }
  }, [userId]);

  // ─── Clear new notification toast ──────────────────────────────────────────
  const clearNewNotification = useCallback(() => {
    setNewNotification(null);
  }, []);

  // ─── SSE Connection ────────────────────────────────────────────────────────
  const connectSSE = useCallback(() => {
    if (!userId) return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    if (!token) return;

    // Đóng kết nối cũ nếu có
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // EventSource không hỗ trợ custom headers, dùng token trong URL
    const url = `${API_URL}/notifications/stream?token=${token}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log("📡 SSE: Connected to notification stream");
    });

    es.addEventListener("notification", (event) => {
      try {
        const notif = JSON.parse(event.data) as Notification;
        // Thêm vào đầu danh sách
        setNotifications((prev) => [notif, ...prev]);
        // Tăng badge unread
        setUnreadCount((prev) => prev + 1);
        // Kích hoạt toast
        setNewNotification(notif);
      } catch {
        // ignore parse error
      }
    });

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      eventSourceRef.current = null;

      // Exponential backoff reconnect
      if (reconnectAttempts.current < MAX_RECONNECT) {
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttempts.current),
          30000,
        );
        reconnectAttempts.current += 1;
        console.log(
          `📡 SSE: Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempts.current})...`,
        );
        reconnectTimerRef.current = setTimeout(connectSSE, delay);
      }
    };
  }, [userId]);

  // ─── Auth middleware cho SSE (token trong query) ───────────────────────────
  // Server cần đọc token từ query string khi dùng EventSource
  // (đã xử lý trong controller bên dưới)

  // ─── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setIsConnected(false);
      return;
    }

    fetchNotifications({ limit: 20 });
    fetchUnreadCount();
    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [userId, connectSSE, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    pagination,
    isLoading,
    isConnected,
    newNotification,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAll,
    clearNewNotification,
  };
};
