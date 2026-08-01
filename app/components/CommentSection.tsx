import { useState } from "react";
import type { IComment } from "../../types";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useReplies,
} from "~/hooks/useComments";
import { timeAgo } from "~/utils/timeFormatter";
import AuthorLink from "~/components/AuthorLink";

// ----- Reply Form (inline) -----
function ReplyForm({
  postId,
  parentCommentId,
  onDone,
}: {
  postId: string;
  parentCommentId: string;
  onDone: () => void;
}) {
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreateComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(
      { postId, content, parentCommentId },
      {
        onSuccess: () => {
          setContent("");
          onDone();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
      >
        {isPending ? "..." : "Reply"}
      </button>
    </form>
  );
}

// ----- Individual Comment (with replies) -----
function CommentItem({
  comment,
  postId,
}: {
  comment: IComment;
  postId: string;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const { data: replies } = useReplies(comment._id, showReplies);
  const { mutate: deleteComment, isPending: deleting } =
    useDeleteComment(postId);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header: Avatar + Name/Gamertag + Time */}
      <div className="flex items-start gap-3">
        <AuthorLink
          author={comment.author}
          size="lg"
          layout="column"
          avatarClassName="border border-gray-200"
          nameClassName="text-sm font-semibold text-gray-900"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-1.5">
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => setReplyOpen(!replyOpen)}
          className="btn-primary"
        >
          {replyOpen ? "Cancel" : "Reply"}
        </button>
        <button
          type="button"
          onClick={() => setShowReplies(!showReplies)}
          className="btn-secondary"
        >
          {showReplies
            ? `Hide replies (${replies?.length ?? 0})`
            : `Show replies (${comment.replyCount ?? 0})`}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={() => deleteComment(comment._id)}
          className="btn-danger"
        >
          {deleting ? "..." : "Delete Comment"}
        </button>
      </div>

      {/* Reply Form (inline) */}
      {replyOpen && (
        <ReplyForm
          postId={postId}
          parentCommentId={comment._id}
          onDone={() => {
            setReplyOpen(false);
            setShowReplies(true);
          }}
        />
      )}

      {/* Replies list */}
      {showReplies && (
        <div className="mt-3 space-y-2 border-l-2 border-gray-200 pl-4">
          {replies?.length === 0 && (
            <p className="text-xs text-gray-500">No replies yet.</p>
          )}
          {replies?.map((reply) => {
            return (
              <div
                key={reply._id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-start gap-2.5">
                  <AuthorLink
                    author={reply.author}
                    size="xs"
                    showGamertag={false}
                    avatarClassName="border border-gray-200"
                    nameClassName="text-xs font-semibold text-gray-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(reply.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-700 break-words">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ----- Main Comment Section -----
export default function CommentSection({ postId }: { postId: string }) {
  const { data: comments, isLoading, error } = useComments(postId);
  const [content, setContent] = useState("");
  const { mutate: createComment, isPending } = useCreateComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(
      { postId, content },
      {
        onSuccess: () => setContent(""),
      }
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Comments</h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          {isPending ? "..." : "Comment"}
        </button>
      </form>

      {/* Loading / error */}
      {isLoading && <p className="text-sm text-gray-500">Loading comments...</p>}
      {error && (
        <p className="text-sm text-red-600">{(error as Error).message}</p>
      )}

      {/* Comments list */}
      <div className="space-y-3">
        {comments?.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={postId} />
        ))}
        {comments?.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}