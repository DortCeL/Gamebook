import User, { IUser } from "../models/User.js";

export class UserService {
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
}
