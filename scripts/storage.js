/* =====================================================
   FINTRACK V12.0.0: STORAGE SERVICE
   ===================================================== */

const storageService = {
  db: null,

  async init() {
    if (!('indexedDB' in window)) return null;

    return new Promise((resolve) => {
      const req = indexedDB.open(STORAGE_DB, 1);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORAGE_STORE)) {
          db.createObjectStore(STORAGE_STORE);
        }
      };

      req.onsuccess = () => {
        this.db = req.result;
        resolve(this.db);
      };

      req.onerror = () => {
        console.error('IndexedDB error:', req.error);
        resolve(null);
      };
    });
  },

  async get() {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const tx = this.db.transaction([STORAGE_STORE], 'readonly');
      const store = tx.objectStore(STORAGE_STORE);
      const req = store.get('state');

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },

  async set(data) {
    if (!this.db) return;

    return new Promise((resolve) => {
      const tx = this.db.transaction([STORAGE_STORE], 'readwrite');
      const store = tx.objectStore(STORAGE_STORE);
      const req = store.put(data, 'state');

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }
};
