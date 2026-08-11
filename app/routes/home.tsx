import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Navbar from "~/components/Navbar";
import PostCard from "~/components/PostCard";
import { postApi } from "~/api";
import { useAuth } from "~/context/AuthContext";
import type { Post } from "../../types";

export default function Home() {
	const { user } = useAuth();
	const location = useLocation();
	const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

	const [posts, setPosts] = useState<Post[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	// new post form
	const [text, setText] = useState("");
	const [visibility, setVisibility] = useState<"public" | "friends">("public");
	const [posting, setPosting] = useState(false);

	async function loadPosts(pageNum: number, append = false) {
		if (pageNum === 1) setLoading(true);
		else setLoadingMore(true);

		try {
			const res = await postApi.getFeed(pageNum);
			setPosts((prev) =>
				append ? [...prev, ...res.data.posts] : res.data.posts,
			);
			setHasMore(res.data.hasMore);
			setPage(pageNum);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	}

	useEffect(() => {
		loadPosts(1);
	}, []);

	async function handleNewPost(e: React.FormEvent) {
		e.preventDefault();
		if (!text.trim()) return;
		setPosting(true);
		try {
			const res = await postApi.create({ text: text.trim(), visibility });
			setPosts((prev) => [res.data, ...prev]);
			setText("");
		} finally {
			setPosting(false);
		}
	}

	return (
		<div className="min-h-screen bg-gray-950 text-gray-100">
			<Navbar />

			<main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
				<h1 className="text-xl font-bold text-green-400">Feed</h1>

				{/* create post — only if logged in */}
				{user ? (
					<form
						onSubmit={handleNewPost}
						className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3"
					>
						<textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="What's on your mind?"
							rows={3}
							className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm"
						/>
						<div className="flex items-center gap-3">
							<select
								value={visibility}
								onChange={(e) =>
									setVisibility(e.target.value as "public" | "friends")
								}
								className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm"
							>
								<option value="public">public</option>
								<option value="friends">friends only</option>
							</select>
							<button
								type="submit"
								disabled={posting}
								className="bg-green-600 px-4 py-1.5 rounded text-sm hover:bg-green-500 disabled:opacity-50"
							>
								{posting ? "Posting..." : "Post"}
							</button>
						</div>
					</form>
				) : (
					<p className="text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg p-4">
						<Link to={loginUrl} className="text-green-400 hover:underline">
							Log in
						</Link>{" "}
						to create a post.
					</p>
				)}

				{loading && <p className="text-gray-500">Loading feed...</p>}

				{posts.map((post) => (
					<PostCard key={post._id} post={post} />
				))}

				{hasMore && !loading && (
					<button
						type="button"
						onClick={() => loadPosts(page + 1, true)}
						disabled={loadingMore}
						className="w-full py-2 text-sm text-green-400 border border-gray-700 rounded hover:bg-gray-800"
					>
						{loadingMore ? "Loading..." : "Load more"}
					</button>
				)}
			</main>
		</div>
	);
}
