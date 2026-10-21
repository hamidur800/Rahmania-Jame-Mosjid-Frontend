const DB_NAME = "rahmania-dua-offline";
const STORE_NAME = "duas";
const DB_VERSION = 1;

const openDuaDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "globalId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const saveOfflineDuas = async (duas) => {
  if (!duas?.length) return;

  const db = await openDuaDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    duas.forEach((dua) => store.put(dua));

    transaction.oncomplete = () => {
      db.close();
      resolve(true);
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const getOfflineDuas = async () => {
  const db = await openDuaDB();

  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result.sort((a, b) => a.globalId - b.globalId));
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

export const getOfflineDuaCount = async () => {
  const db = await openDuaDB();

  return new Promise((resolve, reject) => {
    const request = db
      .transaction(STORE_NAME, "readonly")
      .objectStore(STORE_NAME)
      .count();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};
