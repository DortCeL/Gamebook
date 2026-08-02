import { Request, Response } from "express";
import { ConversationService } from "../services/conversation.service.js";

export class ConversationController {
	static async list(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const conversations =
				await ConversationService.getUserConversations(userId);

			return res.status(200).json({
				success: true,
				count: conversations.length,
				data: conversations,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async create(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const { recipientId } = req.body;

			if (!recipientId) {
				return res.status(400).json({
					success: false,
					message: "recipientId is required.",
				});
			}

			const conversation = await ConversationService.getOrCreateConversation(
				userId,
				recipientId,
			);

			return res.status(201).json({
				success: true,
				data: conversation,
			});
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { id } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const conversation = await ConversationService.getConversationById(
				id as string,
				userId,
			);

			if (!conversation) {
				return res.status(404).json({
					success: false,
					message: "Conversation not found or unauthorized.",
				});
			}

			return res.status(200).json({
				success: true,
				data: conversation,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}
}
