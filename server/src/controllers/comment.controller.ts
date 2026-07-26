import { Request, Response } from "express";
import { CommentService } from "../services/comment.service.js";

export class CommentController {
	static async create(req: Request, res: Response) {
		try {
			const authorId = req.user?._id;
			if (!authorId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const { postId, content, parentCommentId } = req.body;

			if (!postId || !content) {
				return res.status(400).json({
					success: false,
					message: "postId and content are required.",
				});
			}

			const comment = await CommentService.createComment(
				postId,
				authorId,
				content,
				parentCommentId,
			);

			return res.status(201).json({ success: true, data: comment });
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message });
		}
	}

	static async getByPost(req: Request, res: Response) {
		try {
			const { postId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const comments = await CommentService.getPostComments(
				postId as string,
				page,
				limit,
			);

			return res.status(200).json({
				success: true,
				count: comments.length,
				data: comments,
			});
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	static async getReplies(req: Request, res: Response) {
		try {
			const { commentId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;

			const replies = await CommentService.getCommentReplies(
				commentId as string,
				page,
				limit,
			);

			return res.status(200).json({
				success: true,
				count: replies.length,
				data: replies,
			});
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}

	static async delete(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const { id } = req.params;
			const success: boolean = await CommentService.deleteComment(
				id as string,
				userId,
			);

			if (!success) {
				return res.status(403).json({
					success: false,
					message: "Comment not found or you are not authorized to delete it.",
				});
			}

			return res
				.status(200)
				.json({ success: true, message: "Comment deleted successfully." });
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message });
		}
	}
}
