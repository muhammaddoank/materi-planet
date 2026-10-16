/**
 * DATA & KONSTANTA PEMBELAJARAN
 * Jelajah Tata Surya: 34 Cara Belajar Interaktif
 */

// Data Lengkap 8 Planet Tata Surya
const PLANETS_DATA = [
  {
    name: "Merkurius",
    color: "#9ca3af",
    distanceAU: 0.39,
    gravityRatio: 0.38,
    avgTemp: 167,
    diameterKm: 4879,
    fact: "Satu hari (siang ke siang) di sini ±176 hari Bumi!",
    isGasOrIceGiant: false
  },
  {
    name: "Venus",
    color: "#f59e0b",
    distanceAU: 0.72,
    gravityRatio: 0.91,
    avgTemp: 464,
    diameterKm: 12104,
    fact: "Berputar terbalik: Matahari terbit dari barat.",
    isGasOrIceGiant: false
  },
  {
    name: "Bumi",
    color: "#3b82f6",
    distanceAU: 1.0,
    gravityRatio: 1.0,
    avgTemp: 15,
    diameterKm: 12756,
    fact: "Satu-satunya planet yang kita tahu berkehidupan.",
    isGasOrIceGiant: false
  },
  {
    name: "Mars",
    color: "#ef4444",
    distanceAU: 1.52,
    gravityRatio: 0.38,
    avgTemp: -65,
    diameterKm: 6792,
    fact: "Punya gunung tertinggi di Tata Surya: Olympus Mons.",
    isGasOrIceGiant: false
  },
  {
    name: "Jupiter",
    color: "#d97706",
    distanceAU: 5.2,
    gravityRatio: 2.53,
    avgTemp: -110,
    diameterKm: 142984,
    fact: "Bintik Merah Besarnya adalah badai raksasa berabad-abad.",
    isGasOrIceGiant: true
  },
  {
    name: "Saturnus",
    color: "#ca8a04",
    distanceAU: 9.58,
    gravityRatio: 1.07,
    avgTemp: -140,
    diameterKm: 120536,
    fact: "Massa jenisnya lebih kecil daripada air!",
    isGasOrIceGiant: true
  },
  {
    name: "Uranus",
    color: "#0891b2",
    distanceAU: 19.2,
    gravityRatio: 0.89,
    avgTemp: -195,
    diameterKm: 51118,
    fact: "Berputar 'rebah', poros rotasinya miring hampir 98°.",
    isGasOrIceGiant: true
  },
  {
    name: "Neptunus",
    color: "#4f46e5",
    distanceAU: 30.07,
    gravityRatio: 1.14,
    avgTemp: -200,
    diameterKm: 49528,
    fact: "Memiliki angin badai tercepat: melampaui 2.000 km/jam.",
    isGasOrIceGiant: true
  }
];

// #4 Tab Jenis Benda Langit
const CELESTIAL_TYPES_DATA = [
  {
    title: "Kebumian",
    desc: "Merkurius, Venus, Bumi, Mars: berbatu, padat, kecil, dan berada paling dekat dengan Matahari."
  },
  {
    title: "Gas Raksasa",
    desc: "Jupiter & Saturnus: sebagian besar hidrogen dan helium, tanpa permukaan padat yang bisa dipijak."
  },
  {
    title: "Es Raksasa",
    desc: "Uranus & Neptunus: kaya akan air, amonia, dan metana beku yang berputar di atmosfer dan mantelnya."
  },
  {
    title: "Planet Kerdil",
    desc: "Pluto, Ceres, Eris: memiliki gravitasi untuk berbentuk bulat, namun belum 'membersihkan' orbitnya dari batuan lain."
  }
];

// #9 Hotspot Lapisan Matahari
const SOLAR_LAYERS_DATA = [
  {
    name: "Korona",
    desc: "Lapisan atmosfer terluar; suhunya misterius karena jauh lebih panas (jutaan °C) daripada permukaan Matahari.",
    color: "#fde68a",
    radius: 92
  },
  {
    name: "Fotosfer",
    desc: "'Permukaan' bercahaya yang terlihat dari Bumi, bersuhu sekitar 5.500 °C.",
    color: "#fbbf24",
    radius: 74
  },
  {
    name: "Zona Konveksi",
    desc: "Gas plasma panas membubung ke atas lalu mendingin dan turun kembali, mirip gejolak air mendidih.",
    color: "#f59e0b",
    radius: 56
  },
  {
    name: "Zona Radiatif",
    desc: "Energi foton merambat sangat lambat dan butuh puluhan ribu tahun untuk menembus keluar.",
    color: "#ea580c",
    radius: 38
  },
  {
    name: "Inti",
    desc: "Pusat reaksi fusi nuklir hidrogen menjadi helium dengan suhu dahsyat ±15 juta °C.",
    color: "#dc2626",
    radius: 20
  }
];

// #10 Stepper Pembentukan Tata Surya
const SOLAR_FORMATION_STEPS = [
  {
    emoji: "☁️",
    desc: "Awan gas & debu antariksa raksasa (nebula) mulai runtuh karena gravitasinya sendiri."
  },
  {
    emoji: "🌀",
    desc: "Awan tersebut berputar semakin kencang dan memipih membentuk piringan cakram akresi."
  },
  {
    emoji: "☀️",
    desc: "Pusat cakram memadat, suhunya melonjak, dan menyala menjadi protobintang: Matahari lahir!"
  },
  {
    emoji: "🪨",
    desc: "Butir debu di piringan saling bertabrakan dan bergumpal menjadi benda kecil (planetesimal)."
  },
  {
    emoji: "🪐",
    desc: "Gumpalan planetesimal bergabung membentuk planet-planet yang stabil, sekitar 4,6 miliar tahun lalu."
  }
];

// #14 Game Memori Pasangan Karakteristik
const MEMORY_PAIRS_DATA = [
  ["Saturnus", "💍 Cincin Megah"],
  ["Mars", "🔴 Planet Merah"],
  ["Bumi", "🌊 Kaya Air"],
  ["Jupiter", "🌀 Bintik Merah"],
  ["Venus", "🔥 Terpanas"],
  ["Merkurius", "🏃 Terdekat Matahari"]
];

// #15 Kilat Benar / Salah
const TRUE_FALSE_QUESTIONS = [
  { q: "Matahari adalah sebuah planet.", a: false },
  { q: "Bumi mengelilingi Matahari.", a: true },
  { q: "Venus lebih dekat ke Matahari daripada Mars.", a: true },
  { q: "Di ruang hampa udara antariksa, suara ledakan terdengar sangat keras.", a: false }
];

// #16 Kuis Pilihan Ganda
const QUIZ_QUESTIONS = [
  {
    q: "Gaya apa yang menahan planet-planet tetap setia mengorbit Matahari?",
    options: ["Gravitasi", "Medan Magnet Bumi", "Angin Matahari"],
    answerIndex: 0,
    hint: "Gaya tarik yang sama yang menyebabkan buah apel jatuh ke tanah.",
    explanation: "Gravitasi Matahari yang sangat kuat melengkungkan ruang dan menjaga planet pada orbitnya."
  },
  {
    q: "Satu tahun di Bumi didefinisikan sebagai waktu yang dibutuhkan Bumi untuk…",
    options: ["Berotasi sekali pada porosnya", "Mengelilingi Matahari satu putaran penuh", "Mengelilingi Bulan sekali"],
    answerIndex: 1,
    hint: "Rotasi pada poros menghasilkan siklus siang dan malam (1 hari).",
    explanation: "Revolusi Bumi mengelilingi Matahari memakan waktu sekitar 365,25 hari (1 tahun)."
  },
  {
    q: "Sabuk asteroid utama di Tata Surya membentang di antara orbit…",
    options: ["Bumi dan Mars", "Mars dan Jupiter", "Saturnus dan Uranus"],
    answerIndex: 1,
    hint: "Sabuk ini menjadi batas alami antara planet berbatu dan raksasa gas.",
    explanation: "Sabuk asteroid utama berada di antara Mars dan planet gas terbesar, Jupiter."
  }
];

// #17 Misi ke Mars: Skenario Bercabang (Choose Your Own Adventure)
const MARS_MISSION_TREE = {
  start: {
    text: "🚀 Kamu adalah komandan awak wahana menuju Mars. Bahan bakar tersisa 20% dan sinyal radio ke Bumi melemah. Keputusan utamamu?",
    choices: [
      { label: "Langsung lakukan pendaratan ke permukaan", next: "land_direct" },
      { label: "Masuk ke orbit aman dan hemat cadangan daya", next: "orbit_safe" }
    ]
  },
  land_direct: {
    text: "Pendaratan berhasil mulus di kawah Jezero, namun bahan bakar pendorong habis total. Apa prioritas pertamamu?",
    choices: [
      { label: "Cari deposit es air tanah untuk diproses jadi propelan", next: "end_win_fuel" },
      { label: "Keluar berfoto selfie di samping wahana", next: "end_fail_selfie" }
    ]
  },
  orbit_safe: {
    text: "Dari orbit tinggi kamu menghitung ulang lintasan pendaratan. Sinyal pemancar ke Bumi kembali stabil. Langkahmu?",
    choices: [
      { label: "Sinkronkan telemetri dengan pusat kendali Bumi", next: "end_win_mission" },
      { label: "Abaikan instruksi kendali dan mendarat manual", next: "end_fail_solo" }
    ]
  },
  end_win_fuel: {
    text: "✅ Misi Sukses! Timmu menemukan cadangan es air yang berhasil dipecah menjadi hidrogen & oksigen. Awakmu bisa pulang dengan selamat."
  },
  end_fail_selfie: {
    text: "⚠️ Misi Gagal: Waktu kritis terbuang tanpa mengamankan logistik darurat. Lingkungan Mars tidak memberi ruang untuk kelengahan."
  },
  end_win_mission: {
    text: "✅ Misi Sukses Sempurna! Kerja sama dengan stasiun kendali menghasilkan prosedur pendaratan yang presisi dan aman."
  },
  end_fail_solo: {
    text: "⚠️ Pendaratan Keras: Manuver manual tanpa perhitungan komputer pusat menyebabkan kerusakan instrumen navigasi."
  }
};

// #22 Klasifikasi ke Keranjang
const BUCKET_ITEMS_DATA = [
  { label: "☀️ Matahari", categoryId: 0 },
  { label: "🌍 Bumi", categoryId: 1 },
  { label: "🌕 Bulan", categoryId: 2 },
  { label: "✨ Sirius", categoryId: 0 },
  { label: "🔴 Mars", categoryId: 1 },
  { label: "🧊 Europa", categoryId: 2 }
];

const BUCKET_CATEGORIES_DATA = ["⭐ Bintang", "🪐 Planet", "🌙 Satelit Alami"];

// #24 Timeline Eksplorasi Antariksa
const SPACE_TIMELINE_DATA = [
  { year: 1957, event: "Sputnik 1: Satelit buatan pertama manusia berhasil mengorbit Bumi." },
  { year: 1961, event: "Yuri Gagarin: Manusia pertama yang berhasil terbang ke luar angkasa." },
  { year: 1969, event: "Apollo 11: Neil Armstrong & Buzz Aldrin menjadi manusia pertama di Bulan." },
  { year: 1977, event: "Voyager 1 & 2: Dua wahana antariksa legendaris diluncurkan menuju tepi Tata Surya." },
  { year: 1990, event: "Teleskop Hubble: Mengorbit Bumi dan membuka jendela alam semesta yang menakjubkan." },
  { year: 1998, event: "Modul Pertama ISS: Stasiun Luar Angkasa Internasional mulai dirakit di orbit." },
  { year: 2021, event: "Teleskop James Webb (JWST): Diluncurkan untuk mengamati galaksi-galaksi purba." }
];

// #28 Word Search Matrix
const WORD_SEARCH_DATA = {
  grid: [
    "BUMIXQV",
    "UKDWETE",
    "LAPZOHN",
    "ARGFJCU",
    "NDKSYBS",
    "ZMARSTD",
    "WPOYLEQ"
  ],
  words: ["BUMI", "BULAN", "VENUS", "MARS"]
};

// #29 Kartu Pengulangan Berjarak (Leitner System)
const LEITNER_CARDS_DATA = [
  { q: "Planet apa yang letaknya paling dekat dengan Matahari?", a: "Merkurius" },
  { q: "Di lapisan Matahari mana reaksi fusi nuklir berlangsung?", a: "Inti (Suhu ±15 juta °C)" },
  { q: "Satu putaran Bumi mengelilingi Matahari disebut apa?", a: "Revolusi (±365,25 hari)" },
  { q: "Gaya apa yang menjaga orbit planet tetap stabil?", a: "Gravitasi Matahari" },
  { q: "Sabuk asteroid utama berada di antara planet apa?", a: "Mars dan Jupiter" },
  { q: "Planet mana yang memiliki suhu permukaan paling panas?", a: "Venus (±464 °C karena efek rumah kaca)" }
];

// #31 Teka-Teki Silang (TTS)
const CROSSWORD_DATA = [
  { word: "PLANET", row: 0, col: 2, isDown: 1, clue: "Benda langit yang mengorbit bintang" },
  { word: "BULAN", row: 2, col: 5, isDown: 1, clue: "Satelit alami Bumi yang tampak malam hari" },
  { word: "BUMI", row: 2, col: 7, isDown: 1, clue: "Planet biru tempat tinggal umat manusia" },
  { word: "MARS", row: 5, col: 0, isDown: 1, clue: "Planet merah berdebu besi oksida" },
  { word: "MATAHARI", row: 5, col: 0, isDown: 0, clue: "Bintang pusat tata surya kita" },
  { word: "SATURNUS", row: 8, col: 0, isDown: 0, clue: "Planet yang terkenal dengan cincinnya" }
];

// #33 Whack-a-Mole Pertanyaan Cepat
const WHACK_MOLE_DATA = [
  { q: "Planet terdekat ke Matahari", correct: "Merkurius", wrongs: ["Venus", "Mars", "Jupiter"] },
  { q: "Planet terbesar di Tata Surya", correct: "Jupiter", wrongs: ["Bumi", "Mars", "Venus"] },
  { q: "Planet bercincin paling megah", correct: "Saturnus", wrongs: ["Mars", "Venus", "Uranus"] },
  { q: "Planet merah berdebu", correct: "Mars", wrongs: ["Venus", "Bumi", "Neptunus"] },
  { q: "Planet terpanas di Tata Surya", correct: "Venus", wrongs: ["Merkurius", "Mars", "Bumi"] },
  { q: "Satelit alami milik Bumi", correct: "Bulan", wrongs: ["Phobos", "Europa", "Titan"] }
];

// #34 Seret Kata ke Kalimat (Cloze Test)
const CLOZE_PARAGRAPH_DATA = {
  template: [
    "Matahari adalah sebuah ", 0, " di pusat Tata Surya. Planet ", 1,
    " berada paling dekat dengan Matahari, sedangkan ", 2,
    " adalah planet berukuran paling raksasa. Bumi memerlukan waktu sekitar ", 3,
    " hari untuk menyelesaikan satu kali orbit revolusi."
  ],
  correctAnswers: ["bintang", "Merkurius", "Jupiter", "365"],
  wordBank: ["bintang", "Merkurius", "Jupiter", "365", "planet", "Mars"]
};

// #35 Hotspot Image Pin (hotspotimg)
const HOTSPOT_PIN_DATA = [
  {
    id: "jupiter",
    planet: "Jupiter",
    targetName: "Bintik Merah Besar",
    question: "Tancapkan pin tepat pada <b>Bintik Merah Besar (Great Red Spot)</b> — badai raksasa di atmosfer Jupiter!",
    targetX: 64,
    targetY: 66,
    radius: 12,
    hint: "Petunjuk: Pusaran lonjong merah ini terletak di belahan bumi selatan (bagian bawah) Jupiter.",
    explanation: "Tepat sekali! 🎯 Bintik Merah Besar adalah badai raksasa yang telah berputar berabad-abad dan berukuran lebih besar dari Bumi.",
    svgType: "jupiter"
  },
  {
    id: "mars",
    planet: "Mars",
    targetName: "Tudung Es Kutub",
    question: "Tancapkan pin tepat pada <b>Tudung Es Kutub</b> planet Mars!",
    targetX: 50,
    targetY: 15,
    radius: 12,
    hint: "Petunjuk: Perhatikan area berwarna putih cerah di kutub utara (bagian puncak) planet Mars.",
    explanation: "Tepat sasaran! 🎯 Tudung es Mars terdiri dari es air dan es kering (karbon dioksida beku) yang mencair dan membeku sesuai musim Mars.",
    svgType: "mars"
  },
  {
    id: "saturn",
    planet: "Saturnus",
    targetName: "Piringan Cincin Megah",
    question: "Tancapkan pin pada <b>Piringan Cincin</b> yang membentang luas di sekeliling Saturnus!",
    targetX: 20,
    targetY: 50,
    radius: 16,
    altTarget: { targetX: 80, targetY: 50, radius: 16 },
    hint: "Petunjuk: Tancapkan pada sayap bentangan piringan di sisi luar tubuh planet Saturnus.",
    explanation: "Luar biasa! 🎯 Cincin Saturnus terbuat dari miliaran partikel es air dan debu beku yang memantulkan cahaya matahari dengan sangat indah.",
    svgType: "saturn"
  }
];

// #36 Pairing Dua Kolom (Drag & Drop / Tap to Pair)
const PAIRING_DATA = [
  { id: "jup", left: "🪐 Jupiter", right: "Bintik Merah Besar (Badai raksasa purba)" },
  { id: "sat", left: "💍 Saturnus", right: "Massa jenis lebih kecil daripada air" },
  { id: "ven", left: "🔥 Venus", right: "Planet terpanas & berputar terbalik" },
  { id: "mar", left: "🔴 Mars", right: "Gunung tertinggi di Tata Surya (Olympus Mons)" },
  { id: "ura", left: "❄️ Uranus", right: "Poros rotasi miring rebah hampir 98°" }
];

// #37 Rangkaian Benar / Salah Beruntun (True/False Chain)
const TF_CHAIN_DATA = [
  {
    q: "Matahari menyumbang lebih dari 99% dari seluruh massa di Tata Surya.",
    a: true,
    exp: "Benar! Matahari menguasai sekitar 99,86% dari massa total seluruh Tata Surya."
  },
  {
    q: "Merkurius adalah planet terpanas karena paling dekat dengan Matahari.",
    a: false,
    exp: "Salah! Planet terpanas adalah Venus (464 °C) akibat efek rumah kaca ekstrem atmosfer CO₂."
  },
  {
    q: "Satu kali rotasi (hari) di Venus lebih lama daripada satu kali revolusinya (tahun).",
    a: true,
    exp: "Benar! Venus berotasi sangat lambat (243 hari Bumi) sementara revolusinya hanya 225 hari Bumi."
  },
  {
    q: "Olympus Mons di Mars tingginya hampir tiga kali lipat tinggi Gunung Everest.",
    a: true,
    exp: "Benar! Olympus Mons memiliki ketinggian menjulang sekitar 21,9 km."
  },
  {
    q: "Bulan menghasilkan cahaya sendiri melalui reaksi pembakaran kimia.",
    a: false,
    exp: "Salah! Bulan tidak memancarkan cahaya sendiri; ia memantulkan cahaya dari Matahari."
  },
  {
    q: "Saturnus adalah satu-satunya planet yang memiliki sistem cincin di Tata Surya.",
    a: false,
    exp: "Salah! Jupiter, Uranus, dan Neptunus juga memiliki cincin, meski jauh lebih tipis dan redup."
  }
];

// #38 Kuis Pilihan Berganda Multi-Select (Multiple Response)
const QUIZ_MULTI_DATA = {
  question: "Manakah fakta berikut yang <b>BENAR</b> mengenai planet Mars? <span class='text-muted'>(Pilih 3 jawaban yang tepat)</span>",
  options: [
    { text: "Memiliki dua satelit alami kecil bernama Phobos dan Deimos.", correct: true },
    { text: "Warna kemerahannya berasal dari debu kaya senyawa besi oksida (karat).", correct: true },
    { text: "Memiliki sistem cincin es raksasa yang tampak jelas dari teleskop Bumi.", correct: false },
    { text: "Terdapat bukti kuat bahwa air cair pernah mengalir di permukaannya pada masa purba.", correct: true },
    { text: "Suhu rata-rata permukaannya jauh lebih panas daripada suhu rata-rata Bumi.", correct: false }
  ],
  requiredCount: 3,
  explanation: "Tepat sekali! Tiga fakta benar Mars adalah: memiliki bulan Phobos & Deimos, kaya oksida besi (karat), dan pernah dialiri air cair purba."
};

// #39 Isian Angka Presisi (Numeric Entry)
const NUMERIC_ENTRY_DATA = [
  {
    q: "Berapa jarak rata-rata Bumi ke Matahari dalam satuan <b>AU (Astronomical Unit)</b>?",
    answer: 1,
    tolerance: 0.1,
    unit: "AU",
    hint: "1 AU didefinisikan persis sebagai jarak rata-rata Bumi ke Matahari (±150 juta km)."
  },
  {
    q: "Berapa jumlah <b>planet utama</b> yang diakui resmi di Tata Surya saat ini?",
    answer: 8,
    tolerance: 0,
    unit: "planet",
    hint: "Hitung dari Merkurius sampai Neptunus (Pluto berstatus planet kerdil sejak 2006)."
  },
  {
    q: "Berapa menit waktu yang dibutuhkan berkas cahaya Matahari untuk mencapai Bumi (dibulatkan)?",
    answer: 8,
    tolerance: 0.5,
    unit: "menit",
    hint: "Cahaya menempuh jarak 150 juta km dengan kecepatan 300.000 km/detik (sekitar 8 menit 20 detik)."
  },
  {
    q: "Berapa hari Bumi waktu yang dibutuhkan Merkurius untuk satu kali mengelilingi Matahari (revolusi)?",
    answer: 88,
    tolerance: 1,
    unit: "hari",
    hint: "Merkurius adalah pelari tercepat di tata surya, menyelesaikan satu tahun hanya dalam ±88 hari."
  }
];

// #40 Toggle Lapisan Bumi (Layer Toggle) - Visualisasi 3D Potongan Melintang
const EARTH_LAYERS_DATA = [
  {
    id: "atmosphere",
    name: "Atmosfer & Magnetosfer",
    depth: "Ketebalan ±100 – 10.000 km",
    temp: "Suhu: -90 °C hingga +1.500 °C",
    state: "Campuran Gas (78% N₂, 21% O₂, Ar, CO₂)",
    color: "#38bdf8",
    desc: "Perisai gas tipis bercahaya biru yang melindungi kehidupan: menyaring radiasi ultraviolet berbahaya, membakar jutaan meteoroid tiap hari, dan menahan panas agar air tetap cair.",
    role: "Perisai Radiasi UV & Pengatur Iklim",
    svgId: "layer-3d-atmosphere"
  },
  {
    id: "crust",
    name: "Kerak Bumi (Crust)",
    depth: "Ketebalan 5 – 70 km",
    temp: "Suhu: 0 °C hingga ±1.000 °C",
    state: "Batuan Padat Silikat (Granit & Basal)",
    color: "#78716c",
    desc: "Kulit batuan padat terluar yang sangat tipis (ibarat kulit apel). Di sinilah benua membentang, samudra beriak, dan seluruh peradaban makhluk hidup berpijak.",
    role: "Biosfer, Daratan Benua, & Dasar Samudra",
    svgId: "layer-3d-crust"
  },
  {
    id: "mantle",
    name: "Mantel Bumi (Mantle)",
    depth: "Ketebalan ±2.900 km (84% Volume Bumi)",
    temp: "Suhu: 1.000 °C – 3.700 °C",
    state: "Semi-cair / Plastis (Magma Silikat)",
    color: "#ea580c",
    desc: "Lapisan batuan cair kental superpanas yang terus bergolak lambat. Arus konveksi magma di mantel inilah yang menggeser lempeng benua dan memicu gunung api serta gempa.",
    role: "Mesin Penggerak Tektonik Benua",
    svgId: "layer-3d-mantle"
  },
  {
    id: "outer_core",
    name: "Inti Luar (Outer Core)",
    depth: "Ketebalan ±2.200 km",
    temp: "Suhu: 4.000 °C – 5.000 °C",
    state: "Logam Cair Membara (Besi & Nikel)",
    color: "#f59e0b",
    desc: "Lautan logam cair membara yang berputar kencang karena rotasi bumi. Perputaran arus logam cair ini bertindak sebagai dinamo raksasa yang membangkitkan medan magnet pelindung Bumi.",
    role: "Pembangkit Medan Magnetik Pelindung",
    svgId: "layer-3d-outer-core"
  },
  {
    id: "inner_core",
    name: "Inti Dalam (Inner Core)",
    depth: "Radius ±1.220 km (Pusat Bumi)",
    temp: "Suhu: ±5.400 °C (Sepanas Permukaan Matahari!)",
    state: "Logam Padat Kristalin (Besi-Nikel)",
    color: "#fef08a",
    desc: "Bola besi padat superpanas di pusat bumi. Meskipun suhunya menyamai permukaan Matahari, tekanan gravitasi dahsyat di pusat bumi mencegah besi ini meleleh sehingga tetap memadat.",
    role: "Pusat Gravitasi & Penstabil Rotasi Bumi",
    svgId: "layer-3d-inner-core"
  }
];

// #41 Temukan Kesalahan Konsep (Spot the Bug)
const SPOT_BUG_DATA = [
  {
    id: "comet_tail",
    title: "Misteri Arah Ekor Komet",
    subtitle: "Orbit Komet & Angin Radiasi Matahari",
    prompt: "Perhatikan diagram orbit komet mengelilingi Matahari di bawah ini. Terdapat <b>1 posisi komet</b> dengan arah ekor yang keliru secara fisika astronomi. Temukan dan ketuk komet yang salah tersebut!",
    bugId: "komet-pos-3",
    nodes: [
      {
        id: "komet-pos-1",
        letter: "A",
        label: "Posisi 1: Komet Mendekati Matahari",
        cx: 110,
        cy: 130,
        isBug: false,
        note: "Ekor gas & debu mengarah menjauhi Matahari karena terdorong angin surya radiasi matahari."
      },
      {
        id: "komet-pos-2",
        letter: "B",
        label: "Posisi 2: Perihelion (Titik Terdekat)",
        cx: 220,
        cy: 90,
        isBug: false,
        note: "Di titik terdekat perihelion, radiasi Matahari maksimal sehingga ekor komet tampak paling panjang, membentang menjauhi Matahari."
      },
      {
        id: "komet-pos-3",
        letter: "C",
        label: "Posisi 3: Komet Menjauhi Matahari",
        cx: 330,
        cy: 130,
        isBug: true,
        note: "Ekor komet digambar membuntuti di belakang arah geraknya (menghadap ke Matahari) seolah asap kendaraan bermotor. Ini adalah kesalahan konsep!"
      },
      {
        id: "komet-pos-4",
        letter: "D",
        label: "Posisi 4: Aphelion (Titik Terjauh)",
        cx: 220,
        cy: 270,
        isBug: false,
        note: "Di titik terjauh yang sangat beku, komet berupa inti es tanpa ekor gas yang aktif."
      }
    ],
    explanation: "<b>Hebat, kamu berhasil membongkar miskonsepsi ini! 🎯</b><br>Banyak orang mengira ekor komet selalu berada di belakang arah gerakannya layaknya asap roket. <b>Kenyataannya:</b> ekor komet selalu didorong menjauhi Matahari oleh <i>angin matahari</i> (aliran partikel bermuatan) dan <i>tekanan radiasi foton</i>. Maka, saat komet terbang MENJAUHI Matahari (Posisi 3), ekornya justru berada di DEPAN arah geraknya!"
  },
  {
    id: "asteroid_density",
    title: "Mitos Kepadatan Sabuk Asteroid",
    subtitle: "Skala Nyata Sabuk Asteroid vs Fiksi Ilmiah",
    prompt: "Film fiksi ilmiah sering menggambarkan wahana antariksa harus bermanuver zig-zag menghindari ribuan asteroid berjejal rapat. Ketuk elemen pada gambar yang menyajikan konsep keliru!",
    bugId: "asteroid-pile",
    nodes: [
      {
        id: "probe-ship",
        letter: "A",
        label: "Wahana Dawn Meluncur Lurus",
        cx: 85,
        cy: 160,
        isBug: false,
        note: "Wahana luar angkasa seperti Dawn & New Horizons dapat melaju lurus tanpa takut bertubrukan karena ruang angkasa sangat lengang."
      },
      {
        id: "asteroid-pile",
        letter: "B",
        label: "Bebatuan Berjejal Rapat (5 - 10 Meter)",
        cx: 245,
        cy: 160,
        isBug: true,
        note: "Asteroid digambarkan saling bertubrukan padat hanya berjarak beberapa meter. Ini adalah dramatisasi fiksi film Hollywood!"
      },
      {
        id: "mars-orbit-marker",
        letter: "C",
        label: "Zona Sabuk Utama Asteroid (1,5 - 5,2 AU)",
        cx: 220,
        cy: 250,
        isBug: false,
        note: "Sabuk asteroid utama secara ilmiah memang terletak di antara orbit planet Mars (1,5 AU) dan Jupiter (5,2 AU)."
      }
    ],
    explanation: "<b>Analisis kritis yang luar biasa! 🎯</b><br>Meski memuat jutaan asteroid, volume ruang Sabuk Asteroid sangat amat raksasa. Rata-rata jarak antar asteroid berukuran besar adalah <b>sekitar 1 juta kilometer</b> (hampir 3 kali jarak Bumi–Bulan!). Jika kamu berdiri di satu asteroid, asteroid tetangga terdekat bahkan tidak terlihat oleh mata telanjang."
  },
  {
    id: "earth_seasons",
    title: "Penyebab Terjadinya 4 Musim",
    subtitle: "Kemiringan Sumbu 23,5° vs Jarak Orbit",
    prompt: "Banyak siswa salah mengira musim panas terjadi karena Bumi lebih dekat ke Matahari. Temukan elemen konsep keliru pada bagan musim berikut!",
    bugId: "season-distance-claim",
    nodes: [
      {
        id: "axial-tilt-north",
        letter: "A",
        label: "Kemiringan Sumbu Kutub Utara Menghadap Matahari (Juni)",
        cx: 100,
        cy: 160,
        isBug: false,
        note: "Kutub utara condong menghadap Matahari pada bulan Juni, menerima sinar matahari lebih tegak lurus sehingga terjadi Musim Panas di belahan utara."
      },
      {
        id: "season-distance-claim",
        letter: "B",
        label: "Klaim: 'Bumi Lebih Dekat = Musim Panas'",
        cx: 220,
        cy: 250,
        isBug: true,
        note: "Mengklaim musim panas terjadi karena jarak fisik orbit Bumi lebih dekat ke Matahari adalah miskonsepsi astronomi klasik!"
      },
      {
        id: "axial-tilt-south",
        letter: "C",
        label: "Kemiringan Sumbu Kutub Selatan Menghadap Matahari (Desember)",
        cx: 340,
        cy: 160,
        isBug: false,
        note: "Pada bulan Desember, kutub selatan menghadap Matahari (musim panas di belahan selatan) dan kutub utara menjauhi Matahari (musim dingin di utara)."
      }
    ],
    explanation: "<b>Tepat sekali! 🎯</b><br>Jarak Bumi ke Matahari hampir tidak memengaruhi musim. Buktinya, saat belahan bumi utara mengalami puncak musim panas (bulan Juli), Bumi justru sedang berada di titik <b>Aphelion (jarak terjauh dari Matahari, ±152 juta km)</b>! Pergantian musim murni diakibatkan oleh <b>kemiringan sumbu rotasi Bumi sebesar 23,5°</b>."
  }
];

// #42 Bagan Alir Proses Daur Hidup Bintang & Materi Tata Surya (Flow Diagram)
const FLOW_DIAGRAM_DATA = {
  title: "Daur Hidup Bintang & Asal Usul Materi Tata Surya",
  subtitle: "Klik setiap simpul (node) proses untuk mempelajari tahapan evolusi kosmik pembentuk atom-atom di tubuh kita.",
  nodes: [
    {
      id: "nebula",
      step: "01",
      name: "Nebula Molekuler Purba",
      icon: "🌌",
      phase: "Cikal Bakal Bintang",
      duration: "±10 – 50 Juta Tahun",
      temp: "10 – 20 Kelvin (-260 °C)",
      desc: "Awan gas hidrogen, helium, dan debu kosmik raksasa yang dingin. Ketika gelombang kejut supernova purba lewat, gravitasi mulai menarik partikel-partikel awan memadat dan runtuh ke pusat massa.",
      chemistry: "Gas H₂ (74%), He (24%), partikel es silikat mikroskopis",
      legacy: "Dari nebula inilah Matahari dan piringan protoplanet cikal bakal Bumi lahir 4,6 miliar tahun lalu."
    },
    {
      id: "protostar",
      step: "02",
      name: "Protobintang & Piringan Akresi",
      icon: "⭐",
      phase: "Penyalaan Awal",
      duration: "±100 Ribu – 1 Juta Tahun",
      temp: "Inti mencapai ±10 Juta °C",
      desc: "Gumpalan gas yang memampat melepaskan energi potensial gravitasi menjadi panas luar biasa. Di sekelilingnya, materi membentuk piringan pipih berputar tempat batuan dan es bertabrakan membentuk planetesimal.",
      chemistry: "Fusi deuterium awal dan lonjakan tekanan radiasi",
      legacy: "Bumi dan planet lainnya terbentuk dari materi piringan akresi yang tersisa di sekitar protobintang Matahari."
    },
    {
      id: "main_sequence",
      step: "03",
      name: "Deret Utama (Main Sequence)",
      icon: "☀️",
      phase: "Masa Dewasa Bintang",
      duration: "±10 Miliar Tahun (Bintang seperti Matahari)",
      temp: "Inti ±15 Juta °C · Permukaan 5.500 °C",
      desc: "Fusi nuklir stabil: 4 inti hidrogen melebur menjadi 1 inti helium, memancarkan foton energi dahsyat. Terjadi keseimbangan hidrostatik sempurna antara tarikan gravitasi ke dalam dan dorongan tekanan radiasi ke luar.",
      chemistry: "Reaksi fusi rantai Proton-Proton: 4 ¹H ➔ ⁴He + 2e⁺ + 2ν + 26,7 MeV",
      legacy: "Matahari kita saat ini berada di fase deret utama (usia ±4,6 miliar tahun), memberikan energi stabil bagi kehidupan Bumi."
    },
    {
      id: "red_giant",
      step: "04A",
      name: "Raksasa Merah (Massa Sedang)",
      icon: "🔴",
      phase: "Bintang Menua (≤ 8 Massa Matahari)",
      duration: "±100 Juta – 1 Miliar Tahun",
      temp: "Inti ±100 Juta °C · Permukaan 3.000 °C",
      desc: "Bahan bakar hidrogen di inti habis. Inti helium menyusut dan memanas, memicu fusi cangkang hidrogen luar. Bintang menggelembung ratusan kali lipat; diameternya akan menelan Merkurius, Venus, dan kemungkinan Bumi!",
      chemistry: "Proses Triple-Alpha: 3 ⁴He ➔ ¹²C (Membentuk Karbon & Oksigen)",
      legacy: "Dalam ±5 miliar tahun ke depan, Matahari akan memasuki fase ini dan mengubah langit Bumi menjadi kubah merah membara."
    },
    {
      id: "planetary_nebula",
      step: "05A",
      name: "Nebula Planeter",
      icon: "💨",
      phase: "Pelepasan Cangkang Luar",
      duration: "±20 Ribu – 50 Ribu Tahun",
      temp: "Cangkang mengembang 20 – 30 km/detik",
      desc: "Denyut termal meniupkan lapisan gas terluar bintang ke ruang antar bintang. Cangkang gas ini berpendar memukau tersinari oleh radiasi ultraviolet dari inti bintang yang tersisa di tengahnya.",
      chemistry: "Memperkaya antariksa dengan karbon, nitrogen, dan oksigen baru",
      legacy: "Atom karbon di dalam DNA dan sel tubuh kita berasal dari hembusan bintang-bintang purba di fase ini!"
    },
    {
      id: "white_dwarf",
      step: "06A",
      name: "Katai Putih (White Dwarf)",
      icon: "⚪",
      phase: "Fase Akhir / Jenazah Bintang",
      duration: "Miliaran hingga Triliunan Tahun",
      temp: "Mendingin dari 100.000 °C ke 0 Kelvin",
      desc: "Inti karbon-oksigen padat tanpa fusi seukuran bola Bumi tetapi seberat Matahari (satu sendok teh berbobot 5 ton!). Gravitasinya ditahan oleh tekanan degenerasi elektron hingga mendingin menjadi Katai Hitam.",
      chemistry: "Materi terdegenerasi elektron padat (karbon kristalin / 'berlian raksasa')",
      legacy: "Takdir akhir Matahari kita: menjadi permata kosmik kecil padat yang bersinar redup di keheningan ruang."
    },
    {
      id: "supernova",
      step: "04B-05B",
      name: "Supernova Spektakuler (Massa Besar)",
      icon: "💥",
      phase: "Ledakan Bintang Raksasa (> 8 Massa Matahari)",
      duration: "Beberapa Detik (Pendaran berbulan-bulan)",
      temp: "Melebihi 10 Miliar Kelvin",
      desc: "Ketika fusi inti mencapai Besi-56, fusi berhenti menghasilkan energi. Gravitasi meruntuhkan inti dalam sekejap lalu memantul dalam ledakan supernova dahsyat yang kecemerlangannya menandingi seluruh galaksi!",
      chemistry: "Penangkapan neutron cepat (R-process): Sintesis emas (Au), platina (Pt), dan uranium (U)",
      legacy: "Emas pada perhiasan dan besi pada sel darah merah manusia seluruhnya ditempa dalam ledakan supernova!"
    },
    {
      id: "black_hole",
      step: "06B",
      name: "Bintang Neutron / Lubang Hitam",
      icon: "🌀",
      phase: "Sisa Inti Ekstrem",
      duration: "Abadi",
      temp: "Suhu gravitasi relativistik",
      desc: "Jika sisa massa inti 1,4 – 3 Massa Matahari, terbentuk Bintang Neutron (Pulsar). Jika sisa massa > 3 Massa Matahari, gravitasi menang mutlak: materi runtuh menjadi Singularitas titik bermassa tak terhingga: Lubang Hitam (Black Hole)!",
      chemistry: "Neutron terdegenerasi murni / singularitas ruang-waktu",
      legacy: "Objek paling misterius di alam semesta di mana ruang dan waktu melengkung tanpa batas."
    }
  ]
};

// #43 Pohon Taksonomi Benda Langit Tata Surya (Visual Tree)
const VISUAL_TREE_DATA = {
  id: "root",
  name: "Sistem Tata Surya",
  type: "root",
  icon: "🌌",
  badge: "Sistem Bintang",
  desc: "Sistem gravitasi berpusat pada Matahari, mencakup 8 planet utama, 5+ planet kerdil, ratusan satelit, dan triliunan objek kecil.",
  children: [
    {
      id: "sun_node",
      name: "Matahari (Sol)",
      type: "star",
      icon: "☀️",
      badge: "Bintang Induk G2V",
      desc: "Bintang deret utama tipe G2V. Menyumbang 99,86% dari seluruh massa sistem Tata Surya, mengendalikan orbit seluruh benda langit melalui gravitasinya.",
      stats: { diameter: "1.392.700 km", massa: "333.000 × Bumi", suhu_inti: "15.000.000 °C" }
    },
    {
      id: "major_planets",
      name: "Planet Utama (8)",
      type: "group",
      icon: "🪐",
      badge: "Definisi Resmi IAU 2006",
      desc: "Syarat resmi IAU: (1) Mengorbit Matahari, (2) Bulat karena gravitasi sendiri, (3) Telah membersihkan lingkungan orbitnya dari objek lain.",
      children: [
        {
          id: "terrestrial_group",
          name: "Planet Kebumian (Terestrial)",
          type: "subgroup",
          icon: "🪨",
          badge: "Padat & Berbatu",
          desc: "Empat planet bagian dalam yang tersusun dari batuan silikat padat dengan inti logam besi-nikel.",
          children: [
            { id: "p_mercury", name: "Merkurius", icon: "🌑", badge: "0 Satelit", desc: "Planet terkecil dan terdekat. Mengorbit Matahari hanya dalam 88 hari Bumi tanpa atmosfer penahan panas." },
            { id: "p_venus", name: "Venus", icon: "🟡", badge: "0 Satelit", desc: "Kembaran Bumi beracun. Efek rumah kaca ekstrem atmosfer CO₂ 96% menjadikannya planet terpanas (464 °C)." },
            { id: "p_earth", name: "Bumi (Gaia)", icon: "🌍", badge: "1 Satelit (Bulan)", desc: "Satu-satunya oasis kehidupan kosmik dengan air cair stabil, atmosfer nitrogen-oksigen, dan biosfer dinamis." },
            { id: "p_mars", name: "Mars", icon: "🔴", badge: "2 Satelit (Phobos & Deimos)", desc: "Planet merah berdebu besi oksida. Memiliki ngarai Valles Marineris dan gunung berapi terbesar Olympus Mons." }
          ]
        },
        {
          id: "jovian_group",
          name: "Planet Raksasa (Jovian)",
          type: "subgroup",
          icon: "💨",
          badge: "Atmosfer Tebal & Bercincin",
          desc: "Empat planet raksasa luar yang tidak memiliki permukaan padat berpijak, dikelilingi banyak satelit dan sistem cincin.",
          children: [
            { id: "p_jupiter", name: "Jupiter (Raksasa Gas)", icon: "🟠", badge: "95 Satelit", desc: "Raja planet dengan massa 2,5× gabungan semua planet lain. Memiliki Bintik Merah Raksasa badai purba 300+ tahun." },
            { id: "p_saturn", name: "Saturnus (Raksasa Gas)", icon: "🪐", badge: "146 Satelit", desc: "Ikon cincin es terindah selebar 282.000 km namun tebalnya hanya ±10 meter. Kerapatan jenisnya lebih ringan dari air!" },
            { id: "p_uranus", name: "Uranus (Raksasa Es)", icon: "🩵", badge: "28 Satelit", desc: "Planet es dengan rotasi menggelinding menyamping (kemiringan 98°). Warna biru kehijauan berasal dari gas metana atmosfer." },
            { id: "p_neptune", name: "Neptunus (Raksasa Es)", icon: "🔵", badge: "16 Satelit", desc: "Dunia berangin paling dahsyat di tata surya (hingga 2.100 km/jam). Memiliki satelit Triton yang mengorbit mundur (retrograde)." }
          ]
        }
      ]
    },
    {
      id: "dwarf_planets",
      name: "Planet Kerdil (Dwarf Planets)",
      type: "group",
      icon: "🌑",
      badge: "Kategori Khusus IAU",
      desc: "Memenuhi syarat bulat karena gravitasi, namun BELUM membersihkan lingkungan orbitnya dari objek-objek lain di sekitarnya.",
      children: [
        { id: "d_ceres", name: "Ceres", icon: "🪨", badge: "Sabuk Asteroid", desc: "Objek terbesar di Sabuk Asteroid Utama (diameter ±940 km). Diduga memiliki deposit air es di bawah mantelnya." },
        { id: "d_pluto", name: "Pluto", icon: "❄️", badge: "Sabuk Kuiper", desc: "Ditemukan tahun 1930, direklasifikasi tahun 2006. Memiliki dataran es nitrogen berbentuk hati (Sputnik Planitia) dan 5 bulan." },
        { id: "d_eris", name: "Eris", icon: "⚪", badge: "Piringan Tersebar", desc: "Objek beku seukuran Pluto berjarak 3× lebih jauh. Penemuannya memicu IAU mendefinisikan ulang istilah 'planet' pada 2006." },
        { id: "d_haumea", name: "Haumea & Makemake", icon: "🥔", badge: "Sabuk Kuiper", desc: "Haumea berotasi sangat cepat (3,9 jam) hingga berbentuk lonjong mirip bola rugby, serta memiliki cincin tipis." }
      ]
    },
    {
      id: "small_bodies",
      name: "Benda Kecil Tata Surya (SSSB)",
      type: "group",
      icon: "☄️",
      badge: "Sisa Formasi Purba",
      desc: "Jutaan fragmen batuan dan es yang tidak sempat berakresi menjadi planet saat pembentukan tata surya.",
      children: [
        { id: "sb_asteroids", name: "Sabuk Asteroid Utama", icon: "🪨", badge: "2,2 – 3,2 AU", desc: "Cincin jutaan batuan purba antara Mars dan Jupiter yang gagal memadat menjadi planet akibat gangguan gravitasi Jupiter." },
        { id: "sb_comets", name: "Komet (Kuiper & Oort)", icon: "☄️", badge: "Bola Salju Kotor", desc: "Kumpulan es, debu, dan metana beku. Saat mendekati Matahari, es menyublim membentuk koma dan ekor megah jutaan kilometer." },
        { id: "sb_trojans", name: "Asteroid Trojan & NEA", icon: "🪐", badge: "Titik Lagrange L4/L5", desc: "Kawanan asteroid yang terperangkap mengiringi orbit Jupiter di titik gravitasi seimbang Lagrange L4 dan L5." },
        { id: "sb_oort", name: "Awan Oort", icon: "🧊", badge: "2.000 – 100.000 AU", desc: "Cangkang bola raksasa berisi miliaran komet es di perbatasan terjauh Tata Surya, meluas hingga seperempat jarak ke bintang terdekat." }
      ]
    }
  ]
};

// #44 Penjelajahan Ketinggian Atmosfer & Angkasa Parallaks (Parallax Altitude Explorer)
const PARALLAX_ALTITUDE_DATA = {
  layers: [
    {
      id: "troposphere",
      name: "Troposfer",
      range: "0 – 12 km",
      tempRange: "+15 °C s/d -55 °C",
      skyColor: "linear-gradient(to top, #60a5fa 0%, #2563eb 60%, #1d4ed8 100%)",
      desc: "Lapisan terbawah tempat manusia hidup dan tempat 99% uap air berkumpul. Seluruh fenomena cuaca (hujan, petir, awan, angin) terjadi di sini.",
      objects: [
        { alt: 0, name: "Permukaan Daratan & Samudra", icon: "🏞️", track: "center", isBanner: true, subtitle: "Ketinggian 0 m (Permukaan Laut)", desc: "Habitat utama kehidupan manusia dan biosfer Bumi. Tekanan udara standar 1 atmosfer (1.013 mb) dengan 78% Nitrogen dan 21% Oksigen." },
        { alt: 2500, name: "Elang Melayang & Awan Kumulus", icon: "🦅", track: "left", subtitle: "Ketinggian 2.500 m", desc: "Awan kumulus putih bergumpal terbentuk dari kondensasi uap air. Burung pemangsa memanfaatkan arus udara panas vertikal (termal) untuk melayang hemat energi." },
        { alt: 8849, name: "Puncak Gunung Everest", icon: "🏔️", track: "right", subtitle: "Ketinggian 8.849 m", desc: "Titik daratan tertinggi di muka Bumi yang menembus Zona Kematian (Death Zone). Tekanan udara dan kadar molekul oksigen di sini hanya 33% dibanding permukaan laut!" },
        { alt: 11000, name: "Pesawat Jet Komersial (Arus Jet)", icon: "✈️", track: "left", subtitle: "Ketinggian 11.000 m (11 km)", desc: "Zona jelajah jelajah pesawat Boeing/Airbus untuk efisiensi bahan bakar dan menghindari turbulensi cuaca. Terbang berdampingan dengan arus angin kencang Arus Jet (Jet Stream)." }
      ]
    },
    {
      id: "stratosphere",
      name: "Stratosfer",
      range: "12 – 50 km",
      tempRange: "-55 °C s/d 0 °C",
      skyColor: "linear-gradient(to top, #1d4ed8 0%, #1e3a8a 60%, #312e81 100%)",
      desc: "Lapisan tenang tanpa turbulensi awan. Suhu justru NAIK seiring bertambahnya ketinggian karena molekul ozon menyerap radiasi ultraviolet Matahari.",
      objects: [
        { alt: 25000, name: "Lapisan Ozon Pelindung (O₃)", icon: "🛡️", track: "center", isBanner: true, subtitle: "Ketinggian 25 km (25.000 m)", desc: "Perisai gas molekul ozon alami yang menyerap lebih dari 98% radiasi ultraviolet berbahaya (UV-B & UV-C) dari Matahari demi melindungi DNA makhluk hidup di Bumi." },
        { alt: 38000, name: "Balon Cuaca Ilmiah", icon: "🎈", track: "right", subtitle: "Ketinggian 38 km (38.000 m)", desc: "Balon stratosfer pembawa radiosonde untuk mengukur suhu dan angin stratosfer. Di tekanan rendah ini, balon mengembang hingga seukuran gedung sebelum pecah." },
        { alt: 45000, name: "Pesawat Pengintai SR-71 Blackbird", icon: "🚀", track: "left", subtitle: "Ketinggian 45 km (45.000 m)", desc: "Pesawat supersonik Mach 3+ tercepat dalam sejarah. Terbang di tepian stratosfer di mana langit mulai tampak hitam pekat dan lengkungan horizon Bumi terlihat jelas." }
      ]
    },
    {
      id: "mesosphere",
      name: "Mesosfer",
      range: "50 – 85 km",
      tempRange: "0 °C s/d -90 °C",
      skyColor: "linear-gradient(to top, #312e81 0%, #1e1b4b 60%, #0f172a 100%)",
      desc: "Lapisan paling dingin di seluruh atmosfer Bumi (-90 °C). Meskipun udaranya sangat tipis, kerapatannya cukup untuk membakar meteoroid yang melesat kencang.",
      objects: [
        { alt: 75000, name: "Meteoroid Terbakar ('Bintang Jatuh')", icon: "☄️", track: "right", subtitle: "Ketinggian 75 km (75.000 m)", desc: "Batuan dan debu kosmik berkecepatan 11–72 km/detik mengalami gesekan kompresi udara mesosfer yang dahsyat hingga memijar terang menjadi kilatan meteor." },
        { alt: 82000, name: "Awan Noktilusen (Awan Kristal Es)", icon: "✨", track: "left", subtitle: "Ketinggian 82 km (82.000 m)", desc: "Awan tertinggi di atmosfer Bumi, tersusun dari kristal es mikroskopis yang menyala perak lembut karena masih disinari matahari saat daratan di bawah sudah malam." }
      ]
    },
    {
      id: "thermosphere",
      name: "Termosfer & Batas Antariksa",
      range: "85 – 600 km",
      tempRange: "-90 °C s/d +1.500 °C",
      skyColor: "linear-gradient(to top, #0f172a 0%, #020617 70%, #000000 100%)",
      desc: "Molekul gas terpapar langsung sinar-X dan UV ekstrem Matahari sehingga suhunya mencapai 1.500 °C, namun karena kerapatannya nyaris hampa, tubuh tidak akan terbakar panas.",
      objects: [
        { alt: 100000, name: "Garis Kármán (Batas Resmi Antariksa)", icon: "🌐", track: "center", isBanner: true, subtitle: "Ketinggian 100 km (Batas Luar Angkasa)", desc: "Batas pemisah resmi internasional (FAI) antara atmosfer Bumi dan Ruang Angkasa (Outer Space). Di atas garis ini, pesawat butuh kecepatan orbit agar tidak jatuh." },
        { alt: 140000, name: "Tirai Cahaya Aurora Borealis", icon: "🌌", track: "center", isBanner: true, subtitle: "Ketinggian 140 km", desc: "Tarian tirai cahaya kosmik spektakuler akibat partikel angin matahari bertubrukan dengan atom oksigen (berpendar hijau) dan nitrogen (merah/ungu)." },
        { alt: 408000, name: "Stasiun Luar Angkasa Internasional (ISS)", icon: "🛰️", track: "right", subtitle: "Ketinggian 408 km (Orbit Rendah Bumi)", desc: "Laboratorium antariksa berawak berukuran sebesar lapangan sepak bola. Mengorbit Bumi dengan kecepatan 27.600 km/jam, mengitari Bumi tiap 90 menit (16 kali matahari terbit tiap hari!)." },
        { alt: 500000, name: "Teleskop Luar Angkasa Hubble", icon: "🔭", track: "left", subtitle: "Ketinggian 500 km", desc: "Observatorium ruang angkasa legendaris yang mengorbit di luar distorsi atmosfer Bumi untuk memotret objek-objek terjauh di alam semesta." }
      ]
    }
  ]
};

// #45 Kuis Cepat Berwaktu (Timer Challenge)
const TIMER_CHALLENGE_DATA = [
  {
    q: "Planet apakah yang memiliki suhu permukaan paling panas di Tata Surya?",
    options: ["Merkurius", "Venus", "Mars", "Jupiter"],
    correct: 1,
    exp: "Venus (464 °C) paling panas akibat efek rumah kaca ekstrem atmosfer karbon dioksida pekat."
  },
  {
    q: "Berapa jumlah planet utama yang diakui resmi di Tata Surya saat ini?",
    options: ["7", "8", "9", "10"],
    correct: 1,
    exp: "Tepat 8 planet utama dari Merkurius hingga Neptunus (Pluto planet kerdil sejak 2006)."
  },
  {
    q: "Berapa menit waktu yang dibutuhkan cahaya Matahari untuk mencapai Bumi?",
    options: ["±8 detik", "±8 menit", "±1 jam", "±8 jam"],
    correct: 1,
    exp: "Cahaya melesat 300.000 km/detik menempuh jarak 150 juta km dalam waktu ±8 menit 20 detik."
  },
  {
    q: "Planet dengan kala rotasi (hari) tercepat di Tata Surya adalah...",
    options: ["Jupiter (±10 jam)", "Bumi (24 jam)", "Venus (243 hari)", "Mars (25 jam)"],
    correct: 0,
    exp: "Jupiter adalah pemutar tercepat, menyelesaikan satu putaran hanya dalam ±9 jam 55 menit."
  },
  {
    q: "Gunung berapi tertinggi di Tata Surya, Olympus Mons, berada di planet...",
    options: ["Venus", "Bulan", "Mars", "Merkurius"],
    correct: 2,
    exp: "Olympus Mons di Mars menjulang setinggi ±22 km, hampir 3× lipat tinggi Gunung Everest!"
  },
  {
    q: "Garis batas resmi awal ruang angkasa menurut Federasi Aeronautika Internasional (FAI) adalah...",
    options: ["Garis Khatulistiwa", "Garis Kármán (100 km)", "Garis Kuiper", "Garis Oort"],
    correct: 1,
    exp: "Garis Kármán pada ketinggian 100 km menandai batas resmi dimulainya ruang angkasa."
  },
  {
    q: "Planet yang berotasi menggelinding miring hampir 98° seperti tong menggelinding adalah...",
    options: ["Uranus", "Neptunus", "Saturnus", "Bumi"],
    correct: 0,
    exp: "Uranus memiliki kemiringan sumbu rotasi ekstrem 97,8° diduga akibat tubrukan protoplanet purba."
  },
  {
    q: "Bulan terbesar di Tata Surya yang bahkan ukurannya melampaui planet Merkurius adalah...",
    options: ["Titan", "Ganymede", "Europa", "Kallisto"],
    correct: 1,
    exp: "Ganymede (bulan milik Jupiter) berdiameter 5.268 km, lebih besar dari Merkurius (4.879 km)!"
  },
  {
    q: "Lapisan atmosfer Bumi tempat seluruh peristiwa cuaca (hujan, angin, awan) berlangsung adalah...",
    options: ["Stratosfer", "Troposfer", "Mesosfer", "Termosfer"],
    correct: 1,
    exp: "Troposfer (0–12 km) memuat 99% seluruh uap air di atmosfer Bumi."
  },
  {
    q: "Ekor komet saat mengitari tata surya selalu mengarah...",
    options: ["Mengikuti di belakang arah gerak komet", "Menjauhi Matahari", "Menuju ke pusat Matahari", "Ke arah kutub Bumi"],
    correct: 1,
    exp: "Angin matahari dan tekanan radiasi foton selalu mendorong ekor komet menjauhi Matahari."
  },
  {
    q: "Sebagian besar massa total seluruh Tata Surya (99,86%) terhimpun di dalam...",
    options: ["Matahari", "Jupiter", "Bumi", "Sabuk Asteroid"],
    correct: 0,
    exp: "Matahari menguasai 99,86% dari seluruh massa materi di tata surya kita."
  },
  {
    q: "Satelit alami Saturnus yang memiliki atmosfer tebal dan danau hidrokarbon cair adalah...",
    options: ["Titan", "Enceladus", "Mimas", "Iapetus"],
    correct: 0,
    exp: "Titan memiliki siklus metana cair mirip siklus air di Bumi, lengkap dengan awan dan danau metana."
  },
  {
    q: "Medan magnetik pelindung Bumi (magnetosfer) dibangkitkan oleh arus konveksi di lapisan...",
    options: ["Kerak Bumi", "Mantel Magma", "Inti Luar Logam Cair", "Inti Dalam Padat"],
    correct: 2,
    exp: "Perputaran lautan besi-nikel cair di Inti Luar bertindak sebagai dinamo pembangkit medan magnetik."
  },
  {
    q: "Asteroid terbesar di sabuk utama yang juga diklasifikasikan sebagai planet kerdil adalah...",
    options: ["Vesta", "Ceres", "Pallas", "Hygiea"],
    correct: 1,
    exp: "Ceres berdiameter ±940 km dan merupakan satu-satunya planet kerdil di tata surya bagian dalam."
  },
  {
    q: "Planet dengan kerapatan massa jenis paling rendah (lebih ringan dari air) adalah...",
    options: ["Saturnus", "Jupiter", "Uranus", "Neptunus"],
    correct: 0,
    exp: "Saturnus memiliki densitas rata-rata hanya 0,69 g/cm³; jika ada bak air raksasa, Saturnus akan mengapung!"
  },
  {
    q: "Satu kali revolusi (tahun) paling cepat mengitari Matahari dialami oleh...",
    options: ["Merkurius (88 hari)", "Venus (225 hari)", "Bumi (365 hari)", "Mars (687 hari)"],
    correct: 0,
    exp: "Merkurius melesat tercepat (47 km/detik) dan menuntaskan 1 tahun hanya dalam 88 hari Bumi."
  },
  {
    q: "Unsur kimia terberat seperti emas dan uranium di alam semesta terbentuk melalui peristiwa...",
    options: ["Fusi di Matahari", "Letusan Gunung Api", "Ledakan Supernova", "Peluruhan Radioaktif"],
    correct: 2,
    exp: "Energi dahsyat ledakan supernova menembakkan neutron berkecepatan tinggi membentuk unsur berat seperti emas."
  },
  {
    q: "Bintang terdekat dengan Tata Surya kita setelah Matahari berjarak ±4,2 tahun cahaya adalah...",
    options: ["Sirius", "Proxima Centauri", "Betelgeuse", "Polaris"],
    correct: 1,
    exp: "Proxima Centauri adalah bintang katai merah tetangga terdekat kita pada jarak 4,24 tahun cahaya."
  },
  {
    q: "Bulan Saturnus yang menyemburkan geiser air es dari samudra bawah permukaannya adalah...",
    options: ["Enceladus", "Titan", "Rhea", "Dione"],
    correct: 0,
    exp: "Enceladus memiliki samudra cair di bawah lapisan es dan menyemburkan geiser air ke antariksa."
  },
  {
    q: "Pergantian 4 musim di Bumi murni disebabkan oleh...",
    options: ["Perubahan jarak orbit Bumi", "Kemiringan sumbu rotasi Bumi 23,5°", "Aktivitas bintik Matahari", "Gravitasi Bulan"],
    correct: 1,
    exp: "Kemiringan sumbu rotasi 23,5° membuat sudut datang sinar matahari bergantian lebih condong di belahan utara/selatan."
  }
];

// #46 Mode Bertahan Hidup Kosmik (survival_mode)
const SURVIVAL_MODE_DATA = [
  {
    q: "Benda langit apa yang memiliki medan gravitasi sangat ekstrem hingga cahaya pun tidak dapat melewatinya?",
    options: ["Bintang Neutron", "Lubang Hitam (Black Hole)", "Pulsar", "Bintang Katai Putih"],
    correct: 1,
    fact: "Lubang hitam memiliki horizon peristiwa di mana kecepatan lepas melampaui kecepatan cahaya."
  },
  {
    q: "Planet manakah di Tata Surya yang memiliki jumlah satelit alami (bulan) terkonfirmasi paling banyak?",
    options: ["Jupiter", "Saturnus", "Uranus", "Neptunus"],
    correct: 1,
    fact: "Saturnus memiliki lebih dari 145 satelit alami yang telah diakui oleh IAU."
  },
  {
    q: "Kumpulan benda-benda es kerdil di luar orbit planet Neptunus dinamakan...",
    options: ["Sabuk Asteroid", "Sabuk Van Allen", "Sabuk Kuiper", "Awan Oort"],
    correct: 2,
    fact: "Sabuk Kuiper membentang dari 30 hingga 55 AU dari Matahari dan memuat planet katai seperti Pluto."
  },
  {
    q: "Unsur kimia apakah yang mendominasi lebih dari 70% komposisi massa Matahari?",
    options: ["Helium", "Oksigen", "Hidrogen", "Nitrogen"],
    correct: 2,
    fact: "Matahari tersusun atas ±73% gas Hidrogen yang menjadi bahan bakar utama reaksi fusi termonuklir."
  },
  {
    q: "Berapa perkiraan umur terbentuknya Tata Surya kita dari awan nebula purba?",
    options: ["±4,6 Miliar Tahun", "±13,8 Miliar Tahun", "±1 Miliar Tahun", "±500 Juta Tahun"],
    correct: 0,
    fact: "Penanggalan radiometrik meteorit membuktikan Tata Surya terbentuk sekitar 4,57 miliar tahun silam."
  },
  {
    q: "Planet apakah yang memiliki pantulan cahaya awan paling cemerlang dan tampak seperti bintang fajar?",
    options: ["Merkurius", "Venus", "Mars", "Jupiter"],
    correct: 1,
    fact: "Venus diselimuti awan tebal asam sulfat dengan albedo 75% yang memantulkan sinar matahari dengan kuat."
  },
  {
    q: "Wahana antariksa pertama buatan umat manusia yang berhasil melintasi heliopause ke ruang antarbintang adalah...",
    options: ["Apollo 11", "Voyager 1", "New Horizons", "Curiosity"],
    correct: 1,
    fact: "Voyager 1 diluncurkan pada 1977 dan menembus ruang antarbintang pada Agustus 2012."
  },
  {
    q: "Dua satelit alami berukuran kecil dan berbentuk tidak bulat milik Mars bernama...",
    options: ["Io dan Europa", "Titan dan Enceladus", "Phobos dan Deimos", "Triton dan Nereid"],
    correct: 2,
    fact: "Phobos dan Deimos berbentuk tidak beraturan seperti kentang dan diduga asteroid yang tertangkap gravitasi Mars."
  },
  {
    q: "Aliran partikel berenergi tinggi yang terus-menerus disemburkan oleh korona Matahari ke ruang angkasa disebut...",
    options: ["Angin Matahari (Solar Wind)", "Gelombang Gravitasi", "Sinar Kosmik", "Radiasi Cherenkov"],
    correct: 0,
    fact: "Angin matahari berinteraksi dengan magnetosfer Bumi memicu kilauan aurora indah di daerah kutub."
  },
  {
    q: "Planet manakah yang sumbu rotasinya miring ekstrem hampir 98° sehingga berputar menggelinding?",
    options: ["Neptunus", "Saturnus", "Uranus", "Merkurius"],
    correct: 2,
    fact: "Kemiringan sumbu Uranus mencapai 97,77° yang memicu musim ekstrem berlangsung selama 21 tahun per sisi."
  },
  {
    q: "Bulan terbesar di Tata Surya yang ukurannya melampaui ukuran planet Merkurius adalah...",
    options: ["Titan", "Ganymede", "Kalisto", "Bulan"],
    correct: 1,
    fact: "Ganymede (satelit Jupiter) berdiameter 5.268 km, menjadikannya bulan terbesar di Tata Surya."
  },
  {
    q: "Ekor gas dan debu komet selalu mengarah menjauhi Matahari karena dorongan...",
    options: ["Gravitasi Bumi", "Tekanan Radiasi & Angin Matahari", "Medan Magnet Jupiter", "Gaya Sentrifugal"],
    correct: 1,
    fact: "Foton cahaya dan angin partikel matahari meniup partikel komet selalu berlawanan arah dari Matahari."
  },
  {
    q: "Titik dalam lintasan orbit saat sebuah planet berada pada jarak paling dekat ke Matahari disebut...",
    options: ["Aphelion", "Perihelion", "Perigee", "Apogee"],
    correct: 1,
    fact: "Perihelion adalah titik terdekat planet ke Matahari (kebalikannya disebut Aphelion)."
  },
  {
    q: "Planet dengan rentang suhu siang (+430°C) dan malam (-180°C) paling ekstrem akibat tiadanya atmosfer adalah...",
    options: ["Mars", "Merkurius", "Bumi", "Venus"],
    correct: 1,
    fact: "Merkurius tidak memiliki atmosfer tebal untuk menahan panas, sehingga suhu drop drastis di malam hari."
  },
  {
    q: "Bintik Merah Raksasa (Great Red Spot) pada planet Jupiter merupakan sistem...",
    options: ["Kawah Meteorit Purba", "Gunung Berapi Aktif", "Badai Antisiklon Raksasa", "Lautan Metana"],
    correct: 2,
    fact: "Great Red Spot adalah badai antisiklon raksasa berdiameter lebih besar dari Bumi yang berputar ratusan tahun."
  }
];

// #47 Geser Potongan Gambar Planet (puzzle_slide)
const PUZZLE_SLIDE_DATA = {
  title: "Rekonstruksi Jupiter: Sang Penguasa Gas",
  gridSize: 3, // 3x3
  tiles: [
    { id: 0, label: "Pojok Kiri Atas", row: 0, col: 0, bgX: "0%", bgY: "0%" },
    { id: 1, label: "Tengah Atas", row: 0, col: 1, bgX: "50%", bgY: "0%" },
    { id: 2, label: "Pojok Kanan Atas", row: 0, col: 2, bgX: "100%", bgY: "0%" },
    { id: 3, label: "Kiri Tengah", row: 1, col: 0, bgX: "0%", bgY: "50%" },
    { id: 4, label: "Pusat Badai Merah", row: 1, col: 1, bgX: "50%", bgY: "50%" },
    { id: 5, label: "Kanan Tengah", row: 1, col: 2, bgX: "100%", bgY: "50%" },
    { id: 6, label: "Pojok Kiri Bawah", row: 2, col: 0, bgX: "0%", bgY: "100%" },
    { id: 7, label: "Tengah Bawah", row: 2, col: 1, bgX: "50%", bgY: "100%" },
    { id: 8, label: "Slot Kosong", row: 2, col: 2, isEmpty: true }
  ],
  funFact: "Luar biasa! Kamu berhasil menyusun kembali Jupiter! Planet ini memiliki massa 2,5 kali lipat dari gabungan seluruh planet lainnya di Tata Surya. Gravitasi raksasanya melindungi Bumi dengan menangkap atau membelokkan lintasan komet berbahaya."
};

// #48 Susun Potongan Gambar Tata Surya (puzzle_jigsaw)
const PUZZLE_JIGSAW_DATA = [
  {
    id: 1,
    title: "1. Matahari & Merkurius",
    desc: "Sang bintang induk bertenaga fusi nuklir dan planet terdekat berpermukaan kawah.",
    icon: "☀️☿️",
    badge: "Zona Dekat",
    color: "#eab308"
  },
  {
    id: 2,
    title: "2. Venus & Bumi",
    desc: "Dunia awan asam belerang dan planet biru penopang jutaan kehidupan semesta.",
    icon: "♀️🌍",
    badge: "Zona Layak Huni",
    color: "#3b82f6"
  },
  {
    id: 3,
    title: "3. Mars & Sabuk Asteroid",
    desc: "Planet merah berdebu besi oksida dan cincin jutaan puing batuan sisa pembentukan planet.",
    icon: "♂️🪐",
    badge: "Batas Kebumian",
    color: "#ef4444"
  },
  {
    id: 4,
    title: "4. Jupiter & Badai Raksasa",
    desc: "Raksasa gas terbesar dengan Bintik Merah dan sistem satelit alami yang memukau.",
    icon: "♃🌕",
    badge: "Raksasa Gas",
    color: "#f97316"
  },
  {
    id: 5,
    title: "5. Saturnus & Cincin Megah",
    desc: "Permata bercincin partikel es murni dengan kerapatan lebih ringan daripada air.",
    icon: "♄🪐",
    badge: "Sistem Cincin",
    color: "#eab308"
  },
  {
    id: 6,
    title: "6. Raksasa Es & Tepi Semesta",
    desc: "Uranus miring, Neptunus berangin supersonik, serta Sabuk Kuiper beku abadi.",
    icon: "♅♆",
    badge: "Zona Terluar",
    color: "#06b6d4"
  }
];

// Kategori Interaksi untuk Filter Bar (Total: 48)
const ACTIVITY_CATEGORIES = [
  { id: "all", label: "Semua", icon: "✨" },
  { id: "explore", label: "Eksplorasi", icon: "🪐", count: 10 },
  { id: "sim", label: "Simulasi", icon: "⚙️", count: 5 },
  { id: "quiz", label: "Kuis & Cek", icon: "📝", count: 13 },
  { id: "game", label: "Game Edukatif", icon: "🎮", count: 15 },
  { id: "reflect", label: "Refleksi", icon: "🧠", count: 5 }
];
