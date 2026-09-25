import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import { FaLocationDot, FaSun, FaCloudSun, FaMoon } from "react-icons/fa6";

import { MdAccessTimeFilled } from "react-icons/md";
import Loading from "../../Componant/Loading/Loading";

const Prayers = () => {
  // ========================================
  // States
  // ========================================

  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ========================================
  // Update Current Time
  // ========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ========================================
  // Get Prayer Times From Backend
  // ========================================

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const res = await axios.get(
          "https://rahmania-jame-mosjid-backend.onrender.com/prayer-times",
        );

        setPrayerTimes(res.data);
      } catch (error) {
        console.error("Prayer Times Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
  }, []);

  // ========================================
  // Convert "04:30 PM" → Minutes
  // ========================================

  const getTimeInMinutes = (time) => {
    if (!time || time === "--:--") return null;

    const parts = time.trim().split(" ");

    if (parts.length !== 2) return null;

    const [timePart, modifier] = parts;

    let [hours, minutes] = timePart.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  // ========================================
  // Current Time In Minutes
  // ========================================

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // ========================================
  // Format Date
  // ========================================

  // ========================================
  // Format Current Clock
  // ========================================

  const timeParts = currentTime.toLocaleTimeString("Bn-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const [time, period] = timeParts.split(" ");

  // ========================================
  // Prayer Data
  // ========================================

  const prayers = useMemo(() => {
    if (!prayerTimes) return [];

    const prayerList = [
      {
        name: "ফজর",
        time: prayerTimes.fajr || "--:--",
        icon: <FaMoon />,
        label: "ফজরের নামাজ",
      },

      {
        name: "যোহর",
        time: prayerTimes.dhuhr || "--:--",
        icon: <FaSun />,
        label: "দুপুরের নামাজ",
      },

      {
        name: "আসর",
        time: prayerTimes.asr || "--:--",
        icon: <FaCloudSun />,
        label: "বিকেলের নামাজ",
      },

      {
        name: "মাগরিব",
        time: prayerTimes.maghrib || "--:--",
        icon: <FaMoon />,
        label: "সূর্যাস্তের নামাজ",
      },

      {
        name: "এশা",
        time: prayerTimes.isha || "--:--",
        icon: <FaMoon />,
        label: "রাতের নামাজ",
      },
    ];

    return prayerList.map((prayer, index) => {
      const prayerTime = getTimeInMinutes(prayer.time);

      const nextPrayer = prayerList[index + 1];

      const nextPrayerTime = nextPrayer
        ? getTimeInMinutes(nextPrayer.time)
        : null;

      // নামাজের ১৫ মিনিট আগে active হবে
      const activeFrom = prayerTime !== null ? prayerTime - 30 : null;

      // পরবর্তী নামাজের ১৫ মিনিট আগে পর্যন্ত active থাকবে
      const activeUntil = nextPrayerTime !== null ? nextPrayerTime - 30 : null;

      let active = false;

      if (prayerTime !== null) {
        // এশার ক্ষেত্রে
        // ১৫ মিনিট আগে থেকে active হবে
        if (index === prayerList.length - 1) {
          active = currentMinutes >= activeFrom;
        } else {
          active = currentMinutes >= activeFrom && currentMinutes < activeUntil;
        }
      }

      return {
        ...prayer,
        active,
      };
    });
  }, [prayerTimes, currentMinutes]);

  // ========================================
  // Find Next Prayer
  // ========================================

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;

    const prayerList = [
      {
        name: "ফজর",
        time: prayerTimes.fajr,
      },

      {
        name: "যোহর",
        time: prayerTimes.dhuhr,
      },

      {
        name: "আসর",
        time: prayerTimes.asr,
      },

      {
        name: "মাগরিব",
        time: prayerTimes.maghrib,
      },

      {
        name: "এশা",
        time: prayerTimes.isha,
      },
    ];

    // আজকের পরবর্তী নামাজ খুঁজবে
    for (const prayer of prayerList) {
      const prayerMinutes = getTimeInMinutes(prayer.time);

      if (prayerMinutes !== null && currentMinutes < prayerMinutes) {
        return prayer;
      }
    }

    // সব নামাজ শেষ হলে পরের দিনের ফজর
    return prayerList[0];
  }, [prayerTimes, currentMinutes]);

  // ========================================
  // Countdown
  // ========================================

  const countdown = useMemo(() => {
    if (!nextPrayer) {
      return "০০:০০:০০";
    }

    const prayerMinutes = getTimeInMinutes(nextPrayer.time);

    if (prayerMinutes === null) {
      return "০০:০০:০০";
    }

    const nowSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    let prayerSeconds = prayerMinutes * 60;

    // আজকের সব নামাজ শেষ হলে
    // ফজর হবে আগামীকাল
    if (prayerSeconds <= nowSeconds) {
      prayerSeconds += 24 * 60 * 60;
    }

    let difference = prayerSeconds - nowSeconds;

    const hours = Math.floor(difference / 3600);

    difference %= 3600;

    const minutes = Math.floor(difference / 60);

    const seconds = difference % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }, [nextPrayer, currentTime]);

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return <Loading />;
  }

  // ========================================
  // No Data
  // ========================================

  if (!prayerTimes) {
    return (
      <section
        className="
          min-h-screen bg-gray-50 px-3 py-6 pb-28
          transition-colors duration-300
          dark:bg-gray-950
          sm:px-5 md:py-8
        "
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            নামাজের সময়সূচি পাওয়া যাচ্ছে না।
          </p>
        </div>
      </section>
    );
  }

  // ========================================
  // JSX
  // ========================================

  return (
    <section
      className="
        min-h-screen bg-gray-50 px-3 py-6 pb-28
        transition-colors duration-300
        dark:bg-gray-950
        sm:px-5 md:py-8
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ================= HERO ================= */}

        <div
          className="
            overflow-hidden rounded-3xl
            bg-[#087443] p-5 text-white shadow-lg
            sm:p-8
          "
        >
          <div
            className="
              flex flex-col gap-6
              md:flex-row md:items-center md:justify-between
            "
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-green-100">
                <FaLocationDot />

                <span className="text-lg">রাহমানিয়া জামে মসজিদ</span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                নামাজের সময়সূচি
              </h1>

              <p className="mt-2 max-w-lg text-lg text-green-100 sm:text-base">
                কোনো নামাজ যেন বাদ না যায়। প্রতিদিনের নামাজের সময়সূচির সাথে
                নিজেকে যুক্ত রাখুন।
              </p>
            </div>

            {/* Date / Time */}

            <div
              className="
                rounded-2xl bg-white/10 p-4
                backdrop-blur-sm
                md:min-w-[210px]
              "
            >
              <div className="w-full">
                <p className="text-lg font-bold text-white lg:text-2xl">
                  {time}
                </p>
              </div>

              <div className="w-fit">
                <span className="mb-1 text-xl font-semibold text-[#f2ce52]">
                  {period}
                </span>
              </div>
            </div>

            {/* <div
              className="
                rounded-2xl bg-white/10 p-4
                backdrop-blur-sm
                md:min-w-[210px]
              "
            >
              <p className="text-xs text-green-100">আজ</p>

              <h2 className="mt-1 text-xl font-bold">{formattedDate}</h2>

              <p className="mt-1 text-xs text-green-100">{dayName}</p>

              <p className="mt-2 text-sm font-semibold text-white">
                {currentClock}
              </p>
            </div> */}
          </div>
        </div>

        {/* ================= NEXT PRAYER ================= */}

        <div
          className="
            mt-5 rounded-3xl
            border border-green-100
            bg-white p-5 shadow-sm
            transition-colors duration-300
            dark:border-green-900/60
            dark:bg-gray-900
            sm:p-6
          "
        >
          <div
            className="
              flex flex-col gap-5
              sm:flex-row sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-14 w-14 items-center
                  justify-center rounded-2xl
                  bg-green-50 text-2xl text-[#087443]
                  dark:bg-green-950/60
                  dark:text-green-400
                "
              >
                <MdAccessTimeFilled />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-400 dark:text-gray-500">
                  পরবর্তী নামাজ
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
                  {nextPrayer?.name || "নেই"}
                </h2>

                <p className="text-lg text-gray-500 dark:text-gray-400">
                  {nextPrayer?.time || "--:--"}
                </p>
              </div>
            </div>

            <div
              className="
                rounded-2xl bg-green-50
                px-5 py-3 text-center
                dark:bg-green-950/60
              "
            >
              <p className="text-lg text-gray-400 dark:text-gray-500">
                বাকি সময়
              </p>

              <p className="text-lg font-bold text-[#087443] dark:text-green-400">
                {countdown}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PRAYER CARDS ================= */}

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                আজকের নামাজ
              </h2>

              <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
                আজকের পাঁচ ওয়াক্ত নামাজের সময়সূচি
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className={`
        group relative overflow-hidden rounded-2xl border p-5
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg

        ${
          prayer.active
            ? "border-[#087443] bg-[#087443] text-white shadow-md shadow-green-900/20"
            : "border-gray-100 bg-white text-gray-800 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
        }
      `}
              >
                {/* Icon */}
                <div
                  className={`
          flex h-12 w-12 items-center justify-center
          rounded-xl text-xl
          transition-transform duration-300
          group-hover:scale-105

          ${
            prayer.active
              ? "bg-white/15 text-white"
              : "bg-green-50 text-[#087443] dark:bg-green-950/60 dark:text-green-400"
          }
        `}
                >
                  {prayer.icon}
                </div>

                {/* Prayer Name */}
                <h3
                  className={`
          mt-4 text-2xl font-bold
          ${prayer.active ? "text-white" : "text-gray-800 dark:text-white"}
        `}
                >
                  {prayer.name}
                </h3>

                {/* Prayer Time */}
                <p
                  className={`
          mt-1 text-2xl font-extrabold tracking-wide
          ${prayer.active ? "text-white" : "text-[#087443] dark:text-green-400"}
        `}
                >
                  {prayer.time}
                </p>

                {/* Label */}
                <p
                  className={`
          mt-1  leading-5 font-medium text-xl
          ${
            prayer.active
              ? "text-green-100 "
              : "text-gray-500  dark:text-gray-400"
          }
        `}
                >
                  {prayer.label}
                </p>

                {/* Active Status */}
                {prayer.active && (
                  <span
                    className="
            mt-4 inline-flex items-center
            rounded-full bg-white/15
            px-3 py-1.5
            text-[11px] font-semibold
            text-white
          "
                  >
                    ● এখন চলছে
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ================= JUMMAH ================= */}

        <div
          className="
            mt-6 rounded-3xl
            border border-gray-100
            bg-white p-5 shadow-sm
            transition-colors duration-300
            dark:border-gray-800
            dark:bg-gray-900
            sm:p-6
          "
        >
          <div
            className="
              flex flex-col gap-4
              sm:flex-row sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#087443] dark:text-green-400">
                শুক্রবারের বিশেষ নামাজ
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
                জুমার নামাজ
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                জামাতের সাথে জুমার নামাজ আদায় করুন।
              </p>
            </div>

            <div
              className="
                rounded-2xl bg-green-50
                px-5 py-3 text-center
                dark:bg-green-950/60
              "
            >
              <p className="text-xs text-gray-400 dark:text-gray-500">
                নামাজের সময়
              </p>

              <p className="font-bold text-[#087443] dark:text-green-400">
                {prayerTimes.jummah || "--:--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prayers;
