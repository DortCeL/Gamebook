import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import PostCard from "~/components/PostCard";
import { useMyPosts } from "~/hooks/usePosts";

export default function MyPostsPage() {
	const { data: posts, isLoading, error } = useMyPosts();

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='max-w-2xl mx-auto px-4 py-8 space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>My Posts</h1>
					<Link
						to='/posts/new'
						className='px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
					>
						New Post
					</Link>
				</div>

				{isLoading && <p className='text-gray-500'>Loading your posts...</p>}
				{error && (
					<p className='text-red-600'>{(error as Error).message}</p>
				)}

				<div className='space-y-3'>
					{posts?.map((post) => (
						<PostCard key={post._id} post={post} />
					))}
					{posts?.length === 0 && (
						<p className='text-gray-500'>You haven't posted anything yet.</p>
					)}
				</div>

				<Link to='/' className='text-sm text-gray-500 hover:text-gray-700'>
					← Back to feed
				</Link>
			</main>
		</div>
	);
}
