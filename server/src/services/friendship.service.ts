import { Types } from "mongoose";
import User from "../models/User.js";
import { Friendship, IFriendship } from "../models/Friendship.js";

const userFields = "name gamertag avatarUrl";

export class FriendshipService {
	static async findBetweenUsers(userA: string, userB: string) {
		return Friendship.findOne({
			$or: [
				{ requester: userA, recipient: userB },
				{ requester: userB, recipient: userA },
			],
		});
	}

	static async sendRequest(
		requesterId: string,
		recipientId: string,
	): Promise<IFriendship> {
		if (requesterId === recipientId) {
			throw new Error("You cannot send a friend request to yourself.");
		}

		const recipient = await User.findById(recipientId);
		if (!recipient) {
			throw new Error("User not found.");
		}

		const existing = await this.findBetweenUsers(requesterId, recipientId);

		if (existing) {
			if (existing.status === "accepted") {
				throw new Error("You are already friends with this user.");
			}

			if (existing.status === "pending") {
				if (existing.requester.toString() === requesterId) {
					throw new Error("Friend request already sent.");
				}
				throw new Error("This user already sent you a friend request.");
			}

			if (existing.status === "declined") {
				existing.requester = new Types.ObjectId(requesterId);
				existing.recipient = new Types.ObjectId(recipientId);
				existing.status = "pending";
				await existing.save();

				return (await Friendship.findById(existing._id)
					.populate("requester", userFields)
					.populate("recipient", userFields)) as IFriendship;
			}
		}

		const friendship = await Friendship.create({
			requester: requesterId,
			recipient: recipientId,
			status: "pending",
		});

		return (await Friendship.findById(friendship._id)
			.populate("requester", userFields)
			.populate("recipient", userFields)) as IFriendship;
	}

	static async getIncomingRequests(userId: string) {
		return Friendship.find({ recipient: userId, status: "pending" })
			.populate("requester", userFields)
			.sort({ createdAt: -1 });
	}

	static async getSentRequests(userId: string) {
		return Friendship.find({ requester: userId, status: "pending" })
			.populate("recipient", userFields)
			.sort({ createdAt: -1 });
	}

	static async acceptRequest(requestId: string, userId: string) {
		const friendship = await Friendship.findById(requestId);

		if (!friendship) {
			throw new Error("Friend request not found.");
		}

		if (friendship.recipient.toString() !== userId) {
			throw new Error("Unauthorized to accept this request.");
		}

		if (friendship.status !== "pending") {
			throw new Error("This friend request is no longer pending.");
		}

		friendship.status = "accepted";
		await friendship.save();

		return Friendship.findById(friendship._id)
			.populate("requester", userFields)
			.populate("recipient", userFields);
	}

	static async declineRequest(requestId: string, userId: string) {
		const friendship = await Friendship.findById(requestId);

		if (!friendship) {
			throw new Error("Friend request not found.");
		}

		if (friendship.recipient.toString() !== userId) {
			throw new Error("Unauthorized to decline this request.");
		}

		if (friendship.status !== "pending") {
			throw new Error("This friend request is no longer pending.");
		}

		friendship.status = "declined";
		await friendship.save();

		return Friendship.findById(friendship._id)
			.populate("requester", userFields)
			.populate("recipient", userFields);
	}

	static async removeFriendship(friendshipId: string, userId: string) {
		const friendship = await Friendship.findById(friendshipId);

		if (!friendship) {
			throw new Error("Friendship not found.");
		}

		const isRequester = friendship.requester.toString() === userId;
		const isRecipient = friendship.recipient.toString() === userId;

		if (!isRequester && !isRecipient) {
			throw new Error("Unauthorized to modify this friendship.");
		}

		await friendship.deleteOne();
		return friendship;
	}

	static async getFriends(userId: string) {
		const friendships = await Friendship.find({
			status: "accepted",
			$or: [{ requester: userId }, { recipient: userId }],
		})
			.populate("requester", userFields)
			.populate("recipient", userFields)
			.sort({ updatedAt: -1 });

		return friendships.map((friendship) => {
			const requesterId = friendship.requester._id.toString();
			const friend =
				requesterId === userId ? friendship.recipient : friendship.requester;

			return {
				_id: friendship._id,
				friend,
				since: friendship.updatedAt,
			};
		});
	}
}
