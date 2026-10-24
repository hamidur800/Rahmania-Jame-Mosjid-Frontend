import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { FaChevronLeft, FaChevronRight, FaBookmark } from "react-icons/fa";
import { getOfflineAyahs, getOfflineSurahs } from "../../utils/quranOffline";
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

const QuranReader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, number } = useParams();

  const partNumber = Number(number);
  const isSurah = type === "surah";
  const maxNumber = isSurah ? 114 : 30;

  const lastSavedRef = useRef(null);
  const resumeHandledRef = useRef(false);

  const resumeAyah = Number(location.state?.resumeAyah || 0);

  const [item, setItem] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRead, setLastRead] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LAST_READ_KEY) || "null");
    } catch {
      return null;
    }
  });

  // Load selected surah or juz and its Arabic/Bangla verses.
  useEffect(() => {
    let cancelled = false;

    const loadReader = async () => {
      setLoading(true);
      setError("");
      setVerses([]);
      setItem(null);
      lastSavedRef.current = null;
      resumeHandledRef.current = false;

      if (
        !["surah", "juz"].includes(type) ||
        !Number.isInteger(partNumber) ||
        partNumber < 1 ||
        partNumber > maxNumber
      ) {
        setError("সূরা বা পারার নম্বর সঠিক নয়।");
        setLoading(false);
        return;
      }

      try {
        let selectedItem;

        if (isSurah) {
          const cachedSurahs = await getOfflineSurahs().catch(() => []);

          selectedItem = cachedSurahs?.find(
            (surah) => surah.number === partNumber,
          );

          if (!selectedItem && navigator.onLine) {
            const response = await fetch(`${API}/surah`);

            if (!response.ok) {
              throw new Error("সূরা তালিকা লোড হয়নি।");
            }

            const result = await response.json();

            selectedItem = result.data?.find(
              (surah) => surah.number === partNumber,
            );
          }

          if (!selectedItem && !navigator.onLine) {
            throw new Error(
              "এই সূরার তথ্য অফলাইনে নেই। ইন্টারনেট চালু করে আবার চেষ্টা করো।",
            );
          }

          selectedItem = {
            ...selectedItem,
            number: partNumber,
            title:
              banglaNames[partNumber - 1] ||
              selectedItem?.englishName ||
              `সূরা ${partNumber}`,
          };
        } else {
          selectedItem = {
            number: partNumber,
            name: `${partNumber} নং পারা`,
            title: `${partNumber} নং পারা`,
          };
        }

        if (!cancelled) setItem(selectedItem);

        let data;

        try {
          data = await getOfflineAyahs(type, partNumber);
        } catch (offlineError) {
          if (!navigator.onLine) {
            throw new Error(
              "এই অংশের আয়াত অফলাইনে নেই। ইন্টারনেট চালু করো অথবা আগে কুরআন ডাউনলোড করো।",
            );
          }

          const endpoint = isSurah
            ? `${API}/surah/${partNumber}`
            : `${API}/juz/${partNumber}`;

          const [arResponse, bnResponse] = await Promise.all([
            fetch(`${endpoint}/quran-uthmani`),
            fetch(`${endpoint}/bn.bengali`),
          ]);

          if (!arResponse.ok || !bnResponse.ok) {
            throw new Error("কুরআনের আয়াত লোড করা যায়নি।");
          }

          const [arResult, bnResult] = await Promise.all([
            arResponse.json(),
            bnResponse.json(),
          ]);

          const arabicAyahs = arResult?.data?.ayahs;
          const banglaAyahs = bnResult?.data?.ayahs;

          if (!Array.isArray(arabicAyahs) || !Array.isArray(banglaAyahs)) {
            throw new Error("কুরআনের ডেটা সঠিক নয়।");
          }

          const translations = new Map(
            banglaAyahs.map((ayah) => [ayah.number, ayah.text]),
          );

          data = arabicAyahs.map((ayah) => ({
            ...ayah,
            translation:
              translations.get(ayah.number) || "বাংলা অনুবাদ পাওয়া যায়নি।",
          }));
        }

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error("এই অংশে কোনো আয়াত পাওয়া যায়নি।");
        }

        if (!cancelled) setVerses(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "আয়াত লোড করা যায়নি।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReader();

    return () => {
      cancelled = true;
    };
  }, [type, partNumber, isSurah, maxNumber]);

  // Save the currently visible ayah for Continue Reading.
  useEffect(() => {
    if (loading || !item || verses.length === 0) return;

    const nodes = document.querySelectorAll("[data-global-ayah]");

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const entry = visible[0];
        if (!entry) return;

        const dataset = entry.target.dataset;
        const ayahNumber = Number(dataset.globalAyah);

        if (!ayahNumber || lastSavedRef.current === ayahNumber) {
          return;
        }

        const saved = {
          type,
          number: partNumber,
          title:
            item.title ||
            item.name ||
            `${isSurah ? "সূরা" : "পারা"} ${partNumber}`,
          ayahNumber,
          ayahInSurah: Number(dataset.ayahInSurah || 1),
          surahNumber: Number(dataset.surahNumber || 0),
          updatedAt: new Date().toISOString(),
        };

        try {
          localStorage.setItem(LAST_READ_KEY, JSON.stringify(saved));

          setLastRead(saved);
          lastSavedRef.current = ayahNumber;
        } catch (saveError) {
          console.error("Last reading save error:", saveError);
        }
      },
      {
        root: null,
        rootMargin: "-10% 0px -65% 0px",
        threshold: 0,
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [loading, item, verses, type, partNumber, isSurah]);

  // Scroll to the selected ayah when Continue Reading is used.
  useEffect(() => {
    if (loading || !resumeAyah || !verses.length || resumeHandledRef.current) {
      return;
    }

    const target = verses.find((ayah) => Number(ayah.number) === resumeAyah);

    if (!target) return;

    const timer = window.setTimeout(() => {
      const node = document.getElementById(`ayah-${resumeAyah}`);

      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        resumeHandledRef.current = true;
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loading, resumeAyah, verses]);

  const goToPart = (nextNumber) => {
    if (nextNumber < 1 || nextNumber > maxNumber) return;

    navigate(`/quran/read/${type}/${nextNumber}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#f5f8f6] px-3 py-10 text-gray-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="sticky top-2 z-50 overflow-hidden rounded-3xl bg-gradient-to-br from-[#075c46] to-[#087443] p-5 text-white shadow-lg sm:p-7">
          <button
            type="button"
            onClick={() => navigate("/quran")}
            className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 font-semibold transition hover:bg-white/25"
          >
            <FaChevronLeft />
            ফিরে যান
          </button>

          <h1 className="text-2xl font-bold sm:text-3xl">
            সূরা {item?.title || item?.name || `কুরআন ${partNumber}`}
          </h1>

          {/* <p className="mt-2 text-sm text-white/80">
            {isSurah ? `সূরা ${partNumber}` : `পারা ${partNumber}`}
            {" · "}আরবি ও বাংলা অনুবাদ
          </p> */}

          {lastRead?.number === partNumber && lastRead?.type === type && (
            <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
              <FaBookmark />
              সর্বশেষ পড়া আয়াত সংরক্ষিত হচ্ছে
            </p>
          )}
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-100 bg-white p-6 text-center">
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => navigate("/quran")}
              className="mt-4 rounded-xl bg-[#075c46] px-5 py-3 font-semibold text-white"
            >
              সূরা ও পারার তালিকায় ফিরুন
            </button>
          </section>
        ) : (
          <>
            <section className="space-y-3">
              {verses.map((ayah) => (
                <article
                  key={ayah.number}
                  id={`ayah-${ayah.number}`}
                  data-global-ayah={ayah.number}
                  data-ayah-in-surah={ayah.numberInSurah}
                  data-surah-number={ayah.surah?.number || 0}
                  className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-green-800">
                    <span>
                      {ayah.surah?.number
                        ? banglaNames[ayah.surah.number - 1] ||
                          ayah.surah.englishName
                        : item?.title}
                    </span>

                    <span>আয়াত {ayah.numberInSurah}</span>
                  </div>

                  <p
                    dir="rtl"
                    lang="ar"
                    className="text-right text-2xl leading-[2.3] text-gray-900 sm:text-3xl"
                  >
                    {ayah.text}
                  </p>

                  <div className="my-4 border-t border-dashed border-gray-200" />

                  <p className="text-sm leading-8 text-gray-700 sm:text-base">
                    {ayah.translation || "বাংলা অনুবাদ পাওয়া যায়নি।"}
                  </p>
                </article>
              ))}
            </section>

            <div className="flex items-center justify-between gap-3 pb-5">
              <button
                type="button"
                onClick={() => goToPart(partNumber - 1)}
                disabled={partNumber <= 1}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold disabled:opacity-40 sm:px-4"
              >
                <FaChevronLeft />
                আগের {isSurah ? "সূরা" : "পারা"}
              </button>

              <button
                type="button"
                onClick={() => goToPart(partNumber + 1)}
                disabled={partNumber >= maxNumber}
                className="inline-flex items-center gap-2 rounded-xl bg-[#075c46] px-3 py-3 text-sm font-semibold text-white disabled:opacity-40 sm:px-4"
              >
                পরের {isSurah ? "সূরা" : "পারা"}
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default QuranReader;
