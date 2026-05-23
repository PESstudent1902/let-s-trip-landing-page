import { NextRequest, NextResponse } from "next/server";

/**
 * WhatsApp Business API Webhook Handler
 * 
 * This endpoint handles incoming webhooks from the Meta WhatsApp Business API.
 * It processes user messages and routes them through the travel concierge flow:
 * 1. Ask for travel vibe (Adventure, Relaxation, Culture)
 * 2. Ask for budget range
 * 3. Ask for duration
 * 4. Return a curated package recommendation
 */

// Verify webhook (GET request from Meta)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "letstrip_verify_2026";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Handle incoming messages (POST request from Meta)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extract message data
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const messageData = changes?.value?.messages?.[0];

    if (!messageData) {
      return NextResponse.json({ status: "no_message" }, { status: 200 });
    }

    const from = messageData.from; // sender phone number
    const msgBody = messageData.text?.body?.toLowerCase() || "";

    // Determine conversation state and respond
    const response = generateConciergeResponse(msgBody);

    // Send reply via WhatsApp API
    await sendWhatsAppMessage(from, response);

    return NextResponse.json({ status: "processed" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function generateConciergeResponse(message: string): string {
  // Simple keyword-based routing for the travel concierge flow
  if (message.includes("hi") || message.includes("hello") || message.includes("start")) {
    return `Hey! I'm your LetsTrip Assistant 🌍✨\n\nLet me craft your perfect trip! What vibe are you going for?\n\n1️⃣ Adventure & Thrills\n2️⃣ Relaxation & Wellness\n3️⃣ Culture & Heritage\n4️⃣ Luxury & Romance`;
  }

  if (message.includes("adventure") || message.includes("1")) {
    return `Love the adventurous spirit! 🔥\n\nWhat's your budget range?\n\n💰 Under ₹50,000\n💎 ₹50,000 - ₹1,00,000\n👑 ₹1,00,000+`;
  }

  if (message.includes("relax") || message.includes("2")) {
    return `Time to unwind! 🧘\n\nWhat's your budget range?\n\n💰 Under ₹50,000\n💎 ₹50,000 - ₹1,00,000\n👑 ₹1,00,000+`;
  }

  if (message.includes("50k") || message.includes("50,000") || message.includes("budget")) {
    return `Great choice! How many nights?\n\n🌙 3-4 Nights\n🌙🌙 5-7 Nights\n🌙🌙🌙 7+ Nights`;
  }

  if (message.includes("5") || message.includes("7") || message.includes("night")) {
    return `✨ Here's your perfect match!\n\n🏝️ 5N Bali Bliss Package\n💰 ₹89,000 per person\n\n✅ Luxury Private Villa\n✅ Return Flights\n✅ Spa & Wellness\n✅ Adventure Activities\n✅ All Meals Included\n\nReply BOOK to confirm or EXPLORE for more options!`;
  }

  return `Hey there! 👋 I'm your LetsTrip Travel Assistant.\n\nSay "Hi" to start planning your dream vacation! 🌍`;
}

async function sendWhatsAppMessage(to: string, message: string) {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log("WhatsApp credentials not configured. Message:", message);
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });
}
