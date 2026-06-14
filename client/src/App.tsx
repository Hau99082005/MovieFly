import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Layout/Header";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MoviesDetailt from "./pages/MoviesDetailt";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourite from "./pages/Favourite";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Layout/Footer";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

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
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
