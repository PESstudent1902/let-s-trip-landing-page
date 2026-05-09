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
}

export interface Package {
  id: string;
  name: string;
  price: string;
  highlights: string[];
  image: string;
  destinationId: string;
}

export const DEFAULT_DESTINATIONS: Destination[] = [
  { id: "thailand", name: "Thailand", image: "/thailand.png", duration: "7N", price: "₹62,000", tags: ["Adventure", "Culture"], description: "Ancient temples, tropical beaches, and vibrant street food" },
  { id: "dubai", name: "Dubai", image: "/dubai.png", duration: "5N", price: "₹81,500", tags: ["Luxury", "Adventure"], description: "Futuristic skyline, golden deserts, and world-class dining" },
  { id: "singapore", name: "Singapore", image: "/singapore.png", duration: "7N", price: "₹1,15,000", tags: ["Culture", "Luxury"], description: "Garden city wonders, hawker centers, and stunning architecture" },
  { id: "bali", name: "Bali", image: "/bali.png", duration: "5N", price: "₹45,000", tags: ["Relaxation", "Culture"], description: "Sacred temples, rice terraces, and serene spa retreats" },
  { id: "maldives", name: "Maldives", image: "/hero-bg.png", duration: "4N", price: "₹92,000", tags: ["Luxury", "Relaxation"], description: "Overwater villas, turquoise lagoons, and private island calm" },
  { id: "vietnam", name: "Vietnam", image: "/hero-bg.png", duration: "6N", price: "₹58,000", tags: ["Culture", "Adventure"], description: "Limestone bays, old quarters, and unforgettable local cuisine" },
  { id: "japan", name: "Japan", image: "/hero-bg.png", duration: "6N", price: "₹1,45,000", tags: ["Culture", "Luxury"], description: "Neon cities, mountain shrines, and iconic seasonal beauty" },
  { id: "europe", name: "Europe", image: "/hero-bg.png", duration: "8N", price: "₹1,68,000", tags: ["Luxury", "Culture"], description: "Multi-city classics with guided tours and premium stays" },
];

export const DEFAULT_PACKAGES: Package[] = [
  { id: "pkg-th-4n", destinationId: "thailand", name: "4N Thailand", price: "₹45,000", highlights: ["4-Star Hotel", "Sightseeing", "Transfers", "Breakfast", "Activities"], image: "/thailand.png" },
  { id: "pkg-th-exblr", destinationId: "thailand", name: "4N Thai Ex-Blr", price: "₹52,000", highlights: ["Flights Included", "4-Star Hotel", "Transfers", "Breakfast", "City Tour"], image: "/thailand.png" },
  { id: "pkg-db-5n", destinationId: "dubai", name: "5N Dubai", price: "₹81,500", highlights: ["5-Star Hotel", "Return Flights", "Desert Safari", "City Tour", "All Meals"], image: "/dubai.png" },
  { id: "pkg-bl-6n", destinationId: "bali", name: "6N Bali", price: "₹55,000", highlights: ["Private Villa", "Spa Package", "Rice Terrace", "Breakfast", "Transfers"], image: "/bali.png" },
  { id: "pkg-sg-7n", destinationId: "singapore", name: "7N Singapore Cruise Malaysia", price: "₹1,15,000", highlights: ["4-Star Hotels", "Cruise Included", "City Tours", "Transfers", "Half Board"], image: "/singapore.png" },
  { id: "pkg-md-4n", destinationId: "maldives", name: "4N Maldives Escape", price: "₹99,000", highlights: ["Water Villa", "Speedboat Transfers", "Daily Breakfast", "Snorkeling", "Sunset Cruise"], image: "/hero-bg.png" },
  { id: "pkg-vn-6n", destinationId: "vietnam", name: "6N Vietnam Discovery", price: "₹63,000", highlights: ["Hanoi Stay", "Ha Long Bay Cruise", "Guided Tours", "Breakfast", "Airport Transfers"], image: "/hero-bg.png" },
  { id: "pkg-jp-6n", destinationId: "japan", name: "6N Japan Highlights", price: "₹1,45,000", highlights: ["Tokyo + Osaka", "Bullet Train", "City Pass", "4-Star Hotels", "Daily Breakfast"], image: "/hero-bg.png" },
  { id: "pkg-eu-8n", destinationId: "europe", name: "8N Europe Explorer", price: "₹1,68,000", highlights: ["Schengen Support", "Intercity Transfers", "Guided City Walks", "4-Star Hotels", "Breakfast"], image: "/hero-bg.png" },
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

export const AVAILABLE_IMAGES = [
  { value: "/thailand.png", label: "Thailand" },
  { value: "/dubai.png", label: "Dubai" },
  { value: "/singapore.png", label: "Singapore" },
  { value: "/bali.png", label: "Bali" },
  { value: "/hero-bg.png", label: "Generic Travel" },
];
