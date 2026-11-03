/* ExtraPlate - notifications.js : pop-up messages (toasts) + sound alerts (Web Audio API).
   This is the Notifications layer: the NGO tab rings the moment a donor posts food. */

let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
document.addEventListener("click", ensureAudio);

/* Two-tone alert beep, generated in code - no sound file needed */
function beep(times) {
  ensureAudio();
  if (!audioCtx) return;
  const n = times || 2;
  for (let i = 0; i < n; i++) {
    const t0 = audioCtx.currentTime + i * 0.28;
    [880, 1174].forEach((freq, j) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t0 + j * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + j * 0.13 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + j * 0.13 + 0.16);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(t0 + j * 0.13); osc.stop(t0 + j * 0.13 + 0.18);
    });
  }
}

function showToast(title, body, green) {
  const box = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast" + (green ? " green" : "");
  el.innerHTML = "<strong></strong><span></span>";
  el.querySelector("strong").textContent = title;
  el.querySelector("span").textContent = body;
  box.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .4s"; setTimeout(() => el.remove(), 420); }, 5200);
}

function alertNewFood(listing) {
  showToast("🔔 New food posted!", listing.donor + " — " + listing.items + " (" + listing.servings + " servings)");
  beep(2);
}
