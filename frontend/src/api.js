const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "pawdiagnose_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new Error(`Couldn't reach the backend at ${BASE_URL}. Is it running? (${e.message})`);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204) — that's fine
  }

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  BASE_URL,

  // Auth
  signup: (payload) => request("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  googleDemo: () => request("/api/auth/google-demo", { method: "POST" }),
  me: () => request("/api/auth/me"),

  // Diagnosis
  diagnoseText: (symptoms) => request("/api/diagnose/text", { method: "POST", body: { symptoms } }),
  diagnoseImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return request("/api/diagnose/image", { method: "POST", body: form, isForm: true });
  },
  history: () => request("/api/diagnose/history"),
  clearHistory: () => request("/api/diagnose/history", { method: "DELETE" }),

  // Chat assistant
  chat: (messages) => request("/api/chat", { method: "POST", body: { messages } }),

  // Dogs / vaccination
  listDogs: () => request("/api/dogs"),
  addDog: (dog) => request("/api/dogs", { method: "POST", body: dog }),
  removeDog: (id) => request(`/api/dogs/${id}`, { method: "DELETE" }),
  clearDogs: () => request("/api/dogs", { method: "DELETE" }),

  // Favorite vets
  listFavorites: () => request("/api/favorites"),
  addFavorite: (vet) => request("/api/favorites", { method: "POST", body: vet }),
  removeFavorite: (id) => request(`/api/favorites/${id}`, { method: "DELETE" }),
  clearFavorites: () => request("/api/favorites", { method: "DELETE" }),

  // Vets search (server-side proxy, avoids browser CORS issues entirely)
  geocodeCity: (city) => request(`/api/vets/geocode?city=${encodeURIComponent(city)}`),
  nearbyVets: (lat, lon) => request(`/api/vets/nearby?lat=${lat}&lon=${lon}`)
};
