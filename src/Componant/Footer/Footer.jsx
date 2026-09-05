import { FaHome, FaMosque, FaBookOpen, FaUser } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { NavLink } from "react-router";

const Footer = () => {
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
    <footer className="fixed bottom-3 left-0 right-0 z-50 px-3 sm:px-5">
      <div className="mx-auto w-full max-w-2xl">
        <nav
          className="
            flex items-center justify-between
            rounded-2xl
            border border-gray-100
            bg-white/95
            px-2 py-2
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            backdrop-blur-md
            transition-colors duration-300
            dark:border-gray-800
            dark:bg-gray-900/95
          "
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="group flex flex-1 items-center justify-center"
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
                          w-full
                          max-w-[82px]
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
      </div>
    </footer>
  );
};

export default Footer;
