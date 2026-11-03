/* ExtraPlate - charts.js : Impact Hub charts (Chart.js). Both charts show SAMPLE demo data,
   labelled as sample in the page, exactly like the presentation states. */

let chartsMade = false;

function renderCharts() {
  if (chartsMade || typeof Chart === "undefined") return;
  chartsMade = true;

  new Chart(document.getElementById("chart-weekly"), {
    type: "bar",
    data: {
      labels: SAMPLE_IMPACT.weeklyLabels,
      datasets: [{ label: "Meals saved", data: SAMPLE_IMPACT.weeklyMeals, backgroundColor: "#FC8019", borderRadius: 6 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } },
               scales: { y: { beginAtZero: true, title: { display: true, text: "Meals" } } } }
  });

  new Chart(document.getElementById("chart-category"), {
    type: "doughnut",
    data: {
      labels: Object.keys(SAMPLE_IMPACT.categoryMix),
      datasets: [{ data: Object.values(SAMPLE_IMPACT.categoryMix),
                   backgroundColor: ["#FC8019", "#FFC53D", "#14963F", "#5B8DEF"] }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });
}

/* Headline counters = sample platform figures + whatever this demo session actually rescued */
function renderImpact() {
  const meals = SAMPLE_IMPACT.meals + (DB.sessionMeals || 0);
  const kg = SAMPLE_IMPACT.foodKg + (DB.sessionKg || 0);
  const co2 = SAMPLE_IMPACT.co2 + Math.round((DB.sessionKg || 0) * 2.5);
  document.getElementById("stat-meals").textContent = meals.toLocaleString("en-IN");
  document.getElementById("stat-kg").textContent = kg.toLocaleString("en-IN");
  document.getElementById("stat-co2").textContent = co2.toLocaleString("en-IN");
  document.getElementById("stat-session").textContent = (DB.sessionMeals || 0).toLocaleString("en-IN");
  renderLeaderboard();
  renderDirectory();
}

/* Top donors leaderboard — ranked by servings, from the live listings (original feature) */
function renderLeaderboard() {
  const el = document.getElementById("donor-leaderboard");
  if (!el) return;
  const rows = [...DB.listings]
    .sort((a, b) => (b.servings || 0) - (a.servings || 0)).slice(0, 5)
    .map((l, i) => '<div class="lb-row"><span>' + (i + 1) + ". " + esc(l.donor) + '</span><strong>' + l.servings + " meals</strong></div>")
    .join("");
  el.innerHTML = rows || '<p class="form-hint">No listings yet.</p>';
}

/* Verified NGO directory (original project data) */
function renderDirectory() {
  const el = document.getElementById("ngo-directory");
  if (!el) return;
  el.innerHTML = NGOS.map(n =>
    '<div class="dir-item"><strong>' + esc(n.name) + '</strong><div>' + esc(n.area) + " • " + n.volunteers + " active volunteers • 📞 " + esc(n.phone) + "</div></div>"
  ).join("");
}
