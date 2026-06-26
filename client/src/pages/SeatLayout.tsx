import { dummyDateTimeData, dummyShowsData } from "@/assets/assets";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import { TicketIcon, PlayCircle } from "lucide-react";

interface Movie {
  _id: string;
  title: string;
  backdrop_path: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  release_date?: string;
  runtime?: number;
}

interface ShowState {
  movie: Movie;
  dateTime: Record<string, any[]>;
}

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 12;
const ticketPrice = 65000;
const vipPrice = 85000;
const couplePrice = 120000;

const vipRows = ["E", "F"];
const coupleRows = ["G", "H"];

const SeatLayout = () => {
  const { id, date } = useParams<{ id: string; date: string }>();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [show, setShow] = useState<ShowState | null>(null);
  const [occupiedSeats] = useState<string[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(300);

  const navigate = useNavigate();

  const getShow = async () => {
    const foundMovie = dummyShowsData.find((show) => show._id === id);
    if (foundMovie) {
      setShow({
        movie: foundMovie,
        dateTime: dummyDateTimeData,
      });
      if (date && (dummyDateTimeData as Record<string, any[]>)[date]) {
        setSelectedTime(
          (dummyDateTimeData as Record<string, any[]>)[date][0]?.time || null,
        );
      }
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setRemainingSeconds(300);
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelectedSeats([]);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSeats.length]);

  const formatTimeDisplay = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeatPrice = (seat: string) => {
    if (coupleRows.includes(seat.charAt(0))) return couplePrice;
    if (vipRows.includes(seat.charAt(0))) return vipPrice;
    return ticketPrice;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat), 0);
  };

  const getSeatType = (seat: string) => {
    if (coupleRows.includes(seat.charAt(0))) return "couple";
    if (vipRows.includes(seat.charAt(0))) return "vip";
    return "standard";
  };

  return show ? (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,212,255,0.1),transparent_60%)] pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm sm:text-base">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-zinc-800 flex items-center justify-center">
              <TicketIcon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
            </div>
            <span className="font-medium hidden sm:inline">
              Chọn phim/ suất
            </span>
          </div>
          <div className="hidden sm:block w-12 lg:w-24 h-0.5 bg-zinc-700"></div>
          <div className="flex items-center gap-1.5 text-primary text-sm sm:text-base font-bold">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <TicketIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="hidden sm:inline">Chọn ghế</span>
          </div>
          <div className="hidden md:block w-12 lg:w-24 h-0.5 bg-zinc-700"></div>
          <div className="hidden md:flex items-center gap-1.5 text-gray-500 text-sm sm:text-base">
            <span>Chọn Bắp Nước</span>
          </div>
          <div className="hidden lg:block w-12 lg:w-24 h-0.5 bg-zinc-700"></div>
          <div className="hidden lg:flex items-center gap-1.5 text-gray-500 text-sm sm:text-base">
            <span>Thanh toán</span>
          </div>
          <div className="hidden xl:block w-12 lg:w-24 h-0.5 bg-zinc-700"></div>
          <div className="hidden xl:flex items-center gap-1.5 text-gray-500 text-sm sm:text-base">
            <span>Xác nhận</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="text-sm sm:text-base text-gray-400">
                  Có thể chọn tối đa 10 ghế
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="w-full max-w-3xl mx-auto relative">
                  <div className="absolute -top-6 sm:-top-8 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-primary/30 to-transparent rounded-t-[100%]"></div>
                  <p className="text-center text-xs sm:text-sm text-gray-500 uppercase tracking-[0.3em] pt-3 sm:pt-4">
                    SCREEN
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 sm:gap-3 w-full max-w-full overflow-x-auto">
                {rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-1.5 sm:gap-2 justify-center"
                  >
                    <span className="w-6 sm:w-7 text-center text-gray-500 text-sm sm:text-base font-mono flex-shrink-0">
                      {row}
                    </span>
                    <div className="flex gap-1.5 sm:gap-2 justify-center flex-shrink-0">
                      {Array.from({ length: seatsPerRow }, (_, i) => {
                        const seatNum = i + 1;
                        const seatId = `${row}${seatNum.toString().padStart(2, "0")}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        const type = getSeatType(seatId);

                        const baseClasses =
                          type === "couple"
                            ? "w-10 h-8 sm:w-14 sm:h-10"
                            : "w-8 h-8 sm:w-10 sm:h-10";

                        let bgClass = "bg-zinc-800 border-zinc-600";
                        let textClass = "text-gray-300";
                        if (isOccupied) {
                          bgClass = "bg-zinc-700 border-zinc-600";
                        } else if (isSelected) {
                          bgClass =
                            "bg-primary border-primary shadow-[0_0_12px_rgba(0,212,255,0.5)] scale-105 sm:scale-110";
                          textClass = "text-black font-bold";
                        } else if (type === "vip") {
                          bgClass =
                            "bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30";
                        } else if (type === "couple") {
                          bgClass =
                            "bg-pink-500/20 border-pink-500 hover:bg-pink-500/30";
                        } else {
                          bgClass =
                            "bg-zinc-800 border-zinc-600 hover:bg-zinc-700";
                        }

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isOccupied}
                            className={`${baseClasses} rounded-t-md sm:rounded-t-lg border-2 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-mono ${textClass} ${
                              isOccupied
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } ${bgClass}`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-6 sm:w-7 text-center text-gray-400 text-sm sm:text-base font-mono flex-shrink-0">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-6 sm:mt-8">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-zinc-700 border border-zinc-500 rounded-sm"></div>
                  <span className="text-sm sm:text-base text-gray-300">
                    Thường
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500/20 border border-yellow-500 rounded-sm"></div>
                  <span className="text-sm sm:text-base text-gray-300">
                    VIP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-8 h-4 sm:w-10 sm:h-5 bg-pink-500/20 border-pink-500 rounded-sm"></div>
                  <span className="text-sm sm:text-base text-gray-300">
                    Couple
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary border border-primary rounded-t-sm"></div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    Đang chọn
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-zinc-700 border border-zinc-600 rounded-t-sm"></div>
                  <span className="text-xs sm:text-sm text-gray-300">
                    Đã bán
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden mb-4">
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-3">
                  Các khung giờ
                </h3>
                <div className="space-y-2">
                  {date &&
                  (dummyDateTimeData as Record<string, any[]>)[date] ? (
                    (dummyDateTimeData as Record<string, any[]>)[date].map(
                      (slot: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            selectedTime === slot.time
                              ? "bg-primary text-black shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                              : "bg-zinc-800/50 text-gray-300 hover:bg-zinc-700/70 border border-zinc-700/50"
                          }`}
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span className="font-mono text-sm">
                            {formatTime(slot.time)}
                          </span>
                        </button>
                      ),
                    )
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Không có suất chiếu nào
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <img
                    src={show.movie.poster_path || show.movie.backdrop_path}
                    alt={show.movie.title}
                    className="w-24 h-32 sm:w-28 sm:h-40 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1">
                      {show.movie.title.toUpperCase()} (T18)
                    </h3>
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-xs sm:text-sm text-gray-400">2D</p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Suất chiếu:{" "}
                        {date ? new Date(date).toLocaleDateString("vi-VN") : ""}{" "}
                        - {selectedTime ? formatTime(selectedTime) : ""}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Rạp: 03
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Ghế:{" "}
                        {selectedSeats.length > 0
                          ? selectedSeats.join(", ")
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="h-px bg-zinc-700 mb-3 sm:mb-4"></div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm sm:text-base text-gray-400">
                    {selectedSeats.length} ghế
                  </span>
                  <span className="text-sm sm:text-base text-gray-400">
                    0 đ
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-sm sm:text-base text-gray-300">
                    Tổng tiền
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-primary">
                    {getTotalPrice().toLocaleString()} đ
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-3 sm:py-3.5 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors text-base"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={() => alert("Đặt vé thành công!")}
                    disabled={selectedSeats.length === 0}
                    className="flex-1 py-3 sm:py-3.5 bg-primary text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,212,255,0.3)] text-base"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
              Thời gian giữ ghế: {formatTimeDisplay()}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
