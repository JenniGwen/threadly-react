// 🧩 SESI 6 — MIDDLEWARE & VALIDATION
// Beda dengan sesi 5:
//  - login mengembalikan token → disimpan di localStorage (lihat src/api.js)
//  - saat refresh, token dicek ke GET /api/me supaya user tidak perlu login ulang
//  - user_id tidak dikirim lagi; backend tahu siapa kita dari token
//  - error validasi dari backend ditampilkan di form, bukan alert()
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import * as api from "./api";

function App() {
  const [page, setPage] = useState("login"); // "login" | "home" | "profile"
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(!!api.getToken());
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reactions, setReactions] = useState({}); // { [postId]: "like" | "dislike" }

  // Saat app pertama dibuka: kalau ada token tersimpan, tanya backend masih valid atau tidak.
  useEffect(() => {
    if (!api.getToken()) return;

    api
      .me()
      .then(({ user }) => {
        setCurrentUser(user);
        setPage("home");
      })
      .catch(() => api.setToken(null)) // token basi → buang
      .finally(() => setCheckingSession(false));
  }, []);

  // Tiap kali ada user yang login, ambil feed dari backend.
  useEffect(() => {
    if (!currentUser) return;

    api
      .fetchPosts()
      .then((data) => {
        setPosts(data.posts);
        setUsers(data.users);
        setReactions(data.reactions);
      })
      .catch(handleApiError);
  }, [currentUser]);

  useEffect(() => {
    document.title = `Threadly (${posts.length})`;
  }, [posts]);

  // Kalau backend bilang 401 (token ditolak middleware), paksa logout.
  function handleApiError(err) {
    if (err.status === 401) {
      api.setToken(null);
      setCurrentUser(null);
      setPage("login");
      return;
    }
    alert(err.message);
  }

  async function handleLogin(username, password) {
    try {
      const { user, token } = await api.login(username, password);
      api.setToken(token);
      setCurrentUser(user);
      setPage("home");
      return null;
    } catch (err) {
      return err.message;
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // token sudah tidak valid pun tidak masalah, tetap logout di FE
    }
    api.setToken(null);
    setCurrentUser(null);
    setPosts([]);
    setReactions({});
    setPage("login");
  }

  // Backend yang menghitung like/dislike; FE tinggal pakai hasilnya.
  async function handleReact(postId, type) {
    try {
      const { post, my_reaction } = await api.reactToPost(postId, type);
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setReactions((prev) => ({ ...prev, [postId]: my_reaction }));
    } catch (err) {
      handleApiError(err);
    }
  }

  const handleLike = (postId) => handleReact(postId, "like");
  const handleDislike = (postId) => handleReact(postId, "dislike");

  // Mengembalikan pesan error (string) supaya PostComposer bisa menampilkannya.
  async function handleNewPost(content) {
    try {
      const { post } = await api.createPost(content);
      setPosts((prev) => [post, ...prev]);
      return null;
    } catch (err) {
      if (err.status === 422) return err.errors.content?.[0] || err.message;
      handleApiError(err);
      return err.message;
    }
  }

  if (checkingSession) {
    return <p className="loading">Memuat sesi...</p>;
  }

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Navbar page={page} onNavigate={setPage} onLogout={handleLogout} />

      {page === "home" && (
        <HomePage
          posts={posts}
          users={users}
          currentUser={currentUser}
          reactions={reactions}
          onLike={handleLike}
          onDislike={handleDislike}
          onNewPost={handleNewPost}
        />
      )}

      {page === "profile" && (
        <ProfilePage
          posts={posts}
          currentUser={currentUser}
          reactions={reactions}
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </>
  );
}

export default App;
