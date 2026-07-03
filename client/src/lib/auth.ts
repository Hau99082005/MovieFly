const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  birth_day?: string;
  status: "active" | "inactive" | "banned";
  role: "user" | "admin" | "moderator";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  birth_day?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const result = await response.json();
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const result = await response.json();
  localStorage.setItem("token", result.token);
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to get user");
  }

  const result = await response.json();
  return result.user;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getStoredUser();
  return user?.role === "admin";
};

export const isModerator = (): boolean => {
  const user = getStoredUser();
  return user?.role === "admin" || user?.role === "moderator";
};
