# Let's Trip Landing Page

Next.js landing page with:
- Dynamic destinations/packages
- Admin panel (`/admin`) for managing destinations and destination-linked packages
- Vercel KV (Upstash Redis) backend for package/destination storage
- Travel-only chatbot powered by OpenRouter (Gemma model)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `.env.local` (you can start from `.env.example`):

```bash
# Vercel KV / Upstash Redis
KV_REST_API_URL=
KV_REST_API_TOKEN=
# (fallback names also supported)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=

# OpenRouter chatbot
OPENROUTER_API_KEY=

# Model is configured server-side (Gemma 4 26B A4B IT)
# google/gemma-4-26b-a4b-it

# Optional WhatsApp webhook settings (existing endpoint)
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

## Admin panel behavior

- Add/edit destinations
- Add/edit packages and choose destination/subdomain for each package
- Filter packages by destination inside admin
- Deleting a destination removes its linked packages

## Chatbot behavior

- Route: `POST /api/chat`
- Uses live destinations/packages from KV (read-only)
- Restricts responses to travel + LetsTrip services/packages
- Suggests best package based on user demand (destination/budget intent)

## Deploy to Vercel

1. Push to GitHub
2. Import repository in Vercel
3. Add the environment variables above
   - Add a **Vercel KV** database and connect it to this project so `KV_REST_API_URL` / `KV_REST_API_TOKEN` are present
4. Deploy

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```
