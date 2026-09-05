import { useState } from "react";
import {
  FaMosque,
  FaBars,
  FaTimes,
  FaHome,
  FaBookOpen,
  FaUser,
} from "react-icons/fa";
import { MdAccessTimeFilled, MdNotificationsActive } from "react-icons/md";
import { NavLink } from "react-router";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ==========================================
  // নেভিগেশন মেনু
  // ==========================================
  const navItems = [
    {
      name: "হোম",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "নামাজ",
      path: "/prayers",
      icon: <MdAccessTimeFilled />,
    },
    {
      name: "দান করুন",
      path: "/donate",
      icon: <FaMosque />,
      center: true,
    },
    {
      name: "কুরআন",
      path: "/quran",
      icon: <FaBookOpen />,
    },
    {
      name: "প্রোফাইল",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className="
          mx-auto flex w-full max-w-6xl
          items-center justify-between
          rounded-2xl
          border border-gray-100
          bg-white/95
          px-4 py-3
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          backdrop-blur-md
          transition-colors
          dark:border-gray-800
          dark:bg-gray-900/95
          sm:px-6
        "
      >
        {/* ================= LOGO ================= */}
        <NavLink to="/" className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl
              bg-[#087443]
              text-white
              shadow-lg shadow-green-900/20
            "
          >
            <FaMosque className="text-xl" />
          </div>

          <div className="leading-tight">
            <h1 className="text-base font-bold text-gray-800 dark:text-white sm:text-lg">
              রহমানিয়া জামে মসজিদ
            </h1>

            <p className="text-[10px] font-medium text-gray-400 sm:text-xs">
              সংযুক্ত থাকুন • নামাজ পড়ুন • দ্বীনের পথে চলুন
            </p>
          </div>
        </NavLink>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="group flex items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`
                    flex flex-col items-center justify-center
                    gap-1
                    transition-all duration-300
                    ease-out

                    ${
                      item.center
                        ? `
                          mx-1
                          h-[64px]
                          w-[64px]
                          rounded-full
                          bg-[#087443]
                          text-white
                          shadow-lg
                          shadow-green-900/20
                        `
                        : `
                          h-[58px]
                          w-[82px]
                          rounded-2xl

                          ${
                            isActive
                              ? "bg-[#087443] text-white shadow-lg shadow-green-900/20"
                              : "bg-transparent text-gray-500 hover:bg-green-50 hover:text-[#087443] dark:text-gray-400 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                          }
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      transition-transform duration-300
                      group-hover:scale-110
                      ${item.center ? "text-[24px]" : "text-[19px]"}
                    `}
                  >
                    {item.icon}
                  </span>

                  {!item.center && (
                    <span className="text-[10px] font-medium sm:text-[11px]">
                      {item.name}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2">
          {/* নোটিফিকেশন */}
          <button
            type="button"
            title="নোটিফিকেশন"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-green-50
              text-[#087443]
              transition-all duration-300
              hover:bg-[#087443]
              hover:text-white
              dark:bg-green-900/30
              dark:text-green-400
              dark:hover:bg-[#087443]
              sm:flex
            "
          >
            <MdNotificationsActive />
          </button>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-green-50
              text-[#087443]
              transition-all duration-300
              hover:bg-[#087443]
              hover:text-white
              dark:bg-green-900/30
              dark:text-green-400
              md:hidden
            "
          >
            {isMenuOpen ? (
              <FaTimes className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <div
          className="
            mx-auto mt-2 w-full max-w-6xl
            overflow-hidden
            rounded-2xl
            border border-gray-100
            bg-white/95
            p-2
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            backdrop-blur-md
            dark:border-gray-800
            dark:bg-gray-900/95
            md:hidden
          "
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-left text-sm font-medium
                transition-all duration-300

                ${
                  isActive
                    ? "bg-[#087443] text-white"
                    : "text-gray-600 hover:bg-green-50 hover:text-[#087443] dark:text-gray-300 dark:hover:bg-green-900/30 dark:hover:text-green-400"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>

              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
