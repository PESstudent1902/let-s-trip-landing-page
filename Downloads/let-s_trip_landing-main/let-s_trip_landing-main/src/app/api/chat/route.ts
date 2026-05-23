import { fetchDestinations, fetchPackages } from "@/app/actions";
import { NextRequest, NextResponse } from "next/server";

function parseBudgetRupees(text: string): number | null {
  const t = text.toLowerCase();

  const rupeeMatch = t.match(/₹\s*([0-9][0-9,]*)(\.\d+)?/);
  if (rupeeMatch?.[1]) {
    const numeric = Number(rupeeMatch[1].replace(/,/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  const kMatch = t.match(/([0-9]+(?:\.[0-9]+)?)\s*k\b/);
  if (kMatch?.[1]) {
    const numeric = Math.round(Number(kMatch[1]) * 1000);
    return Number.isFinite(numeric) ? numeric : null;
  }

  const lakhMatch = t.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lac|l)\b/);
  if (lakhMatch?.[1]) {
    const numeric = Math.round(Number(lakhMatch[1]) * 100000);
    return Number.isFinite(numeric) ? numeric : null;
  }

  const plain = t.match(/\bunder\s+([0-9][0-9,]{3,})\b/);
  if (plain?.[1]) {
    const numeric = Number(plain[1].replace(/,/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function parsePriceRupees(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const destinations = await fetchDestinations();
    const packages = await fetchPackages();

    const lastUser = [...(Array.isArray(messages) ? messages : [])]
      .reverse()
      .find((m: unknown) => typeof m === "object" && m && (m as { role?: string }).role === "user") as
      | { content?: string }
      | undefined;

    const userText = String(lastUser?.content || "");
    const userTextLower = userText.toLowerCase();
    const budget = parseBudgetRupees(userText);

    const matchedDestination = destinations.find((d) => {
      const name = d.name.toLowerCase();
      const id = d.id.toLowerCase();
      return userTextLower.includes(name) || userTextLower.includes(id);
    });

    const candidates = packages
      .filter((p) => {
        if (matchedDestination?.id && p.destinationId) return p.destinationId === matchedDestination.id;
        return true;
      })
      .map((p) => ({ p, priceNum: parsePriceRupees(p.price) }))
      .filter(({ priceNum }) => (budget ? (priceNum ?? budget) <= budget : true))
      .sort((a, b) => {
        if (budget) {
          const da = Math.abs(budget - (a.priceNum ?? budget));
          const db = Math.abs(budget - (b.priceNum ?? budget));
          return da - db;
        }
        return (a.priceNum ?? Number.MAX_SAFE_INTEGER) - (b.priceNum ?? Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 12)
      .map(({ p }) => p);

    const systemPrompt = [
      "You are LetsTrip's friendly Travel Assistant. You help users find the perfect holiday package.",
      "",
      "RULES:",
      "- Only discuss travel planning and LetsTrip offerings.",
      "- Recommend packages from the catalog below. Never invent packages, prices, or itineraries.",
      "- If the user says hi/hello, greet them warmly and ask about their travel plans.",
      "- If asked about non-travel topics, politely redirect to travel.",
      "- Always suggest contacting via WhatsApp (+91 88677 67171) for booking.",
      "- Keep responses concise (2-4 sentences max), warm and helpful.",
      "- Use emojis sparingly for a friendly tone.",
      "",
      "CATALOG:",
      JSON.stringify(
        {
          destinations: destinations.map(d => ({ id: d.id, name: d.name, duration: d.duration, price: d.price })),
          packages: (candidates.length ? candidates : packages.slice(0, 12)).map(p => ({
            id: p.id, name: p.name, price: p.price, highlights: p.highlights, destinationId: p.destinationId
          })),
          userSignals: { budgetRupees: budget, destinationId: matchedDestination?.id ?? null },
        },
        null,
        0
      ),
    ].join("\n");

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json({ error: "OpenRouter API Key not configured. Please add OPENROUTER_API_KEY to your environment variables." }, { status: 500 });
    }

    // Use dynamic referer from request headers, fallback to production URL
    const referer = req.headers.get("referer") || req.headers.get("origin") || "https://letstrip.co.in";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "LetsTrip Assistant",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(messages) ? messages : [])
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", response.status, errorText);
      return NextResponse.json({ error: "Failed to communicate with AI provider. Please try again." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
