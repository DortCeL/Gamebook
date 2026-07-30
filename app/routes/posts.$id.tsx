import { Link, useNavigate, useParams } from "react-router";
import Navbar from "~/components/Navbar";
import CommentSection from "~/components/CommentSection";
import { useDeletePost, usePost } from "~/hooks/usePosts";
import { getAuthor } from "~/utils/postHelpers";
import { timeAgo } from "~/utils/timeFormatter";
import { Avatar } from "~/components/Avatar";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = usePost(id ?? "");
  const { mutate: deletePost, isPending: deleting } = useDeletePost();

  if (!id) {
    return <p className="p-8">Invalid post id</p>;
  }

  const handleDelete = () => {
    if (!confirm("Delete this post?")) return;
    deletePost(id, { onSuccess: () => navigate("/") });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to feed
        </Link>

        {isLoading && (
          <div className="text-center text-gray-500">Loading post...</div>
        )}
        {error && (
          <div className="text-red-600">{(error as Error).message}</div>
        )}

        {post && (
          <>
            {/* Post Card (same design as PostCard, but without the outer Link) */}
            <article className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              {/* Header: Avatar | Name+Gamertag | Time + Delete */}
              <div className="flex items-start gap-4">
                <Avatar
                  src={getAuthor(post.author).avatarUrl}
                  alt={getAuthor(post.author).name}
                  fallback={getAuthor(post.author).name}
                  size="xl"
                  className="border-2 border-gray-200 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {getAuthor(post.author).name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        @{getAuthor(post.author).gamertag}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {timeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-3">
                <p className="text-gray-800 whitespace-pre-wrap break-words">
                  {post.content || "(no content)"}
                </p>
              </div>

              {/* Tags & Comments + Delete button */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                {post.game && (
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {post.game}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  {post.visibility}
                </span>

                {/* Comments count (static, since it's the detail page) */}
                <div className="ml-auto flex items-center gap-1 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-xs font-medium">
                    {post.commentCount ?? 0}{" "}
                    {(post.commentCount ?? 0) === 1 ? "comment" : "comments"}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="ml-2 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>

            {/* Comment Section (unchanged) */}
            <CommentSection postId={post._id} />
          </>
        )}
      </main>
    </div>
  );
}