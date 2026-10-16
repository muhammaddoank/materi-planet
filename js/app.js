/**
 * APPLICATION BOOTSTRAP & UI CONTROLLER
 * Jelajah Tata Surya: 34 Cara Belajar Interaktif
 */

document.addEventListener("DOMContentLoaded", () => {
  // Pastikan browser selalu mulai dari posisi paling atas saat halaman dibuka atau dimuat ulang
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  // 1. Inisialisasi Elemen Header & Kontrol Utama
  const appHeader = $("#app-header");
  if (appHeader) {
    const updateHeaderH = () => {
      document.documentElement.style.setProperty("--header-h", `${appHeader.offsetHeight}px`);
    };
    updateHeaderH();
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateHeaderH).observe(appHeader);
    } else {
      window.addEventListener("resize", updateHeaderH);
    }
  }

  const progressBar = $("#progress-bar");
  const statsBadge = $("#stats-badge");
  const soundToggleBtn = $("#btn-toggle-sound");
  const themeToggleBtn = $("#btn-toggle-theme");
  const trophyCard = $("#final-trophy-card");
  const categoryNav = $("#category-nav");

  // Kontrol Aksesibilitas di Kartu Intro
  const fontDecBtn = $("#btn-font-dec");
  const fontIncBtn = $("#btn-font-inc");
  const contrastToggleBtn = $("#btn-toggle-contrast");
  const printBtn = $("#btn-print");
  const resetBtn = $("#btn-reset-progress");
  const streakText = $("#streak-text");

  // 2. Hubungkan Perubahan State dengan Header & UI
  AppState.onProgress((status) => {
    if (progressBar) {
      progressBar.style.width = `${status.percent}%`;
    }

    if (statsBadge) {
      statsBadge.textContent = `${status.rank} · ${status.xp} XP · ${status.completedCount}/${status.totalCount}`;
    }

    if (status.isAllCompleted && trophyCard) {
      trophyCard.hidden = false;
      trophyCard.scrollIntoView({ behavior: "smooth" });
      launchConfetti();
    }
  });

  // Tampilkan riwayat streak & status pemulihan
  if (streakText) {
    const s = AppState.getStreak();
    const restoredNote = AppState.isRestored()
      ? " · XP dari kunjungan lalu tersimpan rapi; kamu tetap bisa mengulang tiap interaksi."
      : "";
    streakText.textContent = `🔥 Streak Belajar: ${s.count} Hari (1 hari absen terlindungi fitur 'freeze')${restoredNote}`;
  }

  // Tandai kartu-kartu yang sudah tersimpan sebelumnya
  AppState.getCompletedSet().forEach((taskId) => {
    const cardEl = $(`[data-task-id="${taskId}"]`);
    if (cardEl) {
      cardEl.classList.add("is-completed");
      const statusBadge = cardEl.querySelector(".status-badge");
      if (statusBadge) {
        statusBadge.innerHTML = "✓ Selesai";
      }
    }
  });

  // 3. Kontrol Suara (Mute / Unmute)
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      const isMuted = SoundFX.toggleMute();
      soundToggleBtn.textContent = isMuted ? "🔇" : "🔊";
      soundToggleBtn.setAttribute("title", isMuted ? "Aktifkan Suara" : "Matikan Suara");
    });
  }

  // 4. Kontrol Tema (Terang / Gelap)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const root = document.documentElement;
      const currentTheme = root.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;
      themeToggleBtn.textContent = nextTheme === "dark" ? "☀️" : "🌗";
      SoundFX.playClick();
    });
  }

  // 5. Kontrol Aksesibilitas
  let baseFontSize = 16;
  function updateFontSize(delta) {
    baseFontSize = Math.min(24, Math.max(13, baseFontSize + delta));
    document.documentElement.style.setProperty("--fs", `${baseFontSize}px`);
    SoundFX.playClick();
  }

  if (fontDecBtn) fontDecBtn.addEventListener("click", () => updateFontSize(-2));
  if (fontIncBtn) fontIncBtn.addEventListener("click", () => updateFontSize(2));

  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener("click", () => {
      const isHighContrast = document.documentElement.classList.toggle("high-contrast");
      contrastToggleBtn.setAttribute("aria-pressed", isHighContrast);
      SoundFX.playClick();
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      SoundFX.playClick();
      window.print();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset seluruh progres belajar dan mulai petualangan dari awal?")) {
        AppState.reset();
      }
    });
  }

  // 6. Filter Kategori Aktivitas
  if (categoryNav) {
    categoryNav.innerHTML = ACTIVITY_CATEGORIES.map((cat, idx) => `
      <button class="filter-pill ${idx === 0 ? "active" : ""}" data-category="${cat.id}">
        ${cat.icon} ${cat.label} ${cat.count ? `(${cat.count})` : ""}
      </button>
    `).join("");

    categoryNav.addEventListener("click", (e) => {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      SoundFX.playClick();

      $$(".filter-pill", categoryNav).forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const selectedCat = pill.dataset.category;
      const allCards = $$(".card[data-category]");

      allCards.forEach((card) => {
        if (selectedCat === "all" || card.dataset.category === selectedCat) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // 7. Animasi Konfeti saat Semua Selesai
  function launchConfetti() {
    const emojis = ["🎉", "⭐", "✨", "🪐", "🚀", "🏆"];
    for (let i = 0; i < 45; i++) {
      const span = document.createElement("span");
      span.className = "confetti";
      span.textContent = emojis[i % emojis.length];
      span.style.left = `${Math.random() * 95}vw`;
      span.style.animationDelay = `${Math.random() * 1.5}s`;
      span.style.fontSize = `${18 + Math.random() * 16}px`;
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 4500);
    }
  }

  // 8. Inisialisasi Seluruh 34 Interaksi
  try {
    initTooltip();
    initFlipCards();
    initOrbitCanvas();
    initTabs();
    initWeightCalc();
    initPredict();
    initEstimate();
    initOrder();
    initHotspot();
    initStepper();
    initChecklist();
    initFillBlanks();
    initAnagram();
    initMemoryGame();
    initTrueFalse();
    initQuiz();
    initBranching();
    initPoll();
    initChartToggle();
    initReflectionNote();
    initCanvasDraw();
    initBucketClassify();
    initSplitCompare();
    initTimeline();
    initConfidence();
    initSpeedChallenge();
    initWordSearch();
    initLeitner();
    initHabitableZone();
    initCrossword();
    initWheel();
    initWhackMole();
    initSentenceDrag();
    initHotspotImgPin();
    initPairing();
    initTrueFalseChain();
    initQuizMultiSelect();
    initNumericEntry();
    initLayerToggle();
    initSpotBug();
    initFlowDiagram();
    initVisualTree();
    initAltitudeParallax();
    initTimerChallenge();
    initSurvivalMode();
    initPuzzleSlide();
    initPuzzleJigsaw();
    initKeyReaction();
    initCardSort();
    initSlotMachine();
    initBalloonPop();
    initAirplaneRace();
    initOpenTheBox();

    // Narasi suara diinject setelah kartu siap
    initTTS();

    // Pastikan posisi scroll tetap di paling atas setelah seluruh modul interaktif selesai diinisialisasi
    window.scrollTo(0, 0);
  } catch (err) {
    console.error("Kesalahan saat memuat interaksi:", err);
  }
});

// Penjamin tambahan saat semua aset eksternal/media selesai termuat
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
