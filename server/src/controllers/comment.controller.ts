import { Comment } from "../models/Comment.js";
import { Post } from "../models/Post.js";

export class CommentController {
	// all comments + replies for a post
	static async getByPost(req: any, res: any) {
		try {
			const comments = await Comment.find({ post: req.params.postId })
				.populate("author", "name gamertag avatar")
				.sort({ createdAt: 1 });

			return res.json(comments);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async create(req: any, res: any) {
		try {
			const { postId, text, parentId } = req.body;

			if (!text?.trim()) {
				return res.status(400).json({ message: "Comment text is required." });
			}

			const post = await Post.findById(postId);
			if (!post) {
				return res.status(404).json({ message: "Post not found." });
			}

			const comment = await Comment.create({
				post: postId,
				author: req.user._id,
				text: text.trim(),
				parent: parentId || null,
			});

			await comment.populate("author", "name gamertag avatar");
			return res.status(201).json(comment);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async update(req: any, res: any) {
		try {
			const comment = await Comment.findById(req.params.id);
			if (!comment) {
				return res.status(404).json({ message: "Comment not found." });
			}
			if (comment.author.toString() !== req.user._id) {
				return res.status(403).json({ message: "Not your comment." });
			}

			comment.text = req.body.text.trim();
			await comment.save();
			await comment.populate("author", "name gamertag avatar");
			return res.json(comment);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async remove(req: any, res: any) {
		try {
			const commentId = req.params.id;
			const comment = await Comment.findById(commentId);
			if (!comment) {
				return res.status(404).json({ message: "Comment not found." });
			}
			if (comment.author.toString() !== req.user._id) {
				return res.status(403).json({ message: "Not your comment." });
			}

			if (!comment.parent) {
				// top-level: delete all replies first, then itself
				await Comment.deleteMany({ parent: commentId });
			}
			await Comment.findByIdAndDelete(commentId);

			return res.json({ message: "Comment deleted." });
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
