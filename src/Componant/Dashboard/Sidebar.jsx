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
import { useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const Sidebar = () => {
  const navigate = useNavigate();

  const { logoutUser } = useContext(AuthContext);

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
    <aside className="fixed left-0 top-0 hidden h-screen w-64 bg-[#073b32] text-white shadow-xl lg:block">
      {/* ==============================
          LOGO
      ============================== */}
      <div className="border-b border-white/10 p-6">
        <h1 className="text-xl font-bold">
          <Link to="/" className="transition hover:text-green-300">
            🕌 মসজিদ হাব
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
  );
};

export default Sidebar;
