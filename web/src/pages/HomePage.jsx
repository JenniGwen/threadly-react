import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";

function HomePage({ posts, users, currentUser, onLike, onDislike, onNewPost, reactions }) {
    return (
        <main className="container">
        <PostComposer currentUser={currentUser} onNewPost={onNewPost} />

        <section className="feed">
            {posts.map((post) => {
            const user = users.find((u) => u.id === post.user_id);
            return (
                <PostCard
                key={post.id}
                post={post}
                user={user}
                reactions={reactions}
                onLike={onLike}
                onDislike={onDislike}
                />
            );
            })}
        </section>
        </main>
    );
}

export default HomePage;