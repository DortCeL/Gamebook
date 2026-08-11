import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import User from "../models/User.js";

export class PostController {
	// feed — page 1, 10 per page. public + friends posts if logged in
	static async getFeed(req: any, res: any) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = 10;
			const skip = (page - 1) * limit;

			let filter: any = { visibility: "public" };

			// if logged in, also show friends-only posts from friends
			if (req.user?._id) {
				const me = await User.findById(req.user._id).select("friends");
				const friendIds = me?.friends || [];

				filter = {
					$or: [
						{ visibility: "public" },
						{ visibility: "friends", author: { $in: friendIds } },
						{ author: req.user._id },
					],
				};
			}

			const posts = await Post.find(filter)
				.populate("author", "name gamertag avatar")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit);

			const total = await Post.countDocuments(filter);

			return res.json({
				posts,
				page,
				hasMore: skip + posts.length < total,
			});
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	// posts by one user (for profile page)
	static async getByUser(req: any, res: any) {
		try {
			const userId = req.params.userId;
			const viewerId = req.user?._id;

			let filter: any = { author: userId, visibility: "public" };

			if (viewerId) {
				const me = await User.findById(viewerId).select("friends");
				const isFriend = me?.friends.some(
					(id) => id.toString() === userId,
				);
				const isSelf = viewerId === userId;

				if (isSelf || isFriend) {
					filter = { author: userId };
				}
			}

			const posts = await Post.find(filter)
				.populate("author", "name gamertag avatar")
				.sort({ createdAt: -1 });

			return res.json(posts);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async create(req: any, res: any) {
		try {
			const { text, visibility } = req.body;
			if (!text?.trim()) {
				return res.status(400).json({ message: "Post text is required." });
			}

			const post = await Post.create({
				author: req.user._id,
				text: text.trim(),
				visibility: visibility || "public",
			});

			await post.populate("author", "name gamertag avatar");
			return res.status(201).json(post);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async update(req: any, res: any) {
		try {
			const post = await Post.findById(req.params.id);
			if (!post) {
				return res.status(404).json({ message: "Post not found." });
			}
			if (post.author.toString() !== req.user._id) {
				return res.status(403).json({ message: "Not your post." });
			}

			if (req.body.text) post.text = req.body.text.trim();
			if (req.body.visibility) post.visibility = req.body.visibility;

			await post.save();
			await post.populate("author", "name gamertag avatar");
			return res.json(post);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async remove(req: any, res: any) {
		try {
			const postId = req.params.id;
			const post = await Post.findById(postId);
			if (!post) {
				return res.status(404).json({ message: "Post not found." });
			}
			if (post.author.toString() !== req.user._id) {
				return res.status(403).json({ message: "Not your post." });
			}

			// cascade: delete all comments on this post
			await Comment.deleteMany({ post: postId });
			await Post.findByIdAndDelete(postId);

			return res.json({ message: "Post deleted." });
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
