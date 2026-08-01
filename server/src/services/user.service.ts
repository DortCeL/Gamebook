import { Post } from "../models/Post.js";
import User, { IUser } from "../models/User.js";

export interface UserProfileResponse {
	user: IUser;
	stats: {
		totalPosts: number;
	};
}

export class UserService {
	// Fetch logged-in user details with stats
	static async getProfile(userId: string): Promise<UserProfileResponse> {
		const user = await User.findById(userId);

		if (!user) {
			throw new Error("User not found.");
		}

		// Run post count query concurrently
		const totalPosts = await Post.countDocuments({ author: userId });

		return {
			user,
			stats: {
				totalPosts,
			},
		};
	}

	static async deleteUser(userId: string): Promise<IUser | null> {
		// 1. Fetch the user document instance
		const user = await User.findById(userId);

		if (!user) {
			return null;
		}

		// 2. Calling instance.deleteOne() triggers your schema pre('deleteOne') hook, which cascades and removes all posts authored by this user.
		await user.deleteOne();

		return user;
	}

	static async updateProfile(
		userId: string,
		updateData: Partial<IUser>,
	): Promise<IUser | null> {
		// Prevent password updates through this method (use a dedicated change-password endpoint for security)
		// delete updateData.password;

		// Check if unique fields (gamertag) conflict with another user
		if (updateData.gamertag) {
			const existingUser = await User.findOne({
				_id: { $ne: userId }, // Exclude current user
				$or: [
					// ...(updateData.email
					// 	? [{ email: updateData.email.toLowerCase() }]
					// 	: []),
					...(updateData.gamertag ? [{ gamertag: updateData.gamertag }] : []),
				],
			});

			if (existingUser) {
				// if (existingUser.email === updateData.email?.toLowerCase()) {
				// 	throw new Error("Email is already in use by another account.");
				// }
				if (existingUser.gamertag === updateData.gamertag) {
					throw new Error("Gamertag is already taken.");
				}
			}
		}

		// Perform the update
		return await User.findByIdAndUpdate(
			userId,
			{ $set: updateData },
			{ new: true, runValidators: true },
		);
	}

	static async searchUsers(
		query: string,
		currentUserId: string,
		limit = 10,
	): Promise<IUser[]> {
		const trimmed = query.trim();
		if (!trimmed) return [];

		const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

		return User.find({
			_id: { $ne: currentUserId },
			$or: [{ name: regex }, { gamertag: regex }],
		})
			.select("name gamertag avatarUrl")
			.limit(limit);
	}

	static async getAllUsers(
		currentUserId: string,
		page = 1,
		limit = 20,
	): Promise<IUser[]> {
		return User.find({ _id: { $ne: currentUserId } })
			.select("name gamertag avatarUrl bio")
			.sort({ name: 1 })
			.skip((page - 1) * limit)
			.limit(limit);
	}
}
