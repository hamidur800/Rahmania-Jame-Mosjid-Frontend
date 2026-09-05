import React, { useMemo, useState } from "react";
import {
  FaBookOpen,
  FaMagnifyingGlass,
  FaFilter,
  FaStar,
  FaArrowRight,
  FaBookmark,
} from "react-icons/fa6";

const books = [
  {
    id: 1,
    title: "পবিত্র কুরআন",
    author: "আল-কুরআনুল কারীম",
    category: "Quran",
    description:
      "সুন্দর ও সহজবোধ্য উপস্থাপনার মাধ্যমে পবিত্র কুরআন পড়ুন এবং অনুধাবন করুন।",
    rating: 5,
    pages: 604,
    icon: "📖",
  },
  {
    id: 2,
    title: "রিয়াদুস সালেহীন",
    author: "ইমাম আন-নববী (রহ.)",
    category: "Hadith",
    description:
      "ইসলামি জীবনের বিভিন্ন দিক নিয়ে সহিহ হাদিসের একটি গুরুত্বপূর্ণ সংকলন।",
    rating: 4.9,
    pages: 680,
    icon: "📚",
  },
  {
    id: 3,
    title: "চল্লিশ হাদিস",
    author: "ইমাম আন-নববী (রহ.)",
    category: "Hadith",
    description:
      "প্রত্যেক মুসলিমের জন্য গুরুত্বপূর্ণ ও প্রয়োজনীয় চল্লিশটি হাদিসের বিখ্যাত সংকলন।",
    rating: 4.8,
    pages: 120,
    icon: "📕",
  },
  {
    id: 4,
    title: "নবীদের কাহিনী",
    author: "ইবন কাসীর (রহ.)",
    category: "History",
    description:
      "ইসলামে বর্ণিত বিভিন্ন নবী-রাসুলের জীবন ও শিক্ষণীয় ঘটনাগুলো সম্পর্কে জানুন।",
    rating: 4.9,
    pages: 420,
    icon: "📘",
  },
  {
    id: 5,
    title: "হিসনুল মুসলিম",
    author: "সাঈদ আল-কাহতানী",
    category: "Dua",
    description:
      "মুসলিমদের দৈনন্দিন জীবনের বিভিন্ন দোয়া ও যিকিরের একটি সুন্দর সংকলন।",
    rating: 4.9,
    pages: 190,
    icon: "📗",
  },
  {
    id: 6,
    title: "আর-রাহীকুল মাখতূম",
    author: "সফিউর রহমান মুবারকপুরী",
    category: "Seerah",
    description:
      "রাসুলুল্লাহ ﷺ-এর পবিত্র জীবন ও সীরাতের একটি অনুপ্রেরণামূলক জীবনী।",
    rating: 4.8,
    pages: 520,
    icon: "📙",
  },
];

const categories = [
  { value: "All", label: "সবগুলো" },
  { value: "Quran", label: "কুরআন" },
  { value: "Hadith", label: "হাদিস" },
  { value: "Dua", label: "দোয়া" },
  { value: "Seerah", label: "সীরাত" },
  { value: "History", label: "ইতিহাস" },
];

const categoryLabel = (category) => {
  const found = categories.find((item) => item.value === category);
  return found?.label || category;
};

const BookLibrary = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.description.toLowerCase().includes(searchText);

      const matchesCategory =
        activeCategory === "All" || book.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const toggleBookmark = (bookId) => {
    setBookmarks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 pb-25 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 px-6 py-10 shadow-xl sm:px-10 lg:px-12">
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-white/5" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white backdrop-blur-sm">
              <FaBookOpen />
            </div>

            <p className="mb-2 text-sm font-medium tracking-[0.15em] text-emerald-200">
              ইসলামি জ্ঞান
            </p>

            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              ইসলামি বইয়ের লাইব্রেরি
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
              কুরআন, হাদিস, সীরাত, দোয়া ও বিভিন্ন ইসলামি বই পড়ুন। আপনার ইসলামি
              জ্ঞান বৃদ্ধি করুন এবং ঈমানকে আরও শক্তিশালী করুন।
            </p>
          </div>
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="বই বা লেখকের নাম খুঁজুন..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:bg-gray-800 dark:focus:ring-emerald-900/40"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <div className="hidden shrink-0 items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 sm:flex">
                <FaFilter />
                বিভাগ
              </div>

              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeCategory === category.value
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-950/30"
                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
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
              জানুন ও শিখুন
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
              জনপ্রিয় বইসমূহ
            </h2>
          </div>

          <p className="hidden text-sm text-slate-500 dark:text-gray-400 sm:block">
            {filteredBooks.length}টি বই পাওয়া গেছে
          </p>
        </div>

        {/* ================= BOOK GRID ================= */}
        {filteredBooks.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => {
              const isBookmarked = bookmarks.includes(book.id);

              return (
                <div
                  key={book.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* Book Cover */}
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-slate-100 dark:from-emerald-950/50 dark:via-green-950/40 dark:to-gray-800">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[20px] border-emerald-200 dark:border-emerald-800" />
                      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full border-[25px] border-green-200 dark:border-green-900" />
                    </div>

                    <div className="relative flex h-28 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-700 to-green-950 text-4xl shadow-2xl transition duration-300 group-hover:scale-105">
                      {book.icon}
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmark(book.id)}
                      title={
                        isBookmarked ? "সংরক্ষণ থেকে সরান" : "বই সংরক্ষণ করুন"
                      }
                      className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
                        isBookmarked
                          ? "bg-emerald-600 text-white"
                          : "bg-white/90 text-slate-500 hover:bg-emerald-600 hover:text-white dark:bg-gray-800/90 dark:text-gray-300"
                      }`}
                    >
                      <FaBookmark className="text-sm" />
                    </button>

                    {/* Category */}
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-sm dark:bg-gray-800/90 dark:text-emerald-400">
                      {categoryLabel(book.category)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-800 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {book.author}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-gray-400">
                      {book.description}
                    </p>

                    {/* Rating */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-sm text-amber-400" />

                        <span className="text-sm font-semibold text-slate-700 dark:text-gray-200">
                          {book.rating}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 dark:text-gray-500">
                        {book.pages} পৃষ্ঠা
                      </span>
                    </div>

                    {/* Button */}
                    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      <FaBookOpen />
                      বই পড়ুন
                      <FaArrowRight className="text-xs transition group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FaBookOpen />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-white">
              কোনো বই পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              অন্য কোনো বইয়ের নাম, লেখক বা বিভাগ দিয়ে আবার খুঁজে দেখুন।
            </p>

            <button
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
        <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400">
            <FaBookOpen />
          </div>

          <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
            প্রতিদিন ইসলামি জ্ঞান অর্জন করুন
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-gray-400">
            কুরআন, হাদিস ও ইসলামি জ্ঞান অধ্যয়নের মাধ্যমে নিজের ঈমান ও আমলকে আরও
            সুন্দর করার চেষ্টা করুন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookLibrary;
