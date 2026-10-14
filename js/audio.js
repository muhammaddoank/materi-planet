/**
 * MODUL AUDIO & HAPTIK (Web Audio API & Vibration API)
 * Bebas berkas audio eksternal, sangat ringan, responsif, dan hemat daya.
 */

const SoundFX = (() => {
  let audioCtx = null;
  let isMuted = false;

  // Inisialisasi AudioContext secara lazy saat interaksi pertama pengguna
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Helper untuk membuat nada gelombang sinus lembut
  function playTone(freq, duration = 0.12, type = "sine", gainVal = 0.05) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Envelope ADSR halus agar tidak timbul suara "pop" / "klik"
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Abaikan jika browser membatasi audio
    }
  }

  // Getaran haptik untuk perangkat layar sentuh
  function vibrate(ms = 40) {
    try {
      if ("vibrate" in navigator && !isMuted) {
        navigator.vibrate(ms);
      }
    } catch (_) {}
  }

  return {
    // Nada Sukses / Benar (Harmoni nada C - E)
    playSuccess() {
      playTone(523.25, 0.1, "sine", 0.04);
      setTimeout(() => playTone(659.25, 0.16, "sine", 0.04), 80);
      vibrate(40);
    },

    // Nada Salah / Perlu Ulang (Nada rendah halus)
    playError() {
      playTone(220, 0.18, "triangle", 0.04);
      vibrate([30, 40, 30]);
    },

    // Nada Laser / Tembakan Cepat untuk kuis kilat / penalti
    playLaser() {
      playTone(280, 0.14, "sawtooth", 0.04);
      vibrate([25, 30, 25]);
    },

    // Nada Kemenangan Akhir (3 chord akor ceria)
    playFanfare() {
      if (isMuted) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 0.22, "sine", 0.05), idx * 110);
      });
      vibrate([50, 50, 100]);
    },

    // Sentuhan / Klik Halus
    playClick() {
      playTone(800, 0.04, "sine", 0.015);
    },

    // Toggle status hening
    toggleMute() {
      isMuted = !isMuted;
      return isMuted;
    },

    isMuted() {
      return isMuted;
    },

    setMuted(val) {
      isMuted = !!val;
    }
  };
})();
