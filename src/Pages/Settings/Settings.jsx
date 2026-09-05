import { useContext, useEffect, useState } from "react";
import {
  FaMosque,
  FaUser,
  FaPalette,
  FaMoon,
  FaSun,
  FaArrowLeft,
  FaCircleCheck,
} from "react-icons/fa6";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../provider/AuthProvider";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ==========================================
  // DARK MODE - LOCAL STORAGE
  // ==========================================
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // ==========================================
  // APPLY DARK MODE
  // ==========================================
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ==========================================
  // SAVE SETTINGS
  // ==========================================
  const handleSave = () => {
    localStorage.setItem("darkMode", darkMode);

    Swal.fire({
      icon: "success",
      title: "সেটিংস সংরক্ষণ হয়েছে! 🎉",
      text: "আপনার ডার্ক মোড সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।",
      confirmButtonColor: "#075c46",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  // ==========================================
  // TOGGLE COMPONENT
  // ==========================================
  const Toggle = ({ checked, onChange }) => {
    return (
      <button
        type="button"
        onClick={onChange}
        aria-label="ডার্ক মোড পরিবর্তন করুন"
        className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
          checked
            ? "bg-[#075c46] dark:bg-green-600"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    );
  };

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
      {/* ================= HEADER ================= */}
      <div
        className="
          bg-[#075c46]
          px-4
          pb-16
          pt-6
          dark:bg-[#064d3b]
        "
      >
        <div className="mx-auto max-w-5xl">
          {/* TOP BAR */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              title="পেছনে যান"
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-white/10
                text-white
                transition
                hover:bg-white/20
                active:scale-95
              "
            >
              <FaArrowLeft />
            </button>

            <div className="flex items-center gap-2 text-white">
              <FaMosque className="text-[#e9c46a]" />

              <span className="font-semibold">মসজিদ হাব</span>
            </div>

            <div className="w-11" />
          </div>

          {/* TITLE */}
          <div className="mt-8 text-center">
            <div
              className="
                mx-auto
                flex h-[72px] w-[72px]
                items-center justify-center
                rounded-3xl
                bg-[#e9c46a]
                text-3xl
                text-[#075c46]
                shadow-xl
              "
            >
              <FaPalette />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-white">সেটিংস</h1>

            <p className="mt-1 text-sm text-green-100">
              আপনার পছন্দ ও অ্যাকাউন্ট সেটিংস পরিচালনা করুন
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mx-auto -mt-8 max-w-5xl px-4">
        {/* ================= PROFILE ================= */}
        <div
          className="
            mb-5
            rounded-3xl
            border border-transparent
            bg-white
            p-5
            shadow-[0_10px_35px_rgba(0,70,50,0.08)]
            transition-colors duration-300
            dark:border-gray-800
            dark:bg-gray-900
            dark:shadow-black/20
          "
        >
          <h2
            className="
              mb-4
              flex items-center gap-2
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-[#075c46]
              dark:text-green-400
            "
          >
            <FaUser />
            অ্যাকাউন্ট
          </h2>

          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="প্রোফাইল"
                className="
                  h-14 w-14
                  rounded-2xl
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-[#075c46]
                  text-xl
                  font-bold
                  text-white
                  dark:bg-green-700
                "
              >
                {user?.displayName?.charAt(0) || "U"}
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              <h3
                className="
                  truncate
                  font-bold
                  text-gray-800
                  dark:text-white
                "
              >
                {user?.displayName || "মসজিদ হাব ব্যবহারকারী"}
              </h3>

              <p
                className="
                  truncate
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {user?.email || "user@email.com"}
              </p>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="
                rounded-xl
                bg-green-50
                px-3 py-2
                text-xs
                font-semibold
                text-[#075c46]
                transition
                hover:bg-green-100
                active:scale-95
                dark:bg-green-900/30
                dark:text-green-400
                dark:hover:bg-green-900/50
              "
            >
              প্রোফাইল
            </button>
          </div>
        </div>

        {/* ================= APPEARANCE ================= */}
        <div
          className="
            mb-5
            rounded-3xl
            border border-transparent
            bg-white
            p-5
            shadow-[0_10px_35px_rgba(0,70,50,0.08)]
            transition-colors duration-300
            dark:border-gray-800
            dark:bg-gray-900
            dark:shadow-black/20
          "
        >
          <h2
            className="
              mb-2
              flex items-center gap-2
              text-sm
              font-bold
              uppercase
              tracking-wider
              text-[#075c46]
              dark:text-green-400
            "
          >
            <FaPalette />
            প্রদর্শন
          </h2>

          {/* DARK MODE */}
          <div className="flex items-center gap-4 py-4">
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-2xl
                bg-green-50
                text-lg
                text-[#075c46]
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </div>

            <div className="flex-1">
              <h3
                className="
                  font-semibold
                  text-gray-800
                  dark:text-white
                "
              >
                ডার্ক মোড
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                লাইট ও ডার্ক মোডের মধ্যে পরিবর্তন করুন
              </p>
            </div>

            <Toggle
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
        </div>

        {/* ================= LANGUAGE ================= */}
        <div
          className="
            mb-5
            rounded-3xl
            border border-transparent
            bg-white
            p-5
            shadow-[0_10px_35px_rgba(0,70,50,0.08)]
            transition-colors duration-300
            dark:border-gray-800
            dark:bg-gray-900
            dark:shadow-black/20
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-12 w-12
                shrink-0
                items-center justify-center
                rounded-2xl
                bg-green-50
                text-lg
                text-[#075c46]
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              <span className="text-xl font-bold">বাং</span>
            </div>

            <div className="flex-1">
              <h3
                className="
                  font-semibold
                  text-gray-800
                  dark:text-white
                "
              >
                অ্যাপের ভাষা
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                বর্তমানে অ্যাপের ভাষা বাংলা সেট করা আছে
              </p>
            </div>

            <div
              className="
                flex items-center gap-1.5
                rounded-xl
                bg-green-50
                px-3 py-2
                text-sm
                font-semibold
                text-[#075c46]
                dark:bg-green-900/30
                dark:text-green-400
              "
            >
              <FaCircleCheck />
              বাংলা
            </div>
          </div>
        </div>

        {/* ================= SAVE BUTTON ================= */}
        <button
          onClick={handleSave}
          className="
            flex h-14
            w-full
            items-center justify-center
            gap-2
            rounded-2xl
            bg-[#075c46]
            font-bold
            text-white
            shadow-lg
            shadow-green-900/20
            transition
            hover:bg-[#064b3a]
            active:scale-[0.98]
            dark:bg-green-700
            dark:hover:bg-green-600
          "
        >
          <FaCircleCheck />
          সেটিংস সংরক্ষণ করুন
        </button>

        {/* ================= CURRENT SETTINGS ================= */}
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-green-100
            bg-green-50/50
            p-4
            dark:border-green-900/40
            dark:bg-green-950/20
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                বর্তমান থিম
              </p>

              <p className="mt-1 text-sm font-bold text-[#075c46] dark:text-green-400">
                {darkMode ? "ডার্ক মোড" : "লাইট মোড"}
              </p>
            </div>

            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-white
                text-[#075c46]
                shadow-sm
                dark:bg-gray-800
                dark:text-green-400
              "
            >
              {darkMode ? <FaMoon /> : <FaSun />}
            </div>
          </div>
        </div>

        {/* VERSION */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          রহমানিয়া জামে মসজিদ • সংস্করণ ১.০.০
        </p>

        <p className="mt-2 text-center text-xs text-[#075c46] dark:text-green-400">
          🤍 উম্মাহর জন্য ভালোবাসা দিয়ে তৈরি
        </p>
      </div>
    </div>
  );
};

export default Settings;
