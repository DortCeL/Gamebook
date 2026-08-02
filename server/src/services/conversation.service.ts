import { Types } from "mongoose";
import {
	Conversation,
	IConversation,
} from "../models/Conversation.js";
import User from "../models/User.js";

const userFields = "name gamertag avatarUrl";

export class ConversationService {
	static resolveUserId(
		user: Types.ObjectId | { _id: Types.ObjectId } | string | null | undefined,
	): string {
		if (!user) return "";

		if (typeof user === "string") return user;

		if (typeof user === "object" && "_id" in user && user._id) {
			return user._id.toString();
		}

		return user.toString();
	}

	static assertOneToOne(conversation: IConversation) {
		if (conversation.participants.length !== 2) {
			throw new Error("Invalid conversation: only 1-on-1 chats are supported.");
		}
	}

	static isInConversation(
		conversation: IConversation,
		userId: string,
	): boolean {
		return conversation.participants.some(
			(participant) => this.resolveUserId(participant) === userId,
		);
	}

	static getOtherUserId(
		conversation: IConversation,
		userId: string,
	): string | null {
		this.assertOneToOne(conversation);
		const other = conversation.participants.find(
			(participant) => this.resolveUserId(participant) !== userId,
		);
		return other ? this.resolveUserId(other) : null;
	}

	static async getUserConversations(userId: string): Promise<IConversation[]> {
		return Conversation.find({
			participants: userId,
			$expr: { $eq: [{ $size: "$participants" }, 2] },
		})
			.populate("participants", userFields)
			.populate({
				path: "lastMessage",
				populate: { path: "sender", select: userFields },
			})
			.sort({ lastMessageAt: -1 });
	}

	static async getConversationById(
		conversationId: string,
		userId: string,
	): Promise<IConversation | null> {
		const conversation = await Conversation.findById(conversationId)
			.populate("participants", userFields)
			.populate({
				path: "lastMessage",
				populate: { path: "sender", select: userFields },
			});

		if (!conversation || !this.isInConversation(conversation, userId)) {
			return null;
		}

		this.assertOneToOne(conversation);
		return conversation;
	}

	static async getOrCreateConversation(
		userId: string,
		otherUserId: string,
	): Promise<IConversation> {
		if (userId === otherUserId) {
			throw new Error("You cannot start a conversation with yourself.");
		}

		const otherUser = await User.findById(otherUserId);
		if (!otherUser) {
			throw new Error("User not found.");
		}

		const existing = await Conversation.findOne({
			participants: { $all: [userId, otherUserId], $size: 2 },
		})
			.populate("participants", userFields)
			.populate({
				path: "lastMessage",
				populate: { path: "sender", select: userFields },
			});

		if (existing) {
			return existing;
		}

		const sortedParticipants = [userId, otherUserId]
			.map((id) => id.toString())
			.sort()
			.map((id) => new Types.ObjectId(id));

		const conversation = await Conversation.create({
			participants: sortedParticipants,
		});

		return (await Conversation.findById(conversation._id)
			.populate("participants", userFields)
			.populate({
				path: "lastMessage",
				populate: { path: "sender", select: userFields },
			})) as IConversation;
	}
}
