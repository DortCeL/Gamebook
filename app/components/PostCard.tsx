import { Link } from "react-router";
import type { IPost } from "../../types";
import { getAuthor } from "~/utils/postHelpers";
import { timeAgo } from "~/utils/timeFormatter";
import { Avatar } from "./Avatar";

interface PostCardProps {
  post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
  const author = getAuthor(post.author);
  const commentCount =  post.commentCount ?? 0;

  return (
    <Link
      to={`/posts/${post._id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
    >
      {/* Header: Avatar | Name+Gamertag | Time */}
      <div className="flex items-start gap-4">
        <Avatar
          src={author.avatarUrl}
          alt={author.name}
          fallback={author.name}
          size="xl" // large avatar (w-24 h-24)
          className="border-2 border-gray-200 shadow-sm"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {author.name}
              </h3>
              <p className="text-sm text-gray-500">@{author.gamertag}</p>
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

      {/* Tags & Comments */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {post.game && (
          <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            {post.game}
          </span>
        )}
        {/* <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          {post.visibility}
        </span> */}

        {/* Comments count */}
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
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
    </Link>
  );
}