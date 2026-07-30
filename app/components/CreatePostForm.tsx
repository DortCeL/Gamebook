import { useState } from "react";
import { useNavigate } from "react-router";
import type { CreatePostPayload } from "../../types";
import { useCreatePost } from "~/hooks/usePosts";

export default function CreatePostForm() {
	const navigate = useNavigate();
	const { mutate: createPost, isPending, error } = useCreatePost();

	const [form, setForm] = useState<CreatePostPayload>({
		type: "text",
		game: "",
		content: "",
		visibility: "public",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createPost(form, {
			onSuccess: (post) => navigate(`/posts/${post._id}`),
		});
	};

	return (
		<form onSubmit={handleSubmit} className='bg-white rounded-lg border p-4 space-y-3'>
			<h2 className='font-semibold text-gray-900'>Create Post</h2>

			<div className='grid grid-cols-2 gap-3'>
				<label className='text-sm'>
					Type
					<select
						value={form.type}
						onChange={(e) =>
							setForm({ ...form, type: e.target.value as CreatePostPayload["type"] })
						}
						className='mt-1 w-full border rounded px-2 py-1.5'
					>
						<option value='text'>text</option>
						<option value='review'>review</option>
						<option value='screenshot'>screenshot</option>
					</select>
				</label>

				<label className='text-sm'>
					Visibility
					<select
						value={form.visibility}
						onChange={(e) =>
							setForm({
								...form,
								visibility: e.target.value as CreatePostPayload["visibility"],
							})
						}
						className='mt-1 w-full border rounded px-2 py-1.5'
					>
						<option value='public'>public</option>
						<option value='friends'>friends</option>
					</select>
				</label>
			</div>

			<label className='text-sm block'>
				Game (optional)
				<input
					value={form.game}
					onChange={(e) => setForm({ ...form, game: e.target.value })}
					className='mt-1 w-full border rounded px-2 py-1.5'
					placeholder='Elden Ring'
				/>
			</label>

			<label className='text-sm block'>
				Content
				<textarea
					value={form.content}
					onChange={(e) => setForm({ ...form, content: e.target.value })}
					required
					rows={4}
					className='mt-1 w-full border rounded px-2 py-1.5'
					placeholder='Write something...'
				/>
			</label>

			{error && (
				<p className='text-sm text-red-600'>{(error as Error).message}</p>
			)}

			<button
				type='submit'
				disabled={isPending}
				className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60'
			>
				{isPending ? "Posting..." : "Post"}
			</button>
		</form>
	);
}
