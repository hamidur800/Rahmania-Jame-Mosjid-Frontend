import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaGear,
  FaMoon,
  FaSun,
  FaBell,
  FaShieldHalved,
  FaPalette,
  FaCheck,
  FaRotate,
} from "react-icons/fa6";

const Setting = () => {
  // ========================================
  // States
  // ========================================
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("adminNotifications") !== "false",
  );

  const [emailNotification, setEmailNotification] = useState(
    localStorage.getItem("emailNotification") !== "false",
  );

  const [saving, setSaving] = useState(false);

  // ========================================
  // Dark Mode
  // ========================================
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ========================================
  // Notification Settings
  // ========================================
  useEffect(() => {
    localStorage.setItem("adminNotifications", notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("emailNotification", emailNotification);
  }, [emailNotification]);

  // ========================================
  // Save Settings
  // ========================================
  const handleSave = () => {
    setSaving(true);

    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("adminNotifications", notifications);
    localStorage.setItem("emailNotification", emailNotification);

    setTimeout(() => {
      setSaving(false);

      Swal.fire({
        icon: "success",
        title: "সফলভাবে সংরক্ষণ হয়েছে!",
        text: "আপনার সেটিংস সফলভাবে আপডেট করা হয়েছে।",
        timer: 1800,
        showConfirmButton: false,
      });
    }, 500);
  };

  // ========================================
  // Reset Settings
  // ========================================
  const handleReset = () => {
    Swal.fire({
      icon: "warning",
      title: "সেটিংস রিসেট করবেন?",
      text: "সব সেটিংস ডিফল্ট অবস্থায় ফিরে যাবে।",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, রিসেট করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#087443",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        setDarkMode(false);
        setNotifications(true);
        setEmailNotification(true);

        localStorage.setItem("darkMode", "false");
        localStorage.setItem("adminNotifications", "true");
        localStorage.setItem("emailNotification", "true");

        document.documentElement.classList.remove("dark");

        Swal.fire({
          icon: "success",
          title: "রিসেট সম্পন্ন হয়েছে",
          text: "সব সেটিংস ডিফল্ট অবস্থায় ফিরে গেছে।",
          timer: 1600,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <section className="min-h-screen bg-gray-50 p-3 dark:bg-gray-950 sm:p-5 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* ========================================
            Header
        ======================================== */}
        <div className="overflow-hidden rounded-3xl bg-[#087443] p-5 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-green-100">
                <FaGear />

                <span className="text-sm">অ্যাডমিন কন্ট্রোল প্যানেল</span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                সেটিংস
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                আপনার মসজিদ ও অ্যাডমিন ড্যাশবোর্ডের বিভিন্ন সেটিংস পরিচালনা
                করুন।
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm">
              <FaGear />
            </div>
          </div>
        </div>

        {/* ========================================
            Settings Content
        ======================================== */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ========================================
              Appearance
          ======================================== */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-[#087443] dark:bg-green-950 dark:text-green-400">
                <FaPalette />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  প্রদর্শন সেটিংস
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ড্যাশবোর্ডের চেহারা ও রঙের সেটিংস
                </p>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg text-gray-700 shadow-sm dark:bg-gray-900 dark:text-yellow-400">
                  {darkMode ? <FaMoon /> : <FaSun />}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    ডার্ক মোড
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    ড্যাশবোর্ডের জন্য ডার্ক থিম ব্যবহার করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative h-7 w-14 rounded-full transition ${
                  darkMode ? "bg-[#087443]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    darkMode ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ========================================
              Security Card
          ======================================== */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="flex h-full flex-col">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-[#087443] dark:bg-green-950 dark:text-green-400">
                  <FaShieldHalved />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    নিরাপত্তা
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    অ্যাডমিন নিরাপত্তা
                  </p>
                </div>
              </div>

              <div className="flex-1 rounded-2xl bg-green-50 p-4 dark:bg-green-950/30">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#087443] dark:text-green-400">
                  <FaCheck />
                  নিরাপত্তা সক্রিয়
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">
                  আপনার অ্যাডমিন অ্যাকাউন্ট সুরক্ষিত রাখতে Firebase
                  Authentication এবং JWT Token ব্যবহার করা হচ্ছে।
                </p>
              </div>
            </div>
          </div>

          {/* ========================================
              Notification Settings
          ======================================== */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-[#087443] dark:bg-green-950 dark:text-green-400">
                <FaBell />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  নোটিফিকেশন সেটিংস
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  নোটিফিকেশন এবং আপডেট নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Admin Notification */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    অ্যাডমিন নোটিফিকেশন
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    নতুন পেমেন্ট, ব্যবহারকারী এবং অন্যান্য গুরুত্বপূর্ণ আপডেটের
                    নোটিফিকেশন দেখান
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                    notifications ? "bg-[#087443]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      notifications ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Email Notification */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-950">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    ইমেইল নোটিফিকেশন
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল নোটিফিকেশন চালু রাখুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailNotification(!emailNotification)}
                  className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                    emailNotification ? "bg-[#087443]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      emailNotification ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================
              Current Status
          ======================================== */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              বর্তমান অবস্থা
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  থিম
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#087443] dark:bg-green-950 dark:text-green-400">
                  {darkMode ? "ডার্ক" : "লাইট"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  নোটিফিকেশন
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    notifications
                      ? "bg-green-100 text-[#087443] dark:bg-green-950 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {notifications ? "চালু" : "বন্ধ"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ইমেইল
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    emailNotification
                      ? "bg-green-100 text-[#087443] dark:bg-green-950 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {emailNotification ? "চালু" : "বন্ধ"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            Buttons
        ======================================== */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FaRotate />
            ডিফল্টে রিসেট
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#087443] px-7 py-3 font-semibold text-white transition hover:bg-[#066238] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              <>
                <FaCheck />
                সেটিংস সংরক্ষণ করুন
              </>
            )}
          </button>
        </div>

        {/* ========================================
            Footer Info
        ======================================== */}
        <div className="mt-6 rounded-3xl border border-green-100 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[#087443] dark:text-green-400">
              <FaGear />
            </div>

            <div>
              <h3 className="font-bold text-[#087443] dark:text-green-400">
                সেটিংস সম্পর্কে
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                আপনার পরিবর্তনগুলো এই ব্রাউজারে সংরক্ষণ করা হবে এবং পরবর্তীতে
                ড্যাশবোর্ডে একই সেটিংস ব্যবহার করা হবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Setting;
