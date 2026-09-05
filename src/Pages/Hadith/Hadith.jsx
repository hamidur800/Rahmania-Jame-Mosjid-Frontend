import React, { useState } from "react";
import {
  FaBookOpen,
  FaMagnifyingGlass,
  FaHeart,
  FaShareNodes,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa6";

const Hadith = () => {
  const [search, setSearch] = useState("");

  const hadiths = [
    {
      id: 1,
      number: "০১",
      title: "নিয়তের গুরুত্ব",
      arabic:
        "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      translation:
        "কাজ নিয়তের উপর নির্ভরশীল এবং প্রত্যেক ব্যক্তি তার নিয়ত অনুযায়ী ফল লাভ করবে।",
      narrator: "উমর ইবনুল খাত্তাব (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ১",
      category: "ঈমান",
    },
    {
      id: 2,
      number: "০২",
      title: "তোমাদের মধ্যে শ্রেষ্ঠ",
      arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      translation:
        "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে কুরআন শেখে এবং অন্যকে শিক্ষা দেয়।",
      narrator: "উসমান ইবন আফফান (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ৫০২৭",
      category: "কুরআন",
    },
    {
      id: 3,
      number: "০৩",
      title: "অন্যের প্রতি দয়া",
      arabic: "مَنْ لَا يَرْحَمْ لَا يُرْحَمْ",
      translation: "যে ব্যক্তি দয়া করে না, তার প্রতিও দয়া করা হবে না।",
      narrator: "আবু হুরায়রা (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ৭৩৭৬",
      category: "চরিত্র",
    },
    {
      id: 4,
      number: "০৪",
      title: "সদাচরণও সদকা",
      arabic: "كُلُّ مَعْرُوفٍ صَدَقَةٌ",
      translation: "প্রত্যেক ভালো কাজই একটি সদকা।",
      narrator: "জাবির ইবন আবদুল্লাহ (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ৬০২১",
      category: "সদকা",
    },
    {
      id: 5,
      number: "০৫",
      title: "নিজের জন্য যা ভালোবাসো",
      arabic:
        "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      translation:
        "তোমাদের কেউ ততক্ষণ পর্যন্ত পূর্ণ মুমিন হতে পারবে না, যতক্ষণ না সে নিজের জন্য যা ভালোবাসে, তার ভাইয়ের জন্যও তা ভালোবাসে।",
      narrator: "আনাস ইবন মালিক (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ১৩",
      category: "ভ্রাতৃত্ব",
    },
    {
      id: 6,
      number: "০৬",
      title: "ভালো কথা বলা",
      arabic:
        "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      translation:
        "যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা নীরব থাকে।",
      narrator: "আবু হুরায়রা (রাঃ)",
      source: "সহিহ বুখারি",
      reference: "হাদিস ৬০১৮",
      category: "চরিত্র",
    },
  ];

  const filteredHadiths = hadiths.filter(
    (hadith) =>
      hadith.title.toLowerCase().includes(search.toLowerCase()) ||
      hadith.translation.toLowerCase().includes(search.toLowerCase()) ||
      hadith.category.toLowerCase().includes(search.toLowerCase()) ||
      hadith.narrator.toLowerCase().includes(search.toLowerCase()) ||
      hadith.source.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-8 transition-colors duration-300 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <FaBookOpen />
            ইসলামিক জ্ঞান
          </div>

          <h1 className="font-serif text-3xl font-bold text-emerald-950 dark:text-white sm:text-4xl lg:text-5xl">
            হাদিস সংকলন
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-gray-300 sm:text-base">
            মহানবী হযরত মুহাম্মদ ﷺ-এর বিশুদ্ধ বাণী ও শিক্ষা সম্পর্কে জানুন এবং
            দৈনন্দিন জীবনের জন্য মূল্যবান দিকনির্দেশনা লাভ করুন।
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:border-emerald-500 dark:focus-within:ring-emerald-900/30">
            <FaMagnifyingGlass className="text-emerald-600 dark:text-emerald-400" />

            <input
              type="text"
              placeholder="হাদিস খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Hadith Grid */}
        {filteredHadiths.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredHadiths.map((hadith) => (
              <article
                key={hadith.id}
                className="group overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:shadow-black/20"
              >
                {/* Card Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-950 px-5 py-5">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[16px] border-white/5" />
                  <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/5" />

                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-emerald-100 backdrop-blur-sm">
                        {hadith.number}
                      </div>

                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-emerald-200">
                          {hadith.category}
                        </span>

                        <h2 className="font-serif text-lg font-bold text-white">
                          {hadith.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition hover:bg-white/20"
                      title="হাদিস সংরক্ষণ করুন"
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  {/* Quote Icon */}
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <FaQuoteLeft className="text-sm" />
                  </div>

                  {/* Arabic */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <p
                      dir="rtl"
                      className="font-serif text-xl leading-[2.2] text-emerald-950 dark:text-emerald-100 sm:text-2xl"
                    >
                      {hadith.arabic}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="mt-5">
                    <p className="text-sm leading-7 text-slate-600 dark:text-gray-300">
                      “{hadith.translation}”
                    </p>
                  </div>

                  {/* Narrator */}
                  <div className="mt-5 border-t border-emerald-50 pt-4 dark:border-gray-700">
                    <p className="text-xs text-slate-400 dark:text-gray-500">
                      বর্ণনাকারী
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-gray-200">
                      {hadith.narrator}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        উৎস
                      </p>

                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                        {hadith.source}
                      </p>

                      <p className="text-xs text-slate-400 dark:text-gray-500">
                        {hadith.reference}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-700 hover:text-white dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-600"
                    >
                      <FaShareNodes />
                      শেয়ার করুন
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-emerald-100 bg-white px-5 py-14 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <FaBookOpen />
            </div>

            <h3 className="mt-4 font-serif text-xl font-bold text-emerald-950 dark:text-white">
              কোনো হাদিস পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              অন্য কোনো শব্দ দিয়ে আবার খুঁজে দেখুন।
            </p>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-green-950 p-6 shadow-lg sm:p-8">
          <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <div className="mb-2 flex items-center justify-center gap-2 text-emerald-200 sm:justify-start">
                <FaBookOpen />

                <span className="text-sm font-semibold">
                  প্রতিদিনের ইসলামিক স্মরণ
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
                শিখুন, চিন্তা করুন ও আমল করুন
              </h3>

              <p className="mt-1 text-sm text-emerald-100">
                মহানবী ﷺ-এর শিক্ষা আপনার দৈনন্দিন জীবনকে পরিচালিত করতে দিন।
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              আরও হাদিস
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hadith;
