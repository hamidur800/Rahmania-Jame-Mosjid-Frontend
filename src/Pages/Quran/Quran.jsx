import { useState } from "react";
import { FaBookOpen, FaSearch, FaChevronRight } from "react-icons/fa";

const Quran = () => {
  const [search, setSearch] = useState("");

  const surahs = [
    {
      number: 1,
      name: "আল-ফাতিহা",
      arabic: "الفاتحة",
      meaning: "সূচনা",
      ayahs: 7,
    },
    {
      number: 2,
      name: "আল-বাকারা",
      arabic: "البقرة",
      meaning: "গাভী",
      ayahs: 286,
    },
    {
      number: 3,
      name: "আলে ইমরান",
      arabic: "آل عمران",
      meaning: "ইমরানের পরিবার",
      ayahs: 200,
    },
    {
      number: 4,
      name: "আন-নিসা",
      arabic: "النساء",
      meaning: "নারী",
      ayahs: 176,
    },
    {
      number: 5,
      name: "আল-মায়িদাহ",
      arabic: "المائدة",
      meaning: "খাদ্যের পাত্র",
      ayahs: 120,
    },
    {
      number: 6,
      name: "আল-আনআম",
      arabic: "الأنعام",
      meaning: "গবাদি পশু",
      ayahs: 165,
    },
    {
      number: 7,
      name: "আল-আরাফ",
      arabic: "الأعراف",
      meaning: "উঁচু স্থানসমূহ",
      ayahs: 206,
    },
    {
      number: 8,
      name: "আল-আনফাল",
      arabic: "الأنفال",
      meaning: "যুদ্ধলব্ধ সম্পদ",
      ayahs: 75,
    },
  ];

  // ========================================
  // SEARCH
  // ========================================
  const filteredSurahs = surahs.filter((surah) => {
    const query = search.toLowerCase().trim();

    return (
      surah.name.toLowerCase().includes(query) ||
      surah.arabic.includes(query) ||
      surah.meaning.toLowerCase().includes(query) ||
      surah.number.toString().includes(query)
    );
  });

  return (
    <section
      className="
        min-h-screen
        bg-gray-50
        px-3 py-6 pb-28
        transition-colors duration-300
        dark:bg-gray-950
        sm:px-5
        md:py-8
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* ========================================
            HERO
        ======================================== */}
        <div
          className="
            overflow-hidden
            rounded-3xl
            bg-[#087443]
            p-6
            text-white
            shadow-lg
            sm:p-8
            md:p-10
          "
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* LEFT */}
            <div>
              <div
                className="
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-white/15
                  text-2xl
                "
              >
                <FaBookOpen />
              </div>

              <h1 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">
                কুরআন পড়ুন
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-green-100 sm:text-base">
                প্রতিদিন আল্লাহর পবিত্র বাণী পড়ুন, অনুধাবন করুন এবং কুরআনের
                সাথে নিজেকে আরও গভীরভাবে যুক্ত করুন।
              </p>
            </div>

            {/* ARABIC */}
            <div className="text-right">
              <p dir="rtl" className="text-4xl leading-none sm:text-5xl">
                القرآن الكريم
              </p>

              <p className="mt-2 text-xs text-green-100">পবিত্র কুরআন</p>
            </div>
          </div>
        </div>

        {/* ========================================
            SEARCH
        ======================================== */}
        <div className="relative mt-6">
          <FaSearch
            className="
              absolute
              left-4 top-1/2
              -translate-y-1/2
              text-gray-400
              dark:text-gray-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="সূরা খুঁজুন..."
            className="
              w-full
              rounded-2xl
              border border-gray-200
              bg-white
              py-4 pl-11 pr-4
              text-sm
              text-gray-800
              outline-none
              transition-all
              placeholder:text-gray-400
              focus:border-[#087443]
              focus:ring-4
              focus:ring-green-100

              dark:border-gray-800
              dark:bg-gray-900
              dark:text-white
              dark:placeholder:text-gray-500
              dark:focus:border-green-500
              dark:focus:ring-green-900/30
            "
          />
        </div>

        {/* ========================================
            SURAH SECTION
        ======================================== */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              সূরাসমূহ
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              পড়া শুরু করার জন্য একটি সূরা নির্বাচন করুন।
            </p>
          </div>

          {/* ========================================
              SURAH GRID
          ======================================== */}
          {filteredSurahs.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  type="button"
                  className="
                    group
                    flex items-center
                    gap-4
                    rounded-2xl
                    border border-gray-100
                    bg-white
                    p-4
                    text-left
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-green-100
                    hover:shadow-md

                    dark:border-gray-800
                    dark:bg-gray-900
                    dark:hover:border-green-900
                    dark:hover:bg-gray-900
                  "
                >
                  {/* ========================================
                      NUMBER
                  ======================================== */}
                  <div
                    className="
                      flex
                      h-11 w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-green-50
                      text-sm
                      font-bold
                      text-[#087443]
                      transition-all

                      group-hover:bg-[#087443]
                      group-hover:text-white

                      dark:bg-green-950/50
                      dark:text-green-400
                      dark:group-hover:bg-green-700
                      dark:group-hover:text-white
                    "
                  >
                    {surah.number}
                  </div>

                  {/* ========================================
                      INFO
                  ======================================== */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        truncate
                        text-sm
                        font-bold
                        text-gray-800
                        dark:text-white
                      "
                    >
                      {surah.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      {surah.meaning} • {surah.ayahs} আয়াত
                    </p>
                  </div>

                  {/* ========================================
                      ARABIC
                  ======================================== */}
                  <div className="text-right">
                    <p
                      dir="rtl"
                      className="
                        text-xl
                        text-[#087443]
                        dark:text-green-400
                      "
                    >
                      {surah.arabic}
                    </p>

                    <FaChevronRight
                      className="
                        ml-auto
                        mt-2
                        text-[10px]
                        text-gray-300
                        transition-all

                        group-hover:text-[#087443]

                        dark:text-gray-600
                        dark:group-hover:text-green-400
                      "
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* ========================================
                NO RESULT
            ======================================== */
            <div
              className="
                rounded-3xl
                border border-gray-100
                bg-white
                px-5 py-12
                text-center
                shadow-sm

                dark:border-gray-800
                dark:bg-gray-900
              "
            >
              <div
                className="
                  mx-auto
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-green-50
                  text-2xl
                  text-[#087443]

                  dark:bg-green-950/50
                  dark:text-green-400
                "
              >
                <FaSearch />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">
                কোনো সূরা পাওয়া যায়নি
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                অন্য কোনো নাম বা শব্দ দিয়ে আবার খুঁজে দেখুন।
              </p>
            </div>
          )}
        </div>

        {/* ========================================
            BOTTOM INFO
        ======================================== */}
        <div
          className="
            mt-6
            rounded-3xl
            border border-gray-100
            bg-white
            p-6
            text-center
            shadow-sm
            transition-colors duration-300

            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          <FaBookOpen
            className="
              mx-auto
              text-3xl
              text-[#087443]
              dark:text-green-400
            "
          />

          <h2
            className="
              mt-3
              text-lg
              font-bold
              text-gray-800
              dark:text-white
            "
          >
            প্রতিদিন কুরআনের সাথে থাকুন
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-gray-500
              dark:text-gray-400
            "
          >
            কুরআন তিলাওয়াত করুন, এর অর্থ বোঝার চেষ্টা করুন এবং আল্লাহর
            নির্দেশনা অনুযায়ী জীবন পরিচালনা করুন।
          </p>
        </div>
      </div>
    </section>
  );
};

export default Quran;
