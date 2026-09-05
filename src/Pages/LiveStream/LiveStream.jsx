import React from "react";
import {
  FaVideo,
  FaCircle,
  FaPlay,
  FaCalendarDays,
  FaClock,
  FaMosque,
  FaBell,
  FaArrowRight,
} from "react-icons/fa6";

const LiveStream = () => {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 pb-28 transition-colors duration-300 dark:bg-gray-950 sm:px-6 sm:py-8 sm:pb-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HERO ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 px-6 py-10 shadow-xl sm:px-10 lg:px-12">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-white/5" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white backdrop-blur-sm">
              <FaVideo />
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
              মসজিদ মিডিয়া
            </p>

            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              লাইভ স্ট্রিম
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 sm:text-base">
              আমাদের মসজিদের লাইভ নামাজ, ইসলামিক আলোচনা, জুমার খুতবা এবং বিশেষ
              অনুষ্ঠান সরাসরি দেখুন।
            </p>
          </div>
        </div>

        {/* ================= LIVE SECTION ================= */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20 lg:col-span-2">
            {/* Video */}
            <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950">
              {/* Background decoration */}
              <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10" />
              <div className="absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-emerald-400/10" />

              <div className="relative z-10 text-center px-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-950/40">
                  <FaPlay className="ml-1 text-2xl" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-white sm:text-2xl">
                  মসজিদের লাইভ স্ট্রিম
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  লাইভ স্ট্রিম এখানে দেখা যাবে
                </p>
              </div>

              {/* LIVE Badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <FaCircle className="animate-pulse text-[7px]" />
                লাইভ
              </div>
            </div>

            {/* Video Info */}
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    বর্তমানে সম্প্রচারিত
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
                    ইসলামিক আলোচনা ও মসজিদের অনুষ্ঠান
                  </h2>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FaBell />
                  আমাকে জানান
                </button>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-gray-400">
                অনলাইনে আমাদের মসজিদ কমিউনিটির সাথে যুক্ত থাকুন এবং গুরুত্বপূর্ণ
                ইসলামিক অনুষ্ঠান, আলোচনা ও নামাজের কার্যক্রম সরাসরি উপভোগ করুন।
              </p>
            </div>
          </div>

          {/* ================= SIDE CARD ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <FaCalendarDays />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  সময়সূচি
                </p>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  আসন্ন লাইভ
                </h3>
              </div>
            </div>

            {/* Schedule 1 */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/50 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <FaMosque />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100">
                      জুমার খুতবা
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                      শুক্রবার
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  আসন্ন
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                <FaClock className="text-emerald-600 dark:text-emerald-400" />
                দুপুর ১:০০
              </div>
            </div>

            {/* Schedule 2 */}
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/50 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <FaVideo />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100">
                      ইসলামিক আলোচনা
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                      রবিবার
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  আসন্ন
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                <FaClock className="text-emerald-600 dark:text-emerald-400" />
                রাত ৮:০০
              </div>
            </div>

            {/* Schedule 3 */}
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/50 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <FaMosque />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-gray-100">
                      বিশেষ অনুষ্ঠান
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">
                      বুধবার
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  আসন্ন
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                <FaClock className="text-emerald-600 dark:text-emerald-400" />
                সন্ধ্যা ৭:৩০
              </div>
            </div>
          </div>
        </div>

        {/* ================= RECENT VIDEOS ================= */}
        <div className="mb-5 mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              যেকোনো সময় দেখুন
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
              সাম্প্রতিক স্ট্রিম
            </h2>
          </div>

          <button
            type="button"
            className="hidden items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 sm:flex"
          >
            সব দেখুন
            <FaArrowRight className="text-xs" />
          </button>
        </div>

        {/* Video Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20">
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-emerald-700 to-green-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:scale-110">
                <FaPlay className="ml-1" />
              </div>

              <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
                ৪৫:২০
              </span>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ইসলামিক আলোচনা
              </p>

              <h3 className="mt-1 font-bold text-slate-800 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                নামাজের গুরুত্ব
              </h3>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                ১ সেপ্টেম্বর, ২০২৬
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20">
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-green-700 to-emerald-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:scale-110">
                <FaPlay className="ml-1" />
              </div>

              <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
                ৫২:১৫
              </span>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                জুমা
              </p>

              <h3 className="mt-1 font-bold text-slate-800 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                জুমার খুতবা
              </h3>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                ২৮ আগস্ট, ২০২৬
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20">
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition group-hover:scale-110">
                <FaPlay className="ml-1" />
              </div>

              <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
                ৩৮:৪০
              </span>
            </div>

            <div className="p-5">
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                কমিউনিটি
              </p>

              <h3 className="mt-1 font-bold text-slate-800 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                শক্তিশালী উম্মাহ গড়ে তোলা
              </h3>

              <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                ২৫ আগস্ট, ২০২৬
              </p>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM INFO ================= */}
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/30 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400">
            <FaMosque />
          </div>

          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
              আপনার মসজিদের সাথে যুক্ত থাকুন
            </h3>

            <p className="mt-1 text-sm leading-6 text-emerald-700/80 dark:text-emerald-300/80">
              গুরুত্বপূর্ণ কোনো ইসলামিক অনুষ্ঠান, আলোচনা বা মসজিদের কার্যক্রম
              যেন মিস না হয়। আসন্ন লাইভ স্ট্রিমের জন্য নিয়মিত আমাদের পেজে ফিরে
              আসুন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStream;
