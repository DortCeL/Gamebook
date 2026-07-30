import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import CreatePostForm from "~/components/CreatePostForm";

export default function NewPostPage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='max-w-xl mx-auto px-4 py-8 space-y-4'>
				<Link to='/' className='text-sm text-gray-500 hover:text-gray-700'>
					← Back to feed
				</Link>
				<CreatePostForm />
			</main>
		</div>
	);
}
