import {
  FaBookOpen,
  FaMosque,
  FaCalendarAlt,
  FaHeart,
  FaBroadcastTower,
  FaBullhorn,
  FaBook,
  FaCompass,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { FaSun, FaCloudSun, FaMoon } from "react-icons/fa6";

import { AuthContext } from "../../provider/AuthProvider";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import Loading from "../../Componant/Loading/Loading";
import axiosSecure from "../../api/axiosSecure";

const Home = () => {
  const { loading, user } = useContext(AuthContext);

  const [mongoUser, setMongoUser] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // ==================================================
  // CURRENT DATE & TIME
  // ==================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ========================================
  // CURRENT CLOCK
  // ========================================

  const timeParts = currentTime.toLocaleTimeString("bn-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const [time, period] = timeParts.split(" ");

  // ========================================
  // CURRENT DAY
  // ========================================

  const dayName = currentTime.toLocaleDateString("bn-BD", {
    weekday: "long",
  });

  // ========================================
  // CURRENT DATE
  // ========================================

  const formattedDate = currentTime.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // ==================================================
  // LOAD USER FROM MONGODB
  // ==================================================

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.email) return;

      try {
        const response = await axiosSecure.get(
          `/users/${encodeURIComponent(user.email)}`,
        );

        console.log("Loaded MongoDB user:", response.data);
        setMongoUser(response.data);
      } catch (error) {
        console.error(
          "Failed to load user:",
          error.response?.data || error.message,
        );
      }
    };

    loadUser();
  }, [user]);

  // ==================================================
  // CURRENT TIME UPDATE
  // ==================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // ==================================================
  // LOAD PRAYER TIMES
  // ==================================================

  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        const res = await axios.get(
          "https://rahmania-jame-mosjid-backend.onrender.com/prayer-times",
        );
        setPrayerTimes(res.data);
      } catch (error) {
        console.error("Prayer Times Error:", error);
      }
    };

    loadPrayerTimes();
  }, []);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading || !prayerTimes) {
    return <Loading />;
  }

  // ==================================================
  // LOGIN CHECK
  // ==================================================

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8] px-4 transition-colors duration-300 dark:bg-gray-950">
        <div
          className="
            w-full max-w-md rounded-3xl border
            border-emerald-100 bg-white p-8 text-center shadow-lg
            transition-colors duration-300
            dark:border-green-900/60 dark:bg-gray-900 dark:shadow-black/30
          "
        >
          <div
            className="
              mx-auto flex h-16 w-16 items-center justify-center
              rounded-2xl bg-emerald-50 text-3xl text-[#087443]
              dark:bg-green-950/60 dark:text-green-400
            "
          >
            <FaMosque />
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-emerald-950 dark:text-white">
            প্রথমে লগইন করুন
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
            আপনার ব্যক্তিগত মসজিদ ড্যাশবোর্ড ব্যবহার করতে প্রথমে লগইন করুন।
          </p>

          <Link
            to="/login"
            className="
              mt-6 inline-flex items-center gap-2 rounded-xl
              bg-[#087443] px-6 py-3 text-sm font-bold text-white
              transition hover:bg-[#064b32]
              dark:bg-green-600 dark:hover:bg-green-700
            "
          >
            লগইন করুন
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </main>
    );
  }

  // ==================================================
  // CONVERT PRAYER TIME TO MINUTES
  // ==================================================

  const getTimeInMinutes = (time) => {
    if (!time || time === "--:--") return null;

    const [timePart, modifier] = time.trim().split(" ");

    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }

    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // ==================================================
  // PRAYER TIMES
  // ==================================================

  const prayers = [
    {
      name: "ফজর",
      time: prayerTimes?.fajr || "--:--",
      icon: <FaMoon />,
    },
    {
      name: "যোহর",
      time: prayerTimes?.dhuhr || "--:--",
      icon: <FaSun />,
    },
    {
      name: "আসর",
      time: prayerTimes?.asr || "--:--",
      icon: <FaCloudSun />,
    },
    {
      name: "মাগরিব",
      time: prayerTimes?.maghrib || "--:--",
      icon: <FaMoon />,
    },
    {
      name: "এশা",
      time: prayerTimes?.isha || "--:--",
      icon: <FaMoon />,
    },
  ].map((prayer, index, arr) => {
    const prayerTime = getTimeInMinutes(prayer.time);

    const activeFrom = prayerTime !== null ? prayerTime - 15 : null;

    const nextPrayerTime =
      index < arr.length - 1 ? getTimeInMinutes(arr[index + 1].time) : null;

    return {
      ...prayer,
      active:
        prayerTime !== null &&
        currentMinutes >= activeFrom &&
        (nextPrayerTime === null || currentMinutes < nextPrayerTime - 15),
    };
  });

  // ==================================================
  // QUICK ACTIONS
  // ==================================================

  const quickActions = [
    {
      name: "কুরআন",
      path: "/quran",
      icon: <FaBookOpen />,
    },
    {
      name: "হাদিস",
      path: "/hadith",
      icon: <FaBook />,
    },
    {
      name: "ইভেন্ট",
      path: "/events",
      icon: <FaCalendarAlt />,
    },
    {
      name: "দান করুন",
      path: "/donate",
      icon: <FaHeart />,
    },
    {
      name: "লাইভ",
      path: "/live-stream",
      icon: <FaBroadcastTower />,
    },
    {
      name: "ঘোষণা",
      path: "/announcements",
      icon: <FaBullhorn />,
    },
    {
      name: "লাইব্রেরি",
      path: "/library",
      icon: <FaBook />,
    },
    {
      name: "কিবলা",
      path: "/qibla",
      icon: <FaCompass />,
    },
  ];

  // ==================================================
  // HOME UI
  // ==================================================

  return (
    <main
      className="
        min-h-screen bg-[#f7faf8] px-3 pb-28 pt-3
        transition-colors duration-300
        dark:bg-gray-950
        sm:px-5 lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
        {/* ==================================================
            HERO SECTION
        ================================================== */}

        <section
          className="
            relative min-h-[190px] overflow-hidden rounded-3xl
            bg-[#075c3b] shadow-lg
            sm:min-h-[260px]
            lg:min-h-[300px]
          "
        >
          {/* Background */}

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=80')",
            }}
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#064b32]/95 via-[#075c3b]/70 to-[#075c3b]/20" />

          {/* Hero Content */}

          <div
            className="
              relative z-10 flex min-h-[190px] flex-col
              justify-between p-4
              sm:min-h-[260px] sm:p-7
              lg:min-h-[300px] lg:p-10
            "
          >
            <div className="max-w-md">
              <p className="text-[10px] font-medium text-white/90 sm:text-sm">
                আসসালামু আলাইকুম,
              </p>

              <h1
                className="
                  mt-1 font-serif text-2xl font-bold text-white
                  sm:text-4xl lg:text-5xl
                "
              >
                {mongoUser?.name ||
                  mongoUser?.displayName ||
                  user?.displayName ||
                  "ব্যবহারকারী"}
              </h1>

              <div className="my-2 h-1 w-9 rounded-full bg-[#e8c34a] sm:my-4 sm:w-12" />

              <p
                className="
                  max-w-[220px] text-[10px] leading-relaxed text-white/90
                  sm:max-w-sm sm:text-sm
                "
              >
                আল্লাহ আপনার দিনকে বরকতময় করুন
                <br />
                এবং আপনার নামাজ কবুল করুন।
              </p>

              <button
                type="button"
                onClick={() => navigate("/quran")}
                className="
                  mt-3 flex items-center gap-2 rounded-xl
                  border border-[#e8c34a]/70
                  bg-[#075c3b]/50 px-3 py-2
                  text-[10px] font-semibold text-[#f5d66c]
                  backdrop-blur-sm transition
                  hover:bg-[#e8c34a] hover:text-[#064b32]
                  sm:mt-5 sm:px-4 sm:py-2.5 sm:text-xs
                "
              >
                <FaBookOpen />
                আজকের আয়াত পড়ুন
                <FaArrowRight />
              </button>
            </div>

            {/* Date / Time */}

            <div
              className="
                absolute right-3 top-3 hidden rounded-2xl
                bg-black/20 p-3 backdrop-blur-md
                sm:block sm:w-[145px]
                lg:right-6 lg:top-6 lg:w-[175px] lg:p-4
              "
            >
              <div className="flex items-center gap-2 text-[10px] text-white sm:text-xs">
                <FaCalendarAlt className="text-[#f2ce52]" />

                <div>
                  <p className="font-semibold">{dayName}</p>

                  <p className="text-white/70">{formattedDate}</p>
                </div>
              </div>

              {/* <p className="mt-3 text-lg font-bold text-white lg:text-2xl">
                {time}
              </p> */}
              <div className="mt-3 flex items-end gap-2">
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

              <p className="mt-1 flex items-center gap-1 text-[9px] text-white/70 sm:text-[10px]">
                <FaMapMarkerAlt />
                ঝিনাইদহ, বাংলাদেশ
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================
            PRAYER TIMES
        ================================================== */}

        <section
          className="
            rounded-3xl border border-gray-100 bg-white p-3 shadow-sm
            transition-colors duration-300
            dark:border-gray-800 dark:bg-gray-900
            sm:p-5
          "
        >
          <div className="mb-3 flex items-center justify-between sm:mb-5">
            <div>
              <p className="text-[9px] font-medium text-[#087443] dark:text-green-400 sm:text-xs">
                দৈনিক সময়সূচি
              </p>

              <h2 className="text-sm font-bold text-gray-800 dark:text-white sm:text-lg">
                নামাজের সময়সূচি
              </h2>
            </div>

            <Link
              to="/prayers"
              className="
                flex items-center gap-1 text-[9px] font-medium
                text-[#087443] transition
                hover:text-[#064b32]
                dark:text-green-400 dark:hover:text-green-300
                sm:text-xs
              "
            >
              সব দেখুন
              <FaArrowRight className="text-[8px]" />
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-1 sm:gap-3">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className={`
                  flex min-h-[75px]
                  flex-col items-center justify-center
                  rounded-2xl px-1 py-2
                  transition-all
                  sm:min-h-[105px]

                  ${
                    prayer.active
                      ? "bg-[#087443] text-white shadow-lg shadow-green-900/20"
                      : "text-gray-500 hover:bg-green-50 dark:text-gray-400 dark:hover:bg-green-950/40"
                  }
                `}
              >
                <span
                  className={`
                    text-lg sm:text-2xl
                    ${
                      prayer.active
                        ? "text-[#f3d04e]"
                        : "text-[#087443] dark:text-green-400"
                    }
                  `}
                >
                  {prayer.icon}
                </span>

                <p
                  className={`
                    mt-1 text-[9px] font-semibold sm:text-xs
                    ${
                      prayer.active
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  `}
                >
                  {prayer.name}
                </p>

                <p
                  className={`
                    mt-1 text-[8px] sm:text-[10px]
                    ${
                      prayer.active
                        ? "text-white/80"
                        : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                >
                  {prayer.time}
                </p>

                {prayer.active && (
                  <span
                    className="
                      mt-1 rounded-full bg-white/15
                      px-2 py-0.5 text-[7px]
                      font-medium text-white
                      sm:text-[8px]
                    "
                  >
                    এখন
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <section className="grid grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {quickActions.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.path)}
              className="
                flex min-h-[82px] flex-col items-center justify-center
                rounded-2xl border border-gray-100 bg-white px-1
                shadow-sm transition-all duration-300
                hover:-translate-y-1 hover:bg-green-50 hover:shadow-md
                dark:border-gray-800 dark:bg-gray-900
                dark:hover:bg-green-950/40
                sm:min-h-[110px] sm:rounded-3xl
              "
            >
              <span className="text-xl text-[#087443] dark:text-green-400 sm:text-2xl">
                {item.icon}
              </span>

              <span className="mt-2 text-[8px] font-semibold text-gray-600 dark:text-gray-300 sm:text-xs">
                {item.name}
              </span>
            </button>
          ))}
        </section>

        {/* ==================================================
            UPCOMING EVENTS
        ================================================== */}

        <section
          className="
            rounded-3xl border border-gray-100 bg-white p-3 shadow-sm
            transition-colors duration-300
            dark:border-gray-800 dark:bg-gray-900
            sm:p-5
          "
        >
          <div className="mb-3 flex items-center justify-between sm:mb-5">
            <div>
              <p className="text-[9px] font-medium text-[#087443] dark:text-green-400 sm:text-xs">
                মসজিদ কমিউনিটি
              </p>

              <h2 className="text-sm font-bold text-gray-800 dark:text-white sm:text-lg">
                আসন্ন ইভেন্ট
              </h2>
            </div>

            <Link
              to="/events"
              className="
                flex items-center gap-1 text-[9px] font-medium
                text-[#087443] transition
                dark:text-green-400
                sm:text-xs
              "
            >
              সব দেখুন
              <FaArrowRight className="text-[8px]" />
            </Link>
          </div>

          <Link
            to="/events"
            className="
              group flex items-center gap-3 rounded-2xl
              bg-[#f5faf7] p-2.5 transition
              hover:bg-[#edf8f1]
              dark:bg-gray-800 dark:hover:bg-green-950/40
              sm:p-4
            "
          >
            <div
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl bg-[#e3f2eb] text-[#087443]
                dark:bg-green-950/70 dark:text-green-400
                sm:h-14 sm:w-14
              "
            >
              <FaCalendarAlt className="text-lg sm:text-xl" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[10px] font-bold text-gray-700 dark:text-gray-200 sm:text-sm">
                জুমার নামাজ ও খুতবা
              </h3>

              <p className="mt-1 text-[8px] text-gray-400 dark:text-gray-500 sm:text-xs">
                প্রতি শুক্রবার &nbsp; • &nbsp; দুপুর ১:১৫
              </p>
            </div>

            <FaArrowRight
              className="
                text-xs text-gray-400 transition
                group-hover:translate-x-1
                group-hover:text-[#087443]
                dark:group-hover:text-green-400
              "
            />
          </Link>

          <div className="mt-3 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#087443] dark:bg-green-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </section>

        {/* ==================================================
            QURAN VERSE
        ================================================== */}

        <section
          className="
            relative overflow-hidden rounded-3xl
            bg-[#075c3b] px-4 py-5 text-white shadow-lg
            sm:px-8 sm:py-7
          "
        >
          {/* Decorative Mosque */}

          <div className="absolute -bottom-10 -right-2 opacity-10">
            <FaMosque className="text-[130px] sm:text-[200px]" />
          </div>

          {/* Decorative Circle */}

          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border-[20px] border-white/5" />

          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#f3d04e]">
                <FaBookOpen />
              </div>

              <div>
                <p className="text-[8px] uppercase tracking-widest text-[#f3d04e] sm:text-[10px]">
                  দৈনিক কুরআন
                </p>

                <p className="text-[10px] font-semibold text-white sm:text-xs">
                  আজকের আয়াত
                </p>
              </div>
            </div>

            {/* Arabic */}

            <p
              dir="rtl"
              className="
                text-right font-serif text-[13px]
                leading-loose text-white
                sm:text-xl lg:text-2xl
              "
            >
              وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ
              الرَّاكِعِينَ
            </p>

            {/* Translation */}

            <p className="mt-2 max-w-2xl text-[9px] leading-relaxed text-white/80 sm:text-sm">
              আর তোমরা নামাজ কায়েম করো, যাকাত প্রদান করো এবং যারা রুকু করে
              তাদের সাথে রুকু করো।
            </p>

            <div className="my-3 h-0.5 w-8 bg-[#e8c34a] sm:my-4 sm:w-10" />

            <p className="text-right text-[9px] font-semibold text-[#e8c34a] sm:text-xs">
              — আল-বাকারা ২:৪৩
            </p>
          </div>
        </section>

        {/* ==================================================
            COMMUNITY CTA
        ================================================== */}

        <section
          className="
            rounded-3xl border border-emerald-100
            bg-gradient-to-r from-emerald-50 to-white
            p-5 shadow-sm
            transition-colors duration-300
            dark:border-green-900/60
            dark:from-green-950/50
            dark:to-gray-900
            sm:p-7
          "
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center
                rounded-2xl bg-[#087443] text-2xl text-[#f3d04e]
                shadow-md
              "
            >
              <FaMosque />
            </div>

            <div className="flex-1">
              <h2 className="font-serif text-lg font-bold text-emerald-950 dark:text-white sm:text-xl">
                আপনার মসজিদের সাথে যুক্ত থাকুন
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                ইসলামিক জ্ঞান, ইভেন্ট, দান, লাইভ স্ট্রিম এবং আরও অনেক কিছু
                সম্পর্কে জানুন।
              </p>
            </div>

            <Link
              to="/events"
              className="
                flex shrink-0 items-center gap-2 rounded-xl
                bg-[#087443] px-5 py-3
                text-xs font-bold text-white
                transition hover:bg-[#064b32]
                dark:bg-green-600 dark:hover:bg-green-700
                sm:text-sm
              "
            >
              ঘুরে দেখুন
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
