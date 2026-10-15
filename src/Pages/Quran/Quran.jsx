import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaBookOpen,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBookmark,
  FaHistory,
  FaDownload,
  FaSpinner,
  FaWifi,
} from "react-icons/fa";
import {
  downloadQuranOffline,
  getOfflineAyahs,
  getOfflineSurahs,
  isQuranDownloaded,
  searchOfflineQuran,
} from "../../utils/quranOffline";
import Loading from "../../Componant/Loading/Loading";

const API = "https://api.alquran.cloud/v1";
const LAST_READ_KEY = "rjm-quran-last-read-v1";

const banglaNames = [
  "আল-ফাতিহা",
  "আল-বাকারা",
  "আলে ইমরান",
  "আন-নিসা",
  "আল-মায়িদা",
  "আল-আনআম",
  "আল-আরাফ",
  "আল-আনফাল",
  "আত-তাওবা",
  "ইউনুস",
  "হুদ",
  "ইউসুফ",
  "আর-রাদ",
  "ইবরাহিম",
  "আল-হিজর",
  "আন-নাহল",
  "আল-ইসরা",
  "আল-কাহফ",
  "মারইয়াম",
  "ত্ব-হা",
  "আল-আম্বিয়া",
  "আল-হাজ্জ",
  "আল-মুমিনুন",
  "আন-নূর",
  "আল-ফুরকান",
  "আশ-শুআরা",
  "আন-নামল",
  "আল-কাসাস",
  "আল-আনকাবুত",
  "আর-রুম",
  "লুকমান",
  "আস-সাজদা",
  "আল-আহযাব",
  "সাবা",
  "ফাতির",
  "ইয়াসিন",
  "আস-সাফফাত",
  "সাদ",
  "আয-যুমার",
  "গাফির",
  "ফুসসিলাত",
  "আশ-শুরা",
  "আয-যুখরুফ",
  "আদ-দুখান",
  "আল-জাসিয়া",
  "আল-আহকাফ",
  "মুহাম্মদ",
  "আল-ফাতহ",
  "আল-হুজুরাত",
  "কাফ",
  "আয-যারিয়াত",
  "আত-তূর",
  "আন-নাজম",
  "আল-কামার",
  "আর-রহমান",
  "আল-ওয়াকিয়া",
  "আল-হাদিদ",
  "আল-মুজাদিলা",
  "আল-হাশর",
  "আল-মুমতাহিনা",
  "আস-সাফ",
  "আল-জুমুআ",
  "আল-মুনাফিকুন",
  "আত-তাগাবুন",
  "আত-তালাক",
  "আত-তাহরিম",
  "আল-মুলক",
  "আল-কলম",
  "আল-হাক্কাহ",
  "আল-মাআরিজ",
  "নূহ",
  "আল-জিন",
  "আল-মুযযাম্মিল",
  "আল-মুদ্দাসসির",
  "আল-কিয়ামাহ",
  "আল-ইনসান",
  "আল-মুরসালাত",
  "আন-নাবা",
  "আন-নাযিআত",
  "আবাসা",
  "আত-তাকভির",
  "আল-ইনফিতার",
  "আল-মুতাফফিফিন",
  "আল-ইনশিকাক",
  "আল-বুরুজ",
  "আত-তারিক",
  "আল-আলা",
  "আল-গাশিয়াহ",
  "আল-ফজর",
  "আল-বালাদ",
  "আশ-শামস",
  "আল-লাইল",
  "আদ-দুহা",
  "আল-ইনশিরাহ",
  "আত-তিন",
  "আল-আলাক",
  "আল-কদর",
  "আল-বাইয়্যিনাহ",
  "আয-যিলযাল",
  "আল-আদিয়াত",
  "আল-কারিআহ",
  "আত-তাকাসুর",
  "আল-আসর",
  "আল-হুমাযাহ",
  "আল-ফিল",
  "কুরাইশ",
  "আল-মাউন",
  "আল-কাওসার",
  "আল-কাফিরুন",
  "আন-নাসর",
  "আল-মাসাদ",
  "আল-ইখলাস",
  "আল-ফালাক",
  "আন-নাস",
];

const juzNames = Array.from({ length: 30 }, (_, index) => ({
  number: index + 1,
  name: `${index + 1} নং পারা`,
  title: `পারা ${index + 1}`,
}));

const readLastRead = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_READ_KEY) || "null");
  } catch {
    return null;
  }
};

const Quran = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("surah");
  const [search, setSearch] = useState("");
  const [surahs, setSurahs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRead, setLastRead] = useState(readLastRead);
  const [targetAyah, setTargetAyah] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const readerRef = useRef(null);
  const targetHandledRef = useRef(false);
  const lastSavedRef = useRef(null);

  // Internet connection status
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Load the surah list from IndexedDB first
  useEffect(() => {
    let cancelled = false;

    const loadSurahs = async () => {
      setListLoading(true);

      try {
        const cached = await getOfflineSurahs();

        if (cached?.length === 114) {
          if (!cancelled) setSurahs(cached);
        } else if (navigator.onLine) {
          const response = await fetch(`${API}/surah`);
          if (!response.ok) throw new Error("সূরা তালিকা লোড হয়নি।");

          const result = await response.json();
          if (result.code !== 200 || !Array.isArray(result.data)) {
            throw new Error("সূরা তালিকার ডেটা সঠিক নয়।");
          }

          if (!cancelled) setSurahs(result.data);
        } else {
          throw new Error(
            "সূরা তালিকা অফলাইনে নেই। আগে ইন্টারনেট চালু করে Quran ডাউনলোড করো।",
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "সূরা তালিকা লোড হয়নি।");
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };

    loadSurahs();
    isQuranDownloaded().then((value) => {
      if (!cancelled) setDownloaded(value);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadProgress(0);
    setMessage("");
    setError("");

    try {
      const result = await downloadQuranOffline(setDownloadProgress);
      setDownloaded(true);

      const cachedSurahs = await getOfflineSurahs();
      if (cachedSurahs) setSurahs(cachedSurahs);

      setMessage(
        `ডাউনলোড সম্পূর্ণ! ${result.surahCount}টি সূরা ও ${result.count}টি আরবি আয়াতের সঙ্গে বাংলা অনুবাদ সংরক্ষিত হয়েছে।`,
      );
    } catch (err) {
      setMessage(err.message || "ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setDownloading(false);
    }
  };

  // Open a surah or juz. Try offline first, then use API.
  const openReader = useCallback(async (item, type, resumeAyah = null) => {
    setSelected({ ...item, type });
    setVerses([]);
    setError("");
    setSearchResults([]);
    setLoading(true);
    setTargetAyah(resumeAyah);
    targetHandledRef.current = false;
    lastSavedRef.current = null;

    try {
      let data;

      try {
        data = await getOfflineAyahs(type, item.number);
      } catch (offlineError) {
        if (!navigator.onLine) throw offlineError;

        const endpoint =
          type === "surah"
            ? `${API}/surah/${item.number}`
            : `${API}/juz/${item.number}`;

        const [arabicResponse, banglaResponse] = await Promise.all([
          fetch(`${endpoint}/quran-uthmani`),
          fetch(`${endpoint}/bn.bengali`),
        ]);

        if (!arabicResponse.ok || !banglaResponse.ok) {
          throw new Error("কুরআনের আয়াত লোড করা যায়নি।");
        }

        const [arabicResult, banglaResult] = await Promise.all([
          arabicResponse.json(),
          banglaResponse.json(),
        ]);

        const arabicAyahs = arabicResult?.data?.ayahs;
        const banglaAyahs = banglaResult?.data?.ayahs;

        if (
          arabicResult.code !== 200 ||
          banglaResult.code !== 200 ||
          !Array.isArray(arabicAyahs) ||
          !Array.isArray(banglaAyahs)
        ) {
          throw new Error("কুরআনের ডেটা সঠিকভাবে পাওয়া যায়নি।");
        }

        const translations = new Map(
          banglaAyahs.map((ayah) => [ayah.number, ayah.text]),
        );

        data = arabicAyahs.map((ayah) => ({
          ...ayah,
          translation: translations.get(ayah.number) || "অনুবাদ পাওয়া যায়নি।",
        }));
      }

      setVerses(data);
    } catch (err) {
      setError(err.message || "আয়াত লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  // Save the last ayah currently visible in the reader
  useEffect(() => {
    const container = readerRef.current;

    if (!container || !selected || verses.length === 0) return;

    const nodes = container.querySelectorAll("[data-global-ayah]");

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const entry = visible[0];
        if (!entry) return;

        const ayah = entry.target.dataset;
        const globalNumber = Number(ayah.globalAyah);

        if (!globalNumber || lastSavedRef.current === globalNumber) return;

        lastSavedRef.current = globalNumber;

        const saved = {
          type: selected.type,
          number: selected.number,
          title: selected.title,
          ayahNumber: globalNumber,
          ayahInSurah: Number(ayah.ayahInSurah),
          surahNumber: Number(ayah.surahNumber),
          updatedAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem(LAST_READ_KEY, JSON.stringify(saved));
          setLastRead(saved);
        } catch {
          // Reading still works if local storage is unavailable.
        }
      },
      {
        root: container,
        rootMargin: "-10% 0px -65% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [verses, selected]);

  // Resume at the saved ayah after the reader has rendered
  useEffect(() => {
    if (loading || !targetAyah || !verses.length || targetHandledRef.current) {
      return;
    }

    const target = verses.find(
      (ayah) => ayah.number === targetAyah || ayah.numberInSurah === targetAyah,
    );

    if (!target) return;

    const timer = window.setTimeout(() => {
      const node = document.getElementById(`ayah-${target.number}`);

      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
        targetHandledRef.current = true;
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [loading, targetAyah, verses]);

  const continueReading = () => {
    if (!lastRead) return;

    const item =
      lastRead.type === "surah"
        ? surahs.find((surah) => surah.number === lastRead.number)
        : juzNames.find((juz) => juz.number === lastRead.number);

    if (!item) return;

    openReader(
      {
        ...item,
        title:
          lastRead.title ||
          (lastRead.type === "surah"
            ? banglaNames[item.number - 1]
            : item.name),
      },
      lastRead.type,
      lastRead.ayahNumber,
    );
  };

  const runSearch = async () => {
    const term = search.trim();
    setSearchResults([]);
    setError("");

    if (!term) return;

    setSearching(true);

    try {
      const results = await searchOfflineQuran(term);
      setSearchResults(results);

      if (!results.length) {
        setMessage("এই শব্দের কোনো মিল পাওয়া যায়নি।");
      } else {
        setMessage(`${results.length}টি পর্যন্ত মিল দেখানো হচ্ছে।`);
      }
    } catch (err) {
      setError(err.message || "সার্চ করা যায়নি।");
    } finally {
      setSearching(false);
    }
  };

  const openSearchResult = (ayah) => {
    const surah = surahs.find((item) => item.number === ayah.surah?.number);

    if (!surah) {
      setError("সূরার তথ্য পাওয়া যায়নি।");
      return;
    }

    openReader(
      {
        ...surah,
        title: banglaNames[surah.number - 1] || surah.englishName,
      },
      "surah",
      ayah.number,
    );
  };

  const filteredSurahs = surahs.filter((surah) => {
    const bangla = banglaNames[surah.number - 1] || "";
    const term = search.trim().toLocaleLowerCase("bn");

    return (
      !term ||
      bangla.toLocaleLowerCase("bn").includes(term) ||
      surah.name?.toLocaleLowerCase("bn").includes(term) ||
      surah.englishName?.toLocaleLowerCase("en").includes(term) ||
      String(surah.number) === term
    );
  });

  const filteredJuz = juzNames.filter((juz) => {
    const term = search.trim().toLocaleLowerCase("bn");
    return !term || juz.name.includes(term) || String(juz.number) === term;
  });

  // Load Quran page data
  useEffect(() => {
    let cancelled = false;

    const loadSurahs = async () => {
      setPageLoading(true);
      setListLoading(true);
      setError("");

      try {
        const cached = await getOfflineSurahs();

        if (cached?.length === 114) {
          if (!cancelled) {
            setSurahs(cached);
          }
        } else if (navigator.onLine) {
          const response = await fetch(`${API}/surah`);

          if (!response.ok) {
            throw new Error("সূরা তালিকা লোড হয়নি।");
          }

          const result = await response.json();

          if (result.code !== 200 || !Array.isArray(result.data)) {
            throw new Error("সূরা তালিকার ডেটা সঠিক নয়।");
          }

          if (!cancelled) {
            setSurahs(result.data);
          }
        } else {
          throw new Error(
            "সূরা তালিকা অফলাইনে নেই। আগে ইন্টারনেট চালু করে Quran ডাউনলোড করো।",
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "সূরা তালিকা লোড হয়নি।");
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
          setPageLoading(false);
        }
      }
    };

    loadSurahs();

    isQuranDownloaded()
      .then((value) => {
        if (!cancelled) {
          setDownloaded(value);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDownloaded(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (pageLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-3 py-25 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Header */}
        <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#075c46] to-[#087443] p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/15 p-3">
              <FaBookOpen className="text-3xl" />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                পবিত্র আল-কুরআন
              </h1>
              <p className="mt-1 text-sm text-white/80">
                পড়ুন, বুঝুন এবং আমল করুন
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1">
              ১১৪টি সূরা
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">৩০ পারা</span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              আরবি ও বাংলা
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              <FaWifi className="mr-1 inline" />
              {online ? "অনলাইন" : "অফলাইন"}
            </span>
          </div>
        </header>

        {/* Offline download */}
        <section className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-800">অফলাইনে কুরআন পড়ুন</h2>
              <p className="mt-1 text-sm text-gray-500">
                {downloaded
                  ? "কুরআনের ডেটা এই ডিভাইসে সংরক্ষিত আছে।"
                  : "একবার ডাউনলোড করলে পরে ইন্টারনেট ছাড়াই পড়তে পারবে।"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || !online}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075c46] px-5 py-3 font-semibold text-white transition hover:bg-[#064b39] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaDownload />
              )}
              {downloading
                ? "ডাউনলোড হচ্ছে..."
                : downloaded
                  ? "আবার ডাউনলোড"
                  : "Download Quran"}
            </button>
          </div>

          {downloading && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>ডাউনলোডের অগ্রগতি</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#087443] transition-all"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {message && (
            <p className="mt-3 text-sm text-green-700" role="status">
              {message}
            </p>
          )}
        </section>

        {/* Last read */}
        {lastRead && (
          <section className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                  <FaHistory />
                </div>
                <div>
                  <h2 className="font-bold">সর্বশেষ যেখানে পড়েছিলে</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {lastRead.title || `সূরা ${lastRead.number}`} · আয়াত{" "}
                    {lastRead.ayahInSurah}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={continueReading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 font-semibold text-[#075c46] hover:bg-green-50"
              >
                <FaBookmark />
                Continue Reading
              </button>
            </div>
          </section>
        )}

        {/* Search */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              runSearch();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setMessage("");
                  setSearchResults([]);
                }}
                placeholder="সূরা, পারা বা আরবি/বাংলা আয়াত খুঁজুন..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={searching}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#075c46] px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {searching && <FaSpinner className="animate-spin" />}
              সার্চ আয়াত
            </button>
          </form>

          <p className="mt-2 text-xs text-gray-400">
            আয়াত সার্চ করতে আগে কুরআন অফলাইনে ডাউনলোড করতে হবে।
          </p>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">সার্চের ফলাফল</h3>

              {searchResults.map((ayah) => (
                <button
                  type="button"
                  key={ayah.number}
                  onClick={() => openSearchResult(ayah)}
                  className="block w-full rounded-xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm text-green-800">
                    <span>
                      {banglaNames[(ayah.surah?.number || 1) - 1] ||
                        ayah.surah?.englishName}{" "}
                      · আয়াত {ayah.numberInSurah}
                    </span>
                    <FaChevronRight />
                  </div>

                  <p className="text-right text-xl leading-loose" dir="rtl">
                    {ayah.text}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {ayah.translation}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Surah / Juz lists */}
        {!selected && (
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-2 border-b border-gray-100 p-2">
              <button
                type="button"
                onClick={() => setActiveTab("surah")}
                className={`rounded-xl px-4 py-3 font-semibold transition ${
                  activeTab === "surah"
                    ? "bg-[#075c46] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                সূরা (১১৪)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("juz")}
                className={`rounded-xl px-4 py-3 font-semibold transition ${
                  activeTab === "juz"
                    ? "bg-[#075c46] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                পারা (৩০)
              </button>
            </div>

            {listLoading ? (
              <div className="flex items-center justify-center gap-3 p-10 text-gray-500">
                <FaSpinner className="animate-spin" />
                সূরা তালিকা লোড হচ্ছে...
              </div>
            ) : activeTab === "surah" ? (
              <div className="grid gap-2 p-3 sm:grid-cols-2">
                {filteredSurahs.map((surah) => (
                  <button
                    type="button"
                    key={surah.number}
                    onClick={() =>
                      openReader(
                        {
                          ...surah,
                          title:
                            banglaNames[surah.number - 1] || surah.englishName,
                        },
                        "surah",
                      )
                    }
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 text-left transition hover:border-green-200 hover:bg-green-50"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 font-bold text-green-800">
                      {surah.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">
                        {banglaNames[surah.number - 1] || surah.englishName}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {surah.englishName} · {surah.numberOfAyahs} আয়াত
                      </span>
                    </span>
                    <span className="text-xl text-green-800" dir="rtl">
                      {surah.name}
                    </span>
                  </button>
                ))}

                {filteredSurahs.length === 0 && (
                  <p className="p-6 text-center text-gray-500 sm:col-span-2">
                    কোনো সূরা পাওয়া যায়নি।
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-2 p-3 sm:grid-cols-2">
                {filteredJuz.map((juz) => (
                  <button
                    type="button"
                    key={juz.number}
                    onClick={() =>
                      openReader(
                        {
                          ...juz,
                          title: juz.name,
                        },
                        "juz",
                      )
                    }
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-green-200 hover:bg-green-50"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 font-bold text-green-800">
                      {juz.number}
                    </span>
                    <span>
                      <span className="block font-semibold">{juz.name}</span>
                      <span className="text-xs text-gray-500">
                        কুরআনের পারা {juz.number}
                      </span>
                    </span>
                    <FaChevronRight className="ml-auto text-green-800" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Reader */}
        {selected && (
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/95 p-4 backdrop-blur">
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setVerses([]);
                  setTargetAyah(null);
                  setError("");
                }}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
              >
                <FaChevronLeft />
                তালিকায় ফিরুন
              </button>

              <div className="min-w-0 text-right">
                <h2 className="truncate font-bold">
                  {selected.title ||
                    banglaNames[selected.number - 1] ||
                    selected.name}
                </h2>
                <p className="text-xs text-gray-500">
                  {selected.type === "surah"
                    ? `সূরা ${selected.number}`
                    : `পারা ${selected.number}`}
                </p>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() =>
                    openReader(selected, selected.type, targetAyah)
                  }
                  className="mt-4 rounded-xl bg-[#075c46] px-5 py-3 font-semibold text-white"
                >
                  আবার চেষ্টা করো
                </button>
              </div>
            ) : (
              <div
                ref={readerRef}
                className="max-h-[72vh] space-y-3 overflow-y-auto p-3 sm:p-5"
              >
                {verses.map((ayah) => {
                  const isLastRead =
                    lastRead?.ayahNumber === ayah.number &&
                    lastRead?.surahNumber === ayah.surah?.number;

                  return (
                    <article
                      key={ayah.number}
                      id={`ayah-${ayah.number}`}
                      data-global-ayah={ayah.number}
                      data-ayah-in-surah={ayah.numberInSurah}
                      data-surah-number={ayah.surah?.number || ""}
                      className={`scroll-mt-4 rounded-2xl border p-4 transition sm:p-5 ${
                        isLastRead
                          ? "border-green-300 bg-green-50"
                          : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                          {ayah.surah?.number
                            ? `${banglaNames[ayah.surah.number - 1] || ayah.surah.englishName} · `
                            : ""}
                          আয়াত {ayah.numberInSurah}
                        </span>

                        {isLastRead && (
                          <span className="text-xs font-semibold text-green-800">
                            <FaBookmark className="mr-1 inline" />
                            Last Read
                          </span>
                        )}
                      </div>

                      <p
                        className="text-right text-2xl leading-[2.3] text-gray-900 sm:text-3xl"
                        dir="rtl"
                        lang="ar"
                      >
                        {ayah.text}
                      </p>

                      <div className="my-4 border-t border-dashed border-gray-200" />

                      <p className="text-sm leading-8 text-gray-700 sm:text-base">
                        {ayah.translation}
                      </p>
                    </article>
                  );
                })}

                {verses.length > 0 && (
                  <div className="flex items-center justify-between gap-3 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        const first = verses[0];
                        const previousNumber =
                          selected.type === "surah"
                            ? selected.number - 1
                            : selected.number - 1;

                        if (previousNumber < 1) return;

                        const item =
                          selected.type === "surah"
                            ? surahs.find((s) => s.number === previousNumber)
                            : juzNames.find((j) => j.number === previousNumber);

                        if (item) {
                          openReader(
                            {
                              ...item,
                              title:
                                selected.type === "surah"
                                  ? banglaNames[item.number - 1] ||
                                    item.englishName
                                  : item.name,
                            },
                            selected.type,
                          );
                        } else if (first) {
                          setMessage("এর আগের অংশ নেই।");
                        }
                      }}
                      disabled={selected.number <= 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold disabled:opacity-40"
                    >
                      <FaChevronLeft />
                      আগের {selected.type === "surah" ? "সূরা" : "পারা"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const max = selected.type === "surah" ? 114 : 30;

                        if (selected.number >= max) {
                          setMessage("এটাই শেষ অংশ।");
                          return;
                        }

                        const nextNumber = selected.number + 1;
                        const item =
                          selected.type === "surah"
                            ? surahs.find((s) => s.number === nextNumber)
                            : juzNames.find((j) => j.number === nextNumber);

                        if (item) {
                          openReader(
                            {
                              ...item,
                              title:
                                selected.type === "surah"
                                  ? banglaNames[item.number - 1] ||
                                    item.englishName
                                  : item.name,
                            },
                            selected.type,
                          );
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#075c46] px-4 py-3 text-sm font-semibold text-white"
                    >
                      পরের {selected.type === "surah" ? "সূরা" : "পারা"}
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Quran;
