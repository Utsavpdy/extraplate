/* ExtraPlate - app.js : screen actions, forms, status updates, freshness clock.
   Application Logic layer - connects every screen to the store, map, charts and alerts. */

/* ---------- small helpers ---------- */
const $ = id => document.getElementById(id);
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function fmtLeft(ms) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h + ":" + m + ":" + ss;
}
function sortByUrgency(a, b) { return a.expiresAt - b.expiresAt; }

/* ---------- navigation ---------- */
let mapReady = false;
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.nav === name));
  if (name === "ngo") {
    initMap(); mapReady = true;
    renderNGO();
  }
  if (name === "impact") { renderCharts(); renderImpact(); }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelectorAll("[data-nav]").forEach(el =>
  el.addEventListener("click", () => showView(el.dataset.nav)));
$("role-donor").addEventListener("click", () => { ensureAudio(); showView("donor"); });
$("role-ngo").addEventListener("click", () => { ensureAudio(); showView("ngo"); });

/* ---------- listing card builders ---------- */
function countdownHTML(l) {
  const level = freshnessLevel(l.expiresAt - Date.now());
  return '<div class="countdown ' + level + '" data-countdown="' + l.id + '">' + fmtLeft(l.expiresAt - Date.now()) + "</div>";
}
function metaHTML(l) {
  const c = listingLatLng(l);
  return '<div class="meta">' +
    "<span>🍽️ " + esc(l.type) + "</span>" +
    "<span>👥 Feeds " + l.servings + "</span>" +
    "<span>⚖️ ~" + l.weightKg + " kg</span>" +
    "<span>📦 " + esc(l.packaging) + "</span>" +
    "<span>📍 " + esc(c.pointName) + " (" + listingDistanceKm(l).toFixed(1) + " km)</span></div>";
}
function headHTML(l) {
  const level = freshnessLevel(l.expiresAt - Date.now());
  return '<div class="listing-top"><div><h4>' + esc(l.donor) + '</h4>' +
    '<div class="donor-line">' + esc(l.donorType) + ' • <span class="level-tag" data-level="' + l.id + '">' +
    LEVEL_LABEL[level] + '</span></div></div>' +
    '<span class="status-tag status-' + l.status + '">' + l.status + "</span></div>" +
    '<p class="items">' + esc(l.items) + "</p>" + metaHTML(l);
}

/* ---------- DONOR view ---------- */
function renderDonor() {
  const wrap = $("donor-listings");
  const active = DB.listings.filter(l => l.status === "Available" || l.status === "Claimed").sort(sortByUrgency);
  $("donor-count").textContent = active.length + " active";
  if (!active.length) { wrap.innerHTML = '<div class="empty">No active listings. Post the first one from the form!</div>'; return; }
  wrap.innerHTML = active.map(l =>
    '<div class="listing">' + headHTML(l) +
    '<div class="listing-top" style="margin-top:8px"><span style="font-size:13px;color:var(--muted)">Time left to use</span>' + countdownHTML(l) + "</div>" +
    '<div class="otp-box"><span>🔑 Private pickup OTP — share only with the assigned volunteer at handover</span>' +
    '<span class="otp-code">' + l.otp + "</span></div>" +
    (l.dispatch ? '<div class="dispatch-box">🚴 <strong>Claimed by ' + esc(l.dispatch.ngo) + "</strong> — volunteer " +
      esc(l.dispatch.volunteer) + " (" + esc(l.dispatch.vehicle) + ", ETA " + l.dispatch.etaMin + " min) • 📞 " + esc(l.dispatch.phone) + "</div>" : "") +
    "</div>"
  ).join("");
}

$("listing-form").addEventListener("submit", e => {
  e.preventDefault();
  const servings = parseInt($("f-servings").value, 10);
  const weight = parseFloat($("f-weight").value) || Math.round(servings * 0.25 * 2) / 2;
  const listing = addListing({
    donor: $("f-donor").value.trim(), donorType: $("f-donortype").value,
    items: $("f-items").value.trim(), type: $("f-type").value,
    servings, weightKg: weight, packaging: $("f-packaging").value,
    point: parseInt($("f-point").value, 10), otp: newOTP(),
    expiresAt: Date.now() + parseInt($("f-window").value, 10) * 60000
  });
  e.target.reset();
  renderDonor();
  showToast("✅ Listing posted", listing.donor + " — " + listing.items + ". NGOs in open tabs have been alerted.", true);
});

/* fill the pickup-point dropdown */
$("f-point").innerHTML = PICKUP_POINTS.map((p, i) => '<option value="' + i + '">' + p.name + "</option>").join("");

/* ---------- NGO view ---------- */
let claimTargetId = null;

function renderNGO() {
  const zone = parseFloat($("zone-filter").value);
  renderMap(zone);
  const avail = DB.listings
    .filter(l => l.status === "Available" && listingDistanceKm(l) <= zone)
    .sort(sortByUrgency);
  $("ngo-count").textContent = avail.length + " in zone";
  $("ngo-listings").innerHTML = avail.length ? avail.map(l =>
    '<div class="listing">' + headHTML(l) +
    '<div class="listing-top" style="margin-top:8px"><span style="font-size:13px;color:var(--muted)">Time left to use</span>' + countdownHTML(l) + "</div>" +
    '<div class="listing-actions"><button class="btn green" data-claim="' + l.id + '">✋ Claim This Food</button></div></div>'
  ).join("") : '<div class="empty">No available food in this zone right now. Try a bigger zone.</div>';

  const mine = DB.listings.filter(l => l.status === "Claimed").sort(sortByUrgency);
  $("rescue-count").textContent = mine.length;
  $("my-rescues").innerHTML = mine.length ? mine.map(l =>
    '<div class="listing">' + headHTML(l) +
    '<div class="listing-top" style="margin-top:8px"><span style="font-size:13px;color:var(--muted)">Time left to use</span>' + countdownHTML(l) + "</div>" +
    (l.dispatch ? '<div class="dispatch-box">🚴 Volunteer: <strong>' + esc(l.dispatch.volunteer) + "</strong> (" +
      esc(l.dispatch.vehicle) + ", ETA " + l.dispatch.etaMin + " min) • 📞 " + esc(l.dispatch.phone) + "</div>" : "") +
    '<div class="listing-actions"><span style="font-size:13.5px;font-weight:600">At pickup, enter the donor\'s OTP:</span>' +
    '<span class="otp-entry"><input inputmode="numeric" maxlength="4" placeholder="••••" data-otp-input="' + l.id + '">' +
    '<button class="btn primary small" data-complete="' + l.id + '">Complete Pickup</button></span></div></div>'
  ).join("") : '<div class="empty">Nothing claimed yet. Claim a listing from the left to start a rescue.</div>';

  document.querySelectorAll("[data-claim]").forEach(b => b.addEventListener("click", () => openClaim(b.dataset.claim)));
  document.querySelectorAll("[data-complete]").forEach(b => b.addEventListener("click", () => completePickup(b.dataset.complete)));
}

$("zone-filter").addEventListener("change", renderNGO);

function openClaim(id) {
  claimTargetId = id;
  const l = getListing(id);
  $("claim-for").textContent = l.donor + " — " + l.items + " (" + l.servings + " servings, " + listingDistanceKm(l).toFixed(1) + " km away)";
  $("claim-modal").classList.remove("hidden");
}
$("claim-cancel").addEventListener("click", () => $("claim-modal").classList.add("hidden"));
$("claim-form").addEventListener("submit", e => {
  e.preventDefault();
  updateListing(claimTargetId, {
    status: "Claimed",
    dispatch: { ngo: DEMO_NGO.name, volunteer: $("c-name").value.trim(), phone: $("c-phone").value.trim(),
                vehicle: $("c-vehicle").value, etaMin: parseInt($("c-eta").value, 10) }
  });
  $("claim-modal").classList.add("hidden");
  e.target.reset();
  renderNGO(); renderDonor();
  showToast("✋ Food claimed", "Volunteer dispatched. The listing is now locked for " + DEMO_NGO.name + ".", true);
});

function completePickup(id) {
  const input = document.querySelector('[data-otp-input="' + id + '"]');
  const l = getListing(id);
  if (!input || !l) return;
  if (input.value.trim() === l.otp) {
    updateListing(id, { status: "Completed" });
    DB.sessionMeals = (DB.sessionMeals || 0) + l.servings;
    DB.sessionKg = (DB.sessionKg || 0) + l.weightKg;
    saveDB();
    renderNGO(); renderDonor(); renderImpact();
    showToast("🎉 Pickup completed!", l.servings + " meals rescued from " + l.donor + ". Handover verified by OTP.", true);
    beep(1);
  } else {
    showToast("❌ Wrong OTP", "The code does not match the donor's OTP. Pickup not completed.");
    input.value = "";
    input.focus();
  }
}

/* ---------- freshness ticker: one clock for the whole app ---------- */
setInterval(() => {
  const now = Date.now();
  let changed = false;
  DB.listings.forEach(l => {
    if ((l.status === "Available" || l.status === "Claimed") && l.expiresAt <= now) {
      l.status = "Expired"; changed = true;
    }
  });
  if (changed) { saveDB(); renderDonor(); if (mapReady) renderNGO(); }
  document.querySelectorAll("[data-countdown]").forEach(el => {
    const l = getListing(el.dataset.countdown);
    if (!l) return;
    const left = l.expiresAt - now;
    el.textContent = fmtLeft(left);
    el.className = "countdown " + freshnessLevel(left);
  });
  document.querySelectorAll("[data-level]").forEach(el => {
    const l = getListing(el.dataset.level);
    if (l) el.textContent = LEVEL_LABEL[freshnessLevel(l.expiresAt - now)];
  });
}, 1000);

/* ---------- cross-tab alerts: another tab posted or changed food ---------- */
onBroadcast(msg => {
  const before = DB ? DB.listings.length : 0;
  loadDB();
  renderDonor();
  if (mapReady) renderNGO();
  renderImpact();
  if (msg.type === "listing-added") {
    const l = getListing(msg.id);
    if (l) alertNewFood(l);
  } else if (msg.type === "listing-updated" && before) {
    const l = getListing(msg.id);
    if (l && l.status === "Completed") showToast("✅ Pickup completed in another tab", l.donor + " — " + l.servings + " meals rescued.", true);
  }
});

/* ---------- misc ---------- */
$("reset-demo").addEventListener("click", () => {
  resetDB();
  renderDonor(); if (mapReady) renderNGO(); renderImpact();
  showToast("↺ Demo reset", "Sample listings and counters restored.", true);
});

/* ---------- first render ---------- */
renderDonor();
renderImpact();
