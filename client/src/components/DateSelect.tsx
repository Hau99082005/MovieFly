import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface DateTimeData {
  [key: string]: any[];
}

interface DateSelectProps {
  dateTime: DateTimeData;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onBookHandler?: () => void;
  id?: string;
}

const DateSelect = ({ dateTime, selectedDate, onDateChange, onBookHandler, id }: DateSelectProps) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(selectedDate);
    
    useEffect(() => {
        setSelected(selectedDate);
    }, [selectedDate]);
    
    const handleBook = () => {
        if(onBookHandler) {
            onBookHandler();
        } else {
            if(!selected) {
                return toast("vui lòng chọn ngày!");
            }
            navigate(`/movies/${id}/${selected}`)
            scrollTo(0,0)
        }
    }
  return (
    <div id={id} className="relative">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 relative p-6 bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />
        <div className="z-10 w-full md:w-auto flex-1">
          <p className="text-sm font-semibold text-gray-400 mb-4">Chọn ngày</p>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors">
              <ChevronLeftIcon width={20} />
            </button>
            <div className="flex flex-wrap gap-3 flex-1">
              {Object.keys(dateTime).map((date) => {
                const isSelected = date === selectedDate;
                return (
                  <button
                    key={date}
                    onClick={() => {
                      onDateChange(date);
                      setSelected(date);
                    }}
                    className={`flex flex-col items-center justify-center h-16 w-16 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-zinc-700 text-white hover:bg-zinc-600"
                    }`}
                  >
                    <span className="text-lg font-bold">{new Date(date).getDate()}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(date).toLocaleDateString("vi-VN", {
                        month: "short",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
            <button className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white transition-colors">
              <ChevronRightIcon width={20} />
            </button>
          </div>
        </div>
        <button
          onClick={handleBook}
          className="w-full md:w-auto bg-primary text-black px-8 py-3 rounded-lg hover:bg-primary-dull transition-all duration-200 font-bold cursor-pointer z-10 md:self-end mb-4"
        >
          Đặt vé ngay
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
