// 🧩 SESI 6 — MIDDLEWARE & VALIDATION
// Semua komunikasi ke backend Laravel dikumpulkan di sini.
// Baru di sesi ini: token login disimpan di localStorage dan dikirim
// lewat header Authorization, supaya lolos middleware auth.token di backend.

const BASE_URL = "/api"; // di-proxy ke http://127.0.0.1:8000 lewat vite.config.js
const TOKEN_KEY = "threadly-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Error khusus supaya komponen bisa baca pesan per-field dari Laravel:
 *   err.message → "Post maksimal 280 karakter."
 *   err.errors  → { content: ["Post maksimal 280 karakter."] }
 *   err.status  → 422 / 401 / ...
 */
export class ApiError extends Error {
  constructor(status, data) {
    super(data?.message || "Terjadi kesalahan");
    this.status = status;
    this.errors = data?.errors || {};
  }
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE_URL + path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new ApiError(res.status, data);

  return data;
}

/** POST /api/login → { user, token } */
export function login(username, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/** GET /api/me → { user }  (cek apakah token yang tersimpan masih valid) */
export function me() {
  return request("/me");
}

/** POST /api/logout */
export function logout() {
  return request("/logout", { method: "POST" });
}

/** GET /api/posts → { posts, users, reactions } */
export function fetchPosts() {
  return request("/posts");
}

/** POST /api/posts → { post } */
export function createPost(content) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

/** POST /api/posts/:id/react → { post, my_reaction } */
export function reactToPost(postId, type) {
  return request(`/posts/${postId}/react`, {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}
