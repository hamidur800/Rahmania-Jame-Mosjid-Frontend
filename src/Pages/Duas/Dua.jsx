import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaSearch,
  FaBookmark,
  FaRegBookmark,
  FaCopy,
  FaShareAlt,
  FaChevronDown,
  FaChevronUp,
  FaBookOpen,
  FaSpinner,
  FaRedo,
  FaMoon,
  FaSun,
  FaPrayingHands,
  FaUtensils,
  FaBed,
  FaMosque,
  FaHeart,
  FaStar,
  FaChevronLeft,
} from "react-icons/fa";

import {
  saveOfflineDuas,
  getOfflineDuas,
  getOfflineDuaCount,
} from "../../utils/duaOffline";
import { Link } from "react-router";

const API_BASE = "https://rahmania-jame-mosjid-backend.onrender.com";
// https://rahmania-jame-mosjid-backend.onrender.com
const BOOKMARK_KEY = "rjm-dua-bookmarks-v1";
const BATCH_SIZE = 100;

const getDetails = (page, dua) => {
  const details =
    page?.duaDetailsList ??
    page?.duaDetailsData ??
    dua?.duaDetailsList ??
    dua?.duaDetailsData ??
    dua?.details ??
    [];

  if (Array.isArray(details)) return details;
  if (details && typeof details === "object") return [details];
  return [];
};

const Dua = () => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine,
  );
  const [offlineCount, setOfflineCount] = useState(0);
  const [downloadingOffline, setDownloadingOffline] = useState(false);
  const [offlineProgress, setOfflineProgress] = useState(0);
  const [offlineMode, setOfflineMode] = useState(false);
  const [duas, setDuas] = useState([]);
  const [selectedDua, setSelectedDua] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [fontSize, setFontSize] = useState(30);

  const loadingRef = useRef(false);

  const loadDuas = useCallback(
    async (force = false) => {
      if (loadingRef.current || (!hasMore && !force)) return;

      loadingRef.current = true;
      setLoading(true);
      setError("");

      try {
        const ids = Array.from(
          { length: BATCH_SIZE },
          (_, index) => nextId + index,
        );

        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const response = await fetch(`${API_BASE}/api/dua-proxy/${id}`);

            if (!response.ok) {
              console.warn(`Dua ${id}: HTTP ${response.status}`);
              return null;
            }

            const result = await response.json();

            // Backend response: { success: true, data: Next.js page JSON }
            const page = result?.data?.pageProps;

            if (!page) {
              console.warn(`Dua ${id}: pageProps পাওয়া যায়নি`, result);
              return null;
            }

            const rawDua = page.dua ?? page.duaData ?? page.data?.dua ?? null;

            if (
              !rawDua ||
              typeof rawDua !== "object" ||
              Array.isArray(rawDua)
            ) {
              console.warn(`Dua ${id}: dua object পাওয়া যায়নি`, page);
              return null;
            }

            const details = getDetails(page, rawDua);

            return {
              ...rawDua,
              globalId: Number(rawDua.dua_global_id ?? rawDua.id ?? id),
              category:
                typeof rawDua.category === "object" && rawDua.category !== null
                  ? String(
                      rawDua.category.id ??
                        rawDua.category.category_id ??
                        rawDua.category_id ??
                        rawDua.chap_id ??
                        "other",
                    )
                  : String(
                      rawDua.category_id ??
                        rawDua.chap_id ??
                        rawDua.category ??
                        "other",
                    ),

              categoryName:
                (typeof rawDua.category === "object"
                  ? rawDua.category.name
                  : null) ||
                rawDua.category_name ||
                rawDua.chapname ||
                (typeof rawDua.tags === "string" ? rawDua.tags : "") ||
                "অন্যান্য",
              details,
            };
          }),
        );

        const validDuas = results
          .filter((item) => item.status === "fulfilled")
          .map((item) => item.value)
          .filter(Boolean);

        if (validDuas.length === 0) {
          console.warn("কোনো valid dua পাওয়া যায়নি।");
          setError(
            "দোয়ার ডেটা পাওয়া যায়নি। API response-এর structure পরীক্ষা করো।",
          );
          setHasMore(false);
          return;
        }

        try {
          await saveOfflineDuas(validDuas);
          setOfflineCount(await getOfflineDuaCount());
        } catch (err) {
          console.error("Offline save error:", err);
        }

        setDuas((previous) => {
          const map = new Map(previous.map((dua) => [dua.globalId, dua]));

          validDuas.forEach((dua) => {
            map.set(dua.globalId, dua);
          });

          return Array.from(map.values()).sort(
            (a, b) => a.globalId - b.globalId,
          );
        });

        setNextId((previous) => previous + BATCH_SIZE);
        setHasMore(true);
      } catch (err) {
        console.error("Dua API error:", err);
        setError("ডেটা লোড করা যাচ্ছে না। Backend চালু আছে কি না পরীক্ষা করো।");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [hasMore, nextId],
  );

  const downloadAllDuasOffline = async () => {
    if (!navigator.onLine || downloadingOffline) return;

    setDownloadingOffline(true);
    setOfflineProgress(0);
    setError("");

    let startId = 1;
    let totalSaved = await getOfflineDuaCount();
    if (!navigator.onLine) {
      const savedDuas = await getOfflineDuas();

      setDuas(savedDuas);
      setOfflineCount(savedDuas.length);
      setOfflineMode(true);

      if (savedDuas.length === 0) {
        setError(
          "অফলাইনে কোনো দোয়া সংরক্ষিত নেই। ইন্টারনেট চালু করে আগে দোয়াগুলো ডাউনলোড করো।",
        );
      }

      setHasMore(false);
      return;
    }

    setOfflineMode(false);

    try {
      while (true) {
        const ids = Array.from(
          { length: BATCH_SIZE },
          (_, index) => startId + index,
        );

        const results = await Promise.allSettled(
          ids.map(async (id) => {
            const response = await fetch(`${API_BASE}/api/dua-proxy/${id}`);

            if (!response.ok) return null;

            const result = await response.json();
            const page = result?.data?.pageProps;

            if (!page) return null;

            const rawDua = page.dua ?? page.duaData ?? page.data?.dua ?? null;

            if (
              !rawDua ||
              typeof rawDua !== "object" ||
              Array.isArray(rawDua)
            ) {
              return null;
            }

            return {
              ...rawDua,
              globalId: Number(rawDua.dua_global_id ?? rawDua.id ?? id),
              category:
                typeof rawDua.category === "object" && rawDua.category !== null
                  ? String(
                      rawDua.category.id ??
                        rawDua.category.category_id ??
                        rawDua.category_id ??
                        rawDua.chap_id ??
                        "other",
                    )
                  : String(
                      rawDua.category_id ??
                        rawDua.chap_id ??
                        rawDua.category ??
                        "other",
                    ),
              categoryName:
                (typeof rawDua.category === "object"
                  ? rawDua.category.name
                  : null) ||
                rawDua.category_name ||
                rawDua.chapname ||
                (typeof rawDua.tags === "string" ? rawDua.tags : "") ||
                "অন্যান্য",
              details: getDetails(page, rawDua),
            };
          }),
        );

        const batchDuas = results
          .filter((item) => item.status === "fulfilled")
          .map((item) => item.value)
          .filter(Boolean);

        if (batchDuas.length === 0) break;

        await saveOfflineDuas(batchDuas);
        totalSaved = await getOfflineDuaCount();

        setOfflineCount(totalSaved);
        setOfflineProgress(
          Math.min(99, Math.round((startId / (startId + BATCH_SIZE)) * 100)),
        );

        setDuas((previous) => {
          const map = new Map(previous.map((dua) => [dua.globalId, dua]));

          batchDuas.forEach((dua) => map.set(dua.globalId, dua));

          return Array.from(map.values()).sort(
            (a, b) => a.globalId - b.globalId,
          );
        });

        startId += BATCH_SIZE;
      }

      const savedDuas = await getOfflineDuas();
      setDuas(savedDuas);
      setOfflineCount(savedDuas.length);
      setOfflineProgress(100);
      setOfflineMode(false);
    } catch (err) {
      console.error("Offline download error:", err);
      setError(
        "সব দোয়া ডাউনলোড করা যায়নি। ইন্টারনেট ও Backend পরীক্ষা করে আবার চেষ্টা করো।",
      );
    } finally {
      setDownloadingOffline(false);
    }
  };

  useEffect(() => {
    loadDuas();
    // প্রথমবার শুধু একবার ডেটা লোড
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch (err) {
      console.error("Bookmark save error:", err);
    }
  }, [bookmarks]);

  const categories = useMemo(() => {
    const map = new Map();

    duas.forEach((dua) => {
      const id = String(dua.category ?? "other");
      const name = dua.categoryName || dua.chapname || "অন্যান্য";

      if (!map.has(id)) {
        map.set(id, name);
      }
    });

    return Array.from(map, ([id, name]) => ({
      id,
      name,
    }));
  }, [duas]);

  const filteredDuas = useMemo(() => {
    const query = search.trim().toLowerCase();

    return duas.filter((dua) => {
      const matchesCategory =
        activeCategory === "all" || String(dua.category) === activeCategory;

      const matchesBookmark =
        !onlyBookmarks || bookmarks.includes(dua.globalId);

      const searchable = [
        dua.duaname,
        dua.chapname,
        dua.tags,
        ...dua.details.flatMap((item) => [
          item.arabic,
          item.transliteration,
          item.translations,
          item.reference,
          item.top,
          item.bottom,
        ]),
      ]
        .filter((value) => typeof value === "string")
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesBookmark &&
        (!query || searchable.includes(query))
      );
    });
  }, [duas, search, activeCategory, onlyBookmarks, bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const getDuaText = (dua) =>
    [
      dua.duaname,
      ...dua.details.flatMap((item) => [
        item.arabic,
        item.transliteration,
        item.translations,
        item.reference,
      ]),
    ]
      .filter((value) => typeof value === "string" && value.trim())
      .join("\n\n");

  const copyDua = async (dua) => {
    try {
      await navigator.clipboard.writeText(getDuaText(dua));
      alert("দোয়া কপি করা হয়েছে!");
    } catch {
      alert("কপি করা যায়নি। Clipboard permission পরীক্ষা করো।");
    }
  };

  const shareDua = async (dua) => {
    const text = getDuaText(dua);

    if (!navigator.share) {
      await copyDua(dua);
      return;
    }

    try {
      await navigator.share({
        title: dua.duaname || "দোয়া ও যিকির",
        text,
        url: window.location.href,
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineMode(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setOfflineMode(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadSavedDuas = async () => {
      try {
        const savedDuas = await getOfflineDuas();
        setOfflineCount(savedDuas.length);

        // ইন্টারনেট না থাকলে IndexedDB-এর দোয়া দেখাবে।
        if (!navigator.onLine && savedDuas.length > 0) {
          setDuas(savedDuas);
          setOfflineMode(true);
          setError("");
        }
      } catch (err) {
        console.error("Offline Dua load error:", err);
      }
    };

    loadSavedDuas();
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f8f5] pb-12 pb-25 text-gray-800">
      {/* <div className="mx-auto max-w-5xl py-5 px-4 ">
        <Link
          to="/"
          type="button"
          className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 font-semibold transition hover:bg-white/25"
        >
          <FaChevronLeft />
          ফিরে যান
        </Link>
      </div> */}
      <section className="bg-gradient-to-br from-[#075c46] to-[#087443] px-4 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
            <FaBookOpen />
          </div>

          <p className="mb-2 text-sm font-medium text-emerald-100">
            রহমানিয়া জামে মসজিদ
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">দোয়া ও যিকির</h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
            কুরআন ও হাদিসের দোয়া পড়ুন, অর্থ বুঝুন এবং প্রিয় দোয়াগুলো বুকমার্ক
            করে রাখুন।
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xs text-emerald-100">লোড হওয়া দোয়া</p>
              <p className="mt-1 text-2xl font-bold">{duas.length}</p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xs text-emerald-100">বুকমার্ক</p>
              <p className="mt-1 text-2xl font-bold">{bookmarks.length}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">অফলাইনে পড়ার জন্য ডাউনলোড</p>
                <p className="mt-1 text-sm text-emerald-100">
                  সংরক্ষিত দোয়া: {offlineCount}
                </p>
              </div>

              <button
                type="button"
                onClick={downloadAllDuasOffline}
                disabled={!isOnline || downloadingOffline}
                className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#075c46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadingOffline
                  ? "ডাউনলোড হচ্ছে..."
                  : "সব দোয়া Offline সেভ করুন"}
              </button>
            </div>

            {downloadingOffline && (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-emerald-50">
                  <span>দোয়া সংগ্রহ ও সংরক্ষণ হচ্ছে</span>
                  <span>{offlineProgress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-amber-300 transition-all"
                    style={{ width: `${offlineProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!isOnline && (
              <p className="mt-3 text-sm text-amber-200">
                ইন্টারনেট সংযোগ নেই। আগে সংরক্ষণ করা দোয়াগুলো পড়তে পারবে।
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="my-5 mx-auto max-w-5xl sticky top-2 z-50  overflow-hidden rounded-3xl bg-gradient-to-br from-[#075c46] to-[#087443] p-5 text-white shadow-lg sm:p-7">
        <div className="">
          <Link
            to="/"
            type="button"
            className=" inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 font-semibold transition hover:bg-white/25"
          >
            <FaChevronLeft />
            ফিরে যান
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:py-8">
        <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm sm:p-4">
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-emerald-600">
            <FaSearch className="shrink-0 text-emerald-700" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="দোয়া, আরবি, বাংলা অর্থ বা উচ্চারণ খুঁজুন..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory("all");
                setOnlyBookmarks(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeCategory === "all" && !onlyBookmarks
                  ? "bg-[#075c46] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              সব দোয়া
            </button>

            <button
              onClick={() => {
                setOnlyBookmarks((value) => !value);
                setActiveCategory("all");
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                onlyBookmarks
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <FaBookmark /> বুকমার্ক
            </button>

            {categories.map((category) => {
              const categoryIcons = {
                all: FaBookOpen,
                morning: FaSun,
                evening: FaMoon,
                prayer: FaPrayingHands,
                food: FaUtensils,
                sleep: FaBed,
                mosque: FaMosque,
                general: FaHeart,
              };

              const CategoryIcon = categoryIcons[category.id] || FaStar;

              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setOnlyBookmarks(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "border-[#075c46] bg-[#075c46] text-white shadow-md"
                      : "border-emerald-100 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50"
                  }`}
                >
                  <CategoryIcon className="shrink-0 text-base" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <span className="text-sm font-semibold">আরবি লেখার সাইজ</span>

          <div className="flex gap-2">
            <button
              onClick={() => setFontSize((size) => Math.max(22, size - 2))}
              className="rounded-lg border px-4 py-2"
              aria-label="আরবি ছোট করুন"
            >
              <FaChevronDown />
            </button>

            <span className="flex items-center text-sm">{fontSize}px</span>

            <button
              onClick={() => setFontSize((size) => Math.min(48, size + 2))}
              className="rounded-lg border px-4 py-2"
              aria-label="আরবি বড় করুন"
            >
              <FaChevronUp />
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700">
            <p>{error}</p>

            <button
              disabled={loading}
              onClick={() => loadDuas(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 font-semibold disabled:opacity-50"
            >
              <FaRedo /> আবার চেষ্টা করুন
            </button>
          </div>
        )}

        <div className="space-y-4">
          {filteredDuas.map((dua) => {
            const saved = bookmarks.includes(dua.globalId);
            const expanded = selectedDua === dua.globalId;

            return (
              <article
                key={dua.globalId}
                className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
                  <button
                    onClick={() =>
                      setSelectedDua(expanded ? null : dua.globalId)
                    }
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="mb-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      দোয়া #{dua.globalId}
                    </span>

                    <h2 className="text-base font-bold leading-7 text-gray-900 sm:text-lg">
                      {dua.duaname || "দোয়া ও যিকির"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {dua.chapname || dua.tags || "দোয়া"}
                    </p>
                  </button>

                  <button
                    onClick={() => toggleBookmark(dua.globalId)}
                    className={`shrink-0 rounded-xl p-3 ${
                      saved
                        ? "bg-amber-50 text-amber-600"
                        : "bg-gray-50 text-gray-500"
                    }`}
                    aria-label={saved ? "বুকমার্ক সরান" : "বুকমার্ক করুন"}
                  >
                    {saved ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                </div>

                {(expanded || search.trim() !== "") && (
                  <div className="space-y-5 p-4 sm:p-6">
                    {dua.details.map((item, index) => (
                      <div
                        key={`${dua.globalId}-${index}`}
                        className="space-y-4"
                      >
                        {item.top && (
                          <p className="text-sm leading-7 text-gray-600">
                            {item.top}
                          </p>
                        )}

                        {item.arabic && (
                          <p
                            dir="rtl"
                            lang="ar"
                            className="text-right font-serif leading-[2.2] text-[#075c46]"
                            style={{ fontSize: `${fontSize}px` }}
                          >
                            {item.arabic}
                          </p>
                        )}

                        {item.transliteration && (
                          <div>
                            <h3 className="mb-2 text-xs font-bold text-emerald-800">
                              বাংলা উচ্চারণ
                            </h3>
                            <p className="text-sm leading-8 text-gray-700 sm:text-base">
                              {item.transliteration}
                            </p>
                          </div>
                        )}

                        {item.translations && (
                          <div className="rounded-xl bg-[#f3f8f4] p-4">
                            <h3 className="mb-2 text-xs font-bold text-emerald-800">
                              বাংলা অর্থ
                            </h3>
                            <p className="text-sm leading-8 text-gray-700 sm:text-base">
                              {item.translations}
                            </p>
                          </div>
                        )}

                        {item.bottom && (
                          <p className="text-sm leading-7 text-gray-600">
                            {item.bottom}
                          </p>
                        )}

                        {item.reference && (
                          <p className="border-l-2 border-amber-400 pl-3 text-xs leading-6 text-gray-500">
                            <strong>রেফারেন্স: </strong>
                            {item.reference}
                          </p>
                        )}
                      </div>
                    ))}

                    {dua.details.length === 0 && (
                      <p className="text-sm text-gray-500">
                        এই দোয়ার বিস্তারিত তথ্য পাওয়া যায়নি।
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      <button
                        onClick={() => copyDua(dua)}
                        className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800"
                      >
                        <FaCopy /> কপি
                      </button>

                      <button
                        onClick={() => shareDua(dua)}
                        className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700"
                      >
                        <FaShareAlt /> শেয়ার
                      </button>
                    </div>
                  </div>
                )}

                {!expanded && search.trim() === "" && (
                  <button
                    onClick={() => setSelectedDua(dua.globalId)}
                    className="w-full px-4 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    বিস্তারিত পড়ুন ↓
                  </button>
                )}
              </article>
            );
          })}
        </div>

        {!loading && filteredDuas.length === 0 && !error && (
          <div className="rounded-2xl bg-white p-8 text-center">
            <FaBookOpen className="mx-auto mb-3 text-3xl text-emerald-700" />
            <p className="font-semibold">কোনো দোয়া পাওয়া যায়নি</p>
            <p className="mt-2 text-sm text-gray-500">
              সার্চ বা ক্যাটাগরি পরিবর্তন করে দেখো।
            </p>
          </div>
        )}

        <div className="flex justify-center pt-3">
          {loading ? (
            <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm">
              <FaSpinner className="animate-spin" />
              দোয়া লোড হচ্ছে...
            </div>
          ) : hasMore && !error ? (
            <button
              onClick={() => loadDuas()}
              className="rounded-xl bg-[#075c46] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#087443]"
            >
              আরও দোয়া দেখুন
            </button>
          ) : null}
        </div>

        <p className="text-center text-xs leading-6 text-gray-500">
          দোয়ার তথ্য:{" "}
          <a
            href="https://dua.gtaf.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-emerald-800 underline"
          >
            দোআ ও যিকির (হিসনুল মুসলিম)
          </a>
          <br />
          অনুবাদ ও রেফারেন্স ব্যবহারের আগে মূল উৎসের সঙ্গে মিলিয়ে নাও।
        </p>
      </div>
    </main>
  );
};

export default Dua;
