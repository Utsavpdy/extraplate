/* ExtraPlate - map.js : Rescue Radar map (Leaflet.js + OpenStreetMap), distance zones, pins.
   The NGO sits at the centre; food points appear around it inside distance circles. */

let radarMap = null, radarLayer = null, zoneCircle = null;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function listingLatLng(l) {
  const p = PICKUP_POINTS[l.point] || PICKUP_POINTS[0];
  return { lat: p.lat, lng: p.lng, pointName: p.name };
}

function listingDistanceKm(l) {
  const c = listingLatLng(l);
  return haversineKm(DEMO_CENTRE.lat, DEMO_CENTRE.lng, c.lat, c.lng);
}

/* "Use my live location" — move the radar centre to the visitor's GPS position */
let lastZoneKm = 10;
function setRadarCentre(lat, lng, label) {
  DEMO_CENTRE.lat = lat; DEMO_CENTRE.lng = lng;
  if (label) DEMO_CENTRE.name = label;
  if (radarMap) { radarMap.setView([lat, lng], 12); renderMap(lastZoneKm); }
}

function pinIcon(letter, cls) {
  return L.divIcon({ className: "", html: '<div class="pin ' + cls + '">' + letter + "</div>", iconSize: [30, 30], iconAnchor: [15, 15] });
}

function initMap() {
  if (radarMap || typeof L === "undefined") return;
  radarMap = L.map("map").setView([DEMO_CENTRE.lat, DEMO_CENTRE.lng], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(radarMap);
  radarLayer = L.layerGroup().addTo(radarMap);
}

function renderMap(zoneKm) {
  if (!radarMap) return;
  lastZoneKm = zoneKm;
  radarLayer.clearLayers();
  if (zoneCircle) { radarMap.removeLayer(zoneCircle); zoneCircle = null; }

  const ngoMarker = L.marker([DEMO_CENTRE.lat, DEMO_CENTRE.lng], { icon: pinIcon("N", "ngo") })
    .bindPopup("<strong>NGO Rescue Base</strong><br>" + DEMO_CENTRE.name + "<br>Verified NGOs scan from here (you)");
  radarLayer.addLayer(ngoMarker);

  if (zoneKm && zoneKm < 900) {
    zoneCircle = L.circle([DEMO_CENTRE.lat, DEMO_CENTRE.lng], {
      radius: zoneKm * 1000, color: "#FC8019", weight: 1.5, fillColor: "#FC8019", fillOpacity: 0.05
    }).addTo(radarMap);
  }

  DB.listings.filter(l => l.status === "Available").forEach(l => {
    const c = listingLatLng(l);
    const d = listingDistanceKm(l);
    if (zoneKm && zoneKm < 900 && d > zoneKm) return;
    const left = Math.max(0, Math.round((l.expiresAt - Date.now()) / 60000));
    L.marker([c.lat, c.lng], { icon: pinIcon("F", "food") })
      .bindPopup("<strong>" + (l.eventTitle || l.donor) + "</strong><br>" + l.donor + "<br>" + l.items + "<br>" +
                 l.servings + " servings • " + d.toFixed(1) + " km away<br>Time left: ~" + left + " min")
      .addTo(radarLayer);
  });
  setTimeout(() => radarMap.invalidateSize(), 60);
}
