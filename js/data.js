/* ExtraPlate - data.js : demo centre, pickup points, listings, NGOs, sample impact.
   Content adapted from the original project demo (foodnxt.netlify.app) — its real
   event listings, NGO directory and impact figures — rebranded to ExtraPlate. */

/* Demo centre — Knowledge Park 2, Greater Noida (original project centre) */
const DEMO_CENTRE = { name: "Knowledge Park 2, Greater Noida", lat: 28.46243, lng: 77.49474 };

/* Verified NGO directory (original project data) */
const NGOS = [
  { id: "NGO-01", name: "Robin Hood Food Relief Chapter", phone: "+91 98800 11223", area: "Knowledge Park 2 & Alpha, Greater Noida", volunteers: 24 },
  { id: "NGO-02", name: "Akshaya Feed India Trust", phone: "+91 98450 77889", area: "Pari Chowk & Jagat Farm, Greater Noida", volunteers: 42 },
  { id: "NGO-03", name: "Hope Haven Shelter & Kitchen", phone: "+91 97311 44556", area: "Knowledge Park 3 & ITS Campus, Greater Noida", volunteers: 15 }
];

/* Pickup points = the real venues of the original listings */
const PICKUP_POINTS = [
  { name: "ITS Engineering College Campus, Knowledge Park 3, Greater Noida", lat: 28.46821, lng: 77.48685 },
  { name: "Alpha I Commercial Belt, Greater Noida", lat: 28.4750, lng: 77.5150 },
  { name: "Jagat Farm Market, Greater Noida", lat: 28.4800, lng: 77.5200 },
  { name: "Pari Chowk, Greater Noida", lat: 28.52768, lng: 77.52684 },
  { name: "Knowledge Park 2, Greater Noida", lat: 28.4550, lng: 77.5000 }
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

/* Seed listings — the original project's five live drops.
   Time left = the original's safe window minus time already passed since preparation,
   counted from the moment the demo data is (re)set so the clocks always look alive. */
function seedListings(now) {
  const m = 60000;
  return [
    {
      id: "EP-101", eventTitle: "ITS Engineering College Annual Fest Surplus",
      donor: "ITS Engineering College, Greater Noida", donorType: "College Event",
      phone: "+91 98765 43210", category: "Veg",
      items: "Shahi Paneer, Dum Biryani, Dal Makhani, 120 Tandoori Rotis, Gulab Jamun",
      type: "Cooked Hot Meals", servings: 120, weightKg: 45, packaging: "Insulated Warmers",
      point: 0, otp: "5824", expiresAt: now + 180 * m, status: "Available", dispatch: null,
      notes: "Enter via Gate 2 Service Bay. Ask for Executive Chef Ramesh.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600"
    },
    {
      id: "EP-102", eventTitle: "Aarav 1st Birthday Celebration Feast",
      donor: "Priya & Siddharth Sharma", donorType: "Event Host",
      phone: "+91 98221 11223", category: "Veg",
      items: "Pav Bhaji, Veg Hakka Noodles, Mini Samosas, Cupcakes, Fruit Punch",
      type: "Buffet Spread", servings: 50, weightKg: 20, packaging: "Pre-Packed Eco Meal Boxes",
      point: 1, otp: "9142", expiresAt: now + 180 * m, status: "Available", dispatch: null,
      notes: "Food is freshly packed in eco boxes ready for distribution.",
      image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=600"
    },
    {
      id: "EP-103", eventTitle: "Tech Conclave Corporate Buffet",
      donor: "Jagat Farm Community Centre, Greater Noida", donorType: "Community Centre",
      phone: "+91 97412 88990", category: "Mixed",
      items: "Grilled Herb Chicken, Veg Lasagna, Paneer Tikka, Brownies",
      type: "Buffet Spread", servings: 80, weightKg: 32, packaging: "Insulated Food Containers",
      point: 2, otp: "3671", expiresAt: now + 100 * m, status: "Claimed",
      dispatch: { ngo: "Robin Hood Food Relief Chapter", volunteer: "Arjun Verma", phone: "+91 91234 56780", vehicle: "Eco-Van (KA-01-MJ-4491)", etaMin: 15 },
      notes: "Contact Operations Dock on arrival.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
    },
    {
      id: "EP-104", eventTitle: "Grand Wedding Reception & Sangeet",
      donor: "Rajeshwar Rao", donorType: "Event Host",
      phone: "+91 99001 22334", category: "Veg",
      items: "Dum Pulao, Paneer Butter Masala, Mixed Dal, Parathas, Jalebi",
      type: "Cooked Hot Meals", servings: 140, weightKg: 55, packaging: "Insulated Food Warmers",
      point: 3, otp: "7720", expiresAt: now + 90 * m, status: "Available", dispatch: null,
      notes: "High quality wedding surplus.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600"
    },
    {
      id: "EP-105", eventTitle: "Knowledge Park 2 Community Weekend Brunch",
      donor: "Knowledge Park 2 Community Hall, Greater Noida", donorType: "Community Hall",
      phone: "+91 98450 11998", category: "Mixed",
      items: "Assorted Pasta, Quiche, Croissants, Salads, Rice Platters",
      type: "Continental Brunch", servings: 90, weightKg: 35, packaging: "Bakery Trays & Troughs",
      point: 4, otp: "4912", expiresAt: now + 120 * m, status: "Available", dispatch: null,
      notes: "Refrigerated holding area.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600"
    }
  ];
}

/* Impact figures from the original project (sample demo data).
   Weekly bars are Mon-Sun and sum to the 18,450 meals headline figure. */
const SAMPLE_IMPACT = {
  meals: 18450, foodKg: 7380, co2: 18450,
  weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  weeklyMeals: [1250, 980, 1420, 2100, 3400, 4850, 4450],
  categoryMix: { "Cooked Banquets": 52, "Corporate Lunch": 24, "Bakery / Dry": 14, "Packed Meals": 10 }
};

/* Sample drops for the NGO view's "Simulate Drop" demo button (from the original) */
const SIMULATE_DROPS = [
  { eventTitle: "JW Marriott Tech Dinner Buffet", donor: "JW Marriott Banquets", donorType: "Hotel", servings: 90, weightKg: 36, items: "Paneer Butter Masala, Veg Dum Biryani, Rotis, Gulab Jamun" },
  { eventTitle: "Kapoor Family Sangeet Feast", donor: "Sunil Kapoor", donorType: "Event Host", servings: 60, weightKg: 24, items: "Dal Makhani, Pulao, Paneer Tikka, Mini Samosas, Jalebi" }
];
