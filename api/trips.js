export default async function handler(req, res) {
  const SUPABASE_URL = `${process.env.SUPABASE_URL}/rest/v1`;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Supabase env vars not set" });
  }

  // Handle /api/trips or /api/trips/[id]
  const { id } = req.query;
  const path = id ? `/trips/${id}` : "/trips";
  const url = `${SUPABASE_URL}${path}${req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: ["POST", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
  });

  const text = await response.text();
  res.status(response.status).send(text);
}
