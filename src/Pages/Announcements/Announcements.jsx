import React, { useMemo, useState } from "react";
import {
  FaBullhorn,
  FaMagnifyingGlass,
  FaFilter,
  FaCalendarDays,
  FaArrowRight,
  FaMosque,
  FaCircleExclamation,
  FaCircleInfo,
} from "react-icons/fa6";

const announcements = [
  {
    id: 1,
    title: "জুমার নামাজের সময় পরিবর্তন",
    category: "Prayer",
    date: "৫ সেপ্টেম্বর, ২০২৬",
    priority: "Important",
    description:
      "জুমার নামাজের সময় পরিবর্তন করা হয়েছে। নামাজ শুরু হওয়ার অন্তত ১৫ মিনিট আগে মসজিদে উপস্থিত হওয়ার জন্য সবাইকে অনুরোধ করা হচ্ছে।",
    icon: "🕌",
  },
  {
    id: 2,
    title: "মাসিক মসজিদ সভা",
    category: "Event",
    date: "৭ সেপ্টেম্বর, ২০২৬",
    priority: "General",
    description:
      "মাগরিবের নামাজের পর মাসিক মসজিদ কমিটির সভা অনুষ্ঠিত হবে। সকল সদস্যকে যথাসময়ে উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।",
    icon: "📢",
  },
  {
    id: 3,
    title: "ইসলামিক আলোচনা অনুষ্ঠান",
    category: "Program",
    date: "১০ সেপ্টেম্বর, ২০২৬",
    priority: "General",
    description:
      "এশার নামাজের পর একটি গুরুত্বপূর্ণ ইসলামিক আলোচনা অনুষ্ঠিত হবে। সবাইকে এই শিক্ষামূলক অনুষ্ঠানে অংশগ্রহণের জন্য আমন্ত্রণ জানানো হচ্ছে।",
    icon: "📖",
  },
  {
    id: 4,
    title: "মসজিদ পরিষ্কার-পরিচ্ছন্নতা দিবস",
    category: "Notice",
    date: "১২ সেপ্টেম্বর, ২০২৬",
    priority: "General",
    description:
      "ফজরের নামাজের পর বিশেষ মসজিদ পরিষ্কার-পরিচ্ছন্নতা কার্যক্রম অনুষ্ঠিত হবে। স্বেচ্ছাসেবীদের এই কাজে অংশগ্রহণের জন্য স্বাগত জানানো হচ্ছে।",
    icon: "🧹",
  },
  {
    id: 5,
    title: "রমজানের প্রস্তুতি কার্যক্রম",
    category: "Program",
    date: "১৫ সেপ্টেম্বর, ২০২৬",
    priority: "Important",
    description:
      "ইবাদত, দান-সদকা এবং কমিউনিটি কার্যক্রমকে গুরুত্ব দিয়ে মসজিদে একটি বিশেষ প্রস্তুতিমূলক অনুষ্ঠান আয়োজন করা হবে।",
    icon: "🌙",
  },
  {
    id: 6,
    title: "মসজিদে দান সংগ্রহের বিজ্ঞপ্তি",
    category: "Donation",
    date: "১৮ সেপ্টেম্বর, ২০২৬",
    priority: "General",
    description:
      "মাসিক মসজিদ দান সংগ্রহ কার্যক্রম শুরু হয়েছে। আপনার অনুদান মসজিদের রক্ষণাবেক্ষণ ও কমিউনিটি কার্যক্রম পরিচালনায় সহায়তা করে।",
    icon: "🤲",
  },
];

const categories = [
  { value: "All", label: "সবগুলো" },
  { value: "Prayer", label: "নামাজ" },
  { value: "Event", label: "অনুষ্ঠান" },
  { value: "Program", label: "কার্যক্রম" },
  { value: "Notice", label: "বিজ্ঞপ্তি" },
  { value: "Donation", label: "দান" },
];

const Announcements = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        announcement.title.toLowerCase().includes(searchText) ||
        announcement.description.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All" || announcement.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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
              <FaBullhorn />
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-200">
              মসজিদের আপডেট
            </p>

            <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              বিজ্ঞপ্তি
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 sm:text-base">
              মসজিদের সর্বশেষ খবর, নামাজের সময়সূচি, ইসলামিক কার্যক্রম, অনুষ্ঠান
              এবং গুরুত্বপূর্ণ কমিউনিটি বিজ্ঞপ্তি সম্পর্কে আপডেট থাকুন।
            </p>
          </div>
        </div>

        {/* ================= SEARCH & FILTER ================= */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="বিজ্ঞপ্তি খুঁজুন..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-500 dark:focus:bg-gray-900 dark:focus:ring-emerald-900/30"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <div className="hidden shrink-0 items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 sm:flex">
                <FaFilter />
                বিভাগ
              </div>

              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setActiveCategory(category.value)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeCategory === category.value
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-950/40"
                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION TITLE ================= */}
        <div className="mb-5 mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              সর্বশেষ আপডেট
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
              সাম্প্রতিক বিজ্ঞপ্তি
            </h2>
          </div>

          <p className="hidden text-sm text-slate-500 dark:text-gray-400 sm:block">
            {filteredAnnouncements.length}টি বিজ্ঞপ্তি
          </p>
        </div>

        {/* ================= ANNOUNCEMENT LIST ================= */}
        {filteredAnnouncements.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20 sm:p-6"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 text-2xl dark:from-emerald-900/40 dark:to-green-900/30">
                      {announcement.icon}
                    </div>

                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {
                            categories.find(
                              (item) => item.value === announcement.category,
                            )?.label
                          }
                        </span>

                        {announcement.priority === "Important" && (
                          <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <FaCircleExclamation />
                            গুরুত্বপূর্ণ
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold leading-7 text-slate-800 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 sm:text-xl">
                        {announcement.title}
                      </h3>
                    </div>
                  </div>

                  <FaCircleInfo className="hidden shrink-0 text-slate-300 transition group-hover:text-emerald-500 dark:text-gray-600 dark:group-hover:text-emerald-400 sm:block" />
                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-7 text-slate-500 dark:text-gray-300">
                  {announcement.description}
                </p>

                {/* Footer */}
                <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                    <FaCalendarDays className="text-emerald-600 dark:text-emerald-400" />
                    {announcement.date}
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    বিস্তারিত দেখুন
                    <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center transition-colors dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <FaBullhorn />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-white">
              কোনো বিজ্ঞপ্তি পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              অন্য কোনো শব্দ বা বিভাগ দিয়ে আবার চেষ্টা করুন।
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              ফিল্টার পরিষ্কার করুন
            </button>
          </div>
        )}

        {/* ================= BOTTOM INFO ================= */}
        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400">
            <FaMosque />
          </div>

          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">
              আপনার মসজিদের সাথে যুক্ত থাকুন
            </h3>

            <p className="mt-1 text-sm leading-6 text-emerald-700/80 dark:text-emerald-300/80">
              গুরুত্বপূর্ণ মসজিদ বিজ্ঞপ্তি এবং কমিউনিটির সর্বশেষ আপডেট জানতে
              নিয়মিত এই পেজটি দেখুন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
