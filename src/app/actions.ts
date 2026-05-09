"use server";

import { createHmac, timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  DEFAULT_DESTINATIONS,
  DEFAULT_PACKAGES,
  inferDestinationIdFromPackage,
  type Destination,
  type Package,
} from "@/lib/packageStore";

const DESTINATIONS_KEY = "letstrip_destinations";
const PACKAGES_KEY = "letstrip_packages";
const ADMIN_SESSION_COOKIE = "letstrip_admin_session";
const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function getAdminSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(timestamp: string, secret: string): string {
  return createHmac("sha256", secret).update(timestamp).digest("hex");
}

function parseSession(sessionValue: string): { timestamp: number; signature: string } | null {
  const [timestampPart, signature] = sessionValue.split(".");
  if (!timestampPart || !signature) return null;
  const timestamp = Number(timestampPart);
  if (!Number.isFinite(timestamp)) return null;
  return { timestamp, signature };
}

function createSessionValue(secret: string): string {
  const timestamp = Date.now().toString();
  const signature = signSession(timestamp, secret);
  return `${timestamp}.${signature}`;
}

async function isAdminSessionValid(): Promise<boolean> {
  const secret = getAdminSessionSecret();
  if (!secret) return false;
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionValue) return false;
  const parsed = parseSession(sessionValue);
  if (!parsed) return false;
  if (Date.now() - parsed.timestamp > ADMIN_SESSION_TTL_MS) return false;
  const expected = signSession(parsed.timestamp.toString(), secret);
  return safeEqual(parsed.signature, expected);
}

async function requireAdmin(): Promise<{ ok: boolean; error?: string }> {
  const authenticated = await isAdminSessionValid();
  return authenticated ? { ok: true } : { ok: false, error: "Unauthorized. Please sign in again." };
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

export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return { success: false, error: "Admin password is not configured." };
  if (!safeEqual(password, adminPassword)) return { success: false, error: "Incorrect password. Please try again." };

  const secret = getAdminSessionSecret();
  if (!secret) return { success: false, error: "Admin session secret is not configured." };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });

  return { success: true };
}

export async function getAdminSession(): Promise<{ authenticated: boolean }> {
  return { authenticated: await isAdminSessionValid() };
}

export async function logoutAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function fetchDestinations(): Promise<Destination[]> {
  const redis = getRedisClient();
  if (!redis) return DEFAULT_DESTINATIONS;

  try {
    const data = await redis.get<Destination[]>(DESTINATIONS_KEY);
    return normalizeDestinations(data || []);
  } catch (error) {
    console.error("Error fetching destinations from Redis:", error);
    return DEFAULT_DESTINATIONS;
  }
}

export async function saveDestination(newDestination: Destination): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
  if (!redis) return normalizePackages(DEFAULT_PACKAGES, destinations);

  try {
    const data = await redis.get<Package[]>(PACKAGES_KEY);
    return normalizePackages(data || [], destinations);
  } catch (error) {
    console.error("Error fetching packages from Redis:", error);
    return normalizePackages(DEFAULT_PACKAGES, destinations);
  }
}

export async function savePackage(newPackage: Package): Promise<{ success: boolean; error?: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };
  const redis = getRedisClient();
  if (!redis) return { success: false, error: "Vercel KV is not configured." };

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
