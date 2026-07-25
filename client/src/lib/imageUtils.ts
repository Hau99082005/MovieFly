const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getImageUrl = (url: string | undefined | null): string => {
  if (!url || url === "") return "";
  
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  if (url.startsWith("/uploads/")) {
    return `${API_URL.replace("/api", "")}${url}`;
  }
  
  if (url.startsWith("uploads/")) {
    return `${API_URL.replace("/api", "")}/${url}`;
  }
  
  return url;
};
