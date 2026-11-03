# ExtraPlate — Smart Surplus Food Rescue & Sharing Platform

> **v2:** Content and features ported from the original project demo (foodnxt.netlify.app) — real event listings (ITS Fest, Aarav Birthday, Tech Conclave, Wedding at Pari Chowk, KP-2 Brunch), the verified NGO directory (Robin Hood Food Relief Chapter, Akshaya Feed India Trust, Hope Haven Shelter & Kitchen), original impact figures (18,450 meals / 7,380 kg / 18,450 kg CO2), Top Donors leaderboard, donation certificate with 80G note, Simulate Drop, zone pills and live-location radar centred on Knowledge Park 2, Greater Noida.

**Rescue Surplus. Reduce Waste. Feed More.**

A front-end web demo that connects surplus food from hotels, banquet halls, caterers and
event hosts to nearby NGOs — so good food reaches people instead of the dustbin.

## How to run
Open `index.html` in a browser, or serve the folder with any static server, e.g.:

```
npx serve .
```

## Demo walkthrough (2 minutes)
1. On the home page choose **Donor** and post a food listing (an OTP is generated for you).
2. Open the same page in a **second tab**, choose **NGO** — the new listing appears with a sound alert (cross-tab sync).
3. On the **NGO Radar**, filter by distance zone, **Claim** the food and enter volunteer details.
4. In **My Rescues**, type the donor's OTP (visible in the Donor tab) and press **Complete Pickup**.
5. Open the **Impact Hub** to see the session rescue counted.

## Features
- Donor portal: 1-minute listing form, private 4-digit OTP per listing, live status tracking
- NGO Rescue Radar: Leaflet + OpenStreetMap map, distance zones 3 / 10 / 20 / 30 / 50 km
- Freshness tracking: live countdown on every listing — Normal / Priority / Urgent
- OTP-verified handover: wrong OTP = pickup does not complete
- Cross-tab alerts: BroadcastChannel + toast + Web Audio beep
- Impact Hub: Chart.js dashboards (sample data, labelled as sample)

## File structure
```
extraplate/
├── index.html            Main one-page app and screens
├── css/style.css         Look & design for all screens
├── js/data.js            Sample listings, pickup points, sample impact figures
├── js/store.js           LocalStorage saving + BroadcastChannel tab sync
├── js/map.js             Leaflet map, distance zones, markers
├── js/charts.js          Chart.js impact charts and counters
├── js/notifications.js   Toast pop-ups + Web Audio alert sounds
└── js/app.js             Screen actions, forms, status flow, freshness clock
```

## Honest scope
This is a **front-end prototype**: data lives in the browser (LocalStorage), there is no
server or production database, the OTP is a demo check (not SMS), and impact figures are
sample data. The production roadmap (secure backend + database, verified accounts,
real SMS OTP, verified NGO onboarding, validated impact counting) is described in the
project presentation.

**Team:** Utsav Pandey • Utkarsh Raj • Tejas Mani Tripathi
**Guide:** Mr. Abhishek Shivhare — CSE, I.T.S Engineering College, Greater Noida
