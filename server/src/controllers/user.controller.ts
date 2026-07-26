import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";

export class UserController {
	// GET PROFILE INFO
	static async getProfile(req: Request, res: Response) {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			const profileData = await UserService.getProfile(userId);

			return res.status(200).json({
				success: true,
				data: profileData,
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}

	// UPDATE PROFILE
	static async updateProfile(req: Request, res: Response) {
		try {
			const { name, gamertag, bio, avatarUrl } = req.body;
			// Empty body - nothign to update
			if (!name && !gamertag && !bio && !avatarUrl) {
				return res.status(400).json({
					success: false,
					message: "Nothing to update!",
				});
			}

			const authenticatedUserId = req.user?._id;
			const targetUserId = req.params.id;

			// Auth check
			if (!authenticatedUserId) {
				return res.status(401).json({
					success: false,
					message: "Unauthorized: Authentication required.",
				});
			}

			// Authorization check: Users can only edit their own profile
			if (authenticatedUserId !== targetUserId) {
				return res.status(403).json({
					success: false,
					message: "Forbidden: You can only update your own profile.",
				});
			}

			// Extract allowed fields from body

			const updatedUser = await UserService.updateProfile(targetUserId, {
				name,
				gamertag,
				bio,
				avatarUrl,
			});

			if (!updatedUser) {
				return res.status(404).json({
					success: false,
					message: "User not found.",
				});
			}

			return res.status(200).json({
				success: true,
				data: updatedUser,
			});
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message || "Failed to update profile.",
			});
		}
	}

	// DELETE ACCOUNT / PROFILE
	static async deleteAccount(req: Request, res: Response) {
		try {
			const targetUserId = req.params.id;
			if (!targetUserId)
				return res.status(400).json({
					success: false,
					message: "Target id is missing in the url",
				});

			const authenticatedUserId = req.user?._id; // Populated by your auth middleware

			// Prevent users from deleting other accounts
			if (authenticatedUserId !== targetUserId) {
				return res.status(403).json({
					success: false,
					message: "Forbidden: You can only delete your own account.",
				});
			}

			const deletedUser = await UserService.deleteUser(targetUserId);

			if (!deletedUser) {
				return res.status(404).json({
					success: false,
					message: "User not found.",
				});
			}

			return res.status(200).json({
				success: true,
				message: "Account and associated posts deleted successfully.",
			});
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message || "An error occurred while deleting account.",
			});
		}
	}
}
