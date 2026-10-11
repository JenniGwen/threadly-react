// 🧩 SESI 5 — API & DATABASE INTEGRATION
// Data user & post tidak lagi dari src/data/*.js, tapi dari backend Laravel.
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import * as api from "./api";

function App() {
  const [page, setPage] = useState("login"); // "login" | "home" | "profile"
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [reactions, setReactions] = useState({}); // { [postId]: "like" | "dislike" }

  // Tiap kali ada user yang login, ambil feed dari backend.
  useEffect(() => {
    if (!currentUser) return;

    api
      .fetchPosts(currentUser.id)
      .then((data) => {
        setPosts(data.posts);
        setUsers(data.users);
        setReactions(data.reactions);
      })
      .catch((err) => alert(err.message));
  }, [currentUser]);

  useEffect(() => {
    document.title = `Threadly (${posts.length})`;
  }, [posts]);

  async function handleLogin(username, password) {
    try {
      const { user } = await api.login(username, password);
      setCurrentUser(user);
      setPage("home");
      return null;
    } catch (err) {
      return err.message;
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setPosts([]);
    setReactions({});
    setPage("login");
  }

  // Backend yang menghitung like/dislike; FE tinggal pakai hasilnya.
  async function handleReact(postId, type) {
    try {
      const { post, my_reaction } = await api.reactToPost(
        postId,
        currentUser.id,
        type
      );
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setReactions((prev) => ({ ...prev, [postId]: my_reaction }));
    } catch (err) {
      alert(err.message);
    }
  }

  const handleLike = (postId) => handleReact(postId, "like");
  const handleDislike = (postId) => handleReact(postId, "dislike");

  async function handleNewPost(content) {
    try {
      const { post } = await api.createPost(currentUser.id, content);
      setPosts((prev) => [post, ...prev]);
    } catch (err) {
      alert(err.message);
    }
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
