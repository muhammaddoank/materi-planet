/**
 * STATE MANAGEMENT & LOCAL STORAGE
 * Jelajah Tata Surya: 34 Cara Belajar Interaktif
 */

const AppState = (() => {
  const STORAGE_KEY = "tsi1";
  const TOTAL_ACTIVITIES = 45;

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
      if (!raw) return;

      const data = JSON.parse(raw);
      if (data && Array.isArray(data.d)) {
        isRestored = true;
        completedTasks = new Set(data.d);
        xp = typeof data.xp === "number" ? data.xp : 0;

        if (data.s && data.s.lastDate) {
          const today = new Date(new Date().toDateString());
          const last = new Date(data.s.lastDate);
          const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

          streak = {
            count: diffDays <= 0 ? data.s.count : diffDays <= 2 ? data.s.count + 1 : 1,
            lastDate: new Date().toDateString()
          };
        }
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
        localStorage.removeItem("tsi-sr");
      } catch (_) {}
      location.reload();
    }
  };
})();
