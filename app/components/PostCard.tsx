import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import type { Comment, Post } from "../../types";
import { commentApi, postApi } from "~/api";
import { useAuth } from "~/context/AuthContext";
import { timeAgo } from "~/utils/timeAgo";

export default function PostCard({ post }: { post: Post }) {
	const { user } = useAuth();
	const location = useLocation();
	const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

	const [comments, setComments] = useState<Comment[]>([]);
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [replyTo, setReplyTo] = useState<string | null>(null);
	const [loadingComments, setLoadingComments] = useState(false);

	const isAuthor = user?._id === post.author._id;

	// load comments when user opens the section
	useEffect(() => {
		if (!showComments) return;
		setLoadingComments(true);
		commentApi
			.getByPost(post._id)
			.then((res) => setComments(res.data))
			.finally(() => setLoadingComments(false));
	}, [showComments, post._id]);

	async function handleDeletePost() {
		if (!confirm("Delete this post?")) return;
		await postApi.remove(post._id);
		window.location.reload();
	}

	async function handleComment(e: React.FormEvent) {
		e.preventDefault();
		if (!commentText.trim()) return;

		const res = await commentApi.create({
			postId: post._id,
			text: commentText.trim(),
			parentId: replyTo || undefined,
		});

		setComments((prev) => [...prev, res.data]);
		setCommentText("");
		setReplyTo(null);
	}

	async function handleDeleteComment(id: string) {
		await commentApi.remove(id);
		setComments((prev) => prev.filter((c) => c._id !== id && c.parent !== id));
	}

	// split top-level comments and replies
	const topLevel = comments.filter((c) => !c.parent);
	const repliesOf = (parentId: string) =>
		comments.filter((c) => c.parent === parentId);

	return (
		<article className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-100">
			{/* author row */}
			<div className="flex items-center justify-between gap-2">
				<Link
					to={`/profile/${post.author._id}`}
					className="flex items-center gap-2 hover:text-green-400"
				>
					<div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-sm">
						{post.author.name?.[0] || "?"}
					</div>
					<div>
						<p className="font-semibold text-sm">{post.author.name}</p>
						<p className="text-xs text-gray-400">@{post.author.gamertag}</p>
					</div>
				</Link>
				<span className="text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
			</div>

			<p className="mt-3 whitespace-pre-wrap">{post.text}</p>

			<div className="mt-2 flex items-center gap-2 text-xs">
				<span
					className={`px-2 py-0.5 rounded ${
						post.visibility === "friends"
							? "bg-yellow-900 text-yellow-300"
							: "bg-gray-700 text-gray-300"
					}`}
				>
					{post.visibility}
				</span>
				<button
					type="button"
					onClick={() => setShowComments(!showComments)}
					className="text-green-400 hover:underline"
				>
					{showComments ? "Hide comments" : "Comments"}
				</button>
				{isAuthor && (
					<button
						type="button"
						onClick={handleDeletePost}
						className="text-red-400 hover:underline ml-auto"
					>
						Delete
					</button>
				)}
			</div>

			{showComments && (
				<div className="mt-4 border-t border-gray-700 pt-3 space-y-3">
					{loadingComments && (
						<p className="text-sm text-gray-500">Loading comments...</p>
					)}

					{topLevel.map((comment) => (
						<div key={comment._id} className="text-sm">
							<div className="flex items-center gap-2">
								<Link
									to={`/profile/${comment.author._id}`}
									className="font-medium text-green-400 hover:underline"
								>
									{comment.author.name}
								</Link>
								<span className="text-gray-500 text-xs">
									{timeAgo(comment.createdAt)}
								</span>
							</div>
							<p className="mt-1">{comment.text}</p>
							<div className="flex gap-2 mt-1 text-xs">
								{user ? (
									<button
										type="button"
										onClick={() => setReplyTo(comment._id)}
										className="text-gray-400 hover:text-green-400"
									>
										Reply
									</button>
								) : (
									<Link to={loginUrl} className="text-gray-400 hover:text-green-400">
										Log in to reply
									</Link>
								)}
								{user?._id === comment.author._id && (
									<button
										type="button"
										onClick={() => handleDeleteComment(comment._id)}
										className="text-red-400"
									>
										Delete
									</button>
								)}
							</div>

							{/* replies */}
							{repliesOf(comment._id).map((reply) => (
								<div
									key={reply._id}
									className="ml-4 mt-2 pl-3 border-l border-gray-600"
								>
									<Link
										to={`/profile/${reply.author._id}`}
										className="font-medium text-green-400 text-xs hover:underline"
									>
										{reply.author.name}
									</Link>
									<p className="text-sm mt-0.5">{reply.text}</p>
								</div>
							))}
						</div>
					))}

					{user ? (
						<form onSubmit={handleComment} className="flex gap-2">
							<input
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								placeholder={
									replyTo ? "Write a reply..." : "Write a comment..."
								}
								className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-sm"
							/>
							<button
								type="submit"
								className="bg-green-600 px-3 py-1.5 rounded text-sm hover:bg-green-500"
							>
								Post
							</button>
							{replyTo && (
								<button
									type="button"
									onClick={() => setReplyTo(null)}
									className="text-xs text-gray-400"
								>
									Cancel
								</button>
							)}
						</form>
					) : (
						<p className="text-sm text-gray-400">
							<Link to={loginUrl} className="text-green-400 hover:underline">
								Log in
							</Link>{" "}
							to comment.
						</p>
					)}
				</div>
			)}
		</article>
	);
}
