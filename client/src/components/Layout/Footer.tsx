import { Link } from "react-router-dom";
import { assets } from "@/assets/assets";

const footerLinks = [
  {
    title: "Khám phá",
    links: [
      { label: "Trang chủ", to: "/" },
      { label: "Xem phim", to: "/movies" },
      { label: "Lịch chiếu", to: "/schedule" },
      { label: "Mới nhất", to: "/releases" },
      { label: "Yêu thích", to: "/favorite" },
    ],
  },
  {
    title: "Thể loại",
    links: [
      { label: "Hành động", to: "/movies" },
      { label: "Kinh dị", to: "/movies" },
      { label: "Tình cảm", to: "/movies" },
      { label: "Hoạt hình", to: "/movies" },
      { label: "Khoa học viễn tưởng", to: "/movies" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", to: "/" },
      { label: "Điều khoản sử dụng", to: "/" },
      { label: "Chính sách bảo mật", to: "/" },
      { label: "Liên hệ chúng tôi", to: "/" },
    ],
  },
];

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    hoverClass: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    hoverClass:
      "hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045] hover:border-transparent hover:text-white",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    hoverClass: "hover:bg-black hover:border-white/30 hover:text-white",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/8 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="relative px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-5">
            <Link to="/" onClick={() => scrollTo(0, 0)}>
              <img
                src={assets.logoMain}
                alt="MovieFly"
                className="h-28 w-auto object-contain object-left"
              />
            </Link>
            <p
              className="text-sm text-gray-400 leading-relaxed max-w-xs"
              style={{
                fontSize: "15px",
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 1.8,
                letterSpacing: "0.01em",
              }}
            >
              Trải nghiệm điện ảnh đỉnh cao tại nhà. Khám phá hàng ngàn bộ phim
              hấp dẫn, đặt vé nhanh chóng và tận hưởng giải trí không giới hạn.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ svg, href, label, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/8 border border-white/10
                    text-gray-400 transition-all duration-200 ${hoverClass}`}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-white tracking-wide uppercase">
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      onClick={() => scrollTo(0, 0)}
                      className="text-sm text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-gray-500 text-center sm:text-left"
            style={{
              fontSize: "15px",
              fontWeight: "400",
              fontStyle: "normal",
              lineHeight: 1.8,
              letterSpacing: "0.01em",
            }}
          >
            © {new Date().getFullYear()} MovieFly. Tất cả quyền được bảo lưu.
          </p>
          <div
            className="flex items-center gap-5"
            style={{
              fontSize: "15px",
              fontWeight: "400",
              fontStyle: "normal",
              lineHeight: 1.8,
              letterSpacing: "0.01em",
            }}
          >
            <a
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              style={{
                fontSize: "14px",
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 1.8,
                letterSpacing: "0.01em",
              }}
            >
              Điều khoản
            </a>
            <a
              style={{
                fontSize: "14px",
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 1.8,
                letterSpacing: "0.01em",
              }}
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              Bảo mật
            </a>
            <a
              style={{
                fontSize: "14px",
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 1.8,
                letterSpacing: "0.01em",
              }}
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
            >
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
