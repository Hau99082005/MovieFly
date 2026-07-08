const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  total?: number;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options?.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        const error = await response.json();
        throw new Error(
          error.message || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.baseURL.replace("/api", "/"));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📦 Server response:", data);
      return true;
    } catch (error) {
      console.error("❌ Server connection failed!");
      console.error("❌ Error details:", error);
      return false;
    }
  }
}

export const api = new ApiService(API_URL);

export const bannersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/banners`);
    return await response.json();
  },
  getActive: async () => {
    const response = await fetch(`${API_URL}/banners?is_active=true`);
    return await response.json();
  },
  getById: (id: string) => api.get(`/banners/${id}`),
  create: (data: FormData) =>
    fetch(`${API_URL}/banners`, {
      method: "POST",
      body: data,
    }).then((res) => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/banners/${id}`, {
      method: "PUT",
      body: data,
    }).then((res) => res.json()),
  delete: (id: string) => api.delete(`/banners/${id}`),
};

export const movieCastApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/movie-cast`);
    return await response.json();
  },
  getById: (id: string) => api.get(`/movie-cast/${id}`),
  getByMovieId: async (movieId: string) => {
    const response = await fetch(`${API_URL}/movie-cast/movie/${movieId}`);
    return await response.json();
  },
  getByPersonId: async (personId: string) => {
    const response = await fetch(`${API_URL}/movie-cast/person/${personId}`);
    return await response.json();
  },
  create: (data: any) => api.post("/movie-cast", data),
  delete: (id: string) => api.delete(`/movie-cast/${id}`),
};

export const movieGenresApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/moviegenres`);
    return await response.json();
  },
  getById: (id: string) => api.get(`/moviegenres/${id}`),
  getByMovieId: async (movieId: string) => {
    const response = await fetch(`${API_URL}/moviegenres/movie/${movieId}`);
    return await response.json();
  },
  getByGenreId: async (genreId: string) => {
    const response = await fetch(`${API_URL}/moviegenres/genre/${genreId}`);
    return await response.json();
  },
  create: (data: any) => api.post("/moviegenres", data),
  delete: (id: string) => api.delete(`/moviegenres/${id}`),
};

export const moviesApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; type?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.status) queryParams.append("status", params.status);
    const url = `/movies${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(`${API_URL}${url}`);
    return await response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/movies/${id}`);
    return await response.json();
  },
  create: (data: FormData) =>
    fetch(`${API_URL}/movies`, {
      method: "POST",
      body: data,
    }).then((res) => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/movies/${id}`, {
      method: "PUT",
      body: data,
    }).then((res) => res.json()),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

export const paymentMethodsApi = {
  getAll: () => api.get("/payments-method"),
  getActive: () => api.get("/payments-method/active"),
  getById: (id: string) => api.get(`/payments-method/id/${id}`),
  getByCode: (code: string) => api.get(`/payments-method/code/${code}`),
  create: (data: FormData) =>
    fetch(`${API_URL}/payments-method`, {
      method: "POST",
      body: data,
    }).then((res) => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/payments-method/${id}`, {
      method: "PUT",
      body: data,
    }).then((res) => res.json()),
  delete: (id: string) => api.delete(`/payments-method/${id}`),
};

export const transactionsApi = {
  getAll: () => api.get("/transactions"),
  getById: (id: string) => api.get(`/transactions/${id}`),
  getByUserId: (userId: string) => api.get(`/transactions/user/${userId}`),
  getByStatus: (status: string) => api.get(`/transactions/status/${status}`),
  getBySubscriptionId: (subscriptionId: string) =>
    api.get(`/transactions/subscription/${subscriptionId}`),
  getByPaymentMethod: (paymentMethodId: string) =>
    api.get(`/transactions/payment-method/${paymentMethodId}`),
  getUserStats: (userId: string) =>
    api.get(`/transactions/user/${userId}/stats`),
  create: (data: any) => api.post("/transactions", data),
  updateStatus: (id: string, data: any) =>
    api.patch(`/transactions/${id}/status`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const seasonsApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/seasons`);
    return await response.json();
  },
  getByMovieId: async (movieId: string) => {
    const response = await fetch(`${API_URL}/seasons/movie/${movieId}`);
    return await response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/seasons/${id}`);
    return await response.json();
  },
  create: (data: FormData) =>
    fetch(`${API_URL}/seasons`, {
      method: "POST",
      body: data,
    }).then((res) => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/seasons/${id}`, {
      method: "PUT",
      body: data,
    }).then((res) => res.json()),
  delete: (id: string) => api.delete(`/seasons/${id}`),
};

export const episodesApi = {
  getAll: async (params?: { movieId?: string; seasonId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.movieId) queryParams.append("movieId", params.movieId);
    if (params?.seasonId) queryParams.append("seasonId", params.seasonId);
    const url = `/episodes${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(`${API_URL}${url}`);
    return await response.json();
  },
  getBySeason: async (seasonId: string) => {
    const response = await fetch(`${API_URL}/episodes/season/${seasonId}`);
    return await response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/episodes/${id}`);
    return await response.json();
  },
  incrementView: (id: string) => api.patch(`/episodes/${id}/view`, {}),
  create: (data: FormData) =>
    fetch(`${API_URL}/episodes`, {
      method: "POST",
      body: data,
    }).then((res) => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/episodes/${id}`, {
      method: "PUT",
      body: data,
    }).then((res) => res.json()),
  delete: (id: string) => api.delete(`/episodes/${id}`),
};

export const commentsApi = {
  getAll: async (params?: {
    movieId?: string;
    episodeId?: string;
    userId?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.movieId) queryParams.append("movieId", params.movieId);
    if (params?.episodeId) queryParams.append("episodeId", params.episodeId);
    if (params?.userId) queryParams.append("userId", params.userId);
    if (params?.status) queryParams.append("status", params.status);
    const url = `/comments${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await fetch(`${API_URL}${url}`);
    return await response.json();
  },
  getByMovieId: async (movieId: string, status: string = "approved") => {
    const response = await fetch(
      `${API_URL}/comments/movie/${movieId}?status=${status}`,
    );
    return await response.json();
  },
  getByEpisodeId: async (episodeId: string, status: string = "approved") => {
    const response = await fetch(
      `${API_URL}/comments/episode/${episodeId}?status=${status}`,
    );
    return await response.json();
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/comments/${id}`);
    return await response.json();
  },
  create: (data: any) => api.post("/comments", data),
  update: (id: string, data: any) => api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
  like: (id: string) => api.patch(`/comments/${id}/like`, {}),
  unlike: (id: string) => api.patch(`/comments/${id}/unlike`, {}),
};

export const notificationsApi = {
  // Admin: tạo thông báo (đơn lẻ hoặc broadcast)
  create: (data: {
    userId?: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
    image?: string;
    broadcast?: boolean;
    priority?: "low" | "normal" | "high";
    metadata?: Record<string, unknown>;
  }) => api.post("/notifications", data),

  // Lấy danh sách (user xem của mình, admin xem bất kỳ)
  getByUserId: (
    userId: string,
    params?: { page?: number; limit?: number; type?: string; isRead?: boolean },
  ) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.type) q.set("type", params.type);
    if (params?.isRead !== undefined) q.set("isRead", String(params.isRead));
    return api.get(`/notifications/user/${userId}?${q}`);
  },

  // Đếm chưa đọc
  getUnreadCount: (userId: string) =>
    api.get(`/notifications/unread/${userId}`),

  // Đánh dấu đã đọc
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`, {}),
  markAllAsRead: (userId: string) =>
    api.patch(`/notifications/read-all/${userId}`, {}),

  // Xóa
  delete: (id: string) => api.delete(`/notifications/${id}`),
  deleteAll: (userId: string) => api.delete(`/notifications/all/${userId}`),
};

export default api;
