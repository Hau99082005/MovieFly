import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  X,
  Ticket,
  Home,
  Tv,
  Baby,
  Bell,
  Cast,
} from "lucide-react";
import { useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { assets } from "@/assets/assets";

const primaryLinks = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/tv", label: "Truyền hình", icon: Tv },
  { to: "/kids", label: "Thiếu nhi", icon: Baby },
];

const secondaryLinks = [
  { to: "/series", label: "Phim Bộ" },
  { to: "/movies", label: "Phim Điện Ảnh" },
  { to: "/galaxy-play", label: "Galaxy Play" },
  { to: "/tv-show", label: "TV Show" },
  { to: "/events", label: "Sự Kiện" },
  { to: "/sports", label: "Thể Thao" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full bg-transparent flex flex-col">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src={assets.logoMain}
                alt="MovieFly"
                className="h-10 md:h-30 w-auto object-contain relative top-2"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6 relative right-10">
              {primaryLinks.map(({ to, label, icon: Icon }, index) => (
                <div key={to + label} className="flex items-center">
                  <Link
                    to={to}
                    onClick={() => scrollTo(0, 0)}
                    className={`flex items-center gap-2 font-semibold transition-colors duration-200
                      ${
                        pathname === to
                          ? "text-white"
                          : "text-white hover:text-white/90"
                      }`}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: "500",
                      fontStyle: "normal",
                      lineHeight: 1.4,
                      letterSpacing: "0.01em",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                  {index < primaryLinks.length - 1 && (
                    <span className="ml-6 text-white/50">|</span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-5 shrink-0">
            <button
              className="px-4 py-3 bg-primary hover:bg-primary/50 transition-colors rounded text-sm font-bold text-black hover:text-white"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
                borderRadius: "5px",
              }}
            >
              ĐĂNG KÝ GÓI
            </button>
            <span
              className="text-sm font-medium text-white hover:text-white/90 cursor-pointer transition-colors"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                fontStyle: "normal",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              Nhập mã MovieFly
            </span>
            <button
              aria-label="Tìm kiếm"
              className="text-white hover:text-white/90 transition-colors w-11 h-11 flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              aria-label="Cast"
              className="text-white hover:text-white/90 transition-colors w-11 h-11 flex items-center justify-center"
            >
              <Cast className="w-5 h-5" />
            </button>
            <button
              aria-label="Thông báo"
              className="text-white hover:text-white/90 transition-colors relative w-11 h-11 flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                1
              </span>
            </button>
            {!user ? (
              <div
                className="w-8 h-8 rounded-full bg-transparent border border-white/50 flex items-center justify-center cursor-pointer hover:border-white transition-colors"
                onClick={() => openSignIn()}
              >
                <span className="text-xs font-bold text-white">VIP</span>
              </div>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Xem phim của tôi"
                    labelIcon={<Ticket width={20} />}
                    onClick={() => (window.location.href = "/my-bookings")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          <button
            aria-label="Mở menu"
            className="lg:hidden text-white hover:text-white/90 transition-colors w-11 h-11 flex items-center justify-center"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden lg:block w-full h-px bg-white/30"></div>

        <div className="hidden lg:flex items-center px-4 lg:px-8 h-12 bg-transparent overflow-x-auto no-scrollbar">
          <nav className="flex items-center">
            {secondaryLinks.map(({ to, label }, index) => (
              <div key={to + label} className="flex items-center">
                <Link
                  to={to}
                  onClick={() => scrollTo(0, 0)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors duration-200
                    ${
                      pathname === to
                        ? "text-white"
                        : "text-white hover:text-white/90"
                    }`}
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    fontStyle: "normal",
                    fontFamily: "'Roboto', sans-serif",
                    lineHeight: 1.4,
                    letterSpacing: "0.01em",
                  }}
                >
                  {label}
                </Link>
                {index < secondaryLinks.length - 1 && (
                  <span className="mx-4 text-white/50">|</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0a0a0a] border-l border-white/10
          flex flex-col py-6 px-6 gap-6 lg:hidden overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <img
            src={assets.logoMain}
            alt="MovieFly"
            className="h-8 w-auto object-contain"
          />
          <button
            aria-label="Đóng menu"
            className="text-white/60 hover:text-white transition-colors w-11 h-11 flex items-center justify-center"
            onClick={closeMenu}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to + label}
              to={to}
              onClick={() => {
                scrollTo(0, 0);
                closeMenu();
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  pathname === to
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>

        <div className="w-full h-px bg-white/10"></div>

        <div className="flex flex-col gap-2">
          {secondaryLinks.map(({ to, label }) => (
            <Link
              key={to + label}
              to={to}
              onClick={() => {
                scrollTo(0, 0);
                closeMenu();
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  pathname === to
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/10">
          <button className="w-full py-3 bg-primary hover:bg-primary/50 transition-colors rounded-lg text-sm font-bold text-black">
            ĐĂNG KÝ GÓI
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
            <Search className="w-4 h-4" />
            Tìm kiếm
          </button>
          {!user ? (
            <button
              onClick={() => {
                openSignIn();
                closeMenu();
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all duration-200 rounded-lg text-sm font-semibold text-white cursor-pointer"
            >
              Đăng nhập
            </button>
          ) : (
            <div className="flex justify-center py-2">
              <UserButton />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;
