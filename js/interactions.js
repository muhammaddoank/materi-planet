/**
 * LOGIKA 34 INTERAKSI PEMBELAJARAN
 * Jelajah Tata Surya: 34 Cara Belajar Interaktif
 */

// Helper: Selector ringkas dan aman
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

// Helper: Menampilkan umpan balik (feedback alert)
function showFeedback(element, isOk, message) {
  if (!element) return;
  element.setAttribute("aria-live", "polite");
  element.className = `feedback ${isOk ? "ok" : "no"}`;
  element.textContent = message;
  element.style.display = "block";

  if (isOk) {
    SoundFX.playSuccess();
  } else {
    SoundFX.playError();
  }
}

// Helper: Drag-and-drop universal via Pointer Events (desktop + layar sentuh)
// Menggantikan HTML5 DnD (dragstart/drop) yang tidak berfungsi di iOS Safari & banyak Android.
// Pola: pointerdown → pointermove → pointerup + setPointerCapture + touch-action: none.
function makeDraggable(opts) {
  const { container, itemSelector, dropZone, dropSelector, onDrop, ghostClass, dropOverClass } = opts;
  const effectiveDropZone = dropZone || container;
  const effectiveDropSelector = dropSelector || itemSelector;

  let ghost = null;
  let sourceEl = null;
  let lastOverEl = null;
  let isDragging = false;
  let currentPointerId = null;
  const DRAG_THRESHOLD = 6; // piksel minimum sebelum dianggap drag
  let startX = 0, startY = 0;
  let thresholdMet = false;
  let justDragged = false;

  function getItemAt(x, y, zone, selector) {
    const els = $$(selector, zone);
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return el;
      }
    }
    return null;
  }

  function createGhost(el) {
    const rect = el.getBoundingClientRect();
    const g = el.cloneNode(true);
    g.style.cssText = `position:fixed;z-index:9999;pointer-events:none;opacity:0.85;
      width:${rect.width}px;height:${rect.height}px;margin:0;transition:none;
      box-shadow:0 8px 24px rgba(0,0,0,0.25);border-radius:8px;`;
    if (ghostClass) g.classList.add(ghostClass);
    document.body.appendChild(g);
    return g;
  }

  function moveGhost(g, x, y) {
    const w = parseFloat(g.style.width);
    const h = parseFloat(g.style.height);
    g.style.left = `${x - w / 2}px`;
    g.style.top = `${y - h / 2}px`;
  }

  function cleanup() {
    if (ghost) { ghost.remove(); ghost = null; }
    if (sourceEl) {
      sourceEl.style.opacity = "";
      try {
        if (sourceEl.releasePointerCapture && currentPointerId != null) {
          sourceEl.releasePointerCapture(currentPointerId);
        }
      } catch (_) {}
      sourceEl = null;
    }
    if (lastOverEl && dropOverClass) {
      lastOverEl.classList.remove(dropOverClass);
      lastOverEl = null;
    }
    isDragging = false;
    thresholdMet = false;
    currentPointerId = null;
  }

  // Mencegah click palsu tertrigger pada item saat baru selesai drag
  container.addEventListener(
    "click",
    (e) => {
      if (justDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  container.addEventListener("pointerdown", (e) => {
    // Hanya tangani tombol kiri mouse atau sentuhan primer
    if (e.button != null && e.button !== 0) return;

    const item = e.target.closest(itemSelector);
    if (!item || item.getAttribute("draggable") === "false") return;

    startX = e.clientX;
    startY = e.clientY;
    thresholdMet = false;
    sourceEl = item;
    isDragging = true;
    currentPointerId = e.pointerId;

    try {
      item.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  container.addEventListener("pointermove", (e) => {
    if (!isDragging || !sourceEl) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!thresholdMet) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      thresholdMet = true;
      ghost = createGhost(sourceEl);
      sourceEl.style.opacity = "0.35";
    }

    e.preventDefault();
    moveGhost(ghost, e.clientX, e.clientY);

    // Highlight target drop di bawah koordinat penunjuk
    const overEl = getItemAt(e.clientX, e.clientY, effectiveDropZone, effectiveDropSelector);
    if (lastOverEl && lastOverEl !== overEl && dropOverClass) {
      lastOverEl.classList.remove(dropOverClass);
    }
    if (overEl && overEl !== sourceEl && dropOverClass) {
      overEl.classList.add(dropOverClass);
    }
    lastOverEl = overEl;
  });

  container.addEventListener("pointerup", (e) => {
    if (!isDragging || !sourceEl) return;

    if (thresholdMet) {
      justDragged = true;
      setTimeout(() => { justDragged = false; }, 200);

      const dropEl = getItemAt(e.clientX, e.clientY, effectiveDropZone, effectiveDropSelector);
      const draggedSource = sourceEl;
      cleanup();

      if (dropEl && dropEl !== draggedSource && onDrop) {
        onDrop(draggedSource, dropEl);
      }
    } else {
      cleanup();
    }
  });

  container.addEventListener("pointercancel", () => {
    cleanup();
  });
}

/* ==========================================================================
   INISIALISASI SEMUA INTERAKSI
   ========================================================================== */

// #1 Tooltip Glosarium
function initTooltip() {
  $$(".tip").forEach((tip) => {
    ["mouseenter", "focus", "click"].forEach((evtName) => {
      tip.addEventListener(evtName, () => {
        AppState.complete("tip", 10);
      });
    });
  });
}

// #2 Kartu Balik 3D
// #2 Kartu Balik 3D
function initFlipCards() {
  const container = $("#flip-container");
  const infoText = $("#flip-info");
  if (!container) return;

  container.innerHTML = PLANETS_DATA.map((planet, idx) => `
    <button type="button" class="flip-card" aria-pressed="false" data-name="${planet.name}" data-fact="${planet.fact}" aria-label="Planet ${planet.name}: ketuk untuk membaca fakta unik">
      <div class="flip-inner">
        <div class="flip-front" style="background:${planet.color}">
          <span>${planet.name}</span>
        </div>
        <div class="flip-back">
          <p>${planet.fact}</p>
        </div>
      </div>
    </button>
  `).join("");

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".flip-card");
    if (!card) return;
    SoundFX.playClick();
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", isFlipped ? "true" : "false");
    const name = card.dataset.name;
    const fact = card.dataset.fact;
    if (isFlipped) {
      card.setAttribute("aria-label", `Planet ${name}, terbuka: ${fact}. Ketuk untuk menutup.`);
    } else {
      card.setAttribute("aria-label", `Planet ${name}: ketuk untuk membaca fakta unik`);
    }

    const flippedCount = $$(".flip-card.is-flipped", container).length;
    if (infoText) {
      infoText.textContent = `${flippedCount}/8 kartu terbalik`;
    }
    if (flippedCount === 8) {
      AppState.complete("flip", 10);
    }
  });
}

// #3 Animasi Orbit Canvas 2D
function initOrbitCanvas() {
  const canvas = $("#canvas-orbit");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const speedInput = $("#orbit-speed");
  const pauseBtn = $("#orbit-pause");
  const infoEl = $("#orbit-info");

  const angles = PLANETS_DATA.map((_, i) => i * 0.9);
  let speed = 1;
  let isPaused = false;
  let selectedPlanetIdx = -1;
  let planetPositions = [];

  // Setup HiDPI Canvas
  const dpr = window.devicePixelRatio || 1;
  const logicalSize = 340;
  canvas.width = logicalSize * dpr;
  canvas.height = logicalSize * dpr;
  ctx.scale(dpr, dpr);

  let rafId = null;
  let isIntersecting = true;

  function renderOrbit() {
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // Matahari di pusat
    const center = logicalSize / 2;
    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fill();

    // Gambar lintasan dan posisi orbit
    PLANETS_DATA.forEach((planet, i) => {
      const radius = 28 + i * 17;

      // Lintasan orbit
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Hitung posisi sudut (hanya jika sedang berputar/tidak dijeda)
      if (!isPaused) {
        angles[i] += (0.028 * speed) / (i + 1);
      }

      const x = center + radius * Math.cos(angles[i]);
      const y = center + radius * Math.sin(angles[i]);
      planetPositions[i] = [x, y];

      // Gambar planet
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(x, y, i === selectedPlanetIdx ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();

      // Highlight jika dipilih
      if (i === selectedPlanetIdx) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  function loop() {
    renderOrbit();
    rafId = requestAnimationFrame(loop);
  }

  const start = () => {
    if (!rafId && !isPaused && isIntersecting && !document.hidden) {
      rafId = requestAnimationFrame(loop);
    }
  };

  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // IntersectionObserver: Berhenti saat canvas berada di luar layar pengguna
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);
  }

  // VisibilityChange: Berhenti saat tab browser disembunyikan/minimize
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Render awal & inisialisasi loop jika terlihat
  renderOrbit();
  start();

  if (speedInput) {
    speedInput.addEventListener("input", (e) => {
      speed = parseFloat(e.target.value);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? "▶ Lanjut" : "⏸ Jeda";
      SoundFX.playClick();
      if (isPaused) {
        stop();
        renderOrbit(); // Render sekali lalu berhenti total dari siklus frame
      } else {
        start();
      }
    });
  }

  // Alternatif Aksesibilitas Keyboard: Dropdown Pemilih Planet
  const planetSelect = $("#orbit-planet-select");
  if (planetSelect) {
    planetSelect.innerHTML = `<option value="">-- Pilih planet untuk inspeksi data --</option>` +
      PLANETS_DATA.map((p, idx) => `<option value="${idx}">${p.name} (Jarak ${p.distanceAU} AU)</option>`).join("");

    planetSelect.addEventListener("change", (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!isNaN(idx) && idx >= 0 && idx < PLANETS_DATA.length) {
        selectPlanet(idx);
      }
    });
  }

  function selectPlanet(idx) {
    selectedPlanetIdx = idx;
    const p = PLANETS_DATA[idx];
    if (infoEl) {
      infoEl.innerHTML = `🪐 <b>${p.name}</b>: Jarak ${p.distanceAU} AU · Suhu rata-rata ${p.avgTemp}°C · Diameter ${p.diameterKm.toLocaleString("id")} km.<br><span class="text-muted">${p.fact}</span>`;
    }
    if (planetSelect && planetSelect.value !== String(idx)) {
      planetSelect.value = String(idx);
    }
    AppState.complete("orb", 10);

    // Jika sedang jeda atau di luar layar, render sekali agar highlight baru segera terlihat
    if (isPaused || !rafId) {
      renderOrbit();
    }
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (logicalSize / rect.width);
    const mouseY = (e.clientY - rect.top) * (logicalSize / rect.height);

    let nearestIdx = -1;
    let minDist = 20;

    planetPositions.forEach((pos, i) => {
      const dist = Math.hypot(pos[0] - mouseX, pos[1] - mouseY);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    });

    if (nearestIdx >= 0) {
      selectPlanet(nearestIdx);
    }
  });
}

// #4 Tab Jenis Benda Langit
function initTabs() {
  const nav = $("#tab-nav");
  const content = $("#tab-content");
  if (!nav || !content) return;

  const viewedTabs = new Set();

  nav.innerHTML = CELESTIAL_TYPES_DATA.map((t, idx) => `
    <button class="tab-btn ${idx === 0 ? "active" : ""}" data-index="${idx}">${t.title}</button>
  `).join("");

  content.innerHTML = CELESTIAL_TYPES_DATA[0].desc;
  viewedTabs.add(0);

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    SoundFX.playClick();

    const idx = parseInt(btn.dataset.index, 10);
    $$(".tab-btn", nav).forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    content.innerHTML = CELESTIAL_TYPES_DATA[idx].desc;
    viewedTabs.add(idx);

    if (viewedTabs.size === CELESTIAL_TYPES_DATA.length) {
      AppState.complete("tab", 10);
    }
  });
}

// #5 Kalkulator Berat Badan di Planet Lain
function initWeightCalc() {
  const massSlider = $("#weight-mass");
  const massDisplay = $("#weight-mass-val");
  const planetSelect = $("#weight-planet");
  const outputText = $("#weight-output");
  const barFill = $("#weight-bar-fill");
  if (!massSlider || !planetSelect) return;

  planetSelect.innerHTML = PLANETS_DATA.map((p, idx) => `
    <option value="${idx}">${p.name}</option>
  `).join("");

  function updateWeight(userTriggered = false) {
    const mass = parseFloat(massSlider.value);
    const planetIdx = parseInt(planetSelect.value, 10);
    const planet = PLANETS_DATA[planetIdx];

    if (massDisplay) massDisplay.textContent = mass;
    const calcWeight = (mass * planet.gravityRatio).toFixed(1);

    if (outputText) {
      outputText.innerHTML = `Di <b>${planet.name}</b> beratmu terasa setara <b>${calcWeight} kg</b> (gravitasi ${planet.gravityRatio}× Bumi).`;
    }
    if (barFill) {
      const fillPercent = Math.min(100, Math.max(5, (mass * planet.gravityRatio) / 2.2));
      barFill.style.width = `${fillPercent}%`;
    }

    if (userTriggered) {
      AppState.complete("wt", 10);
    }
  }

  massSlider.addEventListener("input", () => updateWeight(true));
  planetSelect.addEventListener("change", () => {
    SoundFX.playClick();
    updateWeight(true);
  });
  updateWeight(false);
}

// #6 Prediksi Lalu Jawaban
function initPredict() {
  const container = $("#predict-buttons");
  const feedbackEl = $("#predict-feedback");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const answer = btn.dataset.ans;

    if (answer === "v") {
      showFeedback(feedbackEl, true, "Tepat sekali! Venus adalah planet terpanas (464 °C) karena efek rumah kaca ekstrem dari atmosfer karbon dioksida tebalnya.");
    } else if (answer === "m") {
      showFeedback(feedbackEl, false, "Tebakan yang logis karena paling dekat ke Matahari, namun keliru! Merkurius tidak punya atmosfer penahan panas, sehingga panasnya lepas. Jawabannya adalah Venus (464 °C).");
    } else {
      showFeedback(feedbackEl, false, "Kurang tepat. Mars justru sangat dingin dengan suhu rata-rata -65 °C. Planet terpanas adalah Venus (464 °C).");
    }
    AppState.complete("pred", 10);
  });
}

// #7 Tebak Angka Slider
function initEstimate() {
  const slider = $("#estimate-slider");
  const valueDisplay = $("#estimate-val");
  const submitBtn = $("#estimate-btn");
  const feedbackEl = $("#estimate-feedback");
  if (!slider || !submitBtn) return;

  slider.addEventListener("input", () => {
    if (valueDisplay) valueDisplay.textContent = slider.value;
  });

  submitBtn.addEventListener("click", () => {
    const guess = parseFloat(slider.value);
    const diff = Math.abs(guess - 8.33);
    const isClose = diff <= 2;

    showFeedback(
      feedbackEl,
      isClose,
      `Waktu tempuh cahaya Matahari ke Bumi adalah sekitar 8 menit 20 detik (±8,33 menit). Tebakanmu ${guess} menit (selisih ${diff.toFixed(1)} menit).`
    );
    AppState.complete("est", 10);
  });
}

// #8 Seret & Lepas / Ketuk-Tukar Urutan Planet
function initOrder() {
  const container = $("#order-list");
  const checkBtn = $("#order-check-btn");
  const feedbackEl = $("#order-feedback");
  if (!container || !checkBtn) return;

  // Nonaktifkan scroll bawaan saat drag di layar sentuh
  container.style.touchAction = "none";

  const CORRECT_ORDER = ["Venus", "Bumi", "Mars", "Jupiter", "Neptunus"];
  let currentOrder = ["Jupiter", "Venus", "Neptunus", "Bumi", "Mars"];
  let selectedIdx = -1;

  function renderList(focusIdx = null) {
    container.innerHTML = currentOrder.map((name, idx) => `
      <div class="order-item ${idx === selectedIdx ? "selected" : ""}" data-index="${idx}" tabindex="0" role="button" aria-pressed="${idx === selectedIdx ? "true" : "false"}" aria-label="Urutan ${idx + 1}: ${name}. ${idx === selectedIdx ? 'Terpilih untuk ditukar. Tekan Spasi atau Enter pada kartu lain untuk menukar.' : 'Tekan Spasi atau Enter untuk memilih.'}">
        <span class="text-subtle">${idx + 1}.</span> <span>${name}</span>
      </div>
    `).join("");

    if (focusIdx !== null) {
      const targetEl = container.querySelector(`.order-item[data-index="${focusIdx}"]`);
      if (targetEl) targetEl.focus();
    } else {
      const selectedEl = container.querySelector(".order-item.selected");
      if (selectedEl) selectedEl.focus();
    }
  }

  function swap(idxA, idxB) {
    const temp = currentOrder[idxA];
    currentOrder[idxA] = currentOrder[idxB];
    currentOrder[idxB] = temp;
    selectedIdx = -1;
    renderList(idxB);
    SoundFX.playClick();
  }

  // Pointer Events drag (desktop + layar sentuh)
  makeDraggable({
    container,
    itemSelector: ".order-item",
    dropOverClass: "drag-over",
    onDrop(dragEl, dropEl) {
      const fromIdx = parseInt(dragEl.dataset.index, 10);
      const toIdx = parseInt(dropEl.dataset.index, 10);
      swap(fromIdx, toIdx);
    }
  });

  // Operasi keyboard: Enter / Spasi
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = e.target.closest(".order-item");
      if (item) item.click();
    }
  });

  // Fallback tap-tap / keyboard click: ketuk dua item untuk menukar
  container.addEventListener("click", (e) => {
    const item = e.target.closest(".order-item");
    if (!item) return;
    const clickedIdx = parseInt(item.dataset.index, 10);

    if (selectedIdx < 0) {
      selectedIdx = clickedIdx;
      renderList(clickedIdx);
    } else if (selectedIdx === clickedIdx) {
      selectedIdx = -1;
      renderList(clickedIdx);
    } else {
      swap(selectedIdx, clickedIdx);
    }
  });

  checkBtn.addEventListener("click", () => {
    const isCorrect = currentOrder.join(",") === CORRECT_ORDER.join(",");
    showFeedback(
      feedbackEl,
      isCorrect,
      isCorrect ? "Urutan tepat dari yang terdekat: Venus → Bumi → Mars → Jupiter → Neptunus! 🎉" : "Urutan belum tepat. Coba tukar posisi planetnya kembali."
    );
    if (isCorrect) {
      AppState.complete("ord", 10);
    }
  });

  renderList();
}

// #9 Hotspot Lapisan Matahari
function initHotspot() {
  const svg = $("#hotspot-svg");
  const infoEl = $("#hotspot-info");
  if (!svg || !infoEl) return;

  const viewedHotspots = new Set();

  svg.innerHTML = SOLAR_LAYERS_DATA.map((layer, idx) => `
    <circle cx="100" cy="100" r="${layer.radius}" fill="${layer.color}" stroke="rgba(0,0,0,0.25)" data-index="${idx}" style="cursor:pointer;" />
  `).join("");

  svg.addEventListener("click", (e) => {
    const circle = e.target.closest("circle");
    if (!circle) return;
    SoundFX.playClick();

    const idx = parseInt(circle.dataset.index, 10);
    const layer = SOLAR_LAYERS_DATA[idx];

    infoEl.innerHTML = `☀️ <b>${layer.name}</b>: ${layer.desc}`;
    viewedHotspots.add(idx);

    if (viewedHotspots.size >= 3) {
      AppState.complete("hot", 10);
    }
  });
}

// #10 Stepper Pembentukan Tata Surya
function initStepper() {
  const emojiEl = $("#stepper-emoji");
  const descEl = $("#stepper-desc");
  const dotsEl = $("#stepper-dots");
  const prevBtn = $("#stepper-prev");
  const nextBtn = $("#stepper-next");
  if (!emojiEl || !prevBtn || !nextBtn) return;

  let currentStep = 0;

  function renderStep() {
    const step = SOLAR_FORMATION_STEPS[currentStep];
    emojiEl.textContent = step.emoji;
    descEl.textContent = step.desc;
    dotsEl.textContent = SOLAR_FORMATION_STEPS.map((_, i) => (i <= currentStep ? "●" : "○")).join(" ");

    prevBtn.disabled = currentStep === 0;
    nextBtn.disabled = currentStep === SOLAR_FORMATION_STEPS.length - 1;

    if (currentStep === SOLAR_FORMATION_STEPS.length - 1) {
      AppState.complete("step", 10);
    }
  }

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      SoundFX.playClick();
      renderStep();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentStep < SOLAR_FORMATION_STEPS.length - 1) {
      currentStep++;
      SoundFX.playClick();
      renderStep();
    }
  });

  renderStep();
}

// #11 Checklist Multi-Pilih Planet Berbatu
function initChecklist() {
  const container = $("#checklist-items");
  const checkBtn = $("#checklist-btn");
  const feedbackEl = $("#checklist-feedback");
  if (!container || !checkBtn) return;

  const CANDIDATES = ["Merkurius", "Jupiter", "Bumi", "Saturnus", "Mars", "Neptunus"];
  // Indeks planet berbatu adalah 0 (Merkurius), 2 (Bumi), 4 (Mars)

  container.innerHTML = CANDIDATES.map((name, idx) => `
    <label class="check-label">
      <input type="checkbox" value="${idx}">
      <span>${name}</span>
    </label>
  `).join("");

  checkBtn.addEventListener("click", () => {
    const checked = $$("input:checked", container).map((cb) => parseInt(cb.value, 10)).sort();
    const isCorrect = checked.join(",") === "0,2,4";

    showFeedback(
      feedbackEl,
      isCorrect,
      isCorrect ? "Tepat! Planet berbatu (kebumian) di daftar ini adalah Merkurius, Bumi, dan Mars." : "Belum tepat. Petunjuk: planet berbatu memiliki permukaan padat, bukan raksasa gas atau es."
    );

    if (isCorrect) {
      AppState.complete("ck", 10);
    }
  });
}

// #12 Isian Singkat
function initFillBlanks() {
  const input1 = $("#fill-planet-1");
  const input2 = $("#fill-planet-2");
  const checkBtn = $("#fill-check-btn");
  const feedbackEl = $("#fill-feedback");
  if (!input1 || !input2 || !checkBtn) return;

  checkBtn.addEventListener("click", () => {
    const val1 = input1.value.trim().toLowerCase();
    const val2 = input2.value.trim().toLowerCase();

    const ok1 = val1 === "jupiter";
    const ok2 = val2 === "saturnus";

    input1.className = ok1 ? "is-valid" : "is-invalid";
    input2.className = ok2 ? "is-valid" : "is-invalid";

    const allOk = ok1 && ok2;
    showFeedback(
      feedbackEl,
      allOk,
      allOk ? "Luar biasa, jawabanmu benar semua! (Jupiter & Saturnus)" : "Masih ada isian yang belum tepat. Periksa kolom yang bertanda merah."
    );

    if (allOk) {
      AppState.complete("fill", 10);
    }
  });
}

// #13 Anagram
function initAnagram() {
  const input = $("#anagram-input");
  const checkBtn = $("#anagram-check-btn");
  const hintBtn = $("#anagram-hint-btn");
  const feedbackEl = $("#anagram-feedback");
  if (!input || !checkBtn) return;

  checkBtn.addEventListener("click", () => {
    const val = input.value.trim().toLowerCase();
    const isCorrect = val === "neptunus";

    showFeedback(
      feedbackEl,
      isCorrect,
      isCorrect ? "Tepat sekali, Neptunus! 🎯 Planet terjauh berangin kencang." : "Susunan kata belum tepat. Coba lagi!"
    );

    if (isCorrect) {
      AppState.complete("ana", 10);
    }
  });

  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      showFeedback(feedbackEl, true, "💡 Petunjuk: Planet ini adalah planet terjauh dari Matahari berawalan huruf 'N'.");
    });
  }
}

// #14 Game Memori Karakteristik Planet
function initMemoryGame() {
  const container = $("#memory-grid");
  const infoEl = $("#memory-info");
  if (!container) return;

  let cards = MEMORY_PAIRS_DATA.flatMap((pair, pairIdx) => [
    { pairIdx, text: pair[0] },
    { pairIdx, text: pair[1] }
  ]).sort(() => Math.random() - 0.5);

  let openedCardIndices = [];
  let moveCount = 0;
  let matchCount = 0;

  function renderGrid() {
    container.innerHTML = cards.map((c, idx) => `
      <button class="memory-card" data-index="${idx}" aria-label="Kartu ${idx + 1}, tertutup">❓</button>
    `).join("");
  }

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".memory-card");
    if (!btn || btn.classList.contains("is-open") || btn.classList.contains("is-matched") || openedCardIndices.length >= 2) return;

    SoundFX.playClick();
    const clickedIdx = parseInt(btn.dataset.index, 10);
    btn.textContent = cards[clickedIdx].text;
    btn.classList.add("is-open");
    btn.setAttribute("aria-label", `Kartu ${clickedIdx + 1}: ${cards[clickedIdx].text}`);
    openedCardIndices.push(clickedIdx);

    if (openedCardIndices.length === 2) {
      moveCount++;
      const [idxA, idxB] = openedCardIndices;
      const cardA = cards[idxA];
      const cardB = cards[idxB];

      if (cardA.pairIdx === cardB.pairIdx) {
        matchCount++;
        SoundFX.playSuccess();
        [idxA, idxB].forEach((i) => {
          const el = container.querySelector(`.memory-card[data-index="${i}"]`);
          if (el) {
            el.classList.remove("is-open");
            el.classList.add("is-matched");
            el.setAttribute("aria-label", `Kartu ${i + 1}: ${cards[i].text} (Sudah cocok)`);
          }
        });
        openedCardIndices = [];

        if (matchCount === MEMORY_PAIRS_DATA.length) {
          AppState.complete("mem", 15);
        }
      } else {
        SoundFX.playError();
        setTimeout(() => {
          [idxA, idxB].forEach((i) => {
            const el = container.querySelector(`.memory-card[data-index="${i}"]`);
            if (el) {
              el.textContent = "❓";
              el.classList.remove("is-open");
              el.setAttribute("aria-label", `Kartu ${i + 1}, tertutup`);
            }
          });
          openedCardIndices = [];
        }, 900);
      }

      if (infoEl) {
        infoEl.textContent = `Langkah: ${moveCount} · Pasangan: ${matchCount}/${MEMORY_PAIRS_DATA.length}`;
      }
    }
  });

  renderGrid();
}

// #15 Kilat Benar / Salah
function initTrueFalse() {
  const container = $("#tf-container");
  if (!container) return;

  let currentIdx = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIdx >= TRUE_FALSE_QUESTIONS.length) {
      container.innerHTML = `
        <p class="text-bold">Selesai! Skor akhirmu: ${score}/${TRUE_FALSE_QUESTIONS.length}</p>
      `;
      AppState.complete("tf", 10);
      return;
    }

    const item = TRUE_FALSE_QUESTIONS[currentIdx];
    container.innerHTML = `
      <p class="text-bold">${item.q}</p>
      <div>
        <button class="btn-tf" data-ans="true">✅ Benar</button>
        <button class="btn-tf" data-ans="false">❌ Salah</button>
      </div>
      <div id="tf-feedback" class="feedback"></div>
    `;
  }

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-tf");
    if (!btn) return;

    const userAns = btn.dataset.ans === "true";
    const isCorrect = userAns === TRUE_FALSE_QUESTIONS[currentIdx].a;
    if (isCorrect) score++;

    const feedbackEl = $("#tf-feedback", container);
    showFeedback(feedbackEl, isCorrect, isCorrect ? "Tepat sekali!" : "Kurang tepat.");

    $$(".btn-tf", container).forEach((b) => (b.disabled = true));
    currentIdx++;
    setTimeout(renderQuestion, 900);
  });

  renderQuestion();
}

// #16 Kuis Pilihan Ganda dengan Petunjuk & Penjelasan
function initQuiz() {
  const container = $("#quiz-container");
  if (!container) return;

  let currentIdx = 0;
  let score = 0;

  function renderQuizQuestion() {
    if (currentIdx >= QUIZ_QUESTIONS.length) {
      container.innerHTML = `<p class="text-bold">🎉 Kuis Selesai! Skor Akhir: ${score}/${QUIZ_QUESTIONS.length}</p>`;
      AppState.complete("quiz", 15);
      return;
    }

    const q = QUIZ_QUESTIONS[currentIdx];
    container.innerHTML = `
      <p class="text-bold">${currentIdx + 1}/${QUIZ_QUESTIONS.length}. ${q.q}</p>
      <div style="display:flex; flex-direction:column; gap:6px; margin:10px 0;">
        ${q.options.map((opt, i) => `<button class="quiz-option" data-index="${i}">${opt}</button>`).join("")}
      </div>
      <button id="quiz-hint-btn">💡 Petunjuk</button>
      <div id="quiz-feedback" class="feedback"></div>
    `;

    $("#quiz-hint-btn", container).addEventListener("click", () => {
      const fb = $("#quiz-feedback", container);
      showFeedback(fb, true, `💡 ${q.hint}`);
    });

    $$(".quiz-option", container).forEach((btn) => {
      btn.addEventListener("click", () => {
        const selected = parseInt(btn.dataset.index, 10);
        const isCorrect = selected === q.answerIndex;
        if (isCorrect) score++;

        const fb = $("#quiz-feedback", container);
        showFeedback(fb, isCorrect, `${isCorrect ? "Benar! " : "Belum tepat. "} ${q.explanation}`);

        $$(".quiz-option", container).forEach((b) => (b.disabled = true));
        currentIdx++;
        setTimeout(renderQuizQuestion, 2400);
      });
    });
  }

  renderQuizQuestion();
}

// #17 Misi ke Mars: Skenario Bercabang
function initBranching() {
  const container = $("#branching-container");
  if (!container) return;

  function renderNode(nodeKey) {
    const node = MARS_MISSION_TREE[nodeKey];
    if (!node) return;

    if (node.choices) {
      container.innerHTML = `
        <p>${node.text}</p>
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
          ${node.choices.map((c) => `<button class="branch-choice" data-next="${c.next}">${c.label}</button>`).join("")}
        </div>
      `;
    } else {
      // Ending node
      container.innerHTML = `
        <p class="text-bold">${node.text}</p>
        <button id="branch-restart-btn">↺ Ulangi Misi</button>
      `;
      AppState.complete("br", 10);
    }
  }

  container.addEventListener("click", (e) => {
    const choiceBtn = e.target.closest(".branch-choice");
    if (choiceBtn) {
      SoundFX.playClick();
      renderNode(choiceBtn.dataset.next);
      return;
    }

    const restartBtn = e.target.closest("#branch-restart-btn");
    if (restartBtn) {
      SoundFX.playClick();
      renderNode("start");
    }
  });

  renderNode("start");
}

// #18 Polling Emoji
function initPoll() {
  const container = $("#poll-container");
  if (!container) return;

  const OPTIONS = ["😕 Bingung", "🙂 Lumayan", "😀 Paham", "🤩 Sangat Paham"];
  let voteCounts = [3, 8, 14, 6];
  let userChoiceIdx = -1;

  function renderPoll() {
    const maxVotes = Math.max(...voteCounts);
    container.innerHTML = OPTIONS.map((label, idx) => {
      const votes = voteCounts[idx];
      const barWidth = userChoiceIdx >= 0 ? (votes / maxVotes) * 100 : 0;
      return `
        <div class="poll-option" data-index="${idx}" tabindex="0" role="button">
          <span style="width: 130px;">${label}</span>
          <div class="poll-bar-track">
            <div class="poll-bar-fill" style="width: ${barWidth}%;"></div>
          </div>
          <span style="width: 30px; text-align:right;">${userChoiceIdx >= 0 ? votes : ""}</span>
        </div>
      `;
    }).join("");
  }

  container.addEventListener("click", (e) => {
    const opt = e.target.closest(".poll-option");
    if (!opt || userChoiceIdx >= 0) return;

    SoundFX.playClick();
    userChoiceIdx = parseInt(opt.dataset.index, 10);
    voteCounts[userChoiceIdx]++;
    renderPoll();
    AppState.complete("poll", 10);
  });

  renderPoll();
}

// #19 Toggle Skala Grafik Diameter
function initChartToggle() {
  const container = $("#chart-list");
  const toggleCheckbox = $("#chart-log-toggle");
  if (!container || !toggleCheckbox) return;

  function renderChart() {
    const isLog = toggleCheckbox.checked;
    const maxVal = 142984; // Diameter Jupiter

    container.innerHTML = PLANETS_DATA.map((p) => {
      const diam = p.diameterKm;
      let percent = 0;
      if (isLog) {
        percent = ((Math.log10(diam) - 3) / (Math.log10(maxVal) - 3)) * 100;
      } else {
        percent = (diam / maxVal) * 100;
      }

      return `
        <div class="chart-row">
          <span class="chart-label">${p.name}</span>
          <div class="chart-bar-wrap">
            <span class="chart-bar-fill" style="background:${p.color}; width:${Math.max(2, percent)}%;"></span>
          </div>
          <span class="text-subtle" style="width:75px; text-align:right;">${diam.toLocaleString("id")} km</span>
        </div>
      `;
    }).join("");
  }

  toggleCheckbox.addEventListener("change", () => {
    SoundFX.playClick();
    renderChart();
    AppState.complete("log", 10);
  });

  renderChart();
}

// #20 Catatan Refleksi
function initReflectionNote() {
  const textarea = $("#note-textarea");
  const counter = $("#note-counter");
  const saveBtn = $("#note-save-btn");
  const feedbackEl = $("#note-feedback");
  if (!textarea || !saveBtn) return;

  textarea.addEventListener("input", () => {
    if (counter) counter.textContent = `${textarea.value.length}/200`;
  });

  saveBtn.addEventListener("click", () => {
    const text = textarea.value.trim();
    if (text.length < 10) {
      showFeedback(feedbackEl, false, "Tuliskan minimal 10 karakter refleksi belajarmu.");
      return;
    }

    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    showFeedback(feedbackEl, true, `📝 Catatan Tersimpan: "${safeText}"`);
    AppState.complete("note", 10);
  });
}

// #21 Kanvas Bebas Menggambar
function initCanvasDraw() {
  const canvas = $("#canvas-draw");
  const clearBtn = $("#canvas-clear-btn");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let strokeCount = 0;

  // HiDPI Canvas scaling
  const dpr = window.devicePixelRatio || 1;
  const width = 340;
  const height = 220;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#4f46e5";

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return [
      (e.clientX - rect.left) * (width / rect.width),
      (e.clientY - rect.top) * (height / rect.height)
    ];
  }

  canvas.addEventListener("pointerdown", (e) => {
    isDrawing = true;
    canvas.setPointerCapture(e.pointerId);
    const [x, y] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDrawing) return;
    const [x, y] = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    strokeCount++;
    if (strokeCount >= 35) {
      AppState.complete("draw", 10);
    }
  });

  canvas.addEventListener("pointerup", () => {
    isDrawing = false;
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, width, height);
      strokeCount = 0;
      SoundFX.playClick();
    });
  }

  // Alternatif Aksesibilitas Keyboard: Gambar Otomatis
  const autoDrawBtn = $("#canvas-auto-draw-btn");
  if (autoDrawBtn) {
    autoDrawBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, width, height);

      // Gambar Matahari di pusat
      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 18, 0, Math.PI * 2);
      ctx.fill();

      // Gambar lintasan orbit Bumi
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2);
      ctx.stroke();

      // Gambar Planet Bumi
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(width / 2 + 70, height / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      strokeCount = 40;
      SoundFX.playSuccess();
      AppState.complete("draw", 10);
    });
  }
}

// #22 Klasifikasi ke Keranjang
function initBucketClassify() {
  const itemsContainer = $("#bucket-items");
  const bucketsContainer = $("#bucket-targets");
  const feedbackEl = $("#bucket-feedback");
  if (!itemsContainer || !bucketsContainer) return;

  let remainingItems = [...BUCKET_ITEMS_DATA];
  let selectedItemIdx = -1;

  function render() {
    if (remainingItems.length === 0) {
      itemsContainer.innerHTML = `<span class="text-bold" style="color:var(--success);">✅ Semua benda langit berhasil diklasifikasikan ke keranjang yang tepat!</span>`;
      bucketsContainer.innerHTML = "";
      AppState.complete("kls", 10);
      return;
    }

    itemsContainer.innerHTML = remainingItems.map((item, idx) => `
      <button class="btn ${idx === selectedItemIdx ? "btn-primary" : ""}" data-index="${idx}">${item.label}</button>
    `).join("");

    bucketsContainer.innerHTML = BUCKET_CATEGORIES_DATA.map((cat, idx) => `
      <button class="bucket-btn" data-cat="${idx}">${cat}</button>
    `).join("");
  }

  itemsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    SoundFX.playClick();
    selectedItemIdx = parseInt(btn.dataset.index, 10);
    render();
  });

  bucketsContainer.addEventListener("click", (e) => {
    const bucketBtn = e.target.closest(".bucket-btn");
    if (!bucketBtn) return;

    if (selectedItemIdx < 0) {
      showFeedback(feedbackEl, false, "Pilih salah satu benda langit di atas terlebih dahulu.");
      return;
    }

    const targetCatId = parseInt(bucketBtn.dataset.cat, 10);
    const item = remainingItems[selectedItemIdx];
    const isCorrect = item.categoryId === targetCatId;

    if (isCorrect) {
      showFeedback(feedbackEl, true, `Tepat! ${item.label} tergolong ke dalam ${BUCKET_CATEGORIES_DATA[targetCatId]}.`);
      remainingItems.splice(selectedItemIdx, 1);
      selectedItemIdx = -1;
      render();
    } else {
      showFeedback(feedbackEl, false, `${item.label} bukan tergolong dalam ${BUCKET_CATEGORIES_DATA[targetCatId]}. Coba keranjang lain.`);
    }
  });

  render();
}

// #23 Pembanding Geser Bumi vs Mars
function initSplitCompare() {
  const slider = $("#compare-slider");
  const rightPane = $("#compare-right-pane");
  if (!slider || !rightPane) return;

  slider.addEventListener("input", (e) => {
    const val = e.target.value;
    rightPane.style.clipPath = `inset(0 0 0 ${val}%)`;
    AppState.complete("cmp", 10);
  });
}

// #24 Timeline Geser Eksplorasi Antariksa
function initTimeline() {
  const slider = $("#timeline-slider");
  const displayEl = $("#timeline-display");
  if (!slider || !displayEl) return;

  const viewedEvents = new Set();

  function updateTimeline() {
    const idx = parseInt(slider.value, 10);
    const item = SPACE_TIMELINE_DATA[idx];
    displayEl.innerHTML = `🚀 <b>Tahun ${item.year}</b>: ${item.event}`;
    viewedEvents.add(idx);

    if (viewedEvents.size >= 4) {
      AppState.complete("tl", 10);
    }
  }

  slider.addEventListener("input", updateTimeline);
  updateTimeline();
}

// #25 Uji Tingkat Keyakinan Sebelum Menjawab
function initConfidence() {
  const confButtons = $("#confidence-buttons");
  const answerSection = $("#confidence-answers");
  const feedbackEl = $("#confidence-feedback");
  if (!confButtons || !answerSection) return;

  let isConfident = false;

  confButtons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    SoundFX.playClick();
    isConfident = btn.dataset.conf === "1";
    answerSection.hidden = false;
  });

  answerSection.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const answer = btn.dataset.ans;
    const isCorrect = answer === "h"; // Hidrogen

    let feedbackMsg = isCorrect
      ? "Benar! Unsur terbanyak di Matahari adalah gas Hidrogen (±73%). "
      : "Jawabannya adalah gas Hidrogen (±73%). ";

    if (isConfident) {
      feedbackMsg += isCorrect
        ? "Keyakinanmu tepat sasaran! 🎯"
        : "Yakin tapi keliru: di sinilah titik lompatan belajar paling bermakna.";
    } else {
      feedbackMsg += isCorrect
        ? "Kamu ternyata mengerti lebih dari yang kamu kira!"
        : "Ragu itu sangat wajar dalam proses belajar, kini kamu sudah memahaminya.";
    }

    showFeedback(feedbackEl, isCorrect, feedbackMsg);
    AppState.complete("conf", 10);
  });
}

// #26 Tantangan Berwaktu (15 Detik)
function initSpeedChallenge() {
  const startBtn = $("#speed-start-btn");
  const infoEl = $("#speed-info");
  const grid = $("#time-attack-grid");
  if (!startBtn || !grid) return;

  let timeLeft = 0;
  let score = 0;
  let timerId = null;

  const GIANTS = ["Jupiter", "Saturnus", "Uranus", "Neptunus"];
  const ROCKY = ["Merkurius", "Venus", "Bumi", "Mars"];

  function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  function renderGrid() {
    const selection = shuffle([...shuffle(GIANTS).slice(0, 2), ...shuffle(ROCKY).slice(0, 2)]);
    grid.innerHTML = selection.map((name) => `
      <button class="btn" data-is-giant="${GIANTS.includes(name) ? "1" : "0"}">${name}</button>
    `).join("");
  }

  startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 15;
    renderGrid();
    if (infoEl) infoEl.textContent = `⏱ 15 dtk · Skor: 0`;

    clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft--;
      if (infoEl) infoEl.textContent = `⏱ ${timeLeft} dtk · Skor: ${score}`;

      if (timeLeft <= 0) {
        clearInterval(timerId);
        grid.innerHTML = "";
        if (infoEl) infoEl.textContent = `Waktu Habis! Skor Akhir: ${score}`;
        if (score > 0) {
          AppState.complete("time", 10);
        }
      }
    }, 1000);
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || timeLeft <= 0) return;

    if (btn.dataset.isGiant === "1") {
      score++;
      SoundFX.playSuccess();
    } else {
      score = Math.max(0, score - 1);
      SoundFX.playError();
    }

    renderGrid();
    if (infoEl) infoEl.textContent = `⏱ ${timeLeft} dtk · Skor: ${score}`;
  });
}

// #27 Narasi Suara (Web Speech API) di Seluruh Kartu
function initTTS() {
  $$(".card:not(#final-trophy-card)").forEach((card, idx) => {
    if (idx === 0) return; // Lewati kartu pengantar

    const header = card.querySelector(".card-header .card-actions");
    if (!header) return;

    const ttsBtn = document.createElement("button");
    ttsBtn.className = "btn-tts";
    ttsBtn.innerHTML = "🔈 Baca";
    ttsBtn.setAttribute("aria-label", "Bacakan penjelasan kartu ini");

    ttsBtn.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) {
        alert("Peramban ini belum mendukung Web Speech Synthesis.");
        return;
      }

      window.speechSynthesis.cancel();

      if (ttsBtn.classList.contains("is-speaking")) {
        ttsBtn.classList.remove("is-speaking");
        ttsBtn.innerHTML = "🔈 Baca";
        return;
      }

      $$(".btn-tts.is-speaking").forEach((b) => {
        b.classList.remove("is-speaking");
        b.innerHTML = "🔈 Baca";
      });

      const title = card.querySelector("h2") ? card.querySelector("h2").textContent : "";
      const paragraphs = $$("p, .text-bold", card).map((p) => p.textContent).join(" ");
      const textToSpeak = `${title}. ${paragraphs}`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;

      utterance.onstart = () => {
        ttsBtn.classList.add("is-speaking");
        ttsBtn.innerHTML = "⏹ Berhenti";
      };

      utterance.onend = utterance.onerror = () => {
        ttsBtn.classList.remove("is-speaking");
        ttsBtn.innerHTML = "🔈 Baca";
      };

      window.speechSynthesis.speak(utterance);
      AppState.complete("tts", 10);
    });

    header.prepend(ttsBtn);
  });

  const demoBtn = $("#tts-demo-btn");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) {
        alert("Peramban ini belum mendukung Web Speech Synthesis.");
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Halo Kadet Antariksa! Selamat datang di modul interaktif Jelajah Tata Surya. Mari jelajahi keajaiban semesta bersama-sama!");
      u.lang = "id-ID";
      window.speechSynthesis.speak(u);
      AppState.complete("tts", 10);
    });
  }
}

// #28 Word Search (Cari Kata Tersembunyi)
function initWordSearch() {
  const gridContainer = $("#word-search-grid");
  const wordListEl = $("#word-search-list");
  const clearBtn = $("#word-search-clear");
  if (!gridContainer || !wordListEl) return;

  const foundWords = new Set();
  const foundCellIndices = new Set();
  let selectedCells = [];
  let isPointerDragging = false;
  let dragStartIdx = null;
  let lastHoverIdx = null;

  function renderGrid() {
    gridContainer.innerHTML = WORD_SEARCH_DATA.grid.map((row, r) =>
      row.split("").map((char, c) => {
        const cellIdx = r * 7 + c;
        const isSelected = selectedCells.includes(cellIdx);
        const isFound = foundCellIndices.has(cellIdx);
        return `
          <button type="button" class="word-cell ${isFound ? "is-found" : ""} ${isSelected ? "is-selected" : ""}" data-index="${cellIdx}" aria-label="Huruf ${char}, baris ${r + 1} kolom ${c + 1}">
            ${char}
          </button>
        `;
      }).join("")
    ).join("");

    wordListEl.innerHTML = WORD_SEARCH_DATA.words.map((w) =>
      foundWords.has(w) ? `<s>${w}</s>` : `<b>${w}</b>`
    ).join(" · ");
  }

  // Menghasilkan daftar indeks sel dalam satu garis lurus (horizontal, vertikal, diagonal)
  function getLineCells(startIdx, endIdx) {
    if (startIdx === endIdx) return [startIdx];

    const r1 = Math.floor(startIdx / 7);
    const c1 = startIdx % 7;
    const r2 = Math.floor(endIdx / 7);
    const c2 = endIdx % 7;

    const dr = r2 - r1;
    const dc = c2 - c1;

    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    const lenR = Math.abs(dr);
    const lenC = Math.abs(dc);

    // Harus segaris lurus: horizontal, vertikal, atau diagonal
    if (lenR !== 0 && lenC !== 0 && lenR !== lenC) {
      return null;
    }

    const length = Math.max(lenR, lenC) + 1;
    const cells = [];
    for (let i = 0; i < length; i++) {
      cells.push((r1 + i * stepR) * 7 + (c1 + i * stepC));
    }
    return cells;
  }

  // Cek apakah deretan sel membentuk kata target yang valid
  function checkMatch(cells) {
    if (!cells || cells.length < 2) return false;

    const formedString = cells.map((i) => {
      const r = Math.floor(i / 7);
      const c = i % 7;
      return WORD_SEARCH_DATA.grid[r][c];
    }).join("");

    const reversedString = formedString.split("").reverse().join("");

    const matchedWord = WORD_SEARCH_DATA.words.find(
      (w) => !foundWords.has(w) && (w === formedString || w === reversedString)
    );

    if (matchedWord) {
      foundWords.add(matchedWord);
      cells.forEach((i) => foundCellIndices.add(i));
      selectedCells = [];
      dragStartIdx = null;
      SoundFX.playSuccess();

      if (foundWords.size === WORD_SEARCH_DATA.words.length) {
        AppState.complete("ws", 10);
      }
      renderGrid();
      return true;
    }
    return false;
  }

  function getCellIdxFromEvent(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el ? el.closest(".word-cell") : null;
    if (cell && gridContainer.contains(cell)) {
      return parseInt(cell.dataset.index, 10);
    }
    return null;
  }

  // 1. Interaksi Drag / Geser Sentuh (Pointer Events untuk HP & Desktop)
  gridContainer.addEventListener("pointerdown", (e) => {
    const cell = e.target.closest(".word-cell");
    if (!cell) return;

    const idx = parseInt(cell.dataset.index, 10);
    isPointerDragging = true;
    dragStartIdx = idx;
    lastHoverIdx = idx;
    selectedCells = [idx];
    renderGrid();

    try {
      gridContainer.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  gridContainer.addEventListener("pointermove", (e) => {
    if (!isPointerDragging || dragStartIdx === null) return;

    const currentIdx = getCellIdxFromEvent(e);
    if (currentIdx !== null && currentIdx !== lastHoverIdx) {
      lastHoverIdx = currentIdx;
      const line = getLineCells(dragStartIdx, currentIdx);
      if (line) {
        selectedCells = line;
        renderGrid();
      }
    }
  });

  gridContainer.addEventListener("pointerup", (e) => {
    if (!isPointerDragging) return;
    isPointerDragging = false;

    // Jika telah menyeret lebih dari 1 sel, periksa kecocokan kata langsung
    if (selectedCells.length > 1) {
      const matched = checkMatch(selectedCells);
      if (!matched) {
        selectedCells = [];
        SoundFX.playClick();
        renderGrid();
      }
      dragStartIdx = null;
      return;
    }

    // Jika hanya satu ketukan (tap/click mode dua langkah: klik awal lalu klik akhir)
    dragStartIdx = selectedCells.length === 1 ? selectedCells[0] : null;
  });

  gridContainer.addEventListener("pointercancel", () => {
    isPointerDragging = false;
    selectedCells = [];
    dragStartIdx = null;
    renderGrid();
  });

  // 2. Interaksi Ketuk Dua Titik / Keyboard Click (Awal -> Akhir atau Ketuk Huruf)
  gridContainer.addEventListener("click", (e) => {
    // Abaikan jika baru saja selesai aksi drag geser panjang
    if (selectedCells.length > 1) return;

    const cell = e.target.closest(".word-cell");
    if (!cell) return;

    const idx = parseInt(cell.dataset.index, 10);
    SoundFX.playClick();

    // Jika belum ada sel terpilih, atau mengetuk sel yang sama untuk batalkan
    if (selectedCells.length === 0) {
      selectedCells = [idx];
      renderGrid();
      return;
    }

    if (selectedCells.length === 1 && selectedCells[0] === idx) {
      selectedCells = [];
      renderGrid();
      return;
    }

    // Mencoba membuat garis lurus dari sel pertama ke sel yang baru diklik
    const line = getLineCells(selectedCells[0], idx);
    if (line) {
      selectedCells = line;
      const matched = checkMatch(line);
      if (!matched) {
        // Jika garis tersebut bukan kata yang cocok, pindahkan titik awal ke sel yang baru
        selectedCells = [idx];
        renderGrid();
      }
    } else {
      // Tidak segaris lurus, mulai seleksi baru di sel yang baru diklik
      selectedCells = [idx];
      renderGrid();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      selectedCells = [];
      dragStartIdx = null;
      renderGrid();
      SoundFX.playClick();
    });
  }

  renderGrid();
}

// #29 Pengulangan Berjarak (Sistem Leitner 4 Kotak)
function initLeitner() {
  const container = $("#leitner-container");
  if (!container) return;

  // Baca data terpusat dan berversi melalui AppState
  const leitnerState = AppState.getLeitnerData();
  const srCards = (leitnerState && leitnerState.cards) ? leitnerState.cards : {};

  // Interval jeda waktu untuk Sistem Leitner 4 Kotak:
  // Kotak 1 = 1 hari, Kotak 2 = 3 hari, Kotak 3 = 7 hari, Kotak 4 = 14 hari
  const BOX_INTERVALS_DAYS = [1, 3, 7, 14];
  const MAX_BOX = BOX_INTERVALS_DAYS.length - 1; // Indeks 3 (Kotak 4)

  let queue = LEITNER_CARDS_DATA.map((_, i) => i).filter(
    (i) => !srCards[i] || srCards[i].nextDue <= Date.now()
  );
  let reviewedSessionCount = 0;

  function renderCard() {
    const cardIdx = queue[0];
    if (cardIdx === undefined) {
      container.innerHTML = `
        <p class="text-bold" style="font-size:1.05rem;">✅ Selesai untuk sesi ini! (${reviewedSessionCount} kartu diulas).</p>
        <p class="text-muted" style="margin:8px 0 14px;">
          Sistem Leitner 4 kotak menjadwalkan ulang kartu berdasarkan kotak penguasaanmu:
          <b>Kotak 1</b>: 1 hari · <b>Kotak 2</b>: 3 hari · <b>Kotak 3</b>: 7 hari · <b>Kotak 4</b>: 14 hari.
        </p>
        <button id="leitner-reset-all" class="btn-primary">↺ Latihan Ulang Semua Kartu Sekarang</button>
      `;

      $("#leitner-reset-all", container).addEventListener("click", () => {
        queue = LEITNER_CARDS_DATA.map((_, i) => i);
        renderCard();
      });

      if (reviewedSessionCount >= 3) {
        AppState.complete("sr", 10);
      }
      return;
    }

    const card = LEITNER_CARDS_DATA[cardIdx];
    const cardInfo = srCards[cardIdx];
    const currentBox = cardInfo && typeof cardInfo.box === "number" ? cardInfo.box : 0;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
        <span class="text-subtle">Tersisa ${queue.length} kartu di antrean</span>
        <span class="tag-badge">📦 Kotak ${currentBox + 1} dari 4 (Jeda ${BOX_INTERVALS_DAYS[currentBox]} hari)</span>
      </div>
      <p class="text-bold" style="font-size:1.05rem; margin:8px 0;">${card.q}</p>
      <button id="leitner-show-ans-btn">👁 Tampilkan Jawaban</button>
      <div id="leitner-answer-box" style="margin-top:12px;"></div>
    `;

    $("#leitner-show-ans-btn", container).addEventListener("click", () => {
      SoundFX.playClick();
      const ansBox = $("#leitner-answer-box", container);
      ansBox.innerHTML = `
        <p class="text-bold" style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">${card.a}</p>
        <p class="text-subtle" style="font-size:0.8rem; margin:6px 0 12px;">
          Sistem Leitner 4 Kotak: Jika ingat, kartu naik ke <b>Kotak ${Math.min(4, currentBox + 2)}</b> (jeda ${BOX_INTERVALS_DAYS[Math.min(MAX_BOX, currentBox + 1)]} hari). Jika lupa, kartu kembali ke <b>Kotak 1</b> (diulang sesi ini).
        </p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button id="leitner-remember-btn" class="btn-primary">✅ Ingat (+1 Kotak)</button>
          <button id="leitner-forgot-btn">❌ Lupa (Kembali ke Kotak 1)</button>
        </div>
      `;

      $("#leitner-remember-btn", ansBox).addEventListener("click", () => gradeCard(cardIdx, true));
      $("#leitner-forgot-btn", ansBox).addEventListener("click", () => gradeCard(cardIdx, false));
    });
  }

  function gradeCard(idx, isRemembered) {
    const prevCard = srCards[idx];
    const prevBox = prevCard && typeof prevCard.box === "number" ? prevCard.box : 0;

    // Algoritma Leitner 4 Kotak:
    // Ingat: naik ke kotak berikutnya sampai maksimal Kotak 4 (indeks 3).
    // Lupa: reset kembali ke Kotak 1 (indeks 0).
    const newBox = isRemembered ? Math.min(MAX_BOX, prevBox + 1) : 0;
    srCards[idx] = {
      box: newBox,
      nextDue: Date.now() + (isRemembered ? BOX_INTERVALS_DAYS[newBox] * 86400000 : 0)
    };

    // Simpan melalui AppState dengan skema berversi
    AppState.saveLeitnerData(srCards);

    reviewedSessionCount++;
    queue.shift();
    if (!isRemembered) queue.push(idx);

    if (isRemembered) SoundFX.playSuccess();
    else SoundFX.playError();

    renderCard();
  }

  renderCard();
}

// #30 Zona Layak Huni (Goldilocks Zone)
function initHabitableZone() {
  const board = $("#zone-board");
  const earth = $("#zone-earth");
  const statusText = $("#zone-status-text");
  const tiltBtn = $("#zone-tilt-btn");
  if (!board || !earth) return;

  const visitedStates = new Set();
  let posX = 0.15;
  let posY = 0.2;

  function updateEarth(xRatio, yRatio) {
    posX = Math.min(0.92, Math.max(0.08, xRatio));
    posY = Math.min(0.88, Math.max(0.12, yRatio));

    earth.style.left = `${posX * 100}%`;
    earth.style.top = `${posY * 100}%`;

    const rect = board.getBoundingClientRect();
    const pixelDist = Math.hypot((posX - 0.5) * rect.width, (posY - 0.5) * rect.height);

    let stateKey = "";
    if (pixelDist < 46) {
      stateKey = "hot";
      statusText.innerHTML = "🔥 <b>Terlalu Dekat & Panas:</b> Air menguap habis, efek rumah kaca ekstrem!";
    } else if (pixelDist < 96) {
      stateKey = "goldilocks";
      statusText.innerHTML = "✅ <b>Zona Layak Huni (Goldilocks):</b> Suhu ideal, air berwujud cair, kehidupan dapat berkembang!";
    } else {
      stateKey = "cold";
      statusText.innerHTML = "❄️ <b>Terlalu Jauh & Dingin:</b> Suhu beku abadi, air menjadi es padat!";
    }

    visitedStates.add(stateKey);
    if (visitedStates.size >= 3) {
      AppState.complete("zone", 10);
    }
  }

  function handlePointer(e) {
    const rect = board.getBoundingClientRect();
    updateEarth((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  }

  board.addEventListener("pointerdown", (e) => {
    board.setPointerCapture(e.pointerId);
    handlePointer(e);
  });

  board.addEventListener("pointermove", (e) => {
    if (e.buttons > 0) handlePointer(e);
  });

  board.addEventListener("keydown", (e) => {
    const moves = {
      ArrowLeft: [-0.05, 0],
      ArrowRight: [0.05, 0],
      ArrowUp: [0, -0.05],
      ArrowDown: [0, 0.05]
    };
    if (moves[e.key]) {
      e.preventDefault();
      updateEarth(posX + moves[e.key][0], posY + moves[e.key][1]);
    }
  });

  if (tiltBtn) {
    tiltBtn.addEventListener("click", async () => {
      try {
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm !== "granted") return;
        }
      } catch (_) {
        return;
      }

      window.addEventListener("deviceorientation", (e) => {
        if (e.gamma !== null && e.beta !== null) {
          updateEarth(0.5 + e.gamma / 90, 0.5 + (e.beta - 45) / 90);
        }
      });
      tiltBtn.textContent = "✅ Sensor Giroskop Aktif";
    });
  }

  updateEarth(posX, posY);
}

// #31 Teka-Teki Silang (TTS)
function initCrossword() {
  const gridContainer = $("#crossword-grid");
  const cluesContainer = $("#crossword-clues");
  const checkBtn = $("#crossword-check-btn");
  const hintBtn = $("#crossword-hint-btn");
  const feedbackEl = $("#crossword-feedback");
  if (!gridContainer || !cluesContainer) return;

  const cellMap = {};
  const wordsWithClues = CROSSWORD_DATA.map((item, idx) => ({
    ...item,
    id: idx,
    clueNum: idx + 1
  }));

  // Buat mapping huruf pada sel
  wordsWithClues.forEach((wordObj) => {
    const letters = wordObj.word.split("");
    letters.forEach((char, offset) => {
      const r = wordObj.row + (wordObj.isDown ? offset : 0);
      const c = wordObj.col + (wordObj.isDown ? 0 : offset);
      const key = `${r},${c}`;
      if (!cellMap[key]) {
        cellMap[key] = { char, wordIds: [] };
      }
      cellMap[key].wordIds.push(wordObj.id);
    });
  });

  let activeWordId = 0;

  function getWordCells(wordObj) {
    return wordObj.word.split("").map((_, i) => {
      const r = wordObj.row + (wordObj.isDown ? i : 0);
      const c = wordObj.col + (wordObj.isDown ? 0 : i);
      return `${r},${c}`;
    });
  }

  // Render Grid 9 baris x 8 kolom
  let gridHTML = "";
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 8; c++) {
      const key = `${r},${c}`;
      if (!cellMap[key]) {
        gridHTML += "<i></i>";
        continue;
      }

      const startingWord = wordsWithClues.find((w) => w.row === r && w.col === c);
      gridHTML += `
        <label class="crossword-cell">
          ${startingWord ? `<sup>${startingWord.clueNum}</sup>` : ""}
          <input maxlength="1" data-cell-key="${key}" autocomplete="off" aria-label="Kotak TTS baris ${r + 1} kolom ${c + 1}">
        </label>
      `;
    }
  }
  gridContainer.innerHTML = gridHTML;

  // Render Tombol Petunjuk
  cluesContainer.innerHTML = wordsWithClues.map((w) => `
    <button class="crossword-clue-btn" data-word-id="${w.id}">
      <b>${w.clueNum}${w.isDown ? " ↓" : " →"}</b> ${w.clue} (${w.word.length} huruf)
    </button>
  `).join("");

  function highlightWordCells() {
    $$("input", gridContainer).forEach((inp) => inp.classList.remove("is-highlighted"));
    const cells = getWordCells(wordsWithClues[activeWordId]);
    cells.forEach((key) => {
      const inp = $(`input[data-cell-key="${key}"]`, gridContainer);
      if (inp) inp.classList.add("is-highlighted");
    });
  }
  highlightWordCells();

  gridContainer.addEventListener("focusin", (e) => {
    const key = e.target.dataset.cellKey;
    if (!key || !cellMap[key]) return;
    if (!cellMap[key].wordIds.includes(activeWordId)) {
      activeWordId = cellMap[key].wordIds[0];
    }
    highlightWordCells();
  });

  gridContainer.addEventListener("input", (e) => {
    const input = e.target;
    const key = input.dataset.cellKey;
    if (!key) return;

    input.value = input.value.slice(-1).toUpperCase();
    input.classList.remove("is-valid", "is-invalid");
    if (!input.value) return;

    // Auto-advance ke sel berikutnya
    const cells = getWordCells(wordsWithClues[activeWordId]);
    const currentIdx = cells.indexOf(key);
    if (currentIdx >= 0 && currentIdx < cells.length - 1) {
      const nextInput = $(`input[data-cell-key="${cells[currentIdx + 1]}"]`, gridContainer);
      if (nextInput) nextInput.focus();
    }
  });

  gridContainer.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value) {
      const key = e.target.dataset.cellKey;
      const cells = getWordCells(wordsWithClues[activeWordId]);
      const currentIdx = cells.indexOf(key);
      if (currentIdx > 0) {
        const prevInput = $(`input[data-cell-key="${cells[currentIdx - 1]}"]`, gridContainer);
        if (prevInput) prevInput.focus();
      }
    }
  });

  cluesContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".crossword-clue-btn");
    if (!btn) return;
    activeWordId = parseInt(btn.dataset.wordId, 10);
    highlightWordCells();
    const firstCellKey = getWordCells(wordsWithClues[activeWordId])[0];
    const firstInput = $(`input[data-cell-key="${firstCellKey}"]`, gridContainer);
    if (firstInput) firstInput.focus();
  });

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      let isAllCorrect = true;
      Object.keys(cellMap).forEach((key) => {
        const input = $(`input[data-cell-key="${key}"]`, gridContainer);
        if (!input) return;
        const isMatch = input.value.toUpperCase() === cellMap[key].char;
        input.classList.remove("is-valid", "is-invalid");
        input.classList.add(isMatch ? "is-valid" : "is-invalid");
        if (!isMatch) isAllCorrect = false;
      });

      showFeedback(
        feedbackEl,
        isAllCorrect,
        isAllCorrect ? "Selamat! Semua kata dalam Teka-Teki Silang terpecahkan sempurna! 🎉" : "Masih ada kotak yang keliru atau belum terisi."
      );

      if (isAllCorrect) {
        AppState.complete("cw", 15);
      }
    });
  }

  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      const cells = getWordCells(wordsWithClues[activeWordId]);
      const emptyCellKey = cells.find((k) => {
        const inp = $(`input[data-cell-key="${k}"]`, gridContainer);
        return inp && inp.value.toUpperCase() !== cellMap[k].char;
      });

      if (emptyCellKey) {
        const inp = $(`input[data-cell-key="${emptyCellKey}"]`, gridContainer);
        if (inp) {
          inp.value = cellMap[emptyCellKey].char;
          inp.classList.add("is-valid");
        }
      }
    });
  }
}

// #32 Roda Acak Planet
function initWheel() {
  const canvas = $("#canvas-wheel");
  const spinBtn = $("#wheel-spin-btn");
  const questionBox = $("#wheel-question-box");
  if (!canvas || !spinBtn) return;

  const ctx = canvas.getContext("2d");
  const SEGMENT_ANGLE = (Math.PI * 2) / PLANETS_DATA.length;
  let currentRotation = 0;
  let isSpinning = false;
  let selectedPlanetIdx = -1;

  // HiDPI Canvas setup
  const dpr = window.devicePixelRatio || 1;
  const size = 280;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  function drawWheel() {
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(currentRotation);

    PLANETS_DATA.forEach((planet, idx) => {
      const startAngle = idx * SEGMENT_ANGLE;
      const endAngle = (idx + 1) * SEGMENT_ANGLE;

      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Teks Nama Planet
      ctx.save();
      ctx.rotate((idx + 0.5) * SEGMENT_ANGLE);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.fillText(planet.name, radius - 15, 5);
      ctx.restore();
    });

    ctx.restore();

    // Jarum Penunjuk di bagian atas
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center, 22);
    ctx.lineTo(center - 10, 2);
    ctx.lineTo(center + 10, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  drawWheel();

  function showWheelQuestion() {
    const planet = PLANETS_DATA[selectedPlanetIdx];
    questionBox.innerHTML = `
      <p class="text-bold" style="font-size:1.1rem;">🎯 Jarum Berhenti di: ${planet.name}!</p>
      <p>Benar atau Salah: Suhu rata-rata di <b>${planet.name}</b> berada <b>di atas 0 °C</b>?</p>
      <div style="margin:8px 0;">
        <button class="wheel-ans-btn" data-val="1">✅ Benar (> 0 °C)</button>
        <button class="wheel-ans-btn" data-val="0">❌ Salah (≤ 0 °C)</button>
      </div>
      <div id="wheel-feedback" class="feedback"></div>
    `;

    questionBox.onclick = (e) => {
      const btn = e.target.closest(".wheel-ans-btn");
      if (!btn) return;
      const userChoice = btn.dataset.val === "1";
      const isAboveZero = planet.avgTemp > 0;
      const isCorrect = userChoice === isAboveZero;

      const fb = $("#wheel-feedback", questionBox);
      showFeedback(
        fb,
        isCorrect,
        `${isCorrect ? "Tepat sekali! " : "Kurang tepat. "}Suhu rata-rata di ${planet.name} adalah sekitar ${planet.avgTemp} °C. (${planet.fact})`
      );

      AppState.complete("wheel", 10);
    };
  }

  spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    questionBox.innerHTML = "";
    SoundFX.playClick();

    const startTime = performance.now();
    const initialAngle = currentRotation;
    const additionalSpins = (5 + Math.random() * 3) * (Math.PI * 2);
    const duration = 3000;

    function animate(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      // Easing cubic out
      const ease = 1 - Math.pow(1 - progress, 3);
      currentRotation = initialAngle + additionalSpins * ease;
      drawWheel();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        // Hitung sudut di posisi jarum atas (-PI/2)
        const normalized = ((-Math.PI / 2 - currentRotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        selectedPlanetIdx = Math.floor(normalized / SEGMENT_ANGLE);
        showWheelQuestion();
      }
    }
    requestAnimationFrame(animate);
  });
}

// #33 Whack-a-Mole
function initWhackMole() {
  const startBtn = $("#mole-start-btn");
  const promptEl = $("#mole-prompt");
  const grid = $("#mole-grid");
  if (!startBtn || !grid) return;

  let isActive = false;
  let score = 0;
  let remainingSeconds = 0;
  let timerInterval = null;
  let currentQuestionIdx = 0;

  grid.innerHTML = Array.from({ length: 9 }, (_, i) => `
    <button class="mole-hole" data-hole="${i}" aria-label="Lubang ${i + 1}"></button>
  `).join("");

  function updateHUD() {
    if (promptEl) {
      const q = WHACK_MOLE_DATA[currentQuestionIdx];
      promptEl.innerHTML = `❓ <b>${q.q}</b> · ⏱ ${remainingSeconds} dtk · Skor: ${score}`;
    }
  }

  function clearHoles() {
    $$(".mole-hole", grid).forEach((h) => {
      h.textContent = "";
      h.classList.remove("is-active");
    });
  }

  function tick() {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isActive = false;
      clearHoles();
      if (promptEl) promptEl.textContent = `Selesai! Skor Akhir: ${score}`;
      if (score > 0) {
        AppState.complete("mole", 10);
      }
      return;
    }

    const q = WHACK_MOLE_DATA[currentQuestionIdx];
    // Pilih 3 lubang acak
    const randomHoles = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [q.correct, ...q.wrongs.slice().sort(() => Math.random() - 0.5).slice(0, 2)];

    $$(".mole-hole", grid).forEach((hole, idx) => {
      const optIdx = randomHoles.indexOf(idx);
      if (optIdx >= 0) {
        hole.textContent = options[optIdx];
        hole.classList.add("is-active");
      } else {
        hole.textContent = "";
        hole.classList.remove("is-active");
      }
    });

    updateHUD();
  }

  startBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    score = 0;
    remainingSeconds = 25;
    isActive = true;
    currentQuestionIdx = 0;
    tick();
    timerInterval = setInterval(tick, 900);
  });

  grid.addEventListener("click", (e) => {
    const hole = e.target.closest(".mole-hole");
    if (!hole || !isActive || !hole.textContent) return;

    const q = WHACK_MOLE_DATA[currentQuestionIdx];
    if (hole.textContent === q.correct) {
      score++;
      SoundFX.playSuccess();
      currentQuestionIdx = (currentQuestionIdx + 1) % WHACK_MOLE_DATA.length;
      clearHoles();
    } else {
      score = Math.max(0, score - 1);
      SoundFX.playError();
      hole.textContent = "";
      hole.classList.remove("is-active");
    }
    updateHUD();
  });
}

// #34 Seret Kata ke Kalimat (Cloze Test)
function initSentenceDrag() {
  const textBox = $("#drag-text-box");
  const wordBank = $("#drag-word-bank");
  const checkBtn = $("#drag-check-btn");
  const feedbackEl = $("#drag-feedback");
  if (!textBox || !wordBank || !checkBtn) return;

  // Nonaktifkan scroll bawaan saat drag di layar sentuh
  wordBank.style.touchAction = "none";

  let filledWords = [null, null, null, null];
  let selectedWord = null;

  function render() {
    textBox.innerHTML = CLOZE_PARAGRAPH_DATA.template.map((part) => {
      if (typeof part === "number") {
        const word = filledWords[part];
        return `<button class="blank-slot ${word ? "is-filled" : ""}" data-slot="${part}">${word || "______"}</button>`;
      }
      return part;
    }).join("");

    const remainingWords = CLOZE_PARAGRAPH_DATA.wordBank.filter((w) => !filledWords.includes(w));
    wordBank.innerHTML = remainingWords.map((w) => `
      <button class="word-pill ${w === selectedWord ? "is-selected" : ""}" data-word="${w}">${w}</button>
    `).join("");
  }

  function placeWord(slotIdx, word) {
    filledWords[slotIdx] = word;
    selectedWord = null;
    SoundFX.playClick();
    render();
  }

  // Fallback tap-tap: ketuk kata, lalu ketuk slot
  wordBank.addEventListener("click", (e) => {
    const pill = e.target.closest(".word-pill");
    if (!pill) return;
    SoundFX.playClick();
    const w = pill.dataset.word;
    selectedWord = selectedWord === w ? null : w;
    render();
  });

  textBox.addEventListener("click", (e) => {
    const slot = e.target.closest(".blank-slot");
    if (!slot) return;
    const slotIdx = parseInt(slot.dataset.slot, 10);

    if (selectedWord) {
      placeWord(slotIdx, selectedWord);
    } else if (filledWords[slotIdx]) {
      filledWords[slotIdx] = null;
      SoundFX.playClick();
      render();
    }
  });

  // Pointer Events drag: seret kata dari bank ke slot (desktop + layar sentuh)
  makeDraggable({
    container: wordBank,
    itemSelector: ".word-pill",
    dropZone: textBox,
    dropSelector: ".blank-slot",
    dropOverClass: "drag-over",
    onDrop(dragEl, dropEl) {
      const word = dragEl.dataset.word;
      const slotIdx = parseInt(dropEl.dataset.slot, 10);
      if (word && !isNaN(slotIdx)) {
        placeWord(slotIdx, word);
      }
    }
  });

  checkBtn.addEventListener("click", () => {
    const isAllCorrect = filledWords.every(
      (w, idx) => w === CLOZE_PARAGRAPH_DATA.correctAnswers[idx]
    );

    showFeedback(
      feedbackEl,
      isAllCorrect,
      isAllCorrect ? "Paragraf lengkap dan tepat sempurna! 🎉" : "Masih ada isian yang belum sesuai. Ketuk kata di isian untuk memperbaikinya."
    );

    if (isAllCorrect) {
      AppState.complete("dw", 10);
    }
  });

  render();
}

// #35 Hotspot Image Pin (hotspotimg)
function initHotspotImgPin() {
  const missionNav = $("#hotspot-pin-nav");
  const promptEl = $("#hotspot-pin-prompt");
  const wrapper = $("#hotspot-img-canvas-wrap");
  const svgContainer = $("#hotspot-img-svg-container");
  const pin = $("#hotspot-pin-elem");
  const targetZone = $("#hotspot-target-zone-elem");
  const checkBtn = $("#hotspot-pin-check");
  const hintBtn = $("#hotspot-pin-hint");
  const feedbackEl = $("#hotspot-pin-feedback");

  if (!wrapper || !missionNav) return;

  let currentMissionIdx = 0;
  let userPinX = null;
  let userPinY = null;

  const SVG_TEMPLATES = {
    jupiter: `
      <svg class="hotspot-img-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi Planet Jupiter">
        <defs>
          <radialGradient id="jup-glow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fff2cc" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.8"/>
          </radialGradient>
          <clipPath id="jup-clip">
            <circle cx="200" cy="150" r="115" />
          </clipPath>
        </defs>
        <circle cx="50" cy="40" r="1.5" fill="#fff" opacity="0.6"/>
        <circle cx="360" cy="70" r="1" fill="#fff" opacity="0.5"/>
        <circle cx="330" cy="250" r="1.5" fill="#fff" opacity="0.4"/>
        <circle cx="70" cy="260" r="1" fill="#fff" opacity="0.7"/>

        <g clip-path="url(#jup-clip)">
          <rect x="80" y="30" width="240" height="240" fill="#d97706" />
          <rect x="80" y="45" width="240" height="18" fill="#fde68a" />
          <rect x="80" y="63" width="240" height="24" fill="#b45309" />
          <rect x="80" y="87" width="240" height="15" fill="#fef3c7" />
          <rect x="80" y="102" width="240" height="30" fill="#92400e" />
          <rect x="80" y="132" width="240" height="18" fill="#fef08a" />
          <rect x="80" y="150" width="240" height="28" fill="#78350f" />
          <rect x="80" y="178" width="240" height="22" fill="#fed7aa" />
          <rect x="80" y="200" width="240" height="32" fill="#9a3412" />
          <rect x="80" y="232" width="240" height="25" fill="#fef3c7" />

          <ellipse cx="140" cy="115" rx="35" ry="6" fill="#fef9c3" opacity="0.5"/>
          <ellipse cx="280" cy="165" rx="45" ry="7" fill="#fef3c7" opacity="0.4"/>
          <ellipse cx="150" cy="215" rx="40" ry="8" fill="#fef08a" opacity="0.5"/>

          <!-- BINTIK MERAH BESAR (Target: cx=256 cy=198 -> 64%, 66%) -->
          <ellipse cx="256" cy="198" rx="26" ry="17" fill="#dc2626" />
          <ellipse cx="256" cy="198" rx="20" ry="12" fill="#b91c1c" />
          <ellipse cx="258" cy="197" rx="12" ry="7" fill="#ef4444" />
          <ellipse cx="252" cy="195" rx="5" ry="3" fill="#fca5a5" opacity="0.8"/>

          <circle cx="200" cy="150" r="115" fill="url(#jup-glow)" />
        </g>
        <circle cx="200" cy="150" r="115" fill="none" stroke="#fef08a" stroke-width="1.5" stroke-opacity="0.3"/>
      </svg>
    `,
    mars: `
      <svg class="hotspot-img-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi Planet Mars">
        <defs>
          <radialGradient id="mars-glow" cx="38%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#fca5a5" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
          </radialGradient>
          <clipPath id="mars-clip">
            <circle cx="200" cy="150" r="110" />
          </clipPath>
        </defs>
        <circle cx="60" cy="50" r="1" fill="#fff" opacity="0.6"/>
        <circle cx="340" cy="90" r="1.5" fill="#fff" opacity="0.4"/>
        <circle cx="350" cy="240" r="1" fill="#fff" opacity="0.7"/>

        <g clip-path="url(#mars-clip)">
          <rect x="80" y="30" width="240" height="240" fill="#ea580c" />
          <path d="M120 130 Q160 110 210 140 T290 170 Q240 220 170 200 Z" fill="#9a3412" opacity="0.8"/>
          <path d="M140 160 Q200 150 260 175 Q210 195 150 185 Z" fill="#7c2d12" opacity="0.9"/>
          <circle cx="145" cy="135" r="16" fill="#c2410c" stroke="#7c2d12" stroke-width="2"/>
          <circle cx="145" cy="135" r="5" fill="#7c2d12"/>

          <!-- TUDUNG ES KUTUB (Target: cx=200 cy=46 -> 50%, 15%) -->
          <ellipse cx="200" cy="46" rx="36" ry="15" fill="#ffffff" />
          <ellipse cx="200" cy="48" rx="26" ry="9" fill="#e0f2fe" />
          <ellipse cx="196" cy="45" rx="14" ry="5" fill="#ffffff" />

          <circle cx="200" cy="150" r="110" fill="url(#mars-glow)" />
        </g>
        <circle cx="200" cy="150" r="110" fill="none" stroke="#fed7aa" stroke-width="1.5" stroke-opacity="0.25"/>
      </svg>
    `,
    saturn: `
      <svg class="hotspot-img-svg" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustrasi Planet Saturnus">
        <defs>
          <radialGradient id="sat-glow" cx="40%" cy="38%" r="62%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.8"/>
          </radialGradient>
          <clipPath id="sat-planet-clip">
            <circle cx="200" cy="150" r="68" />
          </clipPath>
        </defs>
        <circle cx="40" cy="80" r="1.5" fill="#fff" opacity="0.5"/>
        <circle cx="360" cy="40" r="1" fill="#fff" opacity="0.7"/>

        <!-- Cincin Belakang -->
        <g transform="rotate(-15 200 150)">
          <ellipse cx="200" cy="150" rx="175" ry="46" fill="none" stroke="#eab308" stroke-width="24" stroke-opacity="0.55"/>
          <ellipse cx="200" cy="150" rx="188" ry="50" fill="none" stroke="#ca8a04" stroke-width="6" stroke-opacity="0.6"/>
          <ellipse cx="200" cy="150" rx="162" ry="43" fill="none" stroke="#060914" stroke-width="3"/>
          <ellipse cx="200" cy="150" rx="140" ry="37" fill="none" stroke="#fef08a" stroke-width="16" stroke-opacity="0.7"/>
        </g>

        <!-- Tubuh Saturnus -->
        <g clip-path="url(#sat-planet-clip)">
          <rect x="120" y="70" width="160" height="160" fill="#eab308" />
          <rect x="120" y="95" width="160" height="15" fill="#fde047" />
          <rect x="120" y="110" width="160" height="22" fill="#ca8a04" />
          <rect x="120" y="132" width="160" height="16" fill="#fef08a" />
          <rect x="120" y="148" width="160" height="25" fill="#a16207" />
          <rect x="120" y="173" width="160" height="18" fill="#fef9c3" />
          <circle cx="200" cy="150" r="68" fill="url(#sat-glow)" />
        </g>

        <!-- Cincin Depan -->
        <g transform="rotate(-15 200 150)" clip-path="polygon(0 150, 400 150, 400 300, 0 300)">
          <ellipse cx="200" cy="150" rx="175" ry="46" fill="none" stroke="#eab308" stroke-width="24" stroke-opacity="0.85"/>
          <ellipse cx="200" cy="150" rx="188" ry="50" fill="none" stroke="#ca8a04" stroke-width="6" stroke-opacity="0.8"/>
          <ellipse cx="200" cy="150" rx="162" ry="43" fill="none" stroke="#060914" stroke-width="3"/>
          <ellipse cx="200" cy="150" rx="140" ry="37" fill="none" stroke="#fef08a" stroke-width="16" stroke-opacity="0.95"/>
        </g>
      </svg>
    `
  };

  function loadMission(idx) {
    currentMissionIdx = idx;
    userPinX = null;
    userPinY = null;

    $$(".btn-hotspot-mission", missionNav).forEach((btn, i) => {
      btn.classList.toggle("active", i === idx);
    });

    const mission = HOTSPOT_PIN_DATA[idx];
    promptEl.innerHTML = `🎯 <b>Misi ${idx + 1}: ${mission.planet}</b> — ${mission.question}`;
    svgContainer.innerHTML = SVG_TEMPLATES[mission.svgType] || "";

    pin.classList.remove("is-active", "is-correct");
    targetZone.classList.remove("is-revealed");
    feedbackEl.style.display = "none";
    feedbackEl.textContent = "";

    targetZone.style.left = `${mission.targetX}%`;
    targetZone.style.top = `${mission.targetY}%`;
    targetZone.style.width = `${mission.radius * 2}%`;
    targetZone.style.height = `${mission.radius * 2 * (4 / 3)}%`;
  }

  missionNav.innerHTML = HOTSPOT_PIN_DATA.map((m, i) => `
    <button class="btn-hotspot-mission ${i === 0 ? "active" : ""}" data-mission="${i}">
      ${m.planet}: ${m.targetName}
    </button>
  `).join("");

  missionNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-hotspot-mission");
    if (!btn) return;
    SoundFX.playClick();
    loadMission(parseInt(btn.dataset.mission, 10));
  });

  function placePin(e) {
    const rect = wrapper.getBoundingClientRect();
    const clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0].clientX);
    const clientY = e.clientY != null ? e.clientY : (e.touches && e.touches[0].clientY);

    if (clientX == null || clientY == null) return;

    userPinX = Math.min(98, Math.max(2, ((clientX - rect.left) / rect.width) * 100));
    userPinY = Math.min(98, Math.max(2, ((clientY - rect.top) / rect.height) * 100));

    pin.style.left = `${userPinX}%`;
    pin.style.top = `${userPinY}%`;
    pin.classList.add("is-active");
    pin.classList.remove("is-correct");

    SoundFX.playClick();
  }

  wrapper.addEventListener("pointerdown", (e) => {
    placePin(e);
  });

  checkBtn.addEventListener("click", () => {
    if (userPinX === null || userPinY === null) {
      showFeedback(feedbackEl, false, "Ketuk pada gambar planet terlebih dahulu untuk menancapkan pin.");
      return;
    }

    const mission = HOTSPOT_PIN_DATA[currentMissionIdx];
    const distPrimary = Math.hypot(userPinX - mission.targetX, (userPinY - mission.targetY) * 0.75);
    let isCorrect = distPrimary <= mission.radius;

    if (!isCorrect && mission.altTarget) {
      const distAlt = Math.hypot(userPinX - mission.altTarget.targetX, (userPinY - mission.altTarget.targetY) * 0.75);
      if (distAlt <= mission.altTarget.radius) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      pin.classList.add("is-correct");
      targetZone.classList.add("is-revealed");
      showFeedback(feedbackEl, true, mission.explanation);
      AppState.complete("hotpin", 10);
    } else {
      let directionClue = "";
      if (userPinY < mission.targetY - 10) directionClue = "Pin berada terlalu ke atas (utara). ";
      else if (userPinY > mission.targetY + 10) directionClue = "Pin berada terlalu ke bawah (selatan). ";
      else if (userPinX < mission.targetX - 10) directionClue = "Pin berada terlalu ke kiri (barat). ";
      else if (userPinX > mission.targetX + 10) directionClue = "Pin berada terlalu ke kanan (timur). ";

      showFeedback(feedbackEl, false, `Kurang tepat. ${directionClue}${mission.hint}`);
    }
  });

  hintBtn.addEventListener("click", () => {
    const mission = HOTSPOT_PIN_DATA[currentMissionIdx];
    showFeedback(feedbackEl, true, `💡 ${mission.hint}`);
    targetZone.classList.add("is-revealed");
    setTimeout(() => {
      if (!pin.classList.contains("is-correct")) {
        targetZone.classList.remove("is-revealed");
      }
    }, 2200);
  });

  loadMission(0);
}

// #36 Pairing Dua Kolom (pairing)
function initPairing() {
  const leftCol = $("#pairing-left-col");
  const rightCol = $("#pairing-right-col");
  const checkBtn = $("#pairing-check-btn");
  const resetBtn = $("#pairing-reset-btn");
  const feedbackEl = $("#pairing-feedback");

  if (!leftCol || !rightCol) return;

  // Nonaktifkan scroll bawaan saat drag di layar sentuh
  leftCol.style.touchAction = "none";

  let selectedLeftId = null;
  let matches = {};

  const shuffledRight = [...PAIRING_DATA].sort(() => Math.random() - 0.5);

  function render() {
    leftCol.innerHTML = PAIRING_DATA.map((item) => {
      const isSelected = selectedLeftId === item.id;
      const isMatched = !!matches[item.id];
      return `
        <div class="pair-card ${isSelected ? "selected" : ""} ${isMatched ? "matched" : ""}" 
             ${isMatched ? 'draggable="false"' : ''} 
             data-left-id="${item.id}" 
             tabindex="0" role="button">
          <span>${item.left}</span>
          ${isMatched ? '<span class="status-badge" style="font-size:0.7rem;">✓ Terpasang</span>' : ''}
        </div>
      `;
    }).join("");

    rightCol.innerHTML = shuffledRight.map((item) => {
      const pairedLeftId = Object.keys(matches).find((k) => matches[k] === item.id);
      const isMatched = !!pairedLeftId;
      const pairedObj = pairedLeftId ? PAIRING_DATA.find((p) => p.id === pairedLeftId) : null;

      return `
        <div class="pair-card ${isMatched ? "matched" : ""}" 
             data-right-id="${item.id}" 
             tabindex="0" role="button">
          <div>
            ${pairedObj ? `<span class="tag-badge" style="margin-bottom:4px; display:inline-block;">${pairedObj.left}</span><br>` : ''}
            <span>${item.right}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Fallback tap-tap: ketuk kiri lalu ketuk kanan untuk pasangkan
  leftCol.addEventListener("click", (e) => {
    const card = e.target.closest(".pair-card");
    if (!card) return;
    const id = card.dataset.leftId;
    if (matches[id]) {
      delete matches[id];
      selectedLeftId = null;
      SoundFX.playClick();
      render();
      return;
    }
    selectedLeftId = selectedLeftId === id ? null : id;
    SoundFX.playClick();
    render();
  });

  rightCol.addEventListener("click", (e) => {
    const card = e.target.closest(".pair-card");
    if (!card) return;
    const rightId = card.dataset.rightId;

    if (selectedLeftId) {
      Object.keys(matches).forEach((k) => {
        if (matches[k] === rightId) delete matches[k];
      });
      matches[selectedLeftId] = rightId;
      selectedLeftId = null;
      SoundFX.playSuccess();
      render();
    }
  });

  // Pointer Events drag: seret kartu kiri ke kartu kanan (desktop + layar sentuh)
  makeDraggable({
    container: leftCol,
    itemSelector: ".pair-card",
    dropZone: rightCol,
    dropSelector: ".pair-card",
    dropOverClass: "drag-over",
    onDrop(dragEl, dropEl) {
      const leftId = dragEl.dataset.leftId;
      const rightId = dropEl.dataset.rightId;
      if (leftId && rightId) {
        Object.keys(matches).forEach((k) => {
          if (matches[k] === rightId) delete matches[k];
        });
        matches[leftId] = rightId;
        selectedLeftId = null;
        SoundFX.playSuccess();
        render();
      }
    }
  });

  checkBtn.addEventListener("click", () => {
    const totalPairs = PAIRING_DATA.length;
    const currentCount = Object.keys(matches).length;

    if (currentCount < totalPairs) {
      showFeedback(feedbackEl, false, `Pasangkan semua ${totalPairs} pasangan terlebih dahulu (${currentCount}/${totalPairs} terpasang).`);
      return;
    }

    const isAllCorrect = PAIRING_DATA.every((item) => matches[item.id] === item.id);
    showFeedback(
      feedbackEl,
      isAllCorrect,
      isAllCorrect ? "Luar biasa! Semua planet dan ciri khasnya cocok sempurna! 🎉" : "Masih ada pasangan yang belum tepat. Periksa kembali dan cocokkan ulang."
    );

    if (isAllCorrect) {
      AppState.complete("pair", 10);
    }
  });

  resetBtn.addEventListener("click", () => {
    matches = {};
    selectedLeftId = null;
    SoundFX.playClick();
    render();
    feedbackEl.style.display = "none";
  });

  render();
}

// #37 True/False Chain (truefalse_chain)
function initTrueFalseChain() {
  const startBtn = $("#tf-chain-start-btn");
  const playView = $("#tf-chain-play-view");
  const questionEl = $("#tf-chain-question");
  const timerBar = $("#tf-chain-timer-bar");
  const comboEl = $("#tf-chain-combo");
  const scoreEl = $("#tf-chain-score");
  const btnTrue = $("#tf-chain-btn-true");
  const btnFalse = $("#tf-chain-btn-false");
  const feedbackEl = $("#tf-chain-feedback");

  if (!startBtn || !playView) return;

  let currentIdx = 0;
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let timerInterval = null;
  const TIME_PER_Q = 7;
  let timeLeft = TIME_PER_Q;

  function renderQuestion() {
    if (currentIdx >= TF_CHAIN_DATA.length) {
      clearInterval(timerInterval);
      playView.hidden = true;
      startBtn.hidden = false;
      startBtn.textContent = "↺ Ulangi Tantangan Kilat";

      showFeedback(
        feedbackEl,
        score > 0,
        `Tantangan Selesai! Skor Akhir: ${score} · Combo Tertinggi: 🔥 ${maxCombo}x. ${score >= 40 ? "Refleks pengetahuanmu sangat tajam!" : "Bagus, terus asah ingatanmu!"}`
      );

      if (score >= 30) {
        AppState.complete("tfchain", 15);
      }
      return;
    }

    const item = TF_CHAIN_DATA[currentIdx];
    questionEl.innerHTML = `<span class="text-subtle">${currentIdx + 1}/${TF_CHAIN_DATA.length}</span><br><b>${item.q}</b>`;
    comboEl.innerHTML = combo > 1 ? `🔥 Combo ${combo}x!` : `⚡ Beruntun: ${combo}`;
    scoreEl.textContent = `Skor: ${score}`;

    timeLeft = TIME_PER_Q;
    timerBar.style.width = "100%";
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      const pct = Math.max(0, (timeLeft / TIME_PER_Q) * 100);
      timerBar.style.width = `${pct}%`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(null);
      }
    }, 100);
  }

  function handleAnswer(userChoice) {
    clearInterval(timerInterval);
    const item = TF_CHAIN_DATA[currentIdx];
    const isCorrect = userChoice === item.a;

    if (isCorrect) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      score += 10 * combo;
      SoundFX.playSuccess();
    } else {
      combo = 0;
      SoundFX.playError();
    }

    currentIdx++;
    renderQuestion();
  }

  startBtn.addEventListener("click", () => {
    currentIdx = 0;
    score = 0;
    combo = 0;
    maxCombo = 0;
    startBtn.hidden = true;
    playView.hidden = false;
    feedbackEl.style.display = "none";
    SoundFX.playClick();
    renderQuestion();
  });

  btnTrue.addEventListener("click", () => handleAnswer(true));
  btnFalse.addEventListener("click", () => handleAnswer(false));
}

// #38 Quiz Multi-Select (quiz_multi_select)
function initQuizMultiSelect() {
  const container = $("#multi-quiz-options");
  const counterEl = $("#multi-quiz-counter");
  const checkBtn = $("#multi-quiz-check-btn");
  const feedbackEl = $("#multi-quiz-feedback");

  if (!container || !checkBtn) return;

  let selectedIndices = new Set();

  function render() {
    container.innerHTML = QUIZ_MULTI_DATA.options.map((opt, idx) => {
      const isSelected = selectedIndices.has(idx);
      return `
        <label class="multi-quiz-option ${isSelected ? "selected" : ""}" data-index="${idx}">
          <input type="checkbox" ${isSelected ? "checked" : ""}>
          <span>${opt.text}</span>
        </label>
      `;
    }).join("");

    counterEl.textContent = `Dipilih: ${selectedIndices.size} / ${QUIZ_MULTI_DATA.requiredCount}`;
  }

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".multi-quiz-option");
    if (!card) return;
    const idx = parseInt(card.dataset.index, 10);

    if (selectedIndices.has(idx)) {
      selectedIndices.delete(idx);
    } else {
      selectedIndices.add(idx);
    }
    SoundFX.playClick();
    render();
  });

  checkBtn.addEventListener("click", () => {
    const correctIndices = QUIZ_MULTI_DATA.options
      .map((opt, i) => (opt.correct ? i : null))
      .filter((i) => i !== null);

    const isExactMatch =
      selectedIndices.size === correctIndices.length &&
      correctIndices.every((i) => selectedIndices.has(i));

    showFeedback(
      feedbackEl,
      isExactMatch,
      isExactMatch
        ? `Luar biasa, benar semua! 🎉 ${QUIZ_MULTI_DATA.explanation}`
        : `Belum tepat. Pastikan kamu memilih tepat ${QUIZ_MULTI_DATA.requiredCount} fakta yang benar.`
    );

    if (isExactMatch) {
      AppState.complete("quizmulti", 10);
    }
  });

  render();
}

// #39 Numeric Entry (numeric_entry)
function initNumericEntry() {
  const promptEl = $("#numeric-prompt");
  const inputEl = $("#numeric-input");
  const unitEl = $("#numeric-unit-text");
  const checkBtn = $("#numeric-check-btn");
  const progressEl = $("#numeric-progress");
  const feedbackEl = $("#numeric-feedback");

  if (!promptEl || !inputEl || !checkBtn) return;

  let currentIdx = 0;
  let correctCount = 0;

  function render(shouldFocus = false) {
    if (currentIdx >= NUMERIC_ENTRY_DATA.length) {
      promptEl.innerHTML = `<b>🎉 Selesai! Kamu menjawab benar ${correctCount}/${NUMERIC_ENTRY_DATA.length} pertanyaan angka presisi.</b>`;
      inputEl.style.display = "none";
      unitEl.style.display = "none";
      checkBtn.textContent = "↺ Ulangi Latihan Angka";
      checkBtn.onclick = () => {
        currentIdx = 0;
        correctCount = 0;
        inputEl.style.display = "";
        unitEl.style.display = "";
        checkBtn.textContent = "Periksa Angka";
        checkBtn.onclick = handleCheck;
        render(true);
      };
      if (correctCount >= 3) {
        AppState.complete("numentry", 10);
      }
      return;
    }

    const item = NUMERIC_ENTRY_DATA[currentIdx];
    progressEl.textContent = `Soal ${currentIdx + 1} dari ${NUMERIC_ENTRY_DATA.length}`;
    promptEl.innerHTML = item.q;
    unitEl.textContent = item.unit;
    inputEl.value = "";
    if (shouldFocus) {
      inputEl.focus({ preventScroll: true });
    }
    feedbackEl.style.display = "none";
  }

  function handleCheck() {
    const userVal = parseFloat(inputEl.value);
    if (isNaN(userVal)) {
      showFeedback(feedbackEl, false, "Ketikkan angka yang valid terlebih dahulu.");
      return;
    }

    const item = NUMERIC_ENTRY_DATA[currentIdx];
    const diff = Math.abs(userVal - item.answer);
    const isCorrect = diff <= item.tolerance;

    if (isCorrect) correctCount++;

    showFeedback(
      feedbackEl,
      isCorrect,
      isCorrect
        ? `Tepat sekali! Nilai yang benar adalah ${item.answer} ${item.unit}. (${item.hint})`
        : `Kurang tepat. Jawabannya adalah ${item.answer} ${item.unit}. (${item.hint})`
    );

    currentIdx++;
    setTimeout(() => render(true), 2200);
  }

  checkBtn.onclick = handleCheck;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCheck();
  });

  render(false);
}

// #40 Toggle Lapisan Bumi & Atmosfer 3D (layer_toggle)
function initLayerToggle() {
  const viewModesContainer = $("#layer-view-modes");
  const presetsBar = $("#layer-presets-bar");
  const controls = $("#layer-toggle-controls");
  const infoCard = $("#layer-info-card");
  const svgContainer = $("#earth-layers-svg-wrap");

  if (!controls || !svgContainer) return;

  const activeLayers = new Set(["atmosphere", "crust", "mantle", "outer_core", "inner_core"]);
  const inspectedLayers = new Set();
  let currentInspectedId = "crust";
  let currentView = "cutaway"; // "cutaway" | "exploded" | "depth"

  const PRESETS = [
    { id: "all", label: "🌐 Lengkap (Semua Nyala)", layers: ["atmosphere", "crust", "mantle", "outer_core", "inner_core"] },
    { id: "no_crust", label: "🌋 Kupas Kerak (Eksplor Magma)", layers: ["atmosphere", "mantle", "outer_core", "inner_core"] },
    { id: "core_dynamo", label: "🧲 Dinamo Inti Bumi", layers: ["outer_core", "inner_core"] },
    { id: "vacuum", label: "🌑 Hampa Udara (Tanpa Atmosfer)", layers: ["crust", "mantle", "outer_core", "inner_core"] }
  ];

  // Helper matematika potongan 3D isometrik
  const C = [170, 165];
  const cos12 = Math.cos(12 * Math.PI / 180);
  const sin12 = Math.sin(12 * Math.PI / 180);

  function makeUpperBand(r1, r2, cx = C[0], cy = C[1]) {
    const p1 = [cx, cy - r2];
    const p2 = [cx + r2 * cos12, cy + r2 * sin12];
    const p3 = [cx + r1 * cos12, cy + r1 * sin12];
    const p4 = [cx, cy - r1];
    if (r1 === 0) {
      return `M ${cx},${cy} L ${p1[0]},${p1[1]} A ${r2},${r2} 0 0,1 ${p2[0].toFixed(1)},${p2[1].toFixed(1)} Z`;
    }
    return `M ${p4[0].toFixed(1)},${p4[1].toFixed(1)} L ${p1[0].toFixed(1)},${p1[1].toFixed(1)} A ${r2},${r2} 0 0,1 ${p2[0].toFixed(1)},${p2[1].toFixed(1)} L ${p3[0].toFixed(1)},${p3[1].toFixed(1)} A ${r1},${r1} 0 0,0 ${p4[0].toFixed(1)},${p4[1].toFixed(1)} Z`;
  }

  function makeLowerBand(r1, r2, cx = C[0], cy = C[1]) {
    const p1 = [cx + r2 * cos12, cy + r2 * sin12];
    const p2 = [cx, cy + r2];
    const p3 = [cx, cy + r1];
    const p4 = [cx + r1 * cos12, cy + r1 * sin12];
    if (r1 === 0) {
      return `M ${cx},${cy} L ${p1[0].toFixed(1)},${p1[1].toFixed(1)} A ${r2},${r2} 0 0,1 ${p2[0]},${p2[1]} Z`;
    }
    return `M ${p4[0].toFixed(1)},${p4[1].toFixed(1)} L ${p1[0].toFixed(1)},${p1[1].toFixed(1)} A ${r2},${r2} 0 0,1 ${p2[0]},${p2[1]} L ${p3[0]},${p3[1]} A ${r1},${r1} 0 0,0 ${p4[0].toFixed(1)},${p4[1].toFixed(1)} Z`;
  }

  function renderViewModes() {
    if (!viewModesContainer) return;
    viewModesContainer.innerHTML = `
      <button class="btn-layer-view ${currentView === "cutaway" ? "active" : ""}" data-view="cutaway">🌐 3D Potongan Melintang</button>
      <button class="btn-layer-view ${currentView === "exploded" ? "active" : ""}" data-view="exploded">🚀 3D Lapisan Terurai</button>
      <button class="btn-layer-view ${currentView === "depth" ? "active" : ""}" data-view="depth">📏 Skala Kedalaman</button>
    `;
  }

  function renderPresets() {
    if (!presetsBar) return;
    presetsBar.innerHTML = PRESETS.map((p) => `
      <button class="btn-layer-preset" data-preset="${p.id}">${p.label}</button>
    `).join("");
  }

  function renderSVG() {
    const isAtm = activeLayers.has("atmosphere");
    const isCrust = activeLayers.has("crust");
    const isMantle = activeLayers.has("mantle");
    const isOuter = activeLayers.has("outer_core");
    const isInner = activeLayers.has("inner_core");

    if (currentView === "cutaway") {
      renderCutawayView(isAtm, isCrust, isMantle, isOuter, isInner);
    } else if (currentView === "exploded") {
      renderExplodedView(isAtm, isCrust, isMantle, isOuter, isInner);
    } else {
      renderDepthView(isAtm, isCrust, isMantle, isOuter, isInner);
    }

    // Pasang listener klik pada lapisan langsung di SVG
    svgContainer.querySelectorAll("[data-layer-id]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.dataset.layerId;
        if (!id) return;
        SoundFX.playClick();
        showLayerInfo(id);
      });
    });
  }

  // View 1: 3D Potongan Melintang (Wide-Open Hemisphere Cutaway)
  function renderCutawayView(isAtm, isCrust, isMantle, isOuter, isInner) {
    const seamX = (170 + 115 * cos12).toFixed(1);
    const seamY = (165 + 115 * sin12).toFixed(1);

    svgContainer.innerHTML = `
      <svg viewBox="0 0 420 340" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visualisasi 3D Potongan Melintang Lapisan Interior Bumi">
        <defs>
          <!-- Shading 3D Permukaan Bola -->
          <radialGradient id="globe-3d-shading" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="50%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </radialGradient>

          <!-- Gradien Atmosfer Luar -->
          <radialGradient id="atm-halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.5"/>
            <stop offset="85%" stop-color="#0284c7" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
          </radialGradient>

          <!-- Gradien Potongan Mantel Atas (Tergelumun Cahaya) & Bawah (Bayangan Isometrik) -->
          <linearGradient id="mantle-up-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb923c"/>
            <stop offset="100%" stop-color="#ea580c"/>
          </linearGradient>
          <linearGradient id="mantle-dn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c2410c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </linearGradient>

          <!-- Gradien Bola Magma Terbuka Ketika Kerak Dimatikan -->
          <radialGradient id="magma-globe-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fdba74"/>
            <stop offset="40%" stop-color="#ea580c"/>
            <stop offset="80%" stop-color="#9a3412"/>
            <stop offset="100%" stop-color="#431407"/>
          </radialGradient>

          <!-- Gradien Potongan Inti Luar Besi-Nikel Cair -->
          <linearGradient id="outer-up-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#f59e0b"/>
          </linearGradient>
          <linearGradient id="outer-dn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>

          <!-- Gradien Bola Inti Dalam Padat Superpanas -->
          <radialGradient id="inner-core-sphere-grad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#fef08a"/>
            <stop offset="85%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#a16207"/>
          </radialGradient>

          <!-- Clip Path Belahan Kiri Bola Bumi -->
          <clipPath id="left-hemisphere-clip">
            <path d="M 170,50 A 115,115 0 0,0 170,280 Z"/>
          </clipPath>
          <clipPath id="left-mantle-clip">
            <path d="M 170,58 A 107,107 0 0,0 170,272 Z"/>
          </clipPath>
        </defs>

        <!-- Bintang-bintang Latar Belakang -->
        <circle cx="35" cy="45" r="1.2" fill="#fff" opacity="0.6"/>
        <circle cx="25" cy="180" r="1" fill="#fff" opacity="0.4"/>
        <circle cx="45" cy="300" r="1.5" fill="#fff" opacity="0.5"/>
        <circle cx="395" cy="40" r="1.2" fill="#fff" opacity="0.6"/>
        <circle cx="405" cy="305" r="1" fill="#fff" opacity="0.5"/>

        <!-- ==============================================
             1. LAPISAN ATMOSFER (Halo Biru & Aurora)
             ============================================== -->
        <g class="layer-3d-group ${isAtm ? "" : "is-hidden"} ${currentInspectedId === "atmosphere" ? "is-inspected" : ""}" data-layer-id="atmosphere">
          <!-- Halo Gas Biru -->
          <circle cx="170" cy="165" r="142" fill="url(#atm-halo-grad)"/>
          <circle cx="170" cy="165" r="120" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.6"/>
          <!-- Aurora Borealis di Kutub Utara -->
          <path d="M 150,48 Q 170,38 190,48" fill="none" stroke="#4ade80" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>
        </g>

        <!-- ==============================================
             2. LAPISAN MANTEL BUMI (Bola Magma & Irisan Lebar)
             ============================================== -->
        <g class="layer-3d-group ${isMantle ? "" : "is-hidden"} ${currentInspectedId === "mantle" ? "is-inspected" : ""}" data-layer-id="mantle">
          <!-- Permukaan Magma Belahan Kiri (Terbuka saat Kerak dimatikan) -->
          <path d="M 170,58 A 107,107 0 0,0 170,272 Z" fill="url(#magma-globe-grad)"/>
          <g clip-path="url(#left-mantle-clip)" opacity="0.7">
            <!-- Arus Konveksi Magma Bergerak di Permukaan -->
            <path d="M 115,110 Q 140,150 110,210" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="4 3"/>
            <path d="M 145,95 Q 160,160 135,235" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="4 3"/>
          </g>

          <!-- Irisan Tebal Terbuka Sisi Atas (Lebar 43px) -->
          <path d="${makeUpperBand(64, 107)}" fill="url(#mantle-up-grad)" stroke="#ea580c" stroke-width="0.8"/>
          <!-- Irisan Tebal Terbuka Sisi Bawah (Lebar 43px) -->
          <path d="${makeLowerBand(64, 107)}" fill="url(#mantle-dn-grad)" stroke="#c2410c" stroke-width="0.8"/>
          
          <!-- Arus Konveksi Panas Magma di Dalam Irisan -->
          <path d="M 195,115 Q 220,135 210,165" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="3 2" opacity="0.85"/>
          <path d="M 235,178 Q 248,210 220,230" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="3 2" opacity="0.85"/>
        </g>

        <!-- ==============================================
             3. LAPISAN INTI LUAR (Outer Core Logam Cair)
             ============================================== -->
        <g class="layer-3d-group ${isOuter ? "" : "is-hidden"} ${currentInspectedId === "outer_core" ? "is-inspected" : ""}" data-layer-id="outer_core">
          <!-- Irisan Terbuka Sisi Atas (Lebar 32px) -->
          <path d="${makeUpperBand(32, 64)}" fill="url(#outer-up-grad)" stroke="#f59e0b" stroke-width="0.8"/>
          <!-- Irisan Terbuka Sisi Bawah (Lebar 32px) -->
          <path d="${makeLowerBand(32, 64)}" fill="url(#outer-dn-grad)" stroke="#d97706" stroke-width="0.8"/>
          
          <!-- Riak Arus Logam Besi-Nikel Cair Dinamo Geomagnetik -->
          <ellipse cx="202" cy="162" rx="15" ry="7" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.6"/>
          <ellipse cx="206" cy="188" rx="14" ry="6" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.5"/>
        </g>

        <!-- ==============================================
             4. LAPISAN INTI DALAM (Inner Core Padat)
             ============================================== -->
        <g class="layer-3d-group ${isInner ? "" : "is-hidden"} ${currentInspectedId === "inner_core" ? "is-inspected" : ""}" data-layer-id="inner_core">
          <!-- Potongan Irisan Inti Atas & Bawah -->
          <path d="${makeUpperBand(0, 32)}" fill="#fef08a"/>
          <path d="${makeLowerBand(0, 32)}" fill="#fde047"/>
          <!-- Bola Inti Dalam Pusat (Radius 32px) -->
          <circle cx="170" cy="165" r="32" fill="url(#inner-core-sphere-grad)" stroke="#fef08a" stroke-width="1.5"/>
          <!-- Pantulan Kristal Logam Superpadat -->
          <ellipse cx="160" cy="155" rx="8" ry="4" fill="#ffffff" opacity="0.85"/>
          <text x="170" y="169" text-anchor="middle" font-size="9" font-weight="900" fill="#78350f" letter-spacing="1">INTI</text>
        </g>

        <!-- ==============================================
             5. LAPISAN KERAK BUMI (Daratan, Samudra, & Tebing Batuan)
             ============================================== -->
        <g class="layer-3d-group ${isCrust ? "" : "is-hidden"} ${currentInspectedId === "crust" ? "is-inspected" : ""}" data-layer-id="crust">
          <!-- Samudra Biru Belahan Kiri -->
          <path d="M 170,50 A 115,115 0 0,0 170,280 Z" fill="#1e40af"/>

          <!-- Benua-benua Hijau & Pegunungan -->
          <g clip-path="url(#left-hemisphere-clip)">
            <!-- Afrika & Eurasia Barat -->
            <path d="M 135,90 Q 168,78 168,125 Q 155,165 135,188 Q 110,140 135,90 Z" fill="#15803d"/>
            <path d="M 125,75 Q 155,62 168,82 Q 150,98 125,75 Z" fill="#16a34a"/>
            <path d="M 140,115 Q 165,120 152,155 Q 130,160 140,115 Z" fill="#a16207" opacity="0.65"/>
            <!-- Amerika (Sisi Barat) -->
            <path d="M 85,130 Q 115,118 118,160 Q 95,215 78,185 Z" fill="#15803d"/>
            <!-- Es Antartika di Kutub Selatan -->
            <path d="M 120,268 Q 170,252 170,280 L 120,280 Z" fill="#ffffff"/>
            <!-- Awan Putih Siklon Atmosfer -->
            <path d="M 90,110 Q 120,95 140,115 Q 110,128 90,110 Z" fill="#ffffff" opacity="0.55"/>
            <path d="M 105,200 Q 145,185 168,210 Q 125,225 105,200 Z" fill="#ffffff" opacity="0.5"/>
          </g>

          <!-- Bayangan 3D Bola Bumi -->
          <path d="M 170,50 A 115,115 0 0,0 170,280 Z" fill="url(#globe-3d-shading)"/>

          <!-- Bibir Tebal Kerak Batuan Padat di Tepi Irisan Terbuka (Tebal 8px) -->
          <path d="${makeUpperBand(107, 115)}" fill="#78716c" stroke="#44403c" stroke-width="0.8"/>
          <path d="${makeLowerBand(107, 115)}" fill="#57534e" stroke="#292524" stroke-width="0.8"/>
        </g>

        <!-- Garis Sambungan Lipatan Isometrik Antara Bidang Atas & Bawah -->
        <line x1="170" y1="165" x2="${seamX}" y2="${seamY}" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.85" pointer-events="none"/>

        <!-- ==============================================
             LABEL & GARIS PENUNJUK INTERAKTIF (Sisi Kanan)
             ============================================== -->
        <!-- Label Kerak -->
        <g class="layer-label-tag" data-layer-id="crust">
          <polyline points="280,75 305,65 390,65" fill="none" stroke="#78716c" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="305" y="52" width="95" height="22" rx="11" fill="#1e293b" stroke="#78716c" stroke-width="1.2"/>
          <circle cx="318" cy="63" r="4.5" fill="#78716c"/>
          <text x="328" y="67" font-size="10.5" font-weight="700" fill="#f1f5f9">Kerak (0-70 km)</text>
        </g>

        <!-- Label Mantel -->
        <g class="layer-label-tag" data-layer-id="mantle">
          <polyline points="265,130 295,115 390,115" fill="none" stroke="#ea580c" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="295" y="102" width="105" height="22" rx="11" fill="#1e293b" stroke="#ea580c" stroke-width="1.2"/>
          <circle cx="308" cy="113" r="4.5" fill="#ea580c"/>
          <text x="318" y="117" font-size="10.5" font-weight="700" fill="#f1f5f9">Mantel (2.900 km)</text>
        </g>

        <!-- Label Inti Luar -->
        <g class="layer-label-tag" data-layer-id="outer_core">
          <polyline points="228,175 285,175 390,175" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="285" y="162" width="115" height="22" rx="11" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2"/>
          <circle cx="298" cy="173" r="4.5" fill="#f59e0b"/>
          <text x="308" y="177" font-size="10.5" font-weight="700" fill="#f1f5f9">Inti Luar (2.200 km)</text>
        </g>

        <!-- Label Inti Dalam -->
        <g class="layer-label-tag" data-layer-id="inner_core">
          <polyline points="190,185 275,230 390,230" fill="none" stroke="#fef08a" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="275" y="217" width="125" height="22" rx="11" fill="#1e293b" stroke="#fef08a" stroke-width="1.2"/>
          <circle cx="288" cy="228" r="4.5" fill="#fef08a"/>
          <text x="298" y="232" font-size="10.5" font-weight="700" fill="#f1f5f9">Inti Dalam (1.220 km)</text>
        </g>

        <!-- Label Atmosfer -->
        <g class="layer-label-tag" data-layer-id="atmosphere">
          <polyline points="85,55 50,28 12,28" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="2 2"/>
          <rect x="12" y="16" width="105" height="22" rx="11" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
          <circle cx="24" cy="27" r="4.5" fill="#38bdf8"/>
          <text x="34" y="31" font-size="10.5" font-weight="700" fill="#38bdf8">Atmosfer (Gas)</text>
        </g>
      </svg>
    `;
  }

  // View 2: 3D Lapisan Terurai (Exploded View)
  function renderExplodedView(isAtm, isCrust, isMantle, isOuter, isInner) {
    svgContainer.innerHTML = `
      <svg viewBox="0 0 420 340" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visualisasi 3D Lapisan Bumi Terurai">
        <!-- Garis Pandu Ledakan / Poros Proyeksi Isometrik -->
        <line x1="60" y1="280" x2="360" y2="60" stroke="#475569" stroke-width="1" stroke-dasharray="4 4"/>

        <!-- 1. Atmosfer Shell -->
        <g class="layer-3d-group ${isAtm ? "" : "is-hidden"} ${currentInspectedId === "atmosphere" ? "is-inspected" : ""}" data-layer-id="atmosphere">
          <circle cx="95" cy="255" r="38" fill="#38bdf8" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2"/>
          <text x="95" y="259" text-anchor="middle" font-size="9" font-weight="700" fill="#38bdf8">Atmosfer</text>
        </g>

        <!-- 2. Kerak Bumi Shell -->
        <g class="layer-3d-group ${isCrust ? "" : "is-hidden"} ${currentInspectedId === "crust" ? "is-inspected" : ""}" data-layer-id="crust">
          <circle cx="150" cy="215" r="34" fill="#1e40af" stroke="#78716c" stroke-width="3"/>
          <circle cx="150" cy="215" r="31" fill="#78716c" fill-opacity="0.4"/>
          <text x="150" y="219" text-anchor="middle" font-size="9" font-weight="700" fill="#f1f5f9">Kerak</text>
        </g>

        <!-- 3. Mantel Bumi Shell -->
        <g class="layer-3d-group ${isMantle ? "" : "is-hidden"} ${currentInspectedId === "mantle" ? "is-inspected" : ""}" data-layer-id="mantle">
          <circle cx="215" cy="165" r="36" fill="#ea580c" stroke="#f97316" stroke-width="4"/>
          <circle cx="215" cy="165" r="26" fill="#c2410c"/>
          <text x="215" y="169" text-anchor="middle" font-size="9" font-weight="700" fill="#ffffff">Mantel</text>
        </g>

        <!-- 4. Inti Luar Shell -->
        <g class="layer-3d-group ${isOuter ? "" : "is-hidden"} ${currentInspectedId === "outer_core" ? "is-inspected" : ""}" data-layer-id="outer_core">
          <circle cx="280" cy="115" r="30" fill="#f59e0b" stroke="#fde047" stroke-width="3.5"/>
          <text x="280" y="119" text-anchor="middle" font-size="9" font-weight="700" fill="#78350f">Inti Luar</text>
        </g>

        <!-- 5. Inti Dalam Solid Core -->
        <g class="layer-3d-group ${isInner ? "" : "is-hidden"} ${currentInspectedId === "inner_core" ? "is-inspected" : ""}" data-layer-id="inner_core">
          <circle cx="340" cy="70" r="24" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <circle cx="335" cy="65" r="5" fill="#ffffff" opacity="0.8"/>
          <text x="340" y="74" text-anchor="middle" font-size="9" font-weight="900" fill="#78350f">Inti Dalam</text>
        </g>

        <text x="210" y="325" text-anchor="middle" font-size="11" font-weight="600" fill="#94a3b8">Lapisan diurai berjarak sepanjang sumbu antariksa</text>
      </svg>
    `;
  }

  // View 3: Skala Kedalaman Geologis
  function renderDepthView(isAtm, isCrust, isMantle, isOuter, isInner) {
    svgContainer.innerHTML = `
      <svg viewBox="0 0 420 340" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram Skala Kedalaman Interior Bumi">
        <text x="210" y="30" text-anchor="middle" font-size="12" font-weight="700" fill="#f1f5f9">Diagram Penampang Kedalaman (0 – 6.371 km)</text>
        
        <!-- Bar Horizontal Penampang Lapisan -->
        <!-- 1. Kerak: 0 - 70 km -->
        <g class="layer-3d-group ${isCrust ? "" : "is-hidden"}" data-layer-id="crust">
          <rect x="50" y="80" width="30" height="130" fill="#78716c" rx="4" stroke="#44403c"/>
          <text x="65" y="145" text-anchor="middle" font-size="9" font-weight="700" fill="#f1f5f9" transform="rotate(-90 65 145)">Kerak</text>
        </g>
        
        <!-- 2. Mantel: 70 - 2.900 km -->
        <g class="layer-3d-group ${isMantle ? "" : "is-hidden"}" data-layer-id="mantle">
          <rect x="85" y="80" width="130" height="130" fill="#ea580c" rx="4" stroke="#c2410c"/>
          <text x="150" y="145" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">Mantel Bumi (2.900 km)</text>
          <text x="150" y="165" text-anchor="middle" font-size="9" fill="#fef08a">1.000 °C – 3.700 °C</text>
        </g>

        <!-- 3. Inti Luar: 2.900 - 5.100 km -->
        <g class="layer-3d-group ${isOuter ? "" : "is-hidden"}" data-layer-id="outer_core">
          <rect x="220" y="80" width="100" height="130" fill="#f59e0b" rx="4" stroke="#d97706"/>
          <text x="270" y="145" text-anchor="middle" font-size="11" font-weight="700" fill="#78350f">Inti Luar (2.200 km)</text>
          <text x="270" y="165" text-anchor="middle" font-size="9" fill="#451a03">Cair · 4.000–5.000 °C</text>
        </g>

        <!-- 4. Inti Dalam: 5.100 - 6.371 km -->
        <g class="layer-3d-group ${isInner ? "" : "is-hidden"}" data-layer-id="inner_core">
          <rect x="325" y="80" width="55" height="130" fill="#fef08a" rx="4" stroke="#eab308"/>
          <text x="352" y="145" text-anchor="middle" font-size="10" font-weight="800" fill="#78350f">Inti Dalam</text>
          <text x="352" y="165" text-anchor="middle" font-size="8.5" fill="#78350f">5.400 °C</text>
        </g>

        <!-- Sumbu Penggaris Skala (km) -->
        <line x1="50" y1="225" x2="380" y2="225" stroke="#94a3b8" stroke-width="2"/>
        <line x1="50" y1="220" x2="50" y2="230" stroke="#94a3b8" stroke-width="2"/>
        <line x1="85" y1="220" x2="85" y2="230" stroke="#94a3b8" stroke-width="2"/>
        <line x1="220" y1="220" x2="220" y2="230" stroke="#94a3b8" stroke-width="2"/>
        <line x1="325" y1="220" x2="325" y2="230" stroke="#94a3b8" stroke-width="2"/>
        <line x1="380" y1="220" x2="380" y2="230" stroke="#94a3b8" stroke-width="2"/>

        <text x="50" y="245" text-anchor="middle" font-size="9" fill="#94a3b8">0 km</text>
        <text x="85" y="245" text-anchor="middle" font-size="9" fill="#94a3b8">70</text>
        <text x="220" y="245" text-anchor="middle" font-size="9" fill="#94a3b8">2.900 km</text>
        <text x="325" y="245" text-anchor="middle" font-size="9" fill="#94a3b8">5.100 km</text>
        <text x="380" y="245" text-anchor="middle" font-size="9" fill="#94a3b8">6.371 km</text>

        <!-- Catatan Suhu & Fisika -->
        <text x="210" y="280" text-anchor="middle" font-size="10" fill="#38bdf8">Atmosfer membentang di luar kerak hingga 10.000 km ke hampa antariksa</text>
        <text x="210" y="300" text-anchor="middle" font-size="9.5" fill="#f87171">Gelombang seismik sekunder (S-wave) terhenti di Inti Luar karena fasenya yang cair!</text>
      </svg>
    `;
  }

  function renderControls() {
    controls.innerHTML = EARTH_LAYERS_DATA.map((layer) => {
      const isActive = activeLayers.has(layer.id);
      const isInspected = currentInspectedId === layer.id;
      return `
        <div class="layer-toggle-btn ${isInspected ? "is-inspected" : ""}" data-layer-id="${layer.id}" role="button" tabindex="0">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:14px; height:14px; border-radius:50%; background:${layer.color}; display:inline-block; box-shadow:0 0 6px ${layer.color}66;"></span>
              <b>${layer.name}</b>
            </div>
            <div class="text-subtle" style="margin-left:22px; font-size:0.75rem;">${layer.depth}</div>
          </div>
          <span class="layer-toggle-switch ${isActive ? "is-on" : "is-off"}">
            ${isActive ? "✓ Tampil (ON)" : "✕ Sembunyi (OFF)"}
          </span>
        </div>
      `;
    }).join("");
  }

  function showLayerInfo(layerId) {
    currentInspectedId = layerId;
    const layer = EARTH_LAYERS_DATA.find((l) => l.id === layerId);
    if (!layer || !infoCard) return;

    infoCard.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <b style="color:${layer.color}; font-size:1.15rem;">${layer.name}</b>
        <span class="status-badge" style="background:${layer.color}22; color:${layer.color}; border:1px solid ${layer.color}55;">
          ${activeLayers.has(layerId) ? "✓ Lapisan Aktif" : "✕ Lapisan Dimatikan"}
        </span>
      </div>
      
      <div class="layer-pill-meta">
        <span>📏 ${layer.depth}</span>
        <span>🌡️ ${layer.temp}</span>
        <span>🧪 ${layer.state}</span>
        <span>🛡️ ${layer.role}</span>
      </div>

      <p style="margin:0;">${layer.desc}</p>
    `;

    inspectedLayers.add(layerId);
    if (inspectedLayers.size >= 4) {
      AppState.complete("layertoggle", 10);
    }

    renderControls();
    // Beri highlight pada elemen SVG terkait
    svgContainer.querySelectorAll(".layer-3d-group").forEach((g) => {
      g.classList.toggle("is-inspected", g.dataset.layerId === layerId);
    });
  }

  // Event listener tombol saklar / kartu kontrol
  controls.addEventListener("click", (e) => {
    const btn = e.target.closest(".layer-toggle-btn");
    if (!btn) return;

    const layerId = btn.dataset.layerId;
    if (activeLayers.has(layerId)) {
      activeLayers.delete(layerId);
    } else {
      activeLayers.add(layerId);
    }

    SoundFX.playClick();
    renderSVG();
    showLayerInfo(layerId);
  });

  // Event listener tab mode tampilan
  if (viewModesContainer) {
    viewModesContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-layer-view");
      if (!btn) return;
      currentView = btn.dataset.view;
      $$(".btn-layer-view", viewModesContainer).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      SoundFX.playClick();
      renderSVG();
    });
  }

  // Event listener preset bar
  if (presetsBar) {
    presetsBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-layer-preset");
      if (!btn) return;

      const presetId = btn.dataset.preset;
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      activeLayers.clear();
      preset.layers.forEach((l) => activeLayers.add(l));

      $$(".btn-layer-preset", presetsBar).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      SoundFX.playSuccess();
      renderSVG();
      renderControls();
      showLayerInfo(preset.layers[0] || "crust");
    });
  }

  renderViewModes();
  renderPresets();
  renderSVG();
  renderControls();
  showLayerInfo("crust");
}

// #41 Temukan Kesalahan Konsep (spot_bug)
function initSpotBug() {
  const container = $("#spot-bug-svg-container");
  const casesBar = $("#spot-bug-cases");
  const optionsGrid = $("#spot-bug-options");
  const feedback = $("#spot-bug-feedback");
  const promptEl = $("#spot-bug-prompt");

  if (!container || !casesBar) return;

  let activeCaseIdx = 0;
  const foundBugs = new Set();

  function renderCasesBar() {
    casesBar.innerHTML = SPOT_BUG_DATA.map((c, idx) => `
      <button class="btn-bug-case ${idx === activeCaseIdx ? "active" : ""}" data-idx="${idx}">
        ${c.title} ${foundBugs.has(c.id) ? "✓" : ""}
      </button>
    `).join("");
  }

  function handleSelect(nodeId) {
    const item = SPOT_BUG_DATA[activeCaseIdx];
    if (!item || !feedback) return;

    const targetNode = item.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const allNodes = container.querySelectorAll(".bug-clickable-node");
    const allBtns = optionsGrid ? optionsGrid.querySelectorAll(".btn-bug-option") : [];

    allNodes.forEach((el) => {
      if (!el.classList.contains("is-found")) {
        el.classList.remove("is-wrong-guess");
      }
    });
    allBtns.forEach((b) => {
      if (!b.classList.contains("is-found")) {
        b.classList.remove("is-wrong");
      }
    });

    const activeNodeEl = container.querySelector(`[data-node-id="${nodeId}"]`);
    const activeBtnEl = optionsGrid ? optionsGrid.querySelector(`[data-node-id="${nodeId}"]`) : null;

    feedback.hidden = false;

    if (targetNode.isBug) {
      SoundFX.playSuccess();
      if (activeNodeEl) activeNodeEl.classList.add("is-found");
      if (activeBtnEl) activeBtnEl.classList.add("is-found");

      feedback.className = "spot-bug-feedback is-success";
      feedback.innerHTML = `
        <div class="feedback-header">
          <span class="feedback-badge-correct">✅ JAWABAN BENAR!</span>
          <span class="feedback-title">Hebat, kamu berhasil membongkar kesalahan konsep ini!</span>
        </div>
        <div class="feedback-choice-line">
          <b>Bagian yang kamu pilih:</b> <u>[${targetNode.letter}] ${targetNode.label}</u> (Memang SALAH secara sains)
        </div>
        <div class="feedback-explanation">
          ${item.explanation}
        </div>
      `;

      foundBugs.add(item.id);
      renderCasesBar();
      AppState.complete("spotbug", 10);
    } else {
      SoundFX.playError();
      if (activeNodeEl) {
        activeNodeEl.classList.add("is-wrong-guess");
        setTimeout(() => activeNodeEl.classList.remove("is-wrong-guess"), 600);
      }
      if (activeBtnEl) {
        activeBtnEl.classList.add("is-wrong");
        setTimeout(() => activeBtnEl.classList.remove("is-wrong"), 600);
      }

      feedback.className = "spot-bug-feedback is-wrong";
      feedback.innerHTML = `
        <div class="feedback-header">
          <span class="feedback-badge-wrong">❌ JAWABAN BELUM TEPAT</span>
          <span class="feedback-title">Bukan bagian ini yang salah!</span>
        </div>
        <div class="feedback-choice-line">
          <b>Bagian yang kamu pilih:</b> <u>[${targetNode.letter}] ${targetNode.label}</u>
        </div>
        <div class="feedback-explanation">
          <b>💡 Fakta Sains Sebenarnya:</b> ${targetNode.note}
          <p class="feedback-hint-text">👉 Konsep pada bagian ini sudah BENAR secara ilmiah. Coba amati dan ketuk bagian lainnya pada diagram!</p>
        </div>
      `;
    }
  }

  function renderCase(idx) {
    activeCaseIdx = idx;
    const item = SPOT_BUG_DATA[idx];
    if (!item) return;

    if (promptEl) {
      promptEl.innerHTML = item.prompt;
    }
    if (feedback) {
      feedback.hidden = true;
      feedback.className = "spot-bug-feedback";
      feedback.innerHTML = "";
    }

    renderCasesBar();

    if (item.id === "comet_tail") {
      container.innerHTML = `
        <svg viewBox="0 0 440 320" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram Orbit Komet Mengitari Matahari">
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="35%" stop-color="#fef08a"/>
              <stop offset="70%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="tail-grad-1" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="tail-grad-2" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="tail-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Bintang-bintang Latar -->
          <circle cx="35" cy="40" r="1.2" fill="#fff" opacity="0.6"/>
          <circle cx="410" cy="50" r="1.5" fill="#fff" opacity="0.5"/>
          <circle cx="45" cy="280" r="1" fill="#fff" opacity="0.4"/>
          <circle cx="400" cy="290" r="1.2" fill="#fff" opacity="0.6"/>

          <!-- Garis Orbit Elips Komet -->
          <ellipse cx="220" cy="180" rx="160" ry="90" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="6 4"/>

          <!-- Panah Arah Gerak Orbit -->
          <path d="M 60,180 L 56,170 M 60,180 L 68,172" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
          <path d="M 380,180 L 376,190 M 380,180 L 388,188" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
          <text x="75" y="150" font-size="10" fill="#94a3b8">Arah Orbit ➔</text>

          <!-- Matahari di Pusat Fokus Orbit -->
          <circle cx="220" cy="180" r="45" fill="url(#sun-glow)"/>
          <circle cx="220" cy="180" r="22" fill="#fef08a" stroke="#f59e0b" stroke-width="2"/>
          <text x="220" y="184" text-anchor="middle" font-size="10" font-weight="800" fill="#78350f">MATAHARI</text>

          <!-- POSISI 1 (A): Mendekati Matahari -->
          <g class="bug-clickable-node" data-node-id="komet-pos-1" role="button" tabindex="0">
            <rect x="45" y="45" width="115" height="120" rx="12" fill="transparent" pointer-events="all"/>
            <polygon points="110,130 50,70 70,50" fill="url(#tail-grad-1)"/>
            <circle cx="110" cy="130" r="8" fill="#e2e8f0" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="85" cy="100" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="85" y="104" text-anchor="middle" font-size="10" font-weight="800" fill="#38bdf8">A</text>
            <text x="110" y="152" text-anchor="middle" font-size="10" font-weight="700" fill="#cbd5e1">Posisi 1</text>
          </g>

          <!-- POSISI 2 (B): Perihelion (Titik Terdekat) -->
          <g class="bug-clickable-node" data-node-id="komet-pos-2" role="button" tabindex="0">
            <rect x="160" y="10" width="120" height="115" rx="12" fill="transparent" pointer-events="all"/>
            <polygon points="220,90 205,15 235,15" fill="url(#tail-grad-2)"/>
            <circle cx="220" cy="90" r="9" fill="#e2e8f0" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="220" cy="50" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="220" y="54" text-anchor="middle" font-size="10" font-weight="800" fill="#38bdf8">B</text>
            <text x="220" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#cbd5e1">Posisi 2 (Perihelion)</text>
          </g>

          <!-- POSISI 3 (C): Menjauhi Matahari (BUG DI SINI!) -->
          <g class="bug-clickable-node" data-node-id="komet-pos-3" role="button" tabindex="0">
            <rect x="260" y="45" width="125" height="165" rx="12" fill="transparent" pointer-events="all"/>
            <polygon points="330,130 270,180 290,200" fill="url(#tail-grad-3)"/>
            <circle cx="330" cy="130" r="8" fill="#e2e8f0" stroke="#f87171" stroke-width="2"/>
            <circle cx="345" cy="100" r="11" fill="#0f172a" stroke="#f87171" stroke-width="1.5"/>
            <text x="345" y="104" text-anchor="middle" font-size="10" font-weight="800" fill="#f87171">C</text>
            <text x="330" y="152" text-anchor="middle" font-size="10" font-weight="700" fill="#cbd5e1">Posisi 3</text>
          </g>

          <!-- POSISI 4 (D): Aphelion (Titik Terjauh) -->
          <g class="bug-clickable-node" data-node-id="komet-pos-4" role="button" tabindex="0">
            <rect x="160" y="235" width="120" height="75" rx="12" fill="transparent" pointer-events="all"/>
            <circle cx="220" cy="270" r="8" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/>
            <circle cx="220" cy="245" r="11" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
            <text x="220" y="249" text-anchor="middle" font-size="10" font-weight="800" fill="#cbd5e1">D</text>
            <text x="220" y="292" text-anchor="middle" font-size="10" font-weight="700" fill="#cbd5e1">Posisi 4 (Aphelion)</text>
          </g>
        </svg>
      `;
    } else if (item.id === "asteroid_density") {
      container.innerHTML = `
        <svg viewBox="0 0 440 320" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram Kepadatan Sabuk Asteroid">
          <!-- Batas Orbit Mars -->
          <path d="M 30,30 Q 80,160 30,290" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 5"/>
          <text x="35" y="45" font-size="10" font-weight="700" fill="#ef4444">Orbit Mars (1,5 AU)</text>
          
          <!-- Batas Orbit Jupiter -->
          <path d="M 410,30 Q 360,160 410,290" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5 5"/>
          <text x="320" y="45" font-size="10" font-weight="700" fill="#f59e0b">Orbit Jupiter (5,2 AU)</text>

          <!-- Node 1 (A): Wahana Antariksa -->
          <g class="bug-clickable-node" data-node-id="probe-ship" role="button" tabindex="0">
            <rect x="40" y="115" width="90" height="95" rx="12" fill="transparent" pointer-events="all"/>
            <circle cx="85" cy="155" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="85" y="160" text-anchor="middle" font-size="16">🛰️</text>
            <circle cx="65" cy="130" r="11" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="65" y="134" text-anchor="middle" font-size="10" font-weight="800" fill="#38bdf8">A</text>
            <text x="85" y="195" text-anchor="middle" font-size="10" font-weight="700" fill="#f1f5f9">Wahana Dawn</text>
          </g>

          <!-- Node 2 (B): Gugusan Asteroid Berjejal (BUG!) -->
          <g class="bug-clickable-node" data-node-id="asteroid-pile" role="button" tabindex="0">
            <rect x="180" y="95" width="135" height="125" rx="12" fill="#1e293b" stroke="#f87171" stroke-width="2" stroke-dasharray="4 2" pointer-events="all"/>
            <circle cx="210" cy="135" r="14" fill="#78716c"/>
            <circle cx="235" cy="140" r="16" fill="#a8a29e"/>
            <circle cx="260" cy="130" r="12" fill="#57534e"/>
            <circle cx="225" cy="165" r="15" fill="#64748b"/>
            <circle cx="255" cy="170" r="13" fill="#78716c"/>
            <circle cx="195" cy="110" r="11" fill="#0f172a" stroke="#f87171" stroke-width="1.5"/>
            <text x="195" y="114" text-anchor="middle" font-size="10" font-weight="800" fill="#f87171">B</text>
            <text x="245" y="198" text-anchor="middle" font-size="9" font-weight="700" fill="#fca5a5">Bebatuan Berjejal 5m</text>
          </g>

          <!-- Node 3 (C): Label Marker -->
          <g class="bug-clickable-node" data-node-id="mars-orbit-marker" role="button" tabindex="0">
            <rect x="125" y="240" width="190" height="34" rx="12" fill="#0f172a" stroke="#64748b" stroke-width="1" pointer-events="all"/>
            <circle cx="140" cy="257" r="10" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="140" y="261" text-anchor="middle" font-size="9" font-weight="800" fill="#38bdf8">C</text>
            <text x="230" y="261" text-anchor="middle" font-size="10" fill="#94a3b8">Zona Sabuk Utama Asteroid</text>
          </g>
        </svg>
      `;
    } else {
      // earth_seasons
      container.innerHTML = `
        <svg viewBox="0 0 440 320" class="hotspot-img-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram Penyebab Terjadinya Musim di Bumi">
          <!-- Matahari -->
          <circle cx="220" cy="160" r="28" fill="#fef08a" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="220" y="164" text-anchor="middle" font-size="9" font-weight="800" fill="#78350f">MATAHARI</text>

          <!-- Bumi Bulan Juni (Kiri) - Option A -->
          <g class="bug-clickable-node" data-node-id="axial-tilt-north" role="button" tabindex="0">
            <rect x="45" y="95" width="110" height="130" rx="12" fill="transparent" pointer-events="all"/>
            <circle cx="100" cy="160" r="26" fill="#1e40af" stroke="#60a5fa" stroke-width="2"/>
            <line x1="88" y1="125" x2="112" y2="195" stroke="#facc15" stroke-width="2.5"/>
            <circle cx="65" cy="115" r="11" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="65" y="119" text-anchor="middle" font-size="10" font-weight="800" fill="#60a5fa">A</text>
            <text x="100" y="115" text-anchor="middle" font-size="10" font-weight="700" fill="#f1f5f9">Bumi (Juni)</text>
            <text x="100" y="204" text-anchor="middle" font-size="9" fill="#93c5fd">Kemiringan 23,5°</text>
          </g>

          <!-- Node BUG: Label klaim jarak orbit - Option B -->
          <g class="bug-clickable-node" data-node-id="season-distance-claim" role="button" tabindex="0">
            <rect x="90" y="235" width="260" height="40" rx="10" fill="#1e293b" stroke="#f87171" stroke-width="2" pointer-events="all"/>
            <circle cx="110" cy="255" r="11" fill="#0f172a" stroke="#f87171" stroke-width="1.5"/>
            <text x="110" y="259" text-anchor="middle" font-size="10" font-weight="800" fill="#f87171">B</text>
            <text x="230" y="259" text-anchor="middle" font-size="10" font-weight="700" fill="#fca5a5">"Bumi Lebih Dekat = Musim Panas"</text>
          </g>

          <!-- Bumi Bulan Desember (Kanan) - Option C -->
          <g class="bug-clickable-node" data-node-id="axial-tilt-south" role="button" tabindex="0">
            <rect x="285" y="95" width="110" height="130" rx="12" fill="transparent" pointer-events="all"/>
            <circle cx="340" cy="160" r="26" fill="#1e40af" stroke="#60a5fa" stroke-width="2"/>
            <line x1="328" y1="125" x2="352" y2="195" stroke="#facc15" stroke-width="2.5"/>
            <circle cx="375" cy="115" r="11" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
            <text x="375" y="119" text-anchor="middle" font-size="10" font-weight="800" fill="#60a5fa">C</text>
            <text x="340" y="115" text-anchor="middle" font-size="10" font-weight="700" fill="#f1f5f9">Bumi (Desember)</text>
            <text x="340" y="204" text-anchor="middle" font-size="9" fill="#93c5fd">Kemiringan 23,5°</text>
          </g>
        </svg>
      `;
    }

    // Render pilihan tombol di bawah diagram
    if (optionsGrid) {
      optionsGrid.innerHTML = item.nodes.map((n) => `
        <button class="btn-bug-option" data-node-id="${n.id}">
          <span class="opt-badge">${n.letter}</span>
          <span class="opt-label">${n.label}</span>
        </button>
      `).join("");

      optionsGrid.querySelectorAll(".btn-bug-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          handleSelect(btn.dataset.nodeId);
        });
      });
    }

    // Pasang listener klik pada node SVG
    container.querySelectorAll(".bug-clickable-node").forEach((nodeEl) => {
      nodeEl.addEventListener("click", () => {
        handleSelect(nodeEl.dataset.nodeId);
      });
      nodeEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect(nodeEl.dataset.nodeId);
        }
      });
    });
  }

  casesBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-bug-case");
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx, 10);
    SoundFX.playClick();
    renderCase(idx);
  });

  renderCase(0);
}

// #42 Bagan Alir Proses Daur Hidup Bintang (flow_diagram)
function initFlowDiagram() {
  const track = $("#flow-nodes-track");
  const panel = $("#flow-detail-panel");
  if (!track || !panel) return;

  const data = FLOW_DIAGRAM_DATA;
  let activeIdx = 0;
  const visitedNodes = new Set();

  function renderTrack() {
    track.innerHTML = data.nodes.map((n, idx) => `
      <div class="flow-node-card ${idx === activeIdx ? "active" : ""}" data-idx="${idx}" role="button" tabindex="0">
        <span class="node-step-tag">TAHAP ${n.step}</span>
        <span class="node-icon">${n.icon}</span>
        <div class="node-title">${n.name}</div>
      </div>
    `).join("");
  }

  function renderPanel(idx) {
    activeIdx = idx;
    const n = data.nodes[idx];
    if (!n) return;

    visitedNodes.add(n.id);
    if (visitedNodes.size >= 4) {
      AppState.complete("flow", 10);
    }

    renderTrack();

    panel.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:2.2rem;">${n.icon}</span>
          <div>
            <span class="tag-badge">TAHAP ${n.step}</span>
            <h3 style="margin:2px 0 0; font-size:1.15rem;">${n.name}</h3>
          </div>
        </div>
        <span class="status-badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem;">
          ${n.phase}
        </span>
      </div>

      <div class="flow-meta-grid">
        <div class="flow-meta-pill">
          <b>⏱️ Durasi Tahap</b>
          <span>${n.duration}</span>
        </div>
        <div class="flow-meta-pill">
          <b>🌡️ Suhu Reaktor</b>
          <span>${n.temp}</span>
        </div>
        <div class="flow-meta-pill">
          <b>⚛️ Reaksi Fusi</b>
          <span>${n.chemistry}</span>
        </div>
      </div>

      <p style="margin:10px 0;">${n.desc}</p>

      <div style="background:var(--bg-card); border-left:3px solid var(--accent); padding:10px 14px; border-radius:var(--radius-sm); margin:12px 0; font-size:0.875rem;">
        <b>🌟 Relevansi dengan Tata Surya Kita:</b><br>${n.legacy}
      </div>

      <div class="flow-nav-buttons">
        <button class="btn-sm" id="btn-flow-prev" ${idx === 0 ? "disabled" : ""}>⬅ Sebelumnya</button>
        <span class="text-subtle" style="font-size:0.8125rem;">${idx + 1} dari ${data.nodes.length} Tahap</span>
        <button class="btn-sm" id="btn-flow-next" ${idx === data.nodes.length - 1 ? "disabled" : ""}>Berikutnya ➔</button>
      </div>
    `;

    const prevBtn = $("#btn-flow-prev", panel);
    const nextBtn = $("#btn-flow-next", panel);
    if (prevBtn) prevBtn.addEventListener("click", () => { SoundFX.playClick(); renderPanel(activeIdx - 1); });
    if (nextBtn) nextBtn.addEventListener("click", () => { SoundFX.playClick(); renderPanel(activeIdx + 1); });
  }

  track.addEventListener("click", (e) => {
    const card = e.target.closest(".flow-node-card");
    if (!card) return;
    const idx = parseInt(card.dataset.idx, 10);
    SoundFX.playClick();
    renderPanel(idx);
  });

  renderPanel(0);
}

// #43 Pohon Taksonomi Benda Langit (visual_tree)
function initVisualTree() {
  const treeContainer = $("#visual-tree-nodes");
  const infoBox = $("#tree-leaf-info");
  const searchInput = $("#tree-search-input");
  const expandAllBtn = $("#btn-tree-expand-all");
  const collapseAllBtn = $("#btn-tree-collapse-all");

  if (!treeContainer) return;

  const expandedNodes = new Set(["root", "major_planets", "terrestrial_group"]);
  const inspectedLeaves = new Set();
  let selectedId = "p_earth";
  let searchQuery = "";

  function renderTree() {
    function buildNodeHTML(node) {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedId === node.id;

      let isVisible = true;
      if (searchQuery) {
        const matchSelf = node.name.toLowerCase().includes(searchQuery) || (node.desc && node.desc.toLowerCase().includes(searchQuery));
        const matchChild = hasChildren && node.children.some(c => JSON.stringify(c).toLowerCase().includes(searchQuery));
        isVisible = matchSelf || matchChild;
        if (matchChild) expandedNodes.add(node.id);
      }

      if (!isVisible) return "";

      return `
        <div class="tree-node-item" data-node-id="${node.id}">
          <div class="tree-node-header ${isSelected ? "is-selected" : ""}" data-node-id="${node.id}" role="treeitem" aria-expanded="${isExpanded}">
            <span class="tree-chevron ${hasChildren ? (isExpanded ? "expanded" : "") : "empty"}">▶</span>
            <span>${node.icon || "🪐"}</span>
            <span style="font-size:0.875rem;">${node.name}</span>
            ${node.badge ? `<span class="tree-badge">${node.badge}</span>` : ""}
          </div>
          ${hasChildren ? `
            <div class="tree-children ${isExpanded ? "is-open" : ""}">
              ${node.children.map(buildNodeHTML).join("")}
            </div>
          ` : ""}
        </div>
      `;
    }

    treeContainer.innerHTML = buildNodeHTML(VISUAL_TREE_DATA);
  }

  function findNode(id, node = VISUAL_TREE_DATA) {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const res = findNode(id, child);
        if (res) return res;
      }
    }
    return null;
  }

  function showNodeInfo(id) {
    selectedId = id;
    const node = findNode(id);
    if (!node || !infoBox) return;

    infoBox.hidden = false;
    infoBox.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.6rem;">${node.icon || "🪐"}</span>
          <b style="font-size:1.1rem;">${node.name}</b>
        </div>
        ${node.badge ? `<span class="status-badge" style="background:var(--primary-light); color:var(--primary);">${node.badge}</span>` : ""}
      </div>
      <p style="margin:8px 0 0;">${node.desc || "Informasi taksonomi lengkap sistem tata surya."}</p>
      ${node.stats ? `
        <div class="layer-pill-meta" style="margin-top:8px;">
          <span>📏 Diameter: ${node.stats.diameter}</span>
          <span>⚖️ Massa: ${node.stats.massa}</span>
          <span>🌡️ Suhu Inti: ${node.stats.suhu_inti}</span>
        </div>
      ` : ""}
    `;

    inspectedLeaves.add(id);
    if (inspectedLeaves.size >= 4) {
      AppState.complete("tree", 10);
    }

    renderTree();
  }

  treeContainer.addEventListener("click", (e) => {
    const header = e.target.closest(".tree-node-header");
    if (!header) return;

    const id = header.dataset.nodeId;
    const node = findNode(id);
    if (!node) return;

    if (node.children && node.children.length > 0) {
      if (expandedNodes.has(id)) {
        expandedNodes.delete(id);
      } else {
        expandedNodes.add(id);
      }
    }

    SoundFX.playClick();
    showNodeInfo(id);
  });

  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      function addAll(node) {
        if (node.children && node.children.length > 0) {
          expandedNodes.add(node.id);
          node.children.forEach(addAll);
        }
      }
      addAll(VISUAL_TREE_DATA);
      SoundFX.playClick();
      renderTree();
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", () => {
      expandedNodes.clear();
      expandedNodes.add("root");
      SoundFX.playClick();
      renderTree();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderTree();
    });
  }

  renderTree();
  showNodeInfo("p_earth");
}

// #44 Penjelajahan Ketinggian Atmosfer Parallaks (parallax)
function initAltitudeParallax() {
  const viewport = $("#parallax-viewport");
  const slider = $("#parallax-alt-slider");
  const skyBg = $("#parallax-sky-bg");
  const stars = $("#parallax-stars-layer");
  const hudAlt = $("#hud-altitude-val");
  const hudLayer = $("#hud-layer-val");
  const hudTemp = $("#hud-temp-val");
  const stage = $("#parallax-objects-stage");
  const quickNav = $("#altitude-quick-nav");
  const infoBox = $("#altitude-object-info");
  const rulerPointer = $("#ruler-pointer");
  const pointerAltVal = $("#pointer-alt-val");
  const rulerTrack = $(".ruler-track", viewport);

  if (!viewport || !slider || !stage) return;

  const data = PARALLAX_ALTITUDE_DATA;
  let currentAltKm = 0;
  let selectedObjName = null;
  const visitedLayers = new Set();

  const QUICK_JUMPS = [
    { km: 0, label: "🌍 0 m (Bumi)" },
    { km: 11, label: "✈️ 11 km (Pesawat Jet)" },
    { km: 25, label: "🛡️ 25 km (Ozon)" },
    { km: 38, label: "🎈 38 km (Balon Cuaca)" },
    { km: 75, label: "☄️ 75 km (Meteor)" },
    { km: 100, label: "🌐 100 km (Kármán)" },
    { km: 140, label: "🌌 140 km (Aurora)" },
    { km: 408, label: "🛰️ 408 km (ISS)" },
    { km: 500, label: "🔭 500 km (Hubble)" }
  ];

  function renderQuickNav() {
    if (!quickNav) return;
    quickNav.innerHTML = QUICK_JUMPS.map((j) => `
      <button class="btn-altitude-jump" data-km="${j.km}">${j.label}</button>
    `).join("");
  }

  function getActiveLayer(km) {
    if (km <= 12) return data.layers[0];
    if (km <= 50) return data.layers[1];
    if (km <= 85) return data.layers[2];
    return data.layers[3];
  }

  // Pemetaan non-linear proporsional agar tiap lapisan memiliki ruang gerak seimbang
  function getVirtualY(km) {
    if (km <= 0) return 0;
    if (km <= 12) {
      return (km / 12) * 380;
    }
    if (km <= 50) {
      return 380 + ((km - 12) / 38) * 360;
    }
    if (km <= 85) {
      return 740 + ((km - 50) / 35) * 340;
    }
    if (km <= 100) {
      return 1080 + ((km - 85) / 15) * 80;
    }
    if (km <= 140) {
      return 1160 + ((km - 100) / 40) * 90;
    }
    return 1250 + (Math.min(km, 500) - 140) / (500 - 140) * 350;
  }

  function formatAltitude(meters) {
    if (meters < 1000) return `${meters} Meter`;
    const km = meters / 1000;
    return `${km.toLocaleString("id-ID")} km (${meters.toLocaleString("id-ID")} m)`;
  }

  function getTemperature(km) {
    if (km <= 12) return `${Math.round(15 - (km / 12) * 70)} °C`;
    if (km <= 50) return `${Math.round(-55 + ((km - 12) / 38) * 55)} °C`;
    if (km <= 85) return `${Math.round(0 - ((km - 50) / 35) * 90)} °C`;
    return `+${Math.min(1500, Math.round(100 + ((km - 85) / 415) * 1400))} °C`;
  }

  function displayObjectInfo(obj) {
    if (!infoBox || !obj) return;
    const objKm = obj.alt / 1000;
    const layer = getActiveLayer(objKm);

    infoBox.hidden = false;
    infoBox.className = "layer-info-card is-active-info";
    infoBox.innerHTML = `
      <div class="info-card-header">
        <div class="info-card-title-group">
          <span class="info-card-icon">${obj.icon}</span>
          <div>
            <h3 class="info-card-name">${obj.name}</h3>
            <span class="info-card-sub">${obj.subtitle || `Ketinggian ${formatAltitude(obj.alt)}`}</span>
          </div>
        </div>
        <div class="info-card-tags">
          <span class="status-badge" style="background:var(--primary-light); color:var(--primary); font-weight:700;">
            📏 ${formatAltitude(obj.alt)}
          </span>
          <span class="status-badge" style="background:var(--bg-card); border:1px solid var(--border-light);">
            🏷️ Lapisan ${layer.name}
          </span>
          <span class="status-badge" style="background:var(--bg-card); border:1px solid var(--border-light);">
            🌡️ Suhu: ${getTemperature(objKm)}
          </span>
        </div>
      </div>
      <p class="info-card-desc">${obj.desc}</p>
    `;
  }

  function updateAltitude(km) {
    currentAltKm = Math.max(0, Math.min(500, km));
    slider.value = currentAltKm;

    const layer = getActiveLayer(currentAltKm);
    visitedLayers.add(layer.id);
    if (visitedLayers.size >= 3) {
      AppState.complete("parallax", 10);
    }

    if (hudAlt) {
      if (currentAltKm < 1) {
        hudAlt.textContent = `${Math.round(currentAltKm * 1000)} Meter`;
      } else {
        hudAlt.textContent = `${currentAltKm} km (${(currentAltKm * 1000).toLocaleString("id-ID")} m)`;
      }
    }
    if (hudLayer) hudLayer.textContent = layer.name;
    if (hudTemp) hudTemp.textContent = getTemperature(currentAltKm);

    if (skyBg) {
      skyBg.style.background = layer.skyColor;
    }

    if (stars) {
      const starOpacity = Math.min(1, Math.max(0.08, currentAltKm / 85));
      stars.style.opacity = starOpacity.toFixed(2);
    }

    // Perbarui penunjuk ruler ketinggian
    if (rulerPointer) {
      const maxVirtual = getVirtualY(500);
      const currVirtual = getVirtualY(currentAltKm);
      const pct = Math.max(0, Math.min(100, (currVirtual / maxVirtual) * 100));
      rulerPointer.style.bottom = `${pct.toFixed(1)}%`;
      if (pointerAltVal) {
        pointerAltVal.textContent = currentAltKm < 1 ? `${Math.round(currentAltKm * 1000)}m` : `${Math.round(currentAltKm)}km`;
      }
    }

    renderFloatingObjects();
  }

  function renderFloatingObjects() {
    const allObjects = [];
    data.layers.forEach((l) => {
      l.objects.forEach((o) => {
        allObjects.push({ ...o, layerName: l.name });
      });
    });

    const camV = getVirtualY(currentAltKm);
    const viewportH = 380;
    // Transisi dinamis dari kamera darat (310px) ke kamera melayang bebas (190px)
    const anchorY = 190 + (120 * Math.max(0, 1 - currentAltKm / 12));

    // Cari objek terdekat dengan posisi kamera saat ini
    let nearestObj = null;
    let minDelta = Infinity;

    allObjects.forEach((obj) => {
      const objKm = obj.alt / 1000;
      const vy = getVirtualY(objKm);
      const delta = Math.abs(vy - camV);
      if (delta < minDelta) {
        minDelta = delta;
        nearestObj = obj;
      }
    });

    stage.innerHTML = allObjects.map((obj) => {
      const objKm = obj.alt / 1000;
      const vy = getVirtualY(objKm);
      const yPos = anchorY - (vy - camV);

      // Sembunyikan objek yang jauh di luar layar
      if (yPos < -60 || yPos > viewportH + 70) return "";

      const deltaV = Math.abs(vy - camV);
      const opacity = Math.max(0.35, 1 - (deltaV / 360));
      const isTarget = (selectedObjName ? obj.name === selectedObjName : obj === nearestObj && deltaV < 75);

      if (obj.isBanner) {
        let bannerClass = "banner-ground";
        let bannerIcon = obj.icon;
        let bannerText = obj.name;
        if (obj.alt === 25000) bannerClass = "banner-ozone";
        else if (obj.alt === 100000) bannerClass = "banner-karman";
        else if (obj.alt === 140000) bannerClass = "banner-aurora";

        return `
          <div class="parallax-boundary-banner ${bannerClass}" 
               style="top:${yPos.toFixed(1)}px; opacity:${opacity.toFixed(2)};" 
               data-obj-name="${obj.name}" role="button" tabindex="0">
            <div class="boundary-pill">
              <span>${bannerIcon}</span>
              <span>${bannerText} (${formatAltitude(obj.alt)})</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="parallax-obj-card track-${obj.track || 'left'} ${isTarget ? 'is-active-target' : ''}" 
             style="top:${yPos.toFixed(1)}px; opacity:${opacity.toFixed(2)};" 
             data-obj-name="${obj.name}" 
             role="button" tabindex="0">
          <span class="obj-avatar">${obj.icon}</span>
          <div class="obj-body">
            <span class="obj-title">${obj.name}</span>
            <span class="obj-alt-badge">${formatAltitude(obj.alt)}</span>
          </div>
        </div>
      `;
    }).join("");

    // Perbarui info panel jika objek terdekat terdeteksi
    if (nearestObj && (!selectedObjName || minDelta < 25)) {
      displayObjectInfo(nearestObj);
    }

    // Pasang listener klik pada kartu objek dan banner
    stage.querySelectorAll("[data-obj-name]").forEach((el) => {
      const handleClick = () => {
        const name = el.dataset.objName;
        const target = allObjects.find((o) => o.name === name);
        if (!target) return;

        selectedObjName = name;
        SoundFX.playClick();
        displayObjectInfo(target);
        stage.querySelectorAll(".is-active-target").forEach((c) => c.classList.remove("is-active-target"));
        el.classList.add("is-active-target");
      };

      el.addEventListener("click", handleClick);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      });
    });
  }

  slider.addEventListener("input", (e) => {
    selectedObjName = null;
    updateAltitude(parseFloat(e.target.value));
  });

  viewport.addEventListener("wheel", (e) => {
    // Gulir halus adaptif per lapisan
    let step = 1;
    if (currentAltKm <= 12) step = 0.8;
    else if (currentAltKm <= 50) step = 2.5;
    else if (currentAltKm <= 85) step = 4;
    else step = 12;

    const delta = e.deltaY > 0 ? step : -step;
    const nextAlt = Math.max(0, Math.min(500, currentAltKm + delta));

    // Jangan cegah scroll halaman bila sudah di batas ekstrem
    if ((currentAltKm === 0 && e.deltaY < 0) || (currentAltKm === 500 && e.deltaY > 0)) {
      return;
    }

    e.preventDefault();
    selectedObjName = null;
    updateAltitude(nextAlt);
  }, { passive: false });

  if (quickNav) {
    quickNav.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-altitude-jump");
      if (!btn) return;
      const km = parseFloat(btn.dataset.km);
      selectedObjName = null;
      SoundFX.playClick();
      updateAltitude(km);
    });
  }

  if (rulerTrack) {
    rulerTrack.addEventListener("click", (e) => {
      const seg = e.target.closest(".ruler-seg");
      if (!seg) return;
      const km = parseFloat(seg.dataset.km);
      selectedObjName = null;
      SoundFX.playClick();
      updateAltitude(km);
    });
  }

  renderQuickNav();
  updateAltitude(0);
}

// #45 Kuis Kilat Berwaktu (timer_challenge)
function initTimerChallenge() {
  const arena = $("#timer-challenge-arena");
  const startScreen = $("#timer-start-screen");
  const gameScreen = $("#timer-game-screen");
  const resultScreen = $("#timer-result-screen");
  const btnStart = $("#btn-start-timer-challenge");
  const countdownEl = $("#timer-countdown");
  const scoreEl = $("#timer-score-val");
  const comboEl = $("#timer-combo-badge");
  const qText = $("#speed-question-text");
  const optGrid = $("#speed-options-grid");

  if (!arena || !btnStart) return;

  const questions = TIMER_CHALLENGE_DATA;
  let timerInterval = null;
  let timeLeft = 45;
  let score = 0;
  let combo = 1;
  let highestCombo = 1;
  let correctCount = 0;
  let totalAnswered = 0;
  let currentQIdx = 0;
  let qQueue = [];

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function startGame() {
    timeLeft = 45;
    score = 0;
    combo = 1;
    highestCombo = 1;
    correctCount = 0;
    totalAnswered = 0;
    currentQIdx = 0;
    qQueue = shuffle(questions);

    startScreen.hidden = true;
    resultScreen.hidden = true;
    gameScreen.hidden = false;

    updateHUD();
    loadQuestion();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateHUD();

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function updateHUD() {
    if (countdownEl) {
      countdownEl.textContent = `${timeLeft}s`;
      countdownEl.classList.toggle("is-danger", timeLeft <= 7);
    }
    if (scoreEl) {
      scoreEl.textContent = score;
    }
    if (comboEl) {
      if (combo > 1) {
        comboEl.hidden = false;
        comboEl.textContent = `🔥 COMBO x${combo}`;
      } else {
        comboEl.hidden = true;
      }
    }
  }

  function loadQuestion() {
    if (currentQIdx >= qQueue.length) {
      qQueue = shuffle(questions);
      currentQIdx = 0;
    }

    const q = qQueue[currentQIdx];
    if (!q || !qText || !optGrid) return;

    qText.textContent = q.q;
    optGrid.innerHTML = q.options.map((opt, idx) => `
      <button class="btn-speed-option" data-idx="${idx}">${opt}</button>
    `).join("");
  }

  optGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-speed-option");
    if (!btn || btn.disabled) return;

    const chosenIdx = parseInt(btn.dataset.idx, 10);
    const q = qQueue[currentQIdx];
    totalAnswered++;

    $$(".btn-speed-option", optGrid).forEach((b) => b.disabled = true);

    if (chosenIdx === q.correct) {
      SoundFX.playSuccess();
      btn.classList.add("is-correct");
      correctCount++;
      score += 10 * combo;
      combo++;
      if (combo > highestCombo) highestCombo = combo;
      timeLeft = Math.min(60, timeLeft + 2);
      if (countdownEl) {
        countdownEl.classList.add("is-bonus");
        setTimeout(() => countdownEl.classList.remove("is-bonus"), 400);
      }
      updateHUD();

      setTimeout(() => {
        currentQIdx++;
        loadQuestion();
      }, 260);
    } else {
      SoundFX.playLaser();
      btn.classList.add("is-wrong");
      const correctBtn = $(`[data-idx="${q.correct}"]`, optGrid);
      if (correctBtn) correctBtn.classList.add("is-correct");

      combo = 1;
      timeLeft = Math.max(0, timeLeft - 2);
      if (countdownEl) {
        countdownEl.classList.add("is-penalty");
        setTimeout(() => countdownEl.classList.remove("is-penalty"), 400);
      }
      updateHUD();

      setTimeout(() => {
        currentQIdx++;
        loadQuestion();
      }, 500);
    }
  });

  function endGame() {
    clearInterval(timerInterval);
    SoundFX.playFanfare();

    gameScreen.hidden = true;
    resultScreen.hidden = false;

    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    let speedRank = "🚀 Kecepatan Sub-Orbital";
    if (score >= 120) speedRank = "✨ Kecepatan Hiper-Ruang (Warp 9!)";
    else if (score >= 60) speedRank = "⚡ Kecepatan Cahaya (Warp 1)";

    resultScreen.innerHTML = `
      <div style="font-size:3rem; margin-bottom:8px;">⏱️🏁</div>
      <h3 style="font-size:1.4rem; margin:0 0 6px;">Waktu Habis!</h3>
      <p style="font-weight:700; color:var(--primary); font-size:1.1rem; margin:0 0 14px;">${speedRank}</p>
      
      <div class="timer-summary-grid">
        <div class="timer-stat-card">
          <span class="stat-val">${score}</span>
          <span class="stat-lbl">Total Skor XP</span>
        </div>
        <div class="timer-stat-card">
          <span class="stat-val">${correctCount}/${totalAnswered}</span>
          <span class="stat-lbl">Jawaban Benar</span>
        </div>
        <div class="timer-stat-card">
          <span class="stat-val">${highestCombo}x</span>
          <span class="stat-lbl">Kombo Maksimal</span>
        </div>
      </div>

      <p class="text-muted" style="font-size:0.875rem;">Akurasi Kecepatan: <b>${accuracy}%</b></p>
      <button id="btn-restart-timer" class="btn-primary" style="margin-top:12px; padding:10px 22px;">↺ Mainkan Lagi</button>
    `;

    if (score >= 30) {
      AppState.complete("timer", 10);
    }

    const restartBtn = $("#btn-restart-timer", resultScreen);
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        SoundFX.playClick();
        startGame();
      });
    }
  }

  btnStart.addEventListener("click", () => {
    SoundFX.playClick();
    startGame();
  });
}

// ==========================================================================
// #46 KUIS MODE BERTAHAN (SURVIVAL MODE - SUDDEN DEATH)
// ==========================================================================
function initSurvivalMode() {
  const arena = $("#survival-arena");
  if (!arena) return;

  const livesEl = $("#survival-lives", arena);
  const streakEl = $("#survival-streak", arena);
  const bestEl = $("#survival-best", arena);
  const playArea = $("#survival-play-area", arena);
  const qCategory = $("#survival-q-category", arena);
  const qCounter = $("#survival-q-counter", arena);
  const qText = $("#survival-question-text", arena);
  const optionsGrid = $("#survival-options", arena);
  const feedbackEl = $("#survival-fact-feedback", arena);
  const gameoverCard = $("#survival-gameover-card", arena);
  const gameoverMsg = $("#survival-gameover-msg", arena);
  const finalStreakEl = $("#survival-final-streak", arena);
  const finalBestEl = $("#survival-final-best", arena);
  const btnRestart = $("#btn-survival-restart", arena);

  let currentStreak = 0;
  let bestStreak = 0;
  let qDeck = [];
  let currentDeckIdx = 0;
  let hasCompletedTask = false;

  function shuffleDeck() {
    qDeck = [...SURVIVAL_MODE_DATA].sort(() => Math.random() - 0.5);
    currentDeckIdx = 0;
  }

  function displayQuestion() {
    if (currentDeckIdx >= qDeck.length) {
      shuffleDeck();
    }
    const q = qDeck[currentDeckIdx];
    if (!q) return;

    if (qCategory) qCategory.textContent = `Kategori: ${q.category || "Fakta Kosmik"}`;
    if (qCounter) qCounter.textContent = `Pertanyaan #${currentStreak + 1}`;
    if (qText) qText.textContent = q.question;
    if (feedbackEl) {
      feedbackEl.hidden = true;
      feedbackEl.textContent = "";
    }

    if (optionsGrid) {
      optionsGrid.innerHTML = q.options.map((opt, idx) => `
        <button type="button" class="survival-opt-btn" data-idx="${idx}" aria-label="Pilihan ${idx + 1}: ${opt}">
          <span>${opt}</span>
          <span aria-hidden="true">→</span>
        </button>
      `).join("");
    }
  }

  if (optionsGrid) {
    optionsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".survival-opt-btn");
      if (!btn || btn.disabled) return;

      const chosenIdx = parseInt(btn.dataset.idx, 10);
      const q = qDeck[currentDeckIdx];
      if (!q) return;

      // Kunci semua tombol agar tidak bisa spam klik
      $$(".survival-opt-btn", optionsGrid).forEach((b) => (b.disabled = true));

      if (chosenIdx === q.correct) {
        SoundFX.playSuccess();
        btn.classList.add("is-correct");
        currentStreak++;
        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }

        if (streakEl) streakEl.textContent = currentStreak;
        if (bestEl) bestEl.textContent = `${bestStreak} 🔥`;

        if (feedbackEl) {
          feedbackEl.innerHTML = `<b>✓ Benar!</b> ${q.fact}`;
          feedbackEl.hidden = false;
        }

        // Selesaikan misi jika mencapai minimal 5 streak
        if (currentStreak >= 5 && !hasCompletedTask) {
          hasCompletedTask = true;
          AppState.complete("surv", 15);
        }

        setTimeout(() => {
          currentDeckIdx++;
          displayQuestion();
        }, 900);
      } else {
        SoundFX.playLaser();
        btn.classList.add("is-wrong");
        const correctBtn = $(`[data-idx="${q.correct}"]`, optionsGrid);
        if (correctBtn) correctBtn.classList.add("is-correct");

        if (feedbackEl) {
          feedbackEl.innerHTML = `<b>✕ Salah!</b> ${q.fact}`;
          feedbackEl.hidden = false;
        }

        setTimeout(() => {
          if (playArea) playArea.hidden = true;
          if (gameoverCard) gameoverCard.hidden = false;
          if (finalStreakEl) finalStreakEl.textContent = currentStreak;
          if (finalBestEl) finalBestEl.textContent = bestStreak;

          let note = "Navigasi roketmu meleset. Evaluasi kembali data penerbangan kosmikmu!";
          if (currentStreak >= 5) {
            note = `Luar biasa! Rekor bertahannmu mencapai ${currentStreak} pertanyaan berturut-turut!`;
          } else if (currentStreak >= 1) {
            note = `Kamu berhasil bertahan melewati ${currentStreak} rintangan kosmik berturut-turut. Ayo coba capai 5!`;
          }
          if (gameoverMsg) gameoverMsg.textContent = note;
        }, 1100);
      }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener("click", () => {
      SoundFX.playClick();
      currentStreak = 0;
      if (streakEl) streakEl.textContent = "0";
      if (livesEl) livesEl.textContent = "1 Nyawa";
      if (gameoverCard) gameoverCard.hidden = true;
      if (playArea) playArea.hidden = false;
      shuffleDeck();
      displayQuestion();
    });
  }

  // Mulai game awal
  shuffleDeck();
  displayQuestion();
}

// ==========================================================================
// #47 PUZZLE GESER PLANET JUPITER (SLIDE PUZZLE 3x3)
// ==========================================================================
function initPuzzleSlide() {
  const boardEl = $("#slide-puzzle-board");
  if (!boardEl) return;

  const moveCountEl = $("#slide-move-count");
  const btnShuffle = $("#btn-slide-shuffle");
  const btnGuide = $("#btn-slide-guide");
  const previewBox = $("#slide-preview-box");
  const solvedMsg = $("#slide-solved-msg");

  let boardState = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 adalah slot kosong
  let moveCount = 0;
  let isWon = false;
  let masterJupiterCanvas = null;

  // Render master gambar Jupiter ke canvas offscreen (288x288)
  function getMasterJupiterCanvas() {
    if (masterJupiterCanvas) return masterJupiterCanvas;
    const size = 288;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - 10;

    // Latar angkasa pekat
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, size, size);

    // Bintang latar
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(24, 30, 1.2, 0, Math.PI * 2);
    ctx.arc(264, 45, 1, 0, Math.PI * 2);
    ctx.arc(240, 260, 1.2, 0, Math.PI * 2);
    ctx.arc(36, 248, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Kliping bulatan Jupiter
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Dasar atmosfer oranye keemasan
    ctx.fillStyle = "#d97706";
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Sabuk & zona atmosfer (belts & zones)
    const bands = [
      { y: 0.10, h: 0.08, c: "#fef3c7" },
      { y: 0.18, h: 0.11, c: "#b45309" },
      { y: 0.29, h: 0.07, c: "#fed7aa" },
      { y: 0.36, h: 0.13, c: "#92400e" },
      { y: 0.49, h: 0.08, c: "#fde68a" },
      { y: 0.57, h: 0.14, c: "#78350f" },
      { y: 0.71, h: 0.08, c: "#fed7aa" },
      { y: 0.79, h: 0.12, c: "#9a3412" }
    ];
    bands.forEach((b) => {
      ctx.fillStyle = b.c;
      ctx.fillRect(cx - r, (cy - r) + (r * 2 * b.y), r * 2, r * 2 * b.h);
    });

    // Bintik Merah Besar (Great Red Spot) ikonik di belahan selatan
    const grsX = cx + (r * 0.34);
    const grsY = cy + (r * 0.30);
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, r * 0.22, r * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#b91c1c";
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, r * 0.15, r * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.ellipse(grsX - 3, grsY - 2, r * 0.07, r * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gradien bayangan sferis 3D
    const grad = ctx.createRadialGradient(cx - (r * 0.35), cy - (r * 0.35), r * 0.1, cx, cy, r);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.22)");
    grad.addColorStop(0.7, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.75)");
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore();

    // Cincin pendar halus luar
    ctx.strokeStyle = "rgba(254, 240, 138, 0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    masterJupiterCanvas = c;
    return masterJupiterCanvas;
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    const masterCanvas = getMasterJupiterCanvas();
    const tileSize = 96;

    boardState.forEach((tileId, pos) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.pos = pos;

      if (tileId === 0) {
        btn.className = "slide-tile slide-tile-empty";
        btn.setAttribute("aria-label", "Slot Kosong");
        btn.setAttribute("tabindex", "0");
      } else {
        btn.className = "slide-tile";
        btn.setAttribute("aria-label", `Ubin #${tileId} di posisi ${pos + 1}`);

        // Badge Angka
        const numSpan = document.createElement("span");
        numSpan.className = "slide-tile-num";
        numSpan.textContent = tileId;
        btn.appendChild(numSpan);

        // Potongan kanvas Jupiter asli untuk ubin ini
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = tileSize;
        tileCanvas.height = tileSize;
        tileCanvas.className = "slide-tile-canvas";
        const tCtx = tileCanvas.getContext("2d");
        if (tCtx) {
          const targetIdx = tileId - 1;
          const srcX = (targetIdx % 3) * tileSize;
          const srcY = Math.floor(targetIdx / 3) * tileSize;
          tCtx.drawImage(masterCanvas, srcX, srcY, tileSize, tileSize, 0, 0, tileSize, tileSize);
        }
        btn.appendChild(tileCanvas);
      }

      boardEl.appendChild(btn);
    });
  }

  function getValidNeighbors(emptyPos) {
    const row = Math.floor(emptyPos / 3);
    const col = emptyPos % 3;
    const neighbors = [];
    if (col > 0) neighbors.push(emptyPos - 1); // kiri
    if (col < 2) neighbors.push(emptyPos + 1); // kanan
    if (row > 0) neighbors.push(emptyPos - 3); // atas
    if (row < 2) neighbors.push(emptyPos + 3); // bawah
    return neighbors;
  }

  function tryMove(pos) {
    if (isWon) return false;
    const emptyPos = boardState.indexOf(0);
    const neighbors = getValidNeighbors(emptyPos);

    if (neighbors.includes(pos)) {
      // Tukar posisi
      boardState[emptyPos] = boardState[pos];
      boardState[pos] = 0;
      moveCount++;
      if (moveCountEl) moveCountEl.textContent = moveCount;
      SoundFX.playClick();
      renderBoard();
      checkWin();
      return true;
    }
    return false;
  }

  function checkWin() {
    const isSolved = boardState.slice(0, 8).every((val, idx) => val === idx + 1);
    if (isSolved && !isWon) {
      isWon = true;
      if (solvedMsg) solvedMsg.hidden = false;
      SoundFX.playFanfare();
      AppState.complete("pslide", 15);
    }
  }

  function shuffleSolvable() {
    boardState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let prevPos = -1;
    // Lakukan 40 langkah acak dari kondisi terpecahkan untuk menjamin 100% selalu dapat diselesaikan
    for (let step = 0; step < 40; step++) {
      const emptyPos = boardState.indexOf(0);
      let neighbors = getValidNeighbors(emptyPos);
      if (prevPos !== -1 && neighbors.length > 1) {
        neighbors = neighbors.filter((p) => p !== prevPos);
      }
      const chosenPos = neighbors[Math.floor(Math.random() * neighbors.length)];
      boardState[emptyPos] = boardState[chosenPos];
      boardState[chosenPos] = 0;
      prevPos = emptyPos;
    }

    moveCount = 0;
    isWon = false;
    if (moveCountEl) moveCountEl.textContent = "0";
    if (solvedMsg) solvedMsg.hidden = true;
    renderBoard();
  }

  // Interaksi Klik Ubin
  boardEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".slide-tile");
    if (!btn || btn.classList.contains("slide-tile-empty")) return;
    const pos = parseInt(btn.dataset.pos, 10);
    tryMove(pos);
  });

  // Navigasi Keyboard (Tombol Panah & Enter)
  boardEl.addEventListener("keydown", (e) => {
    const emptyPos = boardState.indexOf(0);
    let targetPos = -1;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      targetPos = emptyPos + 3; // Ubin di bawah slot bergeser ke atas
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      targetPos = emptyPos - 3; // Ubin di atas slot bergeser ke bawah
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (emptyPos % 3 < 2) targetPos = emptyPos + 1; // Ubin di kanan bergeser ke kiri
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (emptyPos % 3 > 0) targetPos = emptyPos - 1; // Ubin di kiri bergeser ke kanan
    } else if (e.key === "Enter" || e.key === " ") {
      const btn = e.target.closest(".slide-tile");
      if (btn && !btn.classList.contains("slide-tile-empty")) {
        e.preventDefault();
        tryMove(parseInt(btn.dataset.pos, 10));
        return;
      }
    }

    if (targetPos >= 0 && targetPos < 9) {
      if (tryMove(targetPos)) {
        // Pindahkan fokus ke ubin yang baru saja digeser
        const newBtn = $(`[data-pos="${emptyPos}"]`, boardEl);
        if (newBtn) newBtn.focus();
      }
    }
  });

  if (btnShuffle) {
    btnShuffle.addEventListener("click", () => {
      SoundFX.playClick();
      shuffleSolvable();
    });
  }

  if (btnGuide && previewBox) {
    btnGuide.addEventListener("click", () => {
      const isHidden = previewBox.hidden;
      previewBox.hidden = !isHidden;
      btnGuide.setAttribute("aria-expanded", String(isHidden));
      SoundFX.playClick();
    });
  }

  // Shuffle awal
  shuffleSolvable();
}

// ==========================================================================
// #48 PUZZLE JIGSAW TATA SURYA (JIGSAW PUZZLE)
// ==========================================================================
function initPuzzleJigsaw() {
  const container = $("#jigsaw-container");
  if (!container) return;

  const boardEl = $("#jigsaw-board", container);
  const trayEl = $("#jigsaw-tray", container);
  const progressEl = $("#jigsaw-progress", container);
  const btnReset = $("#btn-jigsaw-reset", container);
  const solvedMsg = $("#jigsaw-solved-msg", container);

  let selectedPiece = null;

  function renderPuzzle() {
    if (!boardEl || !trayEl) return;
    boardEl.innerHTML = "";
    trayEl.innerHTML = "";
    selectedPiece = null;
    if (solvedMsg) solvedMsg.hidden = true;
    if (progressEl) progressEl.textContent = "Tersusun: 0 / 6";

    // Buat 6 slot target di papan (urut 1..6)
    PUZZLE_JIGSAW_DATA.forEach((item) => {
      const slot = document.createElement("div");
      slot.className = "jigsaw-slot";
      slot.dataset.slotId = item.id;
      slot.dataset.slotOrder = item.order;
      slot.setAttribute("role", "button");
      slot.setAttribute("tabindex", "0");
      slot.setAttribute("aria-label", `Slot ${item.order}: ${item.title}`);
      slot.innerHTML = `
        <span class="jigsaw-slot-num">Zona #${item.order}</span>
        <span class="jigsaw-slot-title">${item.title}</span>
        <span class="text-subtle">${item.name}</span>
      `;
      boardEl.appendChild(slot);
    });

    // Acak kepingan untuk ditempatkan di tray
    const shuffledPieces = [...PUZZLE_JIGSAW_DATA].sort(() => Math.random() - 0.5);
    shuffledPieces.forEach((item) => {
      const piece = document.createElement("div");
      piece.className = "jigsaw-piece";
      piece.dataset.pieceId = item.id;
      piece.setAttribute("role", "button");
      piece.setAttribute("tabindex", "0");
      piece.setAttribute("aria-label", `Kepingan ${item.title}: ${item.desc}`);
      piece.innerHTML = `
        <span class="jigsaw-piece-icon" aria-hidden="true">${item.icon}</span>
        <span class="jigsaw-piece-title">${item.title}</span>
        <span class="jigsaw-piece-desc">${item.desc}</span>
      `;
      trayEl.appendChild(piece);
    });
  }

  function handlePlacement(pieceEl, slotEl) {
    if (!pieceEl || !slotEl || slotEl.classList.contains("is-filled")) return;
    const pieceId = pieceEl.dataset.pieceId;
    const slotId = slotEl.dataset.slotId;

    if (pieceId === slotId) {
      // Cocok! Pasang kepingan ke dalam slot
      pieceEl.classList.remove("is-selected");
      pieceEl.classList.add("is-placed");
      pieceEl.removeAttribute("tabindex");

      slotEl.classList.add("is-filled");
      slotEl.innerHTML = "";
      slotEl.appendChild(pieceEl);

      SoundFX.playSuccess();
      selectedPiece = null;

      // Update hitungan kepingan terpasang
      const filledCount = $$(".jigsaw-slot.is-filled", boardEl).length;
      if (progressEl) progressEl.textContent = `Tersusun: ${filledCount} / 6`;

      if (filledCount === PUZZLE_JIGSAW_DATA.length) {
        if (solvedMsg) solvedMsg.hidden = false;
        SoundFX.playFanfare();
        AppState.complete("pjigsaw", 15);
      }
    } else {
      // Salah slot
      SoundFX.playError();
      slotEl.classList.add("is-wrong");
      setTimeout(() => slotEl.classList.remove("is-wrong"), 500);
    }
  }

  // 1. Dukungan Drag-and-Drop Pointer Events via makeDraggable helper
  makeDraggable({
    container: container,
    itemSelector: ".jigsaw-piece:not(.is-placed)",
    dropZone: boardEl,
    dropSelector: ".jigsaw-slot:not(.is-filled)",
    dropOverClass: "drag-over",
    onDrop: (draggedPiece, targetSlot) => {
      handlePlacement(draggedPiece, targetSlot);
    }
  });

  // 2. Dukungan Tap-to-Place (Klik kepingan lalu klik slot)
  trayEl.addEventListener("click", (e) => {
    const piece = e.target.closest(".jigsaw-piece:not(.is-placed)");
    if (!piece) return;

    if (selectedPiece === piece) {
      piece.classList.remove("is-selected");
      selectedPiece = null;
    } else {
      $$(".jigsaw-piece", trayEl).forEach((p) => p.classList.remove("is-selected"));
      piece.classList.add("is-selected");
      selectedPiece = piece;
      SoundFX.playClick();
    }
  });

  boardEl.addEventListener("click", (e) => {
    const slot = e.target.closest(".jigsaw-slot:not(.is-filled)");
    if (!slot) return;

    if (selectedPiece) {
      handlePlacement(selectedPiece, slot);
    }
  });

  // 3. Dukungan Aksesibilitas Keyboard (Enter / Space)
  container.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    const piece = e.target.closest(".jigsaw-piece:not(.is-placed)");
    if (piece) {
      e.preventDefault();
      piece.click();
      return;
    }

    const slot = e.target.closest(".jigsaw-slot:not(.is-filled)");
    if (slot) {
      e.preventDefault();
      slot.click();
    }
  });

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      SoundFX.playClick();
      renderPuzzle();
    });
  }

  // Inisialisasi awal
  renderPuzzle();
}


