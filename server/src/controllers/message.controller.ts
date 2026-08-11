import { Message } from "../models/Message.js";

export class MessageController {
	// chat history between me and a friend
	static async getWithFriend(req: any, res: any) {
		try {
			const myId = req.user._id;
			const friendId = req.params.friendId;

			const messages = await Message.find({
				$or: [
					{ sender: myId, receiver: friendId },
					{ sender: friendId, receiver: myId },
				],
			})
				.populate("sender", "name gamertag avatar")
				.sort({ createdAt: 1 });

			return res.json(messages);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
