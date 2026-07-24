import express from "express";

const router = express.Router();

// A descriptive User-Agent is required by Nominatim's usage policy.
const NOMINATIM_HEADERS = { "User-Agent": "PawDiagnoseAI-LocalDev/1.0 (educational demo project)" };

router.get("/geocode", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city || !city.trim()) return res.status(400).json({ error: "A city name is required." });
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`, {
      headers: NOMINATIM_HEADERS
    });
    if (!r.ok) throw new Error("Geocoding request failed with status " + r.status);
    const data = await r.json();
    if (!data.length) return res.status(404).json({ error: "Couldn't find coordinates for that city." });
    res.json({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name });
  } catch (e) {
    console.error("vets/geocode error:", e);
    res.status(502).json({ error: e.message || "Geocoding is unavailable right now." });
  }
});

router.get("/nearby", async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return res.status(400).json({ error: "lat and lon are required." });

    const query = `[out:json][timeout:20];(node["amenity"="veterinary"](around:15000,${lat},${lon});node["amenity"="animal_shelter"](around:15000,${lat},${lon}););out body 25;`;
    const r = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    if (!r.ok) throw new Error("Overpass request failed with status " + r.status);
    const data = await r.json();

    const elements = (data.elements || []).filter((e) => e.tags && e.tags.name);
    const mapped = elements.map((e) => ({
      name: e.tags.name,
      address: [e.tags["addr:housenumber"], e.tags["addr:street"], e.tags["addr:city"]].filter(Boolean).join(" ") || "Address not listed",
      phone: e.tags.phone || e.tags["contact:phone"] || "Not listed",
      lat: e.lat,
      lon: e.lon
    }));
    res.json(mapped);
  } catch (e) {
    console.error("vets/nearby error:", e);
    res.status(502).json({ error: e.message || "Live nearby-vet results are unavailable right now." });
  }
});

export default router;
