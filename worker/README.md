# Amplified Places Proxy (Cloudflare Worker)

Holds the SerpApi key server-side so it never ships inside the app. The
mobile app calls this Worker; the Worker calls SerpApi.

## Deploy (one-time, from a machine with Node — Termux works)

```bash
cd worker
npm install -g wrangler   # if not already installed
wrangler login             # opens a browser to authorize Cloudflare

wrangler secret put SERPAPI_KEY
# paste your SerpApi private key when prompted

wrangler secret put APP_SHARED_SECRET
# paste any random string you make up, e.g. output of: openssl rand -hex 16
# the app must send this same string back as X-App-Key

wrangler deploy
```

Wrangler prints a URL like:

```
https://amplified-places-proxy.<your-subdomain>.workers.dev
```

Put that URL in the app's `.env` as `EXPO_PUBLIC_PLACES_PROXY_URL`, and the
same `APP_SHARED_SECRET` value as `EXPO_PUBLIC_APP_SHARED_SECRET`.

## Test it directly

```bash
curl "https://amplified-places-proxy.<sub>.workers.dev/autocomplete?q=Umuahia" \
  -H "X-App-Key: <your APP_SHARED_SECRET>"
```
