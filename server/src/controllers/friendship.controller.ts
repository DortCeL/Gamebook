import { Request, Response } from "express";
import { FriendshipService } from "../services/friendship.service.js";

export class FriendshipController {
	static async sendRequest(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { userId: recipientId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const friendship = await FriendshipService.sendRequest(
				userId,
				recipientId as string,
			);

			return res.status(201).json({
				success: true,
				data: friendship,
			});
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async getIncomingRequests(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const requests = await FriendshipService.getIncomingRequests(userId);

			return res.status(200).json({
				success: true,
				count: requests.length,
				data: requests,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async getSentRequests(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const requests = await FriendshipService.getSentRequests(userId);

			return res.status(200).json({
				success: true,
				count: requests.length,
				data: requests,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async acceptRequest(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { requestId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const friendship = await FriendshipService.acceptRequest(
				requestId as string,
				userId,
			);

			return res.status(200).json({
				success: true,
				data: friendship,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 403;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async declineRequest(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { requestId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const friendship = await FriendshipService.declineRequest(
				requestId as string,
				userId,
			);

			return res.status(200).json({
				success: true,
				data: friendship,
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 403;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async removeFriendship(req: Request, res: Response) {
		try {
			const userId = req.user?._id;
			const { friendshipId } = req.params;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			await FriendshipService.removeFriendship(friendshipId as string, userId);

			return res.status(200).json({
				success: true,
				message: "Friendship removed successfully.",
			});
		} catch (error: any) {
			const status = error.message.includes("not found") ? 404 : 403;
			return res.status(status).json({
				success: false,
				message: error.message,
			});
		}
	}

	static async getFriends(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const friends = await FriendshipService.getFriends(userId);

			return res.status(200).json({
				success: true,
				count: friends.length,
				data: friends,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}
}
