import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import PostCard from "~/components/PostCard";
import { usePosts } from "~/hooks/usePosts";

export default function Home() {
	const { data: posts, isLoading, error } = usePosts();

	console.log('ENV URL = ', import.meta.env.VITE_API_URL)

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />

			<main className='max-w-2xl mx-auto px-4 py-8 space-y-6'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold text-gray-900'>Public Feed</h1>
					<div className='flex gap-2'>
						<Link
							to='/posts/new'
							className='px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'
						>
							New Post
						</Link>
						<Link
							to='/posts/mine'
							className='px-3 py-1.5 text-sm border rounded hover:bg-gray-100'
						>
							My Posts
						</Link>
					</div>
				</div>

				{isLoading && <p className='text-gray-500'>Loading posts...</p>}
				{error && (
					<p className='text-red-600'>{(error as Error).message}</p>
				)}

				<div className='space-y-3'>
					{posts?.map((post) => (
						<PostCard key={post._id} post={post} />
					))}
					{posts?.length === 0 && (
						<p className='text-gray-500 text-center py-8'>
							No public posts yet.{" "}
							<Link to='/posts/new' className='text-blue-600 hover:underline'>
								Create one
							</Link>
						</p>
					)}
				</div>
			</main>
		</div>
	);
}
