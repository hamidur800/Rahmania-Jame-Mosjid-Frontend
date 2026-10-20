import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FaBookOpen,
  FaSearch,
  FaChevronRight,
  FaBookmark,
  FaHistory,
  FaDownload,
  FaSpinner,
  FaWifi,
} from "react-icons/fa";
import {
  downloadQuranOffline,
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

const juzNames = Array.from({ length: 30 }, (_, i) => ({
  number: i + 1,
  name: `${i + 1} নং পারা`,
  title: `পারা ${i + 1}`,
}));

const readLastRead = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_READ_KEY) || "null");
  } catch {
    return null;
  }
};

const Quran = () => {
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("surah");
  const [search, setSearch] = useState("");
  const [surahs, setSurahs] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRead, setLastRead] = useState(readLastRead);
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState(navigator.onLine);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    const loadSurahs = async () => {
      try {
        setPageLoading(true);
        setListLoading(true);
        setError("");

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
            "সূরা তালিকা অফলাইনে নেই। ইন্টারনেট চালু করে Quran ডাউনলোড করো।",
          );
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "সূরা তালিকা লোড হয়নি।");
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
        if (!cancelled) setDownloaded(value);
      })
      .catch(() => {
        if (!cancelled) setDownloaded(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const openReader = useCallback(
    (item, type, resumeAyah = null) => {
      navigate(`/quran/read/${type}/${item.number}`, {
        state: { resumeAyah },
      });
    },
    [navigate],
  );

  const continueReading = () => {
    const saved = readLastRead();
    if (!saved?.type || !saved?.number || !saved?.ayahNumber) return;

    const item =
      saved.type === "surah"
        ? surahs.find((s) => s.number === Number(saved.number))
        : juzNames.find((j) => j.number === Number(saved.number));

    if (!item) {
      setMessage("আগের পড়ার তথ্য পাওয়া যায়নি।");
      return;
    }

    openReader(
      {
        ...item,
        title:
          saved.title ||
          (saved.type === "surah"
            ? banglaNames[item.number - 1] || item.englishName
            : item.name),
      },
      saved.type,
      Number(saved.ayahNumber),
    );
  };

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
        `ডাউনলোড সম্পূর্ণ! ${result.surahCount}টি সূরা ও ${result.count}টি আয়াত সংরক্ষিত হয়েছে।`,
      );
    } catch (err) {
      setMessage(err.message || "ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setDownloading(false);
    }
  };

  const runSearch = async () => {
    const term = search.trim();
    setSearchResults([]);
    setError("");
    setMessage("");

    if (!term) return;

    setSearching(true);

    try {
      const results = await searchOfflineQuran(term);
      setSearchResults(results);
      setMessage(
        results.length
          ? `${results.length}টি পর্যন্ত মিল দেখানো হচ্ছে।`
          : "এই শব্দের কোনো মিল পাওয়া যায়নি।",
      );
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

  const term = search.trim().toLocaleLowerCase("bn");

  const filteredSurahs = surahs.filter((surah) => {
    const bangla = banglaNames[surah.number - 1] || "";
    return (
      !term ||
      bangla.toLocaleLowerCase("bn").includes(term) ||
      surah.name?.toLocaleLowerCase("bn").includes(term) ||
      surah.englishName?.toLocaleLowerCase("en").includes(term) ||
      String(surah.number) === term
    );
  });

  const filteredJuz = juzNames.filter(
    (juz) => !term || juz.name.includes(term) || String(juz.number) === term,
  );

  if (pageLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-3 py-25 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
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

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

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
                  onClick={() => openReader({ ...juz, title: juz.name }, "juz")}
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
      </div>
    </main>
  );
};

export default Quran;
