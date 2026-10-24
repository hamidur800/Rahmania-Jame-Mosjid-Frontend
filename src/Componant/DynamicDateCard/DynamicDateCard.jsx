import { useEffect, useState } from "react";

const getDates = () => {
  const now = new Date();

  // বাংলা তারিখ
  const bengaliDate = new Intl.DateTimeFormat("bn-BD-u-ca-beng", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(now);

  // হিজরি তারিখ
  const arabicDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    numberingSystem: "arab",
    timeZone: "Asia/Dhaka",
  }).format(now);

  // ইংরেজি তারিখ
  const englishDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(now);

  return {
    bengaliDate,
    arabicDate,
    englishDate,
  };
};

const DynamicDateCard = () => {
  const [dates, setDates] = useState(getDates);

  useEffect(() => {
    const updateDates = () => setDates(getDates());

    const timer = setInterval(updateDates, 60 * 1000);

    window.addEventListener("focus", updateDates);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", updateDates);
    };
  }, []);

  return (
    <div className="mx-auto my-2 w-full max-w-xl px-1">
      <div className="rounded-md border border-emerald-100 bg-[#f5f7f5] px-3 py-2 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {/* Arabic / Hijri Date */}
        <p
          className="text-sm font-semibold leading-6 text-[#075c46] sm:text-base dark:text-emerald-300"
          dir="auto"
        >
          {dates.hijriDate} হিজরি 🌙
        </p>

        {/* Bengali Date */}
        <p className="text-xs leading-5 text-gray-600 sm:text-sm dark:text-gray-300">
          {dates.bengaliDate}
        </p>

        {/* English Date */}
        <p className="text-[10px] leading-4 text-gray-500 dark:text-gray-400">
          {dates.englishDate}
        </p>
      </div>
    </div>
  );
};

export default DynamicDateCard;
