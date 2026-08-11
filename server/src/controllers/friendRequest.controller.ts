import User from "../models/User.js";
import { FriendRequest } from "../models/FriendRequest.js";

export class FriendRequestController {
	// send a friend request
	static async send(req: any, res: any) {
		try {
			const fromId = req.user._id;
			const toId = req.body.userId;

			if (fromId === toId) {
				return res.status(400).json({ message: "You cannot add yourself." });
			}

			const target = await User.findById(toId);
			if (!target) {
				return res.status(404).json({ message: "User not found." });
			}

			// already friends?
			const me = await User.findById(fromId);
			if (me?.friends.some((id) => id.toString() === toId)) {
				return res.status(400).json({ message: "Already friends." });
			}

			// duplicate pending request?
			const existing = await FriendRequest.findOne({
				$or: [
					{ from: fromId, to: toId, status: "pending" },
					{ from: toId, to: fromId, status: "pending" },
				],
			});
			if (existing) {
				return res.status(400).json({ message: "Request already exists." });
			}

			const request = await FriendRequest.create({
				from: fromId,
				to: toId,
				status: "pending",
			});

			await request.populate("from to", "name gamertag avatar");
			return res.status(201).json(request);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async incoming(req: any, res: any) {
		try {
			const list = await FriendRequest.find({
				to: req.user._id,
				status: "pending",
			}).populate("from", "name gamertag avatar");

			return res.json(list);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	static async outgoing(req: any, res: any) {
		try {
			const list = await FriendRequest.find({
				from: req.user._id,
				status: "pending",
			}).populate("to", "name gamertag avatar");

			return res.json(list);
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}

	// accept — only the recipient can do this
	static async accept(req: any, res: any) {
		try {
			const request = await FriendRequest.findById(req.params.id);
			if (!request || request.status !== "pending") {
				return res.status(404).json({ message: "Request not found." });
			}
			if (request.to.toString() !== req.user._id) {
				return res.status(403).json({ message: "Not your request to accept." });
			}

			// add each other to friends arrays
			await User.findByIdAndUpdate(request.from, {
				$addToSet: { friends: request.to },
			});
			await User.findByIdAndUpdate(request.to, {
				$addToSet: { friends: request.from },
			});

			// delete the request (plan says delete after accept)
			await FriendRequest.findByIdAndDelete(request._id);

			return res.json({ message: "Friend request accepted." });
		} catch (err: any) {
			return res.status(500).json({ message: err.message });
		}
	}
}
