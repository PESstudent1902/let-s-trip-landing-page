"use server";

import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import {
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  inferDestinationIdFromPackage,
  type Destination,
  type Package,
} from "@/lib/packageStore";

const DESTINATIONS_KEY = "letstrip_destinations";
const PACKAGES_KEY = "letstrip_packages";
const DB_FILE_PATH = path.join(process.cwd(), "src", "lib", "db.json");

interface LocalDB {
  destinations: Destination[];
  packages: Package[];
}

function loadLocalDB(): LocalDB {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const data = fs.readFileSync(DB_FILE_PATH, "utf8");
      return JSON.parse(data) as LocalDB;
    }
  } catch (error) {
    console.error("Error reading local db.json:", error);
  }

  // If file doesn't exist, create it with default data
  const defaultDB: LocalDB = {
    destinations: DEFAULT_DESTINATIONS,
    packages: DEFAULT_PACKAGES,
  };
  saveLocalDB(defaultDB);
  return defaultDB;
}

function saveLocalDB(db: LocalDB) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing local db.json:", error);
  }
}

function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return new Redis({ url, token });
}

function normalizeDestinations(destinations: Destination[]): Destination[] {
  return destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;
}

function normalizePackages(packages: Package[], destinations: Destination[]): Package[] {
  const safeDestinations = normalizeDestinations(destinations);
  return (packages.length > 0 ? packages : DEFAULT_PACKAGES).map((pkg) => ({
    ...pkg,
    destinationId: pkg.destinationId || inferDestinationIdFromPackage(pkg, safeDestinations),
  }));
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function fetchDestinations(): Promise<Destination[]> {
  const redis = getRedisClient();
  if (!redis) {
    return loadLocalDB().destinations;
  }

  try {
    const data = await redis.get<Destination[]>(DESTINATIONS_KEY);
    return normalizeDestinations(data || []);
  } catch (error) {
    console.error("Error fetching destinations from Redis:", error);
    return loadLocalDB().destinations;
  }
}

export async function saveDestination(newDestination: Destination): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.destinations.push(newDestination);
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to save destination locally") };
    }
  }

  try {
    const existing = await fetchDestinations();
    const updated = [...existing, newDestination];
    await redis.set(DESTINATIONS_KEY, updated);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to save destination") };
  }
}

export async function updateDestination(updatedDestination: Destination): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.destinations = db.destinations.map((d) => (d.id === updatedDestination.id ? updatedDestination : d));
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to update destination locally") };
    }
  }

  try {
    const existing = await fetchDestinations();
    const updated = existing.map((d) => (d.id === updatedDestination.id ? updatedDestination : d));
    await redis.set(DESTINATIONS_KEY, updated);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to update destination") };
  }
}

export async function deleteDestinationAction(id: string): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.destinations = db.destinations.filter((d) => d.id !== id);
      db.packages = db.packages.filter((pkg) => pkg.destinationId !== id);
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to delete destination locally") };
    }
  }

  try {
    const existing = await fetchDestinations();
    const updated = existing.filter((d) => d.id !== id);
    await redis.set(DESTINATIONS_KEY, updated);

    const rawPackages = await redis.get<Package[]>(PACKAGES_KEY);
    const packages = normalizePackages(rawPackages || [], existing);
    const filteredPackages = packages.filter((pkg) => pkg.destinationId !== id);
    await redis.set(PACKAGES_KEY, filteredPackages);

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to delete destination") };
  }
}

export async function fetchPackages(): Promise<Package[]> {
  const redis = getRedisClient();
  const destinations = await fetchDestinations();
  if (!redis) {
    return normalizePackages(loadLocalDB().packages, destinations);
  }

  try {
    const data = await redis.get<Package[]>(PACKAGES_KEY);
    return normalizePackages(data || [], destinations);
  } catch (error) {
    console.error("Error fetching packages from Redis:", error);
    return normalizePackages(loadLocalDB().packages, destinations);
  }
}

export async function savePackage(newPackage: Package): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.packages.push(newPackage);
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to save package locally") };
    }
  }

  try {
    const existing = await fetchPackages();
    const updated = [...existing, newPackage];
    await redis.set(PACKAGES_KEY, updated);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to save package") };
  }
}

export async function updatePackage(updatedPackage: Package): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.packages = db.packages.map((p) => (p.id === updatedPackage.id ? updatedPackage : p));
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to update package locally") };
    }
  }

  try {
    const existing = await fetchPackages();
    const updated = existing.map((p) => (p.id === updatedPackage.id ? updatedPackage : p));
    await redis.set(PACKAGES_KEY, updated);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to update package") };
  }
}

export async function deletePackageAction(id: string): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();
  if (!redis) {
    try {
      const db = loadLocalDB();
      db.packages = db.packages.filter((p) => p.id !== id);
      saveLocalDB(db);
      revalidatePath("/");
      revalidatePath("/admin");
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Failed to delete package locally") };
    }
  }

  try {
    const existing = await fetchPackages();
    const updated = existing.filter((p) => p.id !== id);
    await redis.set(PACKAGES_KEY, updated);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error, "Failed to delete package") };
  }
}
