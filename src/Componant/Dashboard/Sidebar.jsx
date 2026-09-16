import { Link, NavLink, useNavigate } from "react-router";
import {
  FaChartPie,
  FaUsers,
  FaMoneyBillWave,
  FaFileAlt,
  FaMosque,
  FaCog,
  FaSignOutAlt,
  FaDonate,
} from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const Sidebar = () => {
  const navigate = useNavigate();

  const { logoutUser } = useContext(AuthContext);

  // ==============================
  // MOBILE SIDEBAR STATE
  // ==============================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "ড্যাশবোর্ড",
      path: "/dashboard",
      icon: <FaChartPie />,
    },
    {
      name: "ব্যবহারকারী",
      path: "/dashboard/users",
      icon: <FaUsers />,
    },
    {
      name: "পেমেন্ট",
      path: "/dashboard/payments",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "পেমেন্ট স্ট্যাটাস",
      path: "/dashboard/payment-status",
      icon: <FaCreditCard />,
    },
    {
      name: "রিপোর্ট",
      path: "/dashboard/reports",
      icon: <FaFileAlt />,
    },
    {
      name: "দান তৈরি করুন",
      path: "/dashboard/create-donation",
      icon: <FaDonate />,
    },
    {
      name: "নামাজের সময়",
      path: "/dashboard/prayer-times",
      icon: <FaMosque />,
    },
    {
      name: "সেটিংস",
      path: "/dashboard/setting",
      icon: <FaCog />,
    },
  ];

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "লগআউট করবেন?",
      text: "আপনি কি নিশ্চিত যে লগআউট করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, লগআউট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      // Firebase logout
      await logoutUser();

      // Remove JWT token if exists
      localStorage.removeItem("access-token");

      // Optional session storage cleanup
      sessionStorage.removeItem("access-token");

      await Swal.fire({
        icon: "success",
        title: "লগআউট সম্পন্ন",
        text: "আপনি সফলভাবে লগআউট করেছেন।",
        confirmButtonColor: "#16a34a",
        timer: 1500,
        showConfirmButton: false,
      });

      // Go to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);

      Swal.fire({
        icon: "error",
        title: "লগআউট ব্যর্থ",
        text: "কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <>
      {/* ==========================================
          MOBILE TOP HEADER
      ========================================== */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center bg-[#073b32] px-4 shadow-md lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10"
          aria-label="Open sidebar"
        >
          {/* Hamburger Icon */}
          <span className="flex w-6 flex-col gap-1.5">
            <span className="h-0.5 w-6 rounded bg-white"></span>
            <span className="h-0.5 w-6 rounded bg-white"></span>
            <span className="h-0.5 w-6 rounded bg-white"></span>
          </span>
        </button>

        <div className="ml-3">
          <h1 className="text-base font-bold text-white">
            রহমানিয়া জামে মসজিদ
          </h1>

          <p className="text-[10px] text-green-200/70">অ্যাডমিন ড্যাশবোর্ড</p>
        </div>
      </header>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          bg-[#073b32] text-white shadow-xl
          transition-transform duration-300 ease-in-out

          lg:translate-x-0

          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* ==============================
            LOGO
        ============================== */}
        <div className="relative border-b border-white/10 p-6">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <span className="relative block h-5 w-5">
              <span className="absolute left-0 top-2.5 h-0.5 w-5 rotate-45 rounded bg-white"></span>
              <span className="absolute left-0 top-2.5 h-0.5 w-5 -rotate-45 rounded bg-white"></span>
            </span>
          </button>

          <h1 className="pr-8 text-xl font-bold">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="transition hover:text-green-300"
            >
              রহমানিয়া জামে মসজিদ
            </Link>
          </h1>

          <p className="mt-1 text-xs text-green-200/70">অ্যাডমিন ড্যাশবোর্ড</p>
        </div>

        {/* ==============================
            MENU
        ============================== */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `mb-2 flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>

              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* ==============================
            LOGOUT
        ============================== */}
        <div className="absolute bottom-5 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400"
          >
            <FaSignOutAlt className="text-lg" />

            <span className="font-medium">লগআউট</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
