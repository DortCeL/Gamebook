import User from "../models/User.js";
import { Post } from "../models/Post.js";

export class UserController {
	// public profile — name, gamertag, avatar, friends
	static async getById(req: any, res: any) {
		try {
			const user = await User.findById(req.params.id)
				.select("name gamertag avatar friends createdAt")
				.populate("friends", "name gamertag avatar");

			if (!user) {
				return res.status(404).json({ message: "User not found." });
			}

			const postCount = await Post.countDocuments({ author: user._id });

			return res.json({
				user,
				postCount,
			});
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	// update own profile
	static async update(req: any, res: any) {
		try {
			const userId = req.user._id;
			if (req.params.id !== userId) {
				return res.status(403).json({ message: "You can only edit your own profile." });
			}

			const { name, gamertag, avatar } = req.body;
			const user = await User.findById(userId);
			if (!user) {
				return res.status(404).json({ message: "User not found." });
			}

			if (name) user.name = name;
			if (gamertag) user.gamertag = gamertag;
			if (avatar !== undefined) user.avatar = avatar;

			await user.save();

			return res.json({
				_id: user._id,
				name: user.name,
				gamertag: user.gamertag,
				email: user.email,
				avatar: user.avatar,
			});
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	// get current logged-in user (for navbar)
	static async me(req: any, res: any) {
		try {
			const user = await User.findById(req.user._id).select(
				"name gamertag email avatar friends",
			);
			if (!user) {
				return res.status(404).json({ message: "User not found." });
			}
			return res.json(user);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
