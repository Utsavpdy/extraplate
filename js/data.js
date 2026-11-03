/* ExtraPlate - data.js : demo centre, pickup points, sample listings, sample impact.
   All listings and figures here are DEMO / SAMPLE data, exactly as stated in the presentation. */

const DEMO_NGO = {
  name: "Helping Hands Foundation",
  lat: 28.4744, lng: 77.5046,
  area: "Knowledge Park III, Greater Noida"
};

/* Demo pickup points a donor can choose (Greater Noida / Noida area) */
const PICKUP_POINTS = [
  { name: "Pari Chowk, Greater Noida",   lat: 28.4622, lng: 77.5100 },
  { name: "Jagat Farm, Greater Noida",   lat: 28.4897, lng: 77.5122 },
  { name: "Alpha 1, Greater Noida",      lat: 28.4723, lng: 77.5183 },
  { name: "Delta 1, Greater Noida",      lat: 28.4819, lng: 77.5410 },
  { name: "Surajpur, Greater Noida",     lat: 28.4691, lng: 77.4880 },
  { name: "Sector 62, Noida",            lat: 28.6304, lng: 77.3721 },
  { name: "Sector 18, Noida",            lat: 28.5708, lng: 77.3261 },
  { name: "Botanical Garden, Noida",     lat: 28.5638, lng: 77.3347 }
];

/* Freshness levels (Slide: Freshness Tracking) */
function freshnessLevel(msLeft) {
  if (msLeft <= 0) return "expired";
  const min = msLeft / 60000;
  if (min > 60) return "normal";     // more time - still safe to plan
  if (min > 20) return "priority";   // pick soon
  return "urgent";                   // act right now
}
const LEVEL_LABEL = { normal: "Normal", priority: "Priority", urgent: "Urgent", expired: "Expired" };

/* Seed listings. expiresInMin is counted from the moment the demo data is (re)set,
   so the freshness clocks always look alive. OTPs are donor-side private codes. */
function seedListings(now) {
  const m = 60000;
  return [
    { id: "L1", donor: "Hotel GreenLeaf", donorType: "Hotel / Hall Manager",
      items: "Rice, Dal, Mixed Vegetables", type: "Cooked Meal", servings: 120, weightKg: 30,
      packaging: "Sealed food boxes", point: 0, otp: "4831", status: "Available",
      createdAt: now - 5 * m, expiresAt: now + 135 * m, dispatch: null },
    { id: "L2", donor: "Sharma Banquet Hall", donorType: "Event Host (one-time)",
      items: "Wedding Feast - Puri, Aloo Sabzi, Kheer", type: "Cooked Meal", servings: 200, weightKg: 50,
      packaging: "Large steel containers", point: 3, otp: "7290", status: "Available",
      createdAt: now - 18 * m, expiresAt: now + 42 * m, dispatch: null },
    { id: "L3", donor: "City Bakery", donorType: "Store / Bakery",
      items: "Bread, Buns, Cream Cakes", type: "Bakery", servings: 60, weightKg: 12,
      packaging: "Paper boxes", point: 1, otp: "3156", status: "Available",
      createdAt: now - 40 * m, expiresAt: now + 12 * m, dispatch: null },
    { id: "L4", donor: "Spice Route Restaurant", donorType: "Restaurant",
      items: "Veg Biryani, Raita", type: "Cooked Meal", servings: 80, weightKg: 20,
      packaging: "Sealed food boxes", point: 4, otp: "9042", status: "Available",
      createdAt: now - 10 * m, expiresAt: now + 55 * m, dispatch: null },
    { id: "L5", donor: "FreshMart Store", donorType: "Store / Bakery",
      items: "Bananas, Oranges, Tomatoes", type: "Fresh Produce", servings: 90, weightKg: 45,
      packaging: "Crates", point: 6, otp: "6618", status: "Available",
      createdAt: now - 30 * m, expiresAt: now + 300 * m, dispatch: null },
    { id: "L6", donor: "Cafe Delight", donorType: "Restaurant",
      items: "Sandwiches, Juice Boxes", type: "Packaged Food", servings: 50, weightKg: 10,
      packaging: "Original packing", point: 2, otp: "2214", status: "Claimed",
      createdAt: now - 25 * m, expiresAt: now + 25 * m,
      dispatch: { ngo: DEMO_NGO.name, volunteer: "Ravi Kumar", phone: "98765 43210", vehicle: "Bike", etaMin: 15 } }
  ];
}

/* Sample platform impact (Slide: Impact Hub) - demo figures, NOT verified results.
   Weekly bars add up to the 1,240 meals headline figure. */
const SAMPLE_IMPACT = {
  meals: 1240, foodKg: 310, co2Kg: 620,
  weeklyMeals: [120, 150, 138, 175, 190, 210, 257],
  weeklyLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"],
  categoryMix: { "Cooked Meal": 55, "Bakery": 15, "Fresh Produce": 18, "Packaged Food": 12 }
};
