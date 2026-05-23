/**
 * Migration script: Adds `sections` field to all existing packages in Vercel KV.
 * Run with: node migrate-sections.mjs
 */

const KV_REST_API_URL = "https://game-husky-119092.upstash.io";
const KV_REST_API_TOKEN = "gQAAAAAAAdE0AAIgcDI4NjA3NTk5MTJjMGQ0NWU5OWQ0ZDEyMDZkZWMxYWM0NA";

const PACKAGES_KEY = "letstrip_packages";

// Smart section assignment based on package name/destination/tags
function inferSections(pkg) {
  const name = (pkg.name || "").toLowerCase();
  const destId = (pkg.destinationId || "").toLowerCase();
  const tags = (pkg.tags || []).map(t => t.toLowerCase());
  const highlights = (pkg.highlights || []).map(h => h.toLowerCase());

  const sections = [];

  // Expert Picks — premium/luxury/high-value packages
  if (
    tags.includes("luxury") ||
    highlights.some(h => h.includes("5-star") || h.includes("5 star")) ||
    highlights.some(h => h.includes("cruise")) ||
    name.includes("cruise")
  ) {
    sections.push("expert-picks");
  }

  // Adventures — adventure-tagged, trekking, safari
  if (
    tags.includes("adventure") ||
    highlights.some(h => h.includes("safari") || h.includes("trek") || h.includes("water sport"))
  ) {
    sections.push("adventures");
  }

  // Honeymoon — honeymoon-tagged, romantic, spa/villa
  if (
    tags.includes("honeymoon") ||
    tags.includes("romantic") ||
    name.includes("honeymoon") ||
    highlights.some(h => h.includes("spa") || h.includes("villa") || h.includes("private"))
  ) {
    sections.push("honeymoon");
  }

  // Domestic / Indian — Indian destinations
  const indianDests = ["goa", "kashmir", "rajasthan", "kerala", "manali", "shimla", "ladakh",
    "andaman", "darjeeling", "ooty", "rishikesh", "jaipur", "udaipur", "munnar",
    "coorg", "agra", "varanasi", "delhi", "mumbai", "bangalore", "hyderabad",
    "leh", "sikkim", "meghalaya", "uttarakhand", "himachal", "india", "indian"];
  if (
    tags.includes("domestic") ||
    tags.includes("india") ||
    indianDests.some(d => name.includes(d) || destId.includes(d))
  ) {
    sections.push("domestic");
  }

  // Explore More — international / catch-all for unmatched
  const internationalDests = ["thailand", "dubai", "singapore", "bali", "maldives", "vietnam",
    "japan", "europe", "paris", "london", "australia", "new zealand", "switzerland",
    "turkey", "egypt", "greece", "italy", "spain", "sri lanka", "nepal", "bhutan",
    "malaysia", "indonesia", "cambodia", "myanmar", "new york", "usa"];
  if (
    internationalDests.some(d => name.includes(d) || destId.includes(d))
  ) {
    sections.push("explore-more");
  }

  // If nothing matched, put in explore-more as fallback
  if (sections.length === 0) {
    sections.push("explore-more");
  }

  return sections;
}

async function redisGet(key) {
  const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
  });
  const data = await res.json();
  if (data.result === null) return null;
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
  console.log("📦 Fetching current packages from Redis...");
  const packages = await redisGet(PACKAGES_KEY);

  if (!packages || !Array.isArray(packages)) {
    console.log("❌ No packages found in Redis. Nothing to migrate.");
    return;
  }

  console.log(`Found ${packages.length} packages. Analyzing sections...\n`);

  let updated = 0;
  const migratedPackages = packages.map((pkg) => {
    const alreadyHasSections = pkg.sections && Array.isArray(pkg.sections) && pkg.sections.length > 0;

    if (alreadyHasSections) {
      console.log(`  ✅ "${pkg.name}" — already has sections: [${pkg.sections.join(", ")}]`);
      return pkg;
    }

    const sections = inferSections(pkg);
    updated++;
    console.log(`  🔄 "${pkg.name}" — assigned sections: [${sections.join(", ")}]`);
    return { ...pkg, sections };
  });

  if (updated === 0) {
    console.log("\n✅ All packages already have sections. No migration needed.");
    return;
  }

  console.log(`\n📤 Saving ${updated} updated packages to Redis...`);
  const result = await redisSet(PACKAGES_KEY, migratedPackages);
  console.log("Result:", result);
  console.log(`\n✅ Migration complete! ${updated} packages updated with sections.`);
}

main().catch(console.error);
