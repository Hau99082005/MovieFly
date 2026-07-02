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
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
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
      console.log("🔍 Testing connection to:", this.baseURL.replace("/api", "/"));
      const response = await fetch(this.baseURL.replace("/api", "/"));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ Server connection successful!");
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
    }).then(res => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/banners/${id}`, {
      method: "PUT",
      body: data,
    }).then(res => res.json()),
  delete: (id: string) => api.delete(`/banners/${id}`),
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
    }).then(res => res.json()),
  update: (id: string, data: FormData) =>
    fetch(`${API_URL}/payments-method/${id}`, {
      method: "PUT",
      body: data,
    }).then(res => res.json()),
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
  getUserStats: (userId: string) => api.get(`/transactions/user/${userId}/stats`),
  create: (data: any) => api.post("/transactions", data),
  updateStatus: (id: string, data: any) => api.patch(`/transactions/${id}/status`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export default api;
