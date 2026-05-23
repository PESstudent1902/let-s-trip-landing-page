/**
 * Shared travel data models and defaults.
 */

export interface Destination {
  id: string;
  name: string;
  image: string;
  duration: string;
  price: string;
  tags: string[];
  description: string;
  bestTimeToVisit?: string;
}

export type ItineraryDay = {
  day: number;
  title: string;
  details: string[];
};

export const PACKAGE_SECTIONS = [
  { id: "expert-picks", label: "Expert Picks to Inspire You", icon: "✦" },
  { id: "adventures", label: "Adventures for You", icon: "🏔️" },
  { id: "honeymoon", label: "Honeymoon Special", icon: "💕" },
  { id: "domestic", label: "Domestic / Indian", icon: "🇮🇳" },
] as const;

export type PackageSectionId = typeof PACKAGE_SECTIONS[number]["id"];

export interface Package {
  id: string;
  name: string;
  price: string;
  highlights: string[]; // kept for backwards compatibility; used as inclusions/benefits in UI
  image: string;
  destinationId?: string;
  durationNights?: number;
  tags?: string[];
  itinerary?: ItineraryDay[];
  sections?: string[]; // which website sections this package appears in (multi-select)
}

export const DEFAULT_DESTINATIONS: Destination[] = [
  { id: "thailand", name: "Thailand", image: "/thailand.png", duration: "7N", price: "₹62,000", tags: ["Adventure", "Culture"], description: "Ancient temples, tropical beaches, and vibrant street food", bestTimeToVisit: "November to April" },
  { id: "france", name: "France", image: "/france.png", duration: "6N", price: "₹1,25,000", tags: ["Romance", "History"], description: "Paris skyline, historical châteaux, and world-renowned art and fashion", bestTimeToVisit: "April to October" },
  { id: "egypt", name: "Egypt", image: "/egypt.png", duration: "5N", price: "₹75,000", tags: ["History", "Mystery"], description: "Giza Pyramids, Nile cruises, and mysterious ancient ruins", bestTimeToVisit: "October to April" },
  { id: "maldives", name: "Maldives", image: "/maldives.png", duration: "4N", price: "₹92,000", tags: ["Luxury", "Relaxation"], description: "Overwater villas, turquoise lagoons, and private island calm", bestTimeToVisit: "November to April" },
  { id: "dubai", name: "Dubai", image: "/dubai.png", duration: "5N", price: "₹81,500", tags: ["Luxury", "Adventure"], description: "Futuristic skyline, golden deserts, and world-class dining" },
  { id: "singapore", name: "Singapore", image: "/singapore.png", duration: "7N", price: "₹1,15,000", tags: ["Culture", "Luxury"], description: "Garden city wonders, hawker centers, and stunning architecture" },
  { id: "bali", name: "Bali", image: "/bali.png", duration: "5N", price: "₹45,000", tags: ["Relaxation", "Culture"], description: "Sacred temples, rice terraces, and serene spa retreats" },
  { id: "vietnam", name: "Vietnam", image: "/hero-bg.png", duration: "6N", price: "₹58,000", tags: ["Culture", "Adventure"], description: "Limestone bays, old quarters, and unforgettable local cuisine" },
  { id: "japan", name: "Japan", image: "/hero-bg.png", duration: "6N", price: "₹1,45,000", tags: ["Culture", "Luxury"], description: "Neon cities, mountain shrines, and iconic seasonal beauty" },
  { id: "europe", name: "Europe", image: "/hero-bg.png", duration: "8N", price: "₹1,68,000", tags: ["Luxury", "Culture"], description: "Multi-city classics with guided tours and premium stays" },
  { id: "spiti", name: "Spiti Valley", image: "/hero-bg.png", duration: "9N", price: "₹18,000", tags: ["Adventure", "Backpacking"], description: "The middle land between Tibet and India, a cold desert mountain valley", bestTimeToVisit: "May to October (Circuit), February (Winter)" },
  { id: "himachal", name: "Himachal Pradesh", image: "/hero-bg.png", duration: "6N", price: "₹13,500", tags: ["Backpacking", "Nature"], description: "Mist-covered mountains, lush valleys, and serene pine forests", bestTimeToVisit: "March to June, September to December" },
  { id: "lucerne", name: "Lucerne", image: "/lucerne.png", duration: "5N", price: "₹1,10,000", tags: ["Nature", "Scenic"], description: "Lake Lucerne, ancient wooden bridge, and dramatic Alpine panoramas", bestTimeToVisit: "June to September" },
  { id: "laax", name: "Laax", image: "/laax.png", duration: "4N", price: "₹95,000", tags: ["Adventure", "Skiing"], description: "World-class freestyle skiing and snowboarding in the Swiss Alps", bestTimeToVisit: "December to April" },
  { id: "interlaken", name: "Interlaken", image: "/interlaken.png", duration: "6N", price: "₹1,20,000", tags: ["Adventure", "Lakes"], description: "The adventure capital of Europe, set between two beautiful Swiss lakes", bestTimeToVisit: "June to August" },
  { id: "zurich", name: "Zurich", image: "/zurich.png", duration: "4N", price: "₹1,15,000", tags: ["City", "Luxury"], description: "Global financial hub, lake cruises, and cobblestoned Old Town history", bestTimeToVisit: "June to August" },
  { id: "zermatt", name: "Zermatt", image: "/zermatt.png", duration: "5N", price: "₹1,30,000", tags: ["Mountains", "Skiing"], description: "Car-free Swiss village under the iconic silhouette of the Matterhorn", bestTimeToVisit: "December to April" },
  { id: "canada", name: "Canada", image: "/canada.png", duration: "8N", price: "₹1,85,000", tags: ["Nature", "Adventure"], description: "Lakes, soaring mountain peaks, and deep forest trails in the Rockies", bestTimeToVisit: "June to September" },
  { id: "italy", name: "Italy", image: "/italy.png", duration: "7N", price: "₹1,55,000", tags: ["Culture", "Romance"], description: "Venice gondolas, ancient Roman ruins, and Tuscan culinary heritage", bestTimeToVisit: "April to June, September to October" },
  { id: "almaty", name: "Almaty", image: "/almaty.png", duration: "5N", price: "₹72,990", tags: ["Nature", "Honeymoon"], description: "Snowy peak backdrops, turquoise alpine lakes, and modern hospitality in Kazakhstan", bestTimeToVisit: "September to May" },
];

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "pkg-bungee",
    name: "Bungee Jumping Adventure",
    price: "₹4,500",
    durationNights: 1,
    highlights: ["Safety Briefing", "Full Gear", "Jump Video", "Certification"],
    image: "/bungee.png",
    destinationId: "himachal",
    sections: ["adventures"],
    itinerary: [
      { day: 1, title: "Adventure Briefing & Jump", details: ["Report to jump zone", "Gear check and briefing", "The ultimate free-fall experience", "Certificate handover"] },
    ],
  },
  {
    id: "pkg-rafting",
    name: "Rafting in River Rapids",
    price: "₹3,200",
    durationNights: 1,
    highlights: ["Grade III Rapids", "Professional Guides", "Safety Kayak", "Hot Lunch"],
    image: "/rafting.png",
    destinationId: "himachal",
    sections: ["adventures"],
    itinerary: [
      { day: 1, title: "Rapid Run", details: ["Arrival at launch point", "Safety briefing and paddling practice", "16km rapid run through Grade II & III rapids", "Hot riverside lunch"] },
    ],
  },
  {
    id: "pkg-paragliding",
    name: "Sunset Paragliding Tandem Flight",
    price: "₹5,000",
    durationNights: 1,
    highlights: ["15 Mins Flight", "Tandem Pilot", "GoPro Video", "Takeoff Transfer"],
    image: "/paragliding.png",
    destinationId: "himachal",
    sections: ["adventures"],
    itinerary: [
      { day: 1, title: "Fly like a Bird", details: ["Transfer to Billing takeoff site", "Pre-flight checks and harness fitting", "15-20 minutes glider flight", "Landing at Bir and video transfer"] },
    ],
  },
  {
    id: "pkg-skiing",
    name: "Ski Touring Experience",
    price: "₹8,500",
    durationNights: 2,
    highlights: ["Ski Equipment", "Local Instructor", "Lift Passes", "Mountain Lodge Stays"],
    image: "/skiing.png",
    destinationId: "laax",
    sections: ["adventures"],
    itinerary: [
      { day: 1, title: "Basics & First Run", details: ["Fittings at lodge", "Snow training and balancing", "Beginner slope practice"] },
      { day: 2, title: "Ski Tour", details: ["Guided trail ride", "Scenic stops", "Evening cozy campfire"] },
    ],
  },
  {
    id: "pkg-almaty",
    name: "5N Almaty Special",
    price: "₹72,990",
    durationNights: 5,
    highlights: ["Mountain Lodge", "Big Almaty Lake Tour", "Charyn Canyon", "Flights Included", "All Meals"],
    image: "/almaty.png",
    destinationId: "almaty",
    sections: ["honeymoon"],
    itinerary: [
      { day: 1, title: "Arrival in Almaty", details: ["Airport pickup", "Check-in at luxury hotel", "Welcome dinner"] },
      { day: 2, title: "Almaty City Highlights", details: ["Panfilov Park", "Zenkov Cathedral", "Medeu Gorge cable car"] },
      { day: 3, title: "Big Almaty Lake", details: ["Scenic drive to alpine lake", "Photowalk around turquoise water", "Traditional Kazakh lunch"] },
      { day: 4, title: "Charyn Canyon Excursion", details: ["Explore Valley of Castles", "Grand landscapes", "Riverside picnic"] },
      { day: 5, title: "Leisure & Departure", details: ["Shopping at Green Bazaar", "Hotel checkout", "Transfer to airport"] },
    ],
  },
  {
    id: "pkg-1",
    name: "4N Thailand",
    price: "₹45,000",
    durationNights: 4,
    highlights: ["4-Star Hotel", "Sightseeing", "Transfers", "Breakfast", "Activities"],
    image: "/thailand.png",
    destinationId: "thailand",
    sections: ["expert-picks"],
    itinerary: [
      { day: 1, title: "Arrival & Check-in", details: ["Airport pickup", "Hotel check-in", "Evening at leisure"] },
      { day: 2, title: "City Highlights", details: ["Guided sightseeing", "Local markets", "Optional activities"] },
      { day: 3, title: "Island/Day Trip", details: ["Full-day excursion", "Transfers included"] },
      { day: 4, title: "Departure", details: ["Breakfast", "Checkout", "Drop to airport"] },
    ],
  },
  {
    id: "pkg-3",
    name: "5N Dubai",
    price: "₹81,500",
    durationNights: 5,
    highlights: ["5-Star Hotel", "Return Flights", "Desert Safari", "City Tour", "All Meals"],
    image: "/dubai.png",
    destinationId: "dubai",
    sections: ["expert-picks", "explore-more"],
    itinerary: [
      { day: 1, title: "Arrival & Marina Evening", details: ["Airport pickup", "Check-in", "Dhow cruise (optional)"] },
      { day: 2, title: "Dubai City Tour", details: ["Landmarks & souks", "Photo stops", "Evening free"] },
      { day: 3, title: "Desert Safari", details: ["Dune bashing", "BBQ dinner", "Cultural shows"] },
      { day: 4, title: "Leisure Day", details: ["Shopping / theme parks (optional)"] },
      { day: 5, title: "Departure", details: ["Checkout", "Airport transfer"] },
    ],
  },
  {
    id: "pkg-4",
    name: "6N Bali",
    price: "₹55,000",
    durationNights: 6,
    highlights: ["Private Villa", "Spa Package", "Rice Terrace", "Breakfast", "Transfers"],
    image: "/bali.png",
    destinationId: "bali",
    sections: ["explore-more"],
    itinerary: [
      { day: 1, title: "Arrival & Villa Check-in", details: ["Pickup", "Settle in", "Leisure"] },
      { day: 2, title: "Ubud & Rice Terraces", details: ["Scenic stops", "Local experiences"] },
      { day: 3, title: "Spa & Relaxation", details: ["Spa session", "Free time"] },
      { day: 4, title: "Beach Day", details: ["Coastline exploration", "Optional water sports"] },
      { day: 5, title: "Temple Visit", details: ["Iconic temples", "Sunset viewpoint"] },
      { day: 6, title: "Flight Back", details: ["Travel home"] },
    ],
  },
];

export const GENERAL_DESTINATION_ID = "general";

export function slugifyDestinationName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function inferDestinationIdFromPackage(pkg: Pick<Package, "name" | "image">, destinations: Destination[]): string {
  const byName = destinations.find((d) => pkg.name.toLowerCase().includes(d.name.toLowerCase()));
  if (byName) return byName.id;

  const byImage = destinations.find((d) => d.image === pkg.image);
  if (byImage) return byImage.id;

  return destinations[0]?.id || GENERAL_DESTINATION_ID;
}

// === Admin Auth ===
// Default password: "letstrip2026"

const ADMIN_PASSWORD_HASH = "d072f2d8c297fed0a7ba34c3fa16824d32b42bdc1080f66d950d60d39366519e";
const AUTH_KEY = "letstrip_admin_auth";
const AUTH_EXPIRY = 24 * 60 * 60 * 1000;

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = await sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    saveToStorage(AUTH_KEY, { authenticated: true, timestamp: Date.now() });
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  const session = getFromStorage<{ authenticated: boolean; timestamp: number } | null>(AUTH_KEY, null);
  if (!session) return false;
  if (Date.now() - session.timestamp > AUTH_EXPIRY) {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
    return false;
  }
  return session.authenticated;
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}

export const AVAILABLE_IMAGES = [
  { value: "/thailand.png", label: "Thailand" },
  { value: "/dubai.png", label: "Dubai" },
  { value: "/singapore.png", label: "Singapore" },
  { value: "/bali.png", label: "Bali" },
  { value: "/hero-bg.png", label: "Generic Travel" },
];
