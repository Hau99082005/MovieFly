import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MoviesDetailt from "./pages/MoviesDetailt";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourite from "./pages/Favourite";
import Schedule from "./pages/Schedule";
import TestConnection from "./pages/TestConnection";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Footer from "./components/Layout/Footer";
import { api } from "./lib/api";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  useEffect(() => {
    const testConnection = async () => {
      console.log("🔍 Testing server connection...");
      
      try {
        const isConnected = await api.testConnection();
        
        if (isConnected) {
          toast.success("Kết nối server thành công!", {
            duration: 3000,
            position: "top-right",
          });
          console.log("✅ Server connection successful");
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

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MoviesDetailt />} />
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
