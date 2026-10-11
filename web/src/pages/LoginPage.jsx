// 👉 TODO (Sesi 2): tambahkan "useEffect" dan "useRef" pada import di bawah.
import { useState } from "react";

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 👉 TODO (Sesi 2 - useRef): pointer ke input username


    // 👉 TODO (Sesi 2 - useEffect): begitu halaman login muncul, fokus ke username.


    async function handleSubmit(e) {
        e.preventDefault();
        // onLogin sekarang async karena nunggu jawaban backend
        const err = await onLogin(username, password);
        if (err) setError(err);
    }

    return (
        <main className="login-page">
        <div className="login-card">
            <h1 className="logo">threadly</h1>
            <p>Share your thoughts.</p>

            <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error">{error}</p>}
            <button className="primary-button" type="submit">
                Login
            </button>
            </form>

            <p className="login-hint">Try: calista / 123456</p>
        </div>
        </main>
    );
}

export default LoginPage;