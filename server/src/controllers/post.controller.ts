import { Request, Response } from "express";
import { PostService } from "../services/post.service.js";

// Note: Replace Request with your custom Authenticated Request type if req.user exists
export class PostController {
	static async create(req: Request, res: Response) {
		try {
			// Assuming req.user._id is populated via auth middleware
			const authorId = req.user?._id;
			// return res.status(420).json({ author: req.user });

			// 1. Guard against unauthenticated requests or invalid tokens
			if (!authorId) {
				return res.status(401).json({
					success: false,
					message:
						"Unauthorized: Valid authentication required to create a post.",
				});
			}

			const postData = { ...req.body, author: authorId };
			const post = await PostService.createPost(postData);

			return res.status(201).json({ success: true, data: post });
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message });
		}
	}

	static async getMyPosts(req: Request, res: Response) {
		try {
			const authorId = req.user?._id;

			// Guard against unauthenticated requests
			if (!authorId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const posts = await PostService.getPostsByAuthor(authorId, page, limit);

			return res.status(200).json({
				success: true,
				count: posts.length,
				data: posts,
			});
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	static async getAll(req: Request, res: Response) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const authorId = req.query.authorId as string;

			const posts = await PostService.getPosts(page, limit, authorId);
			return res
				.status(200)
				.json({ success: true, count: posts.length, data: posts });
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const { id } = req.params;

			const post = await PostService.getPostById(id as string);

			if (!post) {
				return res
					.status(404)
					.json({ success: false, message: "Post not found" });
			}

			return res.status(200).json({ success: true, data: post });
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	static async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const authorId = (req as any).user?._id;

			const updatedPost = await PostService.updatePost(
				id as string,
				authorId,
				req.body,
			);

			if (!updatedPost) {
				return res.status(404).json({
					success: false,
					message: "Post not found or unauthorized to edit",
				});
			}

			return res.status(200).json({ success: true, data: updatedPost });
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message });
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const authorId = (req as any).user?._id;

			const deletedPost = await PostService.deletePost(id as string, authorId);

			if (!deletedPost) {
				return res.status(404).json({
					success: false,
					message: "Post not found or unauthorized to delete",
				});
			}

			return res
				.status(200)
				.json({ success: true, message: "Post deleted successfully" });
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}
}
