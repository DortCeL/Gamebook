import { Comment, IComment } from "../models/Comment.js";
import { IPost, Post } from "../models/Post.js";

export class CommentService {
	// Create a comment or reply
	static async createComment(
		postId: string,
		authorId: string,
		content: string,
		parentCommentId?: string,
	): Promise<IComment> {
		// Verify post exists
		const postExists = await Post.exists({ _id: postId });
		if (!postExists) {
			throw new Error("Post not found.");
		}

		// If it's a reply, verify parent comment exists and belongs to the same post
		if (parentCommentId) {
			const parentComment = await Comment.findById(parentCommentId);
			if (!parentComment) {
				throw new Error("Parent comment not found.");
			}
			if (parentComment.post.toString() !== postId) {
				throw new Error("Parent comment does not belong to this post.");
			}
		}

		// Create comment
		const comment = new Comment({
			post: postId,
			author: authorId,
			content,
			parentComment: parentCommentId || null,
		});

		return (await comment.save()).populate(
			"author",
			"username gamertag avatarUrl",
		);
	}

	// Get top-level comments for a post (paginated)
	static async getPostComments(
		postId: string,
		page = 1,
		limit = 10,
	): Promise<IComment[]> {
		return await Comment.find({ post: postId, parentComment: null })
			.populate("author", "username gamertag avatarUrl")
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);
	}

	// Get replies for a specific comment
	static async getCommentReplies(
		parentCommentId: string,
		page = 1,
		limit = 10,
	): Promise<IComment[]> {
		return await Comment.find({ parentComment: parentCommentId })
			.populate("author", "username gamertag avatarUrl")
			.sort({ createdAt: 1 }) // Chronological order for replies
			.skip((page - 1) * limit)
			.limit(limit);
	}

	// Delete a comment (and its nested replies) if the requester is the comment author OR post author
	static async deleteComment(
		commentId: string,
		userId: string,
	): Promise<boolean> {
		// 1. Fetch the comment and populate the parent post to inspect post.author
		const comment = await Comment.findById(commentId).populate<{ post: IPost }>(
			"post",
		);

		if (!comment) {
			return false;
		}

		const isCommentAuthor = comment.author.toString() === userId;
		const isPostAuthor =
			comment.post && comment.post.author.toString() === userId;

		// 2. Reject if requester is neither the comment author nor the post author
		if (!isCommentAuthor && !isPostAuthor) {
			return false;
		}

		// 3. Delete the comment AND any replies attached to it
		await Comment.deleteMany({
			$or: [{ _id: commentId }, { parentComment: commentId }],
		});

		return true;
	}
}
