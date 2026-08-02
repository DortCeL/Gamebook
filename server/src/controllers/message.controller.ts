import { Request, Response } from "express";
import { MessageService } from "../services/message.service.js";

export class MessageController {
	static async list(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { conversationId } = req.params;
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 50;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const messages = await MessageService.getConversationMessages(
				conversationId as string,
				userId,
				page,
				limit,
			);

			return res.status(200).json({
				success: true,
				count: messages.length,
				data: messages,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 400;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async send(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { conversationId } = req.params;
			const { content } = req.body;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const message = await MessageService.sendMessage(
				conversationId as string,
				userId,
				content
			);

			return res.status(201).json({
				success: true,
				data: message,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 400;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async markAsRead(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { messageId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const message = await MessageService.markMessageAsRead(
				messageId as string,
				userId,
			);

			return res.status(200).json({
				success: true,
				data: message,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 403;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async markConversationAsRead(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { conversationId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const result = await MessageService.markConversationAsRead(
				conversationId as string,
				userId,
			);

			return res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 403;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}
}
