// 🧩 SESI 5 — API & DATABASE INTEGRATION
// Semua komunikasi ke backend Laravel dikumpulkan di sini,
// supaya komponen React tidak perlu tahu detail URL / fetch.

const BASE_URL = "/api"; // di-proxy ke http://127.0.0.1:8000 lewat vite.config.js

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    // Laravel kirim { message, errors } saat gagal validasi / login salah
    throw new Error(data.message || "Terjadi kesalahan");
  }

  return data;
}

/** POST /api/login → { user } */
export function login(username, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

/** GET /api/posts?user_id=1 → { posts, users, reactions } */
export function fetchPosts(userId) {
  return request(`/posts?user_id=${userId}`);
}

/** POST /api/posts → { post } */
export function createPost(userId, content) {
  return request("/posts", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, content }),
  });
}

/** POST /api/posts/:id/react → { post, my_reaction } */
export function reactToPost(postId, userId, type) {
  return request(`/posts/${postId}/react`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId, type }),
  });
}
