import React from "react";
import {
  FaCalendarDays,
  FaClock,
  FaLocationDot,
  FaArrowRight,
  FaMosque,
} from "react-icons/fa6";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "জুমার নামাজ ও খুতবা",
      description:
        "সাপ্তাহিক জুমার নামাজ ও আমাদের ইমামের গুরুত্বপূর্ণ ও অনুপ্রেরণামূলক খুতবায় অংশগ্রহণ করুন।",
      date: "০৫",
      month: "সেপ্টেম্বর",
      day: "শুক্রবার",
      time: "দুপুর ১:০০",
      location: "প্রধান মসজিদ",
      category: "নামাজ",
    },
    {
      id: 2,
      title: "ইসলামিক জ্ঞান সেশন",
      description:
        "ইসলামিক মূল্যবোধ, দৈনন্দিন জীবন এবং উত্তম চরিত্রের গুরুত্ব সম্পর্কে একটি বিশেষ আলোচনা।",
      date: "০৭",
      month: "সেপ্টেম্বর",
      day: "রবিবার",
      time: "সন্ধ্যা ৭:৩০",
      location: "কমিউনিটি হল",
      category: "শিক্ষা",
    },
    {
      id: 3,
      title: "কুরআন শিক্ষা কার্যক্রম",
      description:
        "সঠিক উচ্চারণ ও অর্থ বোঝার মাধ্যমে সুন্দর পরিবেশে কুরআন শেখার সুযোগ গ্রহণ করুন।",
      date: "১২",
      month: "সেপ্টেম্বর",
      day: "শুক্রবার",
      time: "বিকেল ৪:৩০",
      location: "মসজিদ শ্রেণিকক্ষ",
      category: "কুরআন",
    },
    {
      id: 4,
      title: "সামাজিক ইফতার",
      description:
        "দোয়া, খাবার ও ভ্রাতৃত্বের বন্ধনে আমাদের মসজিদ কমিউনিটির একটি সুন্দর মিলনমেলায় অংশগ্রহণ করুন।",
      date: "১৫",
      month: "সেপ্টেম্বর",
      day: "সোমবার",
      time: "সন্ধ্যা ৫:৪৫",
      location: "মসজিদ প্রাঙ্গণ",
      category: "কমিউনিটি",
    },
    {
      id: 5,
      title: "যুব ইসলামিক সমাবেশ",
      description:
        "তরুণ মুসলিমদের জন্য ঈমান, চরিত্র ও সামাজিক দায়িত্ব নিয়ে একটি আকর্ষণীয় ও শিক্ষামূলক আয়োজন।",
      date: "২০",
      month: "সেপ্টেম্বর",
      day: "শনিবার",
      time: "সন্ধ্যা ৬:৩০",
      location: "কমিউনিটি হল",
      category: "যুবসমাজ",
    },
    {
      id: 6,
      title: "বিশেষ দোয়া ও আলোচনা",
      description:
        "দোয়া, ইসলামিক স্মরণ ও অর্থবহ আলোচনার মাধ্যমে একটি শান্তিপূর্ণ সন্ধ্যায় আমাদের সাথে যুক্ত হোন।",
      date: "২৫",
      month: "সেপ্টেম্বর",
      day: "বৃহস্পতিবার",
      time: "রাত ৮:০০",
      location: "প্রধান মসজিদ",
      category: "আধ্যাত্মিক",
    },
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 pb-28 transition-colors duration-300 dark:bg-gray-950 sm:px-6 sm:py-8 sm:pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <FaCalendarDays />
            মসজিদের অনুষ্ঠান
          </div>

          <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-white sm:text-4xl lg:text-5xl">
            আসন্ন অনুষ্ঠানসমূহ
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-gray-300 sm:text-base">
            আমাদের মসজিদ কমিউনিটির সাথে যুক্ত থাকুন এবং গুরুত্বপূর্ণ কোনো
            ইসলামিক অনুষ্ঠান বা কার্যক্রম যেন মিস না হয়।
          </p>
        </div>

        {/* Event Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20"
            >
              {/* Top Section */}
              <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 p-5">
                {/* Islamic Pattern */}
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-white/5" />
                <div className="absolute bottom-0 left-0 h-16 w-16 rounded-tr-full bg-white/5" />

                <div className="relative flex items-start justify-between gap-4">
                  {/* Date */}
                  <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-md dark:bg-gray-100">
                    <span className="text-2xl font-bold leading-none">
                      {event.date}
                    </span>

                    <span className="mt-1 text-[10px] font-bold tracking-wide text-center px-1">
                      {event.month}
                    </span>
                  </div>

                  {/* Category */}
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>

                <div className="relative mt-5">
                  <h2 className="font-serif text-xl font-bold text-white">
                    {event.title}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-100">
                    <FaCalendarDays className="text-emerald-300" />
                    {event.day}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="min-h-[84px] text-sm leading-7 text-slate-600 dark:text-gray-300">
                  {event.description}
                </p>

                {/* Event Info */}
                <div className="mt-5 space-y-3 border-t border-emerald-50 pt-4 dark:border-gray-700">
                  {/* Time */}
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <FaClock />
                    </span>

                    <span>
                      <span className="block text-xs text-slate-400 dark:text-gray-500">
                        সময়
                      </span>

                      <span className="font-medium text-slate-700 dark:text-gray-200">
                        {event.time}
                      </span>
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-gray-300">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <FaLocationDot />
                    </span>

                    <span>
                      <span className="block text-xs text-slate-400 dark:text-gray-500">
                        স্থান
                      </span>

                      <span className="font-medium text-slate-700 dark:text-gray-200">
                        {event.location}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all duration-300 hover:bg-emerald-700 hover:text-white dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                >
                  বিস্তারিত দেখুন
                  <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Community Banner */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-green-950 p-6 shadow-lg sm:p-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl text-emerald-200">
                <FaMosque />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  আমাদের কমিউনিটির অংশ হোন
                </h3>

                <p className="mt-1 text-sm leading-6 text-emerald-100">
                  আমাদের বিভিন্ন অনুষ্ঠানে অংশগ্রহণ করুন এবং মসজিদের সাথে সবসময়
                  যুক্ত থাকুন।
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              আরও দেখুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
