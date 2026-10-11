import PostCard from "../components/PostCard";

function ProfilePage({ posts, currentUser, reactions, onLike, onDislike }) {
    const userPosts = posts.filter((p) => p.user_id === currentUser.id);

    return (
        <main className="container">
        <section className="profile-header">
            <div className="profile-avatar">
            {currentUser.display_name.charAt(0)}
            </div>
            <h2>{currentUser.display_name}</h2>
            <p>@{currentUser.username}</p>
        </section>

        <section className="feed">
            {userPosts.length === 0 && (
            <p className="empty-feed">Belum ada post.</p>
            )}
            {userPosts.map((post) => (
            <PostCard
                key={post.id}
                post={post}
                user={currentUser}
                reactions={reactions}
                onLike={onLike}
                onDislike={onDislike}
            />
            ))}
        </section>
        </main>
    );
}

export default ProfilePage;