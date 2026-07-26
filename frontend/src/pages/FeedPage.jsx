import { Heart, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, loadFeed, toggleLike } from "../features/socialSlice";

export default function FeedPage() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.social);
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    dispatch(createPost(content.trim())).then(() => dispatch(loadFeed()));
    setContent("");
  }

  return (
    <div className="grid gap-4">
      <form className="panel p-4" onSubmit={submit}>
        <textarea className="field min-h-24 resize-none" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share an update with your network" />
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary">
            <Send size={18} />
            Post
          </button>
        </div>
      </form>

      {posts.length === 0 && <EmptyState title="No posts yet" text="Create your first post or connect with people to build your feed." />}

      {posts.map((post) => {
        const isLiked = post.likes?.some((id) => String(id) === String(user._id));
        return (
          <article className="panel p-4" key={post._id}>
            <div className="flex items-start gap-3">
              <Avatar name={post.userId?.name} />
              <div>
                <h3 className="font-black">{post.userId?.name}</h3>
                <p className="text-sm text-slate-500">{post.userId?.headline || "Professional"}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line leading-7">{post.content}</p>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
              <button className={`btn ${isLiked ? "btn-primary" : "btn-soft"}`} onClick={() => dispatch(toggleLike(post._id))}>
                <Heart size={18} />
                {post.likes?.length || 0}
              </button>
              <button className="btn btn-soft">
                <MessageSquare size={18} />
                {post.comments?.length || 0}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Avatar({ name = "U" }) {
  return <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-gold font-black text-white">{name.slice(0, 1).toUpperCase()}</div>;
}

function EmptyState({ title, text }) {
  return (
    <div className="panel p-8 text-center">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-slate-500">{text}</p>
    </div>
  );
}
