function PostCard({ post, user, reactions, onLike, onDislike }) {
  const myReaction = reactions[post.id]; // "like" | "dislike" | undefined

    return (
        <article className="post-card">
        <div className="post-header">
            <div className="avatar">{user.display_name.charAt(0)}</div>
            <div>
            <h3>{user.display_name}</h3>
            <span>@{user.username}</span>
            </div>
        </div>

        <p className="post-content">{post.content}</p>

        <div className="post-actions">
            <button
            className={myReaction === "like" ? "active-like" : ""}
            onClick={() => onLike(post.id)}
            >
            ❤️ {post.likes}
            </button>
            <button
            className={myReaction === "dislike" ? "active-dislike" : ""}
            onClick={() => onDislike(post.id)}
            >
            👎 {post.dislikes}
            </button>
        </div>
        </article>
    );
}

export default PostCard;