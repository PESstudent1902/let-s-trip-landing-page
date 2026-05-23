/**
 * Seeding script: Adds new Spiti and Himachal packages and destinations to Vercel KV.
 * Run with: node seed-domestic.mjs
 */

const KV_REST_API_URL = "https://game-husky-119092.upstash.io";
const KV_REST_API_TOKEN = "gQAAAAAAAdE0AAIgcDI4NjA3NTk5MTJjMGQ0NWU5OWQ0ZDEyMDZkZWMxYWM0NA";

const PACKAGES_KEY = "letstrip_packages";
const DESTINATIONS_KEY = "letstrip_destinations";

const NEW_DESTINATIONS = [
  { id: "spiti", name: "Spiti Valley", image: "/hero-bg.png", duration: "9N", price: "₹18,000", tags: ["Adventure", "Backpacking"], description: "The middle land between Tibet and India, a cold desert mountain valley", bestTimeToVisit: "May to October (Circuit), February (Winter)" },
  { id: "himachal", name: "Himachal Pradesh", image: "/hero-bg.png", duration: "6N", price: "₹13,500", tags: ["Backpacking", "Nature"], description: "Mist-covered mountains, lush valleys, and serene pine forests", bestTimeToVisit: "March to June, September to December" },
];

const NEW_PACKAGES = [
  {
    id: "pkg-spiti-winter",
    name: "Winter Spiti Trip",
    price: "₹18,000 + GST",
    durationNights: 8,
    highlights: ["Tempo Traveler", "Homestays", "All Meals", "Sightseeing", "Guided Tour"],
    image: "/hero-bg.png",
    destinationId: "spiti",
    sections: ["domestic", "adventures"],
    itinerary: [
      { day: 1, title: "Delhi to Shimla", details: ["Overnight travel"] },
      { day: 2, title: "Shimla to Kalpa", details: ["Scenic drive", "Apple orchards"] },
      { day: 3, title: "Kalpa to Nako/Tabo", details: ["Frozen landscapes"] },
      { day: 4, title: "Tabo to Kaza", details: ["Key Monastery", "Khibber"] },
      { day: 5, title: "Kaza Sightseeing", details: ["Hikkim", "Komic", "Langza"] },
      { day: 6, title: "Kaza to Pin Valley", details: ["Snow leopards", "Local culture"] },
      { day: 7, title: "Kaza to Kalpa", details: ["Descent", "Evening walk"] },
      { day: 8, title: "Kalpa to Shimla", details: ["Farewell dinner"] },
      { day: 9, title: "Shimla to Delhi", details: ["Morning arrival"] },
    ],
  },
  {
    id: "pkg-spiti-circuit",
    name: "Spiti Valley Circuit Trip",
    price: "₹23,000 + GST",
    durationNights: 9,
    highlights: ["9N Accommodations", "All Transfers", "Meals", "Inner Line Permit", "Oxygen Support"],
    image: "/hero-bg.png",
    destinationId: "spiti",
    sections: ["domestic", "expert-picks"],
    itinerary: [
      { day: 1, title: "Delhi to Manali", details: ["Overnight journey"] },
      { day: 2, title: "Manali Arrival", details: ["Rest & Acclimatization"] },
      { day: 3, title: "Manali to Chandratal", details: ["Rohtang Pass", "Camping"] },
      { day: 4, title: "Chandratal to Kaza", details: ["Kunzum Pass"] },
      { day: 5, title: "Kaza Local", details: ["Key Monastery", "Hikkim"] },
      { day: 6, title: "Kaza to Mudh (Pin Valley)", details: ["Scenic trek"] },
      { day: 7, title: "Mudh to Nako", details: ["Lake visit"] },
      { day: 8, title: "Nako to Kalpa", details: ["Kinnaur views"] },
      { day: 9, title: "Kalpa to Shimla", details: ["Long drive"] },
      { day: 10, title: "Shimla to Delhi", details: ["Return home"] },
    ],
  },
  {
    id: "pkg-himachal-backpacking",
    name: "Himachal Backpacking (Manali, Kasol, Jibhi)",
    price: "₹13,500 + GST",
    durationNights: 6,
    highlights: ["Delhi-Manali-Delhi Volvo", "Stays", "Breakfast & Dinner", "Sightseeing", "Trek to Kheerganga"],
    image: "/hero-bg.png",
    destinationId: "himachal",
    sections: ["domestic", "explore-more"],
    itinerary: [
      { day: 1, title: "Delhi to Manali", details: ["Evening departure"] },
      { day: 2, title: "Manali Arrival", details: ["Hadimba Temple", "Old Manali"] },
      { day: 3, title: "Manali Local", details: ["Solang Valley", "Vashisht"] },
      { day: 4, title: "Manali to Kasol", details: ["Parvati Valley", "Chhalal"] },
      { day: 5, title: "Kasol/Kheerganga", details: ["Trek", "Hot springs"] },
      { day: 6, title: "Kasol to Jibhi", details: ["Tirthan Valley", "Waterfall"] },
      { day: 7, title: "Jibhi to Delhi", details: ["Morning arrival"] },
    ],
  },
];

async function redisGet(key) {
  const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  if (data.result === null) return [];
  return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
}

async function redisSet(key, value) {
  const res = await fetch(`${KV_REST_API_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
  return res.json();
}

async function main() {
  console.log("📥 Fetching current data from Redis...");
  const currentPackages = await redisGet(PACKAGES_KEY);
  const currentDestinations = await redisGet(DESTINATIONS_KEY);

  console.log(`Current: ${currentPackages.length} packages, ${currentDestinations.length} destinations.`);

  // Filter out duplicates
  const filteredNewDestinations = NEW_DESTINATIONS.filter(nd => !currentDestinations.some(cd => cd.id === nd.id));
  const filteredNewPackages = NEW_PACKAGES.filter(np => !currentPackages.some(cp => cp.id === np.id));

  if (filteredNewDestinations.length === 0 && filteredNewPackages.length === 0) {
    console.log("✅ All new data already exists in Redis.");
    return;
  }

  const updatedDestinations = [...currentDestinations, ...filteredNewDestinations];
  const updatedPackages = [...currentPackages, ...filteredNewPackages];

  console.log(`📤 Adding ${filteredNewDestinations.length} destinations and ${filteredNewPackages.length} packages...`);
  
  await redisSet(DESTINATIONS_KEY, updatedDestinations);
  await redisSet(PACKAGES_KEY, updatedPackages);

  console.log("✅ Seeding complete!");
}

main().catch(console.error);
