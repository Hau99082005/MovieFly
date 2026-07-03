import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourite from "./pages/Favourite";
import Schedule from "./pages/Schedule";
import TestConnection from "./pages/TestConnection";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Footer from "./components/Layout/Footer";
import { api } from "./lib/api";
import MovieDetailMovieFly from "./pages/MovieDetailMovieFly";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await api.testConnection();
        
        if (isConnected) {
          toast.success("Kết nối server thành công!", {
            duration: 3000,
            position: "top-right",
          });
        } else {
          toast.error("❌ Không thể kết nối tới server", {
            duration: 5000,
            position: "top-right",
          });
          console.error("❌ Server connection failed");
        }
      } catch (error) {
        toast.error("❌ Lỗi kết nối server: " + (error instanceof Error ? error.message : "Unknown error"), {
          duration: 5000,
          position: "top-right",
        });
        console.error("❌ Connection error:", error);
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const syncUserToBackend = async () => {
      if (!user) return;

      try {
        const email = user.emailAddresses[0]?.emailAddress;
        const username = user.username || email?.split("@")[0] || `user_${user.id.substring(0, 8)}`;
        const full_name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || username;

        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/users/sync`, {
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

        console.log("✅ User synced to backend");
      } catch (error) {
        console.error("❌ Failed to sync user:", error);
      }
    };

    if (isLoaded && user) {
      syncUserToBackend();
    }
  }, [user, isLoaded]);

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetailMovieFly />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favourite />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/test-connection" element={<TestConnection />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
