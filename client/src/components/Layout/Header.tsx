import { Link, useLocation } from "react-router-dom";
import { MenuIcon, SearchIcon, XIcon, TicketIcon } from "lucide-react";
import { useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { assets } from "@/assets/assets";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/movies", label: "Xem phim" },
  { to: "/schedule", label: "Lịch chiếu" },
  { to: "/releases", label: "Mới nhất" },
  { to: "/favorite", label: "Yêu thích" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full px-4 md:px-12 lg:px-20 py-2 md:py-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={assets.logoMain}
            alt="MovieFly"
            className="h-24 sm:h-28 md:h-24 lg:h-28 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/8 border border-white/10">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to + label}
              to={to}
              onClick={() => scrollTo(0, 0)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${
                  pathname === to
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          <button className="text-white/60 hover:text-white transition-colors duration-200">
            <SearchIcon className="w-5 h-5" />
          </button>
          {!user ? (
            <button
              onClick={() => openSignIn()}
              className="px-5 py-2 bg-primary hover:bg-primary/85 active:scale-95 transition-all duration-200 rounded-full text-sm font-semibold text-white cursor-pointer"
            >
              Đăng nhập
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Đặt vé"
                  labelIcon={<TicketIcon width={20} />}
                  onClick={() => (window.location.href = "/my-bookings")}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>

        <button
          className="md:hidden text-white/80 hover:text-white transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-zinc-950 border-l border-white/10
          flex flex-col pt-20 pb-16 px-6 gap-2 md:hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
          onClick={closeMenu}
        >
          <XIcon className="w-6 h-6" />
        </button>

        {navLinks.map(({ to, label }) => (
          <Link
            key={to + label}
            to={to}
            onClick={() => {
              scrollTo(0, 0);
              closeMenu();
            }}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                pathname === to
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/6 hover:text-white"
              }`}
          >
            {label}
          </Link>
        ))}

        <div className="mt-auto flex flex-col gap-3">
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/6 transition-all duration-200">
            <SearchIcon className="w-4 h-4" />
            Tìm kiếm
          </button>
          {!user ? (
            <button
              onClick={() => {
                openSignIn();
                closeMenu();
              }}
              className="w-full py-3 bg-primary hover:bg-primary/85 transition-all duration-200 rounded-xl text-sm font-semibold text-white cursor-pointer"
            >
              Đăng nhập
            </button>
          ) : (
            <div className="flex justify-center">
              <UserButton />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Header;
