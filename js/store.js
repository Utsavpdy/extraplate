/* ExtraPlate - store.js : saving data (LocalStorage) + tabs talking to each other (BroadcastChannel).
   This is the State & Sync layer of the architecture: no server, no database - the browser is the store. */

const DB_KEY = "extraplate_db_v2";
const channel = ("BroadcastChannel" in window) ? new BroadcastChannel("extraplate_channel") : null;

let DB = null;

function saveDB() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(DB)); } catch (e) { /* storage full/blocked - demo keeps running in memory */ }
}

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) { DB = JSON.parse(raw); return; }
  } catch (e) { /* fall through to reseed */ }
  DB = { listings: seedListings(Date.now()), sessionMeals: 0, sessionKg: 0 };
  saveDB();
}

function resetDB() {
  localStorage.removeItem(DB_KEY);
  loadDB();
  broadcast({ type: "reset" });
}

/* Announce a change to every other open tab */
function broadcast(msg) { if (channel) channel.postMessage(msg); }

function onBroadcast(fn) { if (channel) channel.onmessage = (ev) => fn(ev.data || {}); }

function getListing(id) { return DB.listings.find(l => l.id === id); }

function addListing(data) {
  const listing = Object.assign({
    id: "L" + Date.now().toString(36),
    status: "Available", dispatch: null, createdAt: Date.now()
  }, data);
  DB.listings.unshift(listing);
  saveDB();
  broadcast({ type: "listing-added", id: listing.id });
  return listing;
}

function updateListing(id, patch) {
  const l = getListing(id);
  if (!l) return;
  Object.assign(l, patch);
  saveDB();
  broadcast({ type: "listing-updated", id });
}

function newOTP() { return String(Math.floor(1000 + Math.random() * 9000)); }

loadDB();
