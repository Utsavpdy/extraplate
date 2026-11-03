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
  document.getElementById("stat-meals").textContent = meals.toLocaleString("en-IN");
  document.getElementById("stat-kg").textContent = kg.toLocaleString("en-IN");
  document.getElementById("stat-co2").textContent = Math.round(kg * 2).toLocaleString("en-IN");
  document.getElementById("stat-session").textContent = (DB.sessionMeals || 0).toLocaleString("en-IN");
}
