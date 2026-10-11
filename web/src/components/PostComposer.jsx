// 👉 TODO (Sesi 2): tambahkan "useEffect" dan "useRef" pada import di bawah.
import { useState } from "react";

const MAX_CHARS = 280;
// eslint-disable-next-line no-unused-vars -- dipakai nanti pas ngerjain TODO Sesi 2
const DRAFT_KEY = "threadly-draft"; // nama "laci" penyimpanan di localStorage

function PostComposer({ currentUser, onNewPost }) {
    const [content, setContent] = useState("");
    const isOver = content.length > MAX_CHARS;

    // 👉 TODO (Sesi 2 - useRef): buat "pointer" ke elemen textarea.


    // 👉 TODO (Sesi 2 - useEffect #1 / auto-focus):


    // 👉 TODO (Sesi 2 - useEffect #2 / simpan draft):
    //    Tiap "content" berubah, simpan ke localStorage biar ga hilang saat refresh.


    //    BONUS: jadikan draft yang tersimpan sebagai nilai AWAL useState di atas:
    //      useState(() => localStorage.getItem(DRAFT_KEY) || "")

    function handlePost() {
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > MAX_CHARS) return;
        onNewPost(trimmed);
        setContent("");
        // 👉 TODO (Sesi 2): setelah jadi post, hapus draft:
        
    }

    return (
        <section className="post-composer">
        <div className="composer-user">
            <div className="avatar">{currentUser.display_name.charAt(0)}</div>
            <span>What's happening?</span>
        </div>

        <textarea
            placeholder="Share your thoughts..."
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />

        <div className="composer-footer">
            <span className={`character-count ${isOver ? "over-limit" : ""}`}>
            {content.length} / {MAX_CHARS}
            </span>

            <button
            className="primary-button"
            onClick={handlePost}
            disabled={!content.trim() || isOver}
            >
            Post
            </button>
        </div>
        </section>
    );
}

export default PostComposer;