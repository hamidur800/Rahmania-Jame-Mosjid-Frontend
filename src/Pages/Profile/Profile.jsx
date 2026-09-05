import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaUser,
  FaEnvelope,
  FaMosque,
  FaEdit,
  FaSignOutAlt,
  FaChevronRight,
  FaHeart,
  FaBell,
  FaCog,
  FaBookOpen,
  FaShieldAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

import { AuthContext } from "../../provider/AuthProvider";
import axiosSecure from "../../api/axiosSecure";
import Loading from "../../Componant/Loading/Loading";

const Profile = () => {
  const { user, logOut } = useContext(AuthContext);

  const [mongoUser, setMongoUser] = useState(null);
  const [role, setRole] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  // =========================================================
  // LOAD USER FROM MONGODB
  // =========================================================
  useEffect(() => {
    const loadUser = async () => {
      if (!user?.email) {
        setLoadingUser(false);
        return;
      }

      try {
        setLoadingUser(true);

        const res = await axiosSecure.get(
          `/users/${encodeURIComponent(user.email)}`,
        );

        console.log("Profile MongoDB User:", res.data);

        setMongoUser(res.data);
        setRole(res.data?.role || "user");
      } catch (error) {
        console.error(
          "Failed to load user:",
          error.response?.data || error.message,
        );

        // Firebase user থাকলে fallback role
        setRole("user");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [user]);

  // =========================================================
  // LOGOUT
  // =========================================================
  const handleLogout = async () => {
    try {
      await logOut();

      localStorage.removeItem("access-token");

      await Swal.fire({
        icon: "success",
        title: "লগআউট সফল হয়েছে",
        text: "আবার দেখা হবে 🤍",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "লগআউট ব্যর্থ হয়েছে",
        text: error.message,
      });
    }
  };

  // =========================================================
  // ACCOUNT MENU
  // =========================================================
  const menuItems = [
    {
      icon: <FaHeart />,
      title: "আমার পছন্দসমূহ",
      subtitle: "সংরক্ষিত মসজিদ ও কনটেন্ট",
    },
    {
      icon: <FaBookOpen />,
      title: "আমার কুরআন",
      subtitle: "আপনার কুরআন পড়া চালিয়ে যান",
      path: "/quran",
    },
    {
      icon: <FaBell />,
      title: "নোটিফিকেশন",
      subtitle: "নামাজ ও মসজিদের আপডেট",
      path: "/notifications",
    },
    {
      icon: <FaShieldAlt />,
      title: "গোপনীয়তা ও নিরাপত্তা",
      subtitle: "আপনার অ্যাকাউন্টের নিরাপত্তা পরিচালনা করুন",
    },
    {
      icon: <FaCog />,
      title: "সেটিংস",
      subtitle: "আপনার অভিজ্ঞতা কাস্টমাইজ করুন",
      path: "/settings",
    },
  ];

  // =========================================================
  // USER DISPLAY DATA
  // =========================================================
  const displayName =
    mongoUser?.name ||
    mongoUser?.displayName ||
    user?.displayName ||
    "ব্যবহারকারী";

  const displayEmail = mongoUser?.email || user?.email || "ইমেইল পাওয়া যায়নি";

  const photoURL = mongoUser?.photoURL || user?.photoURL || "";

  if (loadingUser) {
    return <Loading />;
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f8f6]
        pb-28
        transition-colors duration-300
        dark:bg-gray-950
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          relative overflow-hidden
          bg-[#075c46]
          px-5 pb-24 pt-8
          text-white
          dark:bg-[#064d3b]
        "
      >
        {/* Background Decoration */}
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/5" />

        <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#e9c46a]/10" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-bold">আমার প্রোফাইল</h1>

            <p className="mt-1 text-xs text-green-100">
              আপনার অ্যাকাউন্টের তথ্য ও সেটিংস
            </p>
          </div>

          <Link
            to="/settings"
            title="সেটিংস"
            className="
              flex h-11 w-11 items-center justify-center
              rounded-full
              bg-white/10
              backdrop-blur-md
              transition
              hover:bg-white/20
              active:scale-95
            "
          >
            <FaCog className="text-lg" />
          </Link>
        </div>
      </div>

      {/* =====================================================
          PROFILE CARD
      ====================================================== */}
      <div className="relative z-20 mx-4 -mt-16">
        <div
          className="
            rounded-[28px]
            border border-green-50
            bg-white
            p-5
            shadow-[0_15px_45px_rgba(0,70,50,0.10)]
            transition-colors duration-300
            dark:border-green-900/50
            dark:bg-gray-900
            dark:shadow-black/30
          "
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="
                    h-[76px] w-[76px]
                    rounded-2xl
                    object-cover
                    shadow-md
                  "
                />
              ) : (
                <div
                  className="
                    flex h-[76px] w-[76px]
                    items-center justify-center
                    rounded-2xl
                    bg-[#e8f4ef]
                    text-[#075c46]
                    shadow-sm
                    dark:bg-green-950
                    dark:text-green-400
                  "
                >
                  <FaUser className="text-3xl" />
                </div>
              )}

              {/* Online Status */}
              <div
                className="
                  absolute -bottom-1 -right-1
                  flex h-6 w-6
                  items-center justify-center
                  rounded-full
                  border-2 border-white
                  bg-[#087443]
                  dark:border-gray-900
                "
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <h2
                className="
                  truncate
                  text-lg font-bold
                  text-gray-800
                  dark:text-white
                "
              >
                {loadingUser ? "লোড হচ্ছে..." : displayName}
              </h2>

              <div
                className="
                  mt-1 flex items-center gap-2
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <FaEnvelope className="text-xs shrink-0" />

                <span className="truncate">{displayEmail}</span>
              </div>

              <div
                className="
                  mt-2 inline-flex items-center gap-1.5
                  rounded-full
                  bg-green-50
                  px-3 py-1
                  text-[10px]
                  font-semibold
                  text-[#087443]
                  dark:bg-green-950/70
                  dark:text-green-400
                "
              >
                <FaMosque />
                মুসলিম কমিউনিটি সদস্য
              </div>
            </div>

            {/* Edit */}
            <Link
              to="/profile/edit"
              title="প্রোফাইল সম্পাদনা"
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-gray-50
                text-gray-500
                transition
                hover:bg-green-50
                hover:text-[#087443]
                active:scale-95
                dark:bg-gray-800
                dark:text-gray-400
                dark:hover:bg-green-950
                dark:hover:text-green-400
              "
            >
              <FaEdit />
            </Link>
          </div>

          {/* Stats */}
          {/* <div
            className="
              mt-6
              grid grid-cols-3
              divide-x divide-gray-100
              rounded-2xl
              bg-[#f7faf8]
              py-4
              dark:divide-gray-800
              dark:bg-gray-800/70
            "
          >
            <div className="text-center">
              <p className="text-lg font-bold text-[#075c46] dark:text-green-400">
                ১২
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                নামাজ
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-[#075c46] dark:text-green-400">
                ০৫
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                মসজিদ
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-[#075c46] dark:text-green-400">
                ২৪
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                সক্রিয় দিন
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* =====================================================
          QUICK ACTION
      ====================================================== */}
      <div className="mx-4 mt-6">
        <h3
          className="
            mb-3 px-1
            text-sm font-bold
            text-gray-800
            dark:text-white
          "
        >
          দ্রুত অ্যাক্সেস
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* ADMIN DASHBOARD */}
          {role === "admin" && (
            <Link
              to="/dashboard"
              className="
                group col-span-2
                rounded-2xl
                border border-green-50
                bg-white
                p-4
                shadow-sm
                transition
                hover:border-green-100
                hover:shadow-md
                active:scale-[0.98]
                dark:border-green-900/50
                dark:bg-gray-900
                dark:hover:border-green-800
              "
            >
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-green-50
                  text-[#087443]
                  transition
                  group-hover:bg-[#087443]
                  group-hover:text-white
                  dark:bg-green-950
                  dark:text-green-400
                  dark:group-hover:bg-green-700
                  dark:group-hover:text-white
                "
              >
                <FaMosque className="text-xl" />
              </div>

              <p
                className="
                  mt-3 text-sm font-bold
                  text-gray-800
                  dark:text-white
                "
              >
                অ্যাডমিন ড্যাশবোর্ড
              </p>

              <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                মসজিদ সিস্টেম পরিচালনা করুন
              </p>
            </Link>
          )}

          {/* PAYMENT HISTORY */}
          <Link
            to="/payment-history"
            className="
              group
              rounded-2xl
              border border-green-50
              bg-white
              p-4
              shadow-sm
              transition
              hover:border-green-100
              hover:shadow-md
              active:scale-[0.98]
              dark:border-green-900/50
              dark:bg-gray-900
              dark:hover:border-green-800
            "
          >
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-green-50
                text-[#087443]
                transition
                group-hover:bg-[#087443]
                group-hover:text-white
                dark:bg-green-950
                dark:text-green-400
                dark:group-hover:bg-green-700
                dark:group-hover:text-white
              "
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 576 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 112.5L0 422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4l0-309.9c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64l-64 0 0-64zm64-208c0 35.3-28.7 64-64 64l0-64 64 0zM512 304l0 64-64 0c0-35.3 28.7-64 64-64zM448 96l64 0 0 64c-35.3 0-64-28.7-64-64z" />
              </svg>
            </div>

            <p
              className="
                mt-3 text-sm font-bold
                text-gray-800
                dark:text-white
              "
            >
              পেমেন্ট হিস্টোরি
            </p>

            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              সব দানের তথ্য দেখুন
            </p>
          </Link>

          {/* QURAN */}
          <Link
            to="/quran"
            className="
              group
              rounded-2xl
              border border-green-50
              bg-white
              p-4
              shadow-sm
              transition
              hover:border-amber-100
              hover:shadow-md
              active:scale-[0.98]
              dark:border-green-900/50
              dark:bg-gray-900
              dark:hover:border-amber-900/50
            "
          >
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-amber-50
                text-[#c08b18]
                transition
                group-hover:bg-[#e9c46a]
                group-hover:text-white
                dark:bg-amber-950/60
                dark:text-amber-400
                dark:group-hover:bg-amber-600
                dark:group-hover:text-white
              "
            >
              <FaBookOpen className="text-lg" />
            </div>

            <p
              className="
                mt-3 text-sm font-bold
                text-gray-800
                dark:text-white
              "
            >
              কুরআন পড়ুন
            </p>

            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              পড়া চালিয়ে যান
            </p>
          </Link>
        </div>
      </div>

      {/* =====================================================
          ACCOUNT MENU
      ====================================================== */}
      <div className="mx-4 mt-7">
        <h3
          className="
            mb-3 px-1
            text-sm font-bold
            text-gray-800
            dark:text-white
          "
        >
          অ্যাকাউন্ট
        </h3>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-green-50
            bg-white
            shadow-sm
            dark:border-green-900/50
            dark:bg-gray-900
          "
        >
          {menuItems.map((item, index) => (
            <Link
              key={item.title}
              to={item.path || "#"}
              onClick={(e) => {
                if (!item.path) {
                  e.preventDefault();
                }
              }}
              className={`
                flex items-center gap-4
                p-4
                transition
                hover:bg-green-50
                dark:hover:bg-green-950/30
                ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-100 dark:border-gray-800"
                    : ""
                }
              `}
            >
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[#f0f7f4]
                  text-[#087443]
                  dark:bg-green-950
                  dark:text-green-400
                "
              >
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-sm font-semibold
                    text-gray-800
                    dark:text-white
                  "
                >
                  {item.title}
                </p>

                <p
                  className="
                    mt-0.5 truncate
                    text-[10px]
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  {item.subtitle}
                </p>
              </div>

              <FaChevronRight className="text-xs text-gray-300 dark:text-gray-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* =====================================================
          LOGOUT
      ====================================================== */}
      <div className="mx-4 mt-6">
        <button
          onClick={handleLogout}
          className="
            flex w-full
            items-center justify-center gap-3
            rounded-2xl
            border border-red-100
            bg-white
            py-4
            font-semibold
            text-red-500
            shadow-sm
            transition
            hover:bg-red-50
            active:scale-[0.98]
            dark:border-red-900/50
            dark:bg-gray-900
            dark:text-red-400
            dark:hover:bg-red-950/40
          "
        >
          <FaSignOutAlt />
          লগআউট করুন
        </button>
      </div>

      {/* =====================================================
          FOOTER TEXT
      ====================================================== */}
      <p
        className="
          mt-7 px-5
          text-center text-[10px]
          text-gray-400
          dark:text-gray-600
        "
      >
        মসজিদ হাব • সংযুক্ত থাকুন • নামাজ পড়ুন • দ্বীনের পথে চলুন
      </p>
    </div>
  );
};

export default Profile;
