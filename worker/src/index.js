// Amplified Logistics — Places proxy
//
// Keeps the SerpApi key off the phone. The app calls this Worker instead of
// calling SerpApi directly; the Worker holds the real key as a secret.
//
// Routes:
//   GET /autocomplete?q=<text>&lat=<num>&lng=<num>   -> { predictions: [{ description, place_id }] }
//   GET /geocode?q=<text>                             -> { lat, lng, address }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-App-Key',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Optional shared-secret gate. Set APP_SHARED_SECRET with `wrangler secret put`
    // and the app will send it as X-App-Key — stops randoms hitting your Worker
    // and burning your SerpApi quota. Leave the secret unset to disable this.
    if (env.APP_SHARED_SECRET) {
      const key = request.headers.get('X-App-Key');
      if (key !== env.APP_SHARED_SECRET) {
        return json({ error: 'Unauthorized' }, 401);
      }
    }

    if (!env.SERPAPI_KEY) {
      return json({ error: 'SERPAPI_KEY not configured on the Worker' }, 500);
    }

    if (url.pathname === '/autocomplete') {
      const q = url.searchParams.get('q');
      if (!q || q.trim().length < 2) return json({ predictions: [] });

      const serp = new URL('https://serpapi.com/search.json');
      serp.searchParams.set('engine', 'google_maps_autocomplete');
      serp.searchParams.set('q', q);
      serp.searchParams.set('google_domain', 'google.com.ng');
      serp.searchParams.set('gl', 'ng');
      serp.searchParams.set('hl', 'en');
      serp.searchParams.set('api_key', env.SERPAPI_KEY);

      const lat = url.searchParams.get('lat');
      const lng = url.searchParams.get('lng');
      if (lat && lng) serp.searchParams.set('location', `@${lat},${lng},14z`);

      const res = await fetch(serp.toString());
      if (!res.ok) return json({ predictions: [], error: 'SerpApi request failed' }, 502);
      const data = await res.json();

      const predictions = (data.predictions || data.suggestions || [])
        .map((p) => ({
          description: p.description || p.title || '',
          place_id: p.place_id || p.data_id || null,
        }))
        .filter((p) => p.description);

      return json({ predictions });
    }

    if (url.pathname === '/geocode') {
      const q = url.searchParams.get('q');
      if (!q) return json({ error: 'q is required' }, 400);

      const serp = new URL('https://serpapi.com/search.json');
      serp.searchParams.set('engine', 'google_maps');
      serp.searchParams.set('q', q);
      serp.searchParams.set('type', 'search');
      serp.searchParams.set('google_domain', 'google.com.ng');
      serp.searchParams.set('gl', 'ng');
      serp.searchParams.set('hl', 'en');
      serp.searchParams.set('api_key', env.SERPAPI_KEY);

      const res = await fetch(serp.toString());
      if (!res.ok) return json({ lat: null, lng: null, address: q, error: 'SerpApi request failed' }, 502);
      const data = await res.json();

      const coords =
        data.place_results?.gps_coordinates ||
        data.local_results?.[0]?.gps_coordinates ||
        null;

      if (!coords) return json({ lat: null, lng: null, address: q });

      return json({
        lat: coords.latitude,
        lng: coords.longitude,
        address: data.place_results?.address || q,
      });
    }

    return json({ error: 'Not found', routes: ['/autocomplete?q=', '/geocode?q='] }, 404);
  },
};
