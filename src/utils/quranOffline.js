const API = "https://api.alquran.cloud/v1";
const DB_NAME = "rahmania-quran-offline";
const STORE_NAME = "quran";
const DB_VERSION = 1;

const openDB = () =>
  new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("এই ব্রাউজারে IndexedDB সাপোর্ট নেই।"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const readRecord = async (id) => {
  const db = await openDB();

  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
};

const saveRecords = async (records) => {
  const db = await openDB();

  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      records.forEach((record) => store.put(record));

      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("ডেটা সংরক্ষণ হয়নি।"));
    });
  } finally {
    db.close();
  }
};

const fetchJSON = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`সার্ভার থেকে ডেটা পাওয়া যায়নি (${response.status})`);
  }

  const result = await response.json();

  if (result.code !== 200 || !result.data) {
    throw new Error("Quran API থেকে সঠিক ডেটা পাওয়া যায়নি।");
  }

  return result.data;
};

export const getOfflineSurahs = async () => {
  const record = await readRecord("surahs");
  return Array.isArray(record?.data) ? record.data : null;
};

export const isQuranDownloaded = async () => {
  try {
    const [arabic, bangla, surahs] = await Promise.all([
      readRecord("arabic"),
      readRecord("bangla"),
      readRecord("surahs"),
    ]);

    return (
      Array.isArray(arabic?.data) &&
      arabic.data.length > 6000 &&
      Array.isArray(bangla?.data) &&
      bangla.data.length === arabic.data.length &&
      Array.isArray(surahs?.data) &&
      surahs.data.length === 114
    );
  } catch {
    return false;
  }
};

// export const downloadQuranOffline = async (onProgress = () => {}) => {
//   if (!navigator.onLine) {
//     throw new Error("ডাউনলোড করতে ইন্টারনেট সংযোগ চালু করো।");
//   }

//   onProgress(5);

//   // Arabic Quran, Bengali translation, and all 114 surahs
//   const [arabicData, banglaData, surahData] = await Promise.all([
//     fetchJSON(`${API}/quran/quran-uthmani`),
//     fetchJSON(`${API}/quran/bn.bengali`),
//     fetchJSON(`${API}/surah`),
//   ]);

//   const arabic = arabicData.ayahs;
//   const bangla = banglaData.ayahs;
//   const surahs = surahData;

//   if (
//     !Array.isArray(arabic) ||
//     !Array.isArray(bangla) ||
//     !Array.isArray(surahs) ||
//     arabic.length < 6000 ||
//     bangla.length !== arabic.length ||
//     surahs.length !== 114
//   ) {
//     throw new Error("সম্পূর্ণ কুরআনের ডেটা পাওয়া যায়নি। আবার চেষ্টা করো।");
//   }

//   onProgress(55);

//   await saveRecords([
//     { id: "arabic", data: arabic },
//     { id: "bangla", data: bangla },
//     { id: "surahs", data: surahs },
//   ]);

//   onProgress(100);

//   return {
//     count: arabic.length,
//     surahCount: surahs.length,
//   };
// };

// Convert API response into a flat list of ayahs
const flattenQuran = (data) => {
  if (Array.isArray(data?.ayahs)) {
    return data.ayahs;
  }

  if (Array.isArray(data?.surahs)) {
    return data.surahs.flatMap((surah) =>
      (surah.ayahs || []).map((ayah) => ({
        ...ayah,
        surah: {
          number: surah.number,
          name: surah.name,
          englishName: surah.englishName,
          numberOfAyahs: surah.numberOfAyahs,
        },
      })),
    );
  }

  return [];
};

export const downloadQuranOffline = async (onProgress = () => {}) => {
  if (!navigator.onLine) {
    throw new Error("ডাউনলোড করতে ইন্টারনেট সংযোগ চালু করো।");
  }

  onProgress(5);

  const [arabicData, banglaData, surahData] = await Promise.all([
    fetchJSON(`${API}/quran/quran-uthmani`),
    fetchJSON(`${API}/quran/bn.bengali`),
    fetchJSON(`${API}/surah`),
  ]);

  const arabic = flattenQuran(arabicData);
  const bangla = flattenQuran(banglaData);
  const surahs = surahData;

  // Verify all Quran data is available
  if (
    arabic.length < 6000 ||
    bangla.length < 6000 ||
    !Array.isArray(surahs) ||
    surahs.length !== 114
  ) {
    console.error("Quran download diagnostic:", {
      arabicCount: arabic.length,
      banglaCount: bangla.length,
      surahCount: surahs?.length,
      arabicKeys: Object.keys(arabicData || {}),
      banglaKeys: Object.keys(banglaData || {}),
    });

    throw new Error(
      `ডেটা যাচাই ব্যর্থ: আরবি ${arabic.length}, বাংলা ${bangla.length}, সূরা ${surahs?.length || 0}। F12 Console দেখো।`,
    );
  }

  // Check whether Arabic and Bengali ayahs match
  const banglaNumbers = new Set(bangla.map((ayah) => ayah.number));

  const matchedCount = arabic.filter((ayah) =>
    banglaNumbers.has(ayah.number),
  ).length;

  if (matchedCount !== arabic.length) {
    throw new Error(
      `আরবি ও বাংলা অনুবাদ মেলেনি। মিলেছে ${matchedCount}/${arabic.length} আয়াত।`,
    );
  }

  onProgress(55);

  await saveRecords([
    { id: "arabic", data: arabic },
    { id: "bangla", data: bangla },
    { id: "surahs", data: surahs },
  ]);

  onProgress(100);

  return {
    count: arabic.length,
    surahCount: surahs.length,
  };
};

export const getOfflineAyahs = async (type, number) => {
  const [arabicRecord, banglaRecord] = await Promise.all([
    readRecord("arabic"),
    readRecord("bangla"),
  ]);

  const arabic = arabicRecord?.data;
  const bangla = banglaRecord?.data;

  if (!Array.isArray(arabic) || !Array.isArray(bangla)) {
    throw new Error(
      "অফলাইন কুরআন ডাউনলোড করা নেই। ইন্টারনেট চালু করে Download Quran চাপো।",
    );
  }

  const translations = new Map(bangla.map((ayah) => [ayah.number, ayah.text]));

  const selectedAyahs = arabic.filter((ayah) =>
    type === "surah"
      ? ayah.surah?.number === Number(number)
      : ayah.juz === Number(number),
  );

  if (!selectedAyahs.length) {
    throw new Error("এই সূরা বা পারার ডেটা পাওয়া যায়নি।");
  }

  return selectedAyahs.map((ayah) => ({
    ...ayah,
    translation: translations.get(ayah.number) || "অনুবাদ পাওয়া যায়নি।",
  }));
};

export const searchOfflineQuran = async (query) => {
  const [arabicRecord, banglaRecord] = await Promise.all([
    readRecord("arabic"),
    readRecord("bangla"),
  ]);

  if (!arabicRecord?.data || !banglaRecord?.data) {
    throw new Error("আগে সম্পূর্ণ কুরআন অফলাইনে ডাউনলোড করো।");
  }

  const term = query.trim().toLocaleLowerCase("bn");

  if (!term) return [];

  const translations = new Map(
    banglaRecord.data.map((ayah) => [ayah.number, ayah.text]),
  );

  return arabicRecord.data
    .filter((ayah) => {
      const translation = translations.get(ayah.number) || "";

      return (
        ayah.text.toLocaleLowerCase("bn").includes(term) ||
        translation.toLocaleLowerCase("bn").includes(term)
      );
    })
    .slice(0, 100)
    .map((ayah) => ({
      ...ayah,
      translation: translations.get(ayah.number) || "অনুবাদ পাওয়া যায়নি।",
    }));
};
