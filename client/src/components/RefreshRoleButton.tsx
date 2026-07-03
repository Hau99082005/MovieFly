import { useUser } from "@clerk/clerk-react";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export function RefreshRoleButton() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const refreshRole = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const email = user.emailAddresses[0]?.emailAddress;
      const username = user.username || email?.split("@")[0] || `user_${user.id.substring(0, 8)}`;
      const full_name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || username;

      const syncResponse = await fetch(`${API_URL}/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          username,
          email,
          full_name,
          avatar_url: user.imageUrl || "",
        }),
      });

      const syncData = await syncResponse.json();
      
      if (syncData.user?.role) {
        localStorage.setItem("userRole", syncData.user.role);
        alert(`Role updated: ${syncData.user.role}`);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to refresh role:", error);
      alert("Failed to refresh role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={refreshRole}
      disabled={loading}
      className="fixed bottom-4 right-4 p-3 bg-primary text-black rounded-full shadow-lg hover:bg-primary-dull transition-colors"
      title="Refresh Role"
    >
      <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
    </button>
  );
}
