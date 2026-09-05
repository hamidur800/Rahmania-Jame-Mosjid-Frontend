import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import {
  FaMoon,
  FaSun,
  FaCloudSun,
  FaMosque,
  FaPenToSquare,
} from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";

import axiosSecure from "../../api/axiosSecure";

const PrayerTimes = () => {
  // ========================================
  // States
  // ========================================
  const [prayerTimes, setPrayerTimes] = useState({
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
    jummah: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ========================================
  // Prayer Information
  // ========================================
  const prayerList = [
    {
      key: "fajr",
      name: "ফজর",
      label: "ভোরের নামাজ",
      icon: <FaMoon />,
    },
    {
      key: "dhuhr",
      name: "যোহর",
      label: "দুপুরের নামাজ",
      icon: <FaSun />,
    },
    {
      key: "asr",
      name: "আসর",
      label: "বিকেলের নামাজ",
      icon: <FaCloudSun />,
    },
    {
      key: "maghrib",
      name: "মাগরিব",
      label: "সূর্যাস্তের নামাজ",
      icon: <FaMoon />,
    },
    {
      key: "isha",
      name: "এশা",
      label: "রাতের নামাজ",
      icon: <FaMoon />,
    },
    {
      key: "jummah",
      name: "জুমার নামাজ",
      label: "শুক্রবারের বিশেষ নামাজ",
      icon: <FaMosque />,
    },
  ];

  // ========================================
  // Get Prayer Times
  // Public API
  // ========================================
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/prayer-times");

        if (res.data) {
          setPrayerTimes({
            fajr: res.data.fajr || "",
            dhuhr: res.data.dhuhr || "",
            asr: res.data.asr || "",
            maghrib: res.data.maghrib || "",
            isha: res.data.isha || "",
            jummah: res.data.jummah || "",
          });
        }
      } catch (error) {
        console.error(
          "Prayer Times Error:",
          error.response?.data || error.message,
        );

        Swal.fire({
          icon: "error",
          title: "সমস্যা হয়েছে",
          text: "নামাজের সময় লোড করা যায়নি!",
          confirmButtonText: "ঠিক আছে",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // ========================================
  // Handle Input Change
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPrayerTimes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // Update Prayer Times
  // Admin Protected API
  // ========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      // axiosSecure automatically sends Firebase ID token
      const res = await axiosSecure.put("/prayer-times", prayerTimes);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে আপডেট হয়েছে!",
          text: "নামাজের সময়গুলো সফলভাবে আপডেট করা হয়েছে।",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "সফলভাবে আপডেট হয়েছে!",
          text: "নামাজের সময়গুলো সফলভাবে আপডেট করা হয়েছে।",
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(
        "Update Prayer Times Error:",
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "সেশন শেষ হয়েছে",
          text: "অনুগ্রহ করে আবার লগইন করুন এবং চেষ্টা করুন।",
          confirmButtonText: "ঠিক আছে",
        });
      } else if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "অনুমতি নেই",
          text: "শুধুমাত্র অ্যাডমিন নামাজের সময় আপডেট করতে পারবেন।",
          confirmButtonText: "ঠিক আছে",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "আপডেট ব্যর্থ হয়েছে!",
          text:
            error.response?.data?.message ||
            "নামাজের সময় আপডেট করার সময় কিছু সমস্যা হয়েছে।",
          confirmButtonText: "ঠিক আছে",
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  // ========================================
  // Loading
  // ========================================
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-[#087443]" />

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              নামাজের সময় লোড হচ্ছে...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ========================================
  // JSX
  // ========================================
  return (
    <section className="min-h-screen bg-gray-50 p-3 dark:bg-gray-950 sm:p-5 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* ================= HEADER ================= */}
        <div className="overflow-hidden rounded-3xl bg-[#087443] p-5 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-green-100">
                <FaMosque />

                <span className="text-sm">রাহমানিয়া জামে মসজিদ</span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                নামাজের সময় পরিচালনা
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                মসজিদের প্রতিদিনের নামাজের সময় আপডেট ও পরিচালনা করুন।
                পরিবর্তনগুলো স্বয়ংক্রিয়ভাবে ব্যবহারকারীদের নামাজের সময়ের
                পাতায় দেখা যাবে।
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm">
              <MdAccessTimeFilled />
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleUpdate}
          className="mt-6 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
        >
          {/* Title */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#087443] dark:text-green-400">
              নামাজের সময়সূচি
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl">
              নামাজের সময় আপডেট করুন
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              রাহমানিয়া জামে মসজিদের প্রতিদিনের নামাজের সময় নির্ধারণ করুন।
            </p>
          </div>

          {/* ================= PRAYER INPUTS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prayerList.map((prayer) => (
              <div
                key={prayer.key}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-green-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:hover:border-green-800"
              >
                {/* Icon + Name */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg text-[#087443] dark:bg-green-950 dark:text-green-400">
                    {prayer.icon}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {prayer.name}
                    </h3>

                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {prayer.label}
                    </p>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    নামাজের সময়
                  </label>

                  <input
                    type="text"
                    name={prayer.key}
                    value={prayerTimes[prayer.key]}
                    onChange={handleChange}
                    placeholder="যেমন: 05:00 AM"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#087443] focus:ring-2 focus:ring-green-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-green-500 dark:focus:ring-green-900"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ================= SAVE BUTTON ================= */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#087443] px-6 py-3 font-semibold text-white transition hover:bg-[#066238] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {updating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  আপডেট হচ্ছে...
                </>
              ) : (
                <>
                  <FaPenToSquare />
                  নামাজের সময় আপডেট করুন
                </>
              )}
            </button>
          </div>
        </form>

        {/* ================= INFO BOX ================= */}
        <div className="mt-6 rounded-3xl border border-green-100 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
          <h3 className="font-bold text-[#087443] dark:text-green-400">
            গুরুত্বপূর্ণ তথ্য
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            সঠিক সময়ের ফরম্যাট ব্যবহার করুন। যেমন{" "}
            <span className="mx-1 font-semibold text-[#087443] dark:text-green-400">
              05:00 AM
            </span>{" "}
            অথবা{" "}
            <span className="mx-1 font-semibold text-[#087443] dark:text-green-400">
              04:30 PM
            </span>
            । আপডেট করার পর ব্যবহারকারীরা স্বয়ংক্রিয়ভাবে নতুন নামাজের সময়
            দেখতে পারবেন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrayerTimes;
