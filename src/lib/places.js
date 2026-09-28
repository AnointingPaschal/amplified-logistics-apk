// Talks to our Cloudflare Worker proxy, never to SerpApi directly —
// keeps the SerpApi key off the phone. See /worker in this repo.

const PROXY_URL = process.env.EXPO_PUBLIC_PLACES_PROXY_URL;
const APP_KEY = process.env.EXPO_PUBLIC_APP_SHARED_SECRET;

async function callProxy(path, params = {}) {
  if (!PROXY_URL) {
    throw new Error('EXPO_PUBLIC_PLACES_PROXY_URL is not set — add it to your .env');
  }
  const url = new URL(PROXY_URL.replace(/\/+$/, '') + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString(), {
    headers: APP_KEY ? { 'X-App-Key': APP_KEY } : {},
  });
  if (!res.ok) throw new Error(`Places lookup failed (${res.status})`);
  return res.json();
}

export async function autocompletePlaces(query, userCoords) {
  if (!query || query.trim().length < 2) return [];
  const { predictions } = await callProxy('/autocomplete', {
    q: query,
    lat: userCoords?.lat,
    lng: userCoords?.lng,
  });
  return predictions || [];
}

export async function geocodePlace(description) {
  return callProxy('/geocode', { q: description });
}
