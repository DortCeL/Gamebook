import { Post, IPost } from "../models/Post.js";
import User from "../models/User.js";

export interface CreatePostPayload {
	title: string;
	content: string;
	author: string;
}

export class PostService {
	// Create a new post
	static async createPost(data: CreatePostPayload): Promise<IPost> {
		const { author: authorId } = data;
		const authorExists = await User.findOne({ _id: authorId });
		if (!authorExists) {
			throw new Error("Author does not exist");
		}

		const post = new Post(data);
		return await post.save();
	}

	// Get feed (public posts + optional user filter)
	static async getPosts(
		page = 1,
		limit = 10,
		authorId?: string,
	): Promise<IPost[]> {
		const query: Record<string, any> = { visibility: "public" };
		if (authorId) {
			query.author = authorId;
		}

		return await Post.find(query)
			.populate("author", "name email gamertag avatarUrl") // Adjust fields as needed
			.populate("game", "title coverImage")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);
	}

	// Get single post by ID
	static async getPostById(postId: string): Promise<IPost | null> {
		return await Post.findById(postId)
			.populate("author", "name email gamertag avatarUrl")
			.populate("game", "title coverImage");
	}

	// Update a post
	static async updatePost(
		postId: string,
		authorId: string,
		updateData: Partial<IPost>,
	): Promise<IPost | null> {
		// Ensures users can only update their own posts
		return await Post.findOneAndUpdate(
			{ _id: postId, author: authorId },
			{ $set: updateData },
			{ new: true, runValidators: true },
		);
	}

	// Get posts by a specific author (includes all visibility levels for the owner)
	static async getPostsByAuthor(
		authorId: string,
		page = 1,
		limit = 10,
	): Promise<IPost[]> {
		return await Post.find({ author: authorId })
			.populate("author", "name email gamertag avatarUrl")
			.populate("game", "title coverImage")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);
	}

	// Delete a post
	static async deletePost(
		postId: string,
		authorId: string,
	): Promise<IPost | null> {
		return await Post.findOneAndDelete({ _id: postId, author: authorId });
	}
}
