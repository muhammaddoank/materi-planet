/**
 * STATE MANAGEMENT & LOCAL STORAGE
 * Jelajah Tata Surya: 34 Cara Belajar Interaktif
 */

const AppState = (() => {
  const STORAGE_KEY = "tsi1";
  const SR_STORAGE_KEY = "tsi-sr";
  const SR_SCHEMA_VERSION = 1;
  const TOTAL_ACTIVITIES = 54;

  let completedTasks = new Set();
  let xp = 0;
  let streak = { count: 1, lastDate: new Date().toDateString() };
  let isRestored = false;
  let progressListeners = [];

  // Hitung pangkat berdasarkan XP
  function calculateRank() {
    if (xp < 70) return "Kadet";
    if (xp < 160) return "Astronot";
    return "Komandan";
  }

  // Muat data Spaced Repetition (Sistem Leitner 4 Kotak) dengan skema berversi & migrasi format lama
  function loadLeitnerData() {
    try {
      const raw = localStorage.getItem(SR_STORAGE_KEY);
      if (!raw) {
        return { version: SR_SCHEMA_VERSION, cards: {} };
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.version === SR_SCHEMA_VERSION && typeof parsed.cards === "object") {
          return parsed;
        }
        // Migrasi dari format lama (objek langsung tanpa properti version)
        return {
          version: SR_SCHEMA_VERSION,
          cards: parsed.cards || parsed
        };
      }
    } catch (e) {
      console.warn("Gagal membaca data Leitner:", e);
    }
    return { version: SR_SCHEMA_VERSION, cards: {} };
  }

  // Simpan data Spaced Repetition (Sistem Leitner 4 Kotak) dengan skema berversi
  function saveLeitnerData(cardsMap) {
    try {
      const payload = {
        version: SR_SCHEMA_VERSION,
        cards: cardsMap,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(SR_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Gagal menyimpan data Leitner:", e);
    }
  }

  // Simpan data progres ke localStorage
  function save() {
    try {
      const payload = {
        d: Array.from(completedTasks),
        xp,
        s: streak
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Penyimpanan lokal tidak tersedia:", e);
    }
  }

  // Muat data dari localStorage
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const todayStr = new Date().toDateString();

      if (!raw) {
        // Kunjungan pertama: simpan state awal agar streak tersimpan sejak hari pertama
        save();
        return;
      }

      const data = JSON.parse(raw);
      if (data) {
        isRestored = (Array.isArray(data.d) && data.d.length > 0) || (typeof data.xp === "number" && data.xp > 0);
        if (Array.isArray(data.d)) {
          completedTasks = new Set(data.d);
        }
        xp = typeof data.xp === "number" ? data.xp : 0;

        if (data.s && data.s.lastDate) {
          const count = typeof data.s.count === "number" && data.s.count > 0 ? data.s.count : 1;
          const today = new Date(todayStr);
          const last = new Date(data.s.lastDate);
          const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

          if (isNaN(diffDays) || diffDays > 2 || diffDays < 0) {
            // Absen lebih dari 1 hari (> 2 hari kalender) atau waktu sistem tidak valid: reset ke 1
            streak = { count: 1, lastDate: todayStr };
          } else if (diffDays === 2) {
            // Absen tepat 1 hari: terlindungi fitur freeze (pertahankan tanpa naik)
            streak = { count: count, lastDate: todayStr };
          } else if (diffDays === 1) {
            // Hari berturut-turut: naik 1
            streak = { count: count + 1, lastDate: todayStr };
          } else {
            // Hari yang sama (diffDays === 0): tetap
            streak = { count: count, lastDate: data.s.lastDate };
          }
        } else {
          // Jika data.s tidak ada atau korup, inisialisasi streak baru
          streak = { count: 1, lastDate: todayStr };
        }

        // Simpan pembaruan streak dan tanggal kunjungan langsung ke localStorage
        save();
      }
    } catch (e) {
      console.warn("Gagal membaca progres tersimpan:", e);
    }
  }

  // Beritahu observer saat terjadi perubahan progres
  function notifyChange() {
    const data = {
      completedCount: completedTasks.size,
      totalCount: TOTAL_ACTIVITIES,
      xp,
      rank: calculateRank(),
      percent: Math.min(100, Math.round((completedTasks.size / TOTAL_ACTIVITIES) * 100)),
      isAllCompleted: completedTasks.size >= TOTAL_ACTIVITIES
    };
    progressListeners.forEach((fn) => {
      try { fn(data); } catch (err) { console.error(err); }
    });
  }

  // Inisialisasi awal
  load();

  return {
    // Selesaikan sebuah interaksi
    complete(taskId, points = 10) {
      if (completedTasks.has(taskId)) return false;

      completedTasks.add(taskId);
      xp += points;
      save();
      SoundFX.playSuccess();
      notifyChange();

      // Update kartu di UI jika ada elemen penandanya
      const cardEl = document.querySelector(`[data-task-id="${taskId}"]`);
      if (cardEl) {
        cardEl.classList.add("is-completed");
        const statusEl = cardEl.querySelector(".status-badge");
        if (statusEl) {
          statusEl.innerHTML = "✓ Selesai";
        }
      }

      if (completedTasks.size >= TOTAL_ACTIVITIES) {
        SoundFX.playFanfare();
      }

      return true;
    },

    isCompleted(taskId) {
      return completedTasks.has(taskId);
    },

    getCompletedSet() {
      return completedTasks;
    },

    getXP() {
      return xp;
    },

    getRank() {
      return calculateRank();
    },

    getStreak() {
      return streak;
    },

    isRestored() {
      return isRestored;
    },

    getTotal() {
      return TOTAL_ACTIVITIES;
    },

    // Manajemen data Spaced Repetition (Sistem Leitner 4 Kotak) tersentralisasi & berversi
    getLeitnerData() {
      return loadLeitnerData();
    },

    saveLeitnerData(cards) {
      saveLeitnerData(cards);
    },

    onProgress(fn) {
      if (typeof fn === "function") {
        progressListeners.push(fn);
        // Panggil langsung untuk nilai terkini
        fn({
          completedCount: completedTasks.size,
          totalCount: TOTAL_ACTIVITIES,
          xp,
          rank: calculateRank(),
          percent: Math.min(100, Math.round((completedTasks.size / TOTAL_ACTIVITIES) * 100)),
          isAllCompleted: completedTasks.size >= TOTAL_ACTIVITIES
        });
      }
    },

    reset() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SR_STORAGE_KEY);
      } catch (_) {}
      location.reload();
    }
  };
})();
