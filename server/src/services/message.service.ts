import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import {
	isUserOnline,
	notifyChatPartners,
	sendToUser,
	SOCKET_EVENTS,
} from "../socket/socket.js";
import { ConversationService } from "./conversation.service.js";

const senderFields = "name gamertag avatarUrl";

export class MessageService {
	static async getConversationMessages(
		conversationId: string,
		userId: string,
		page = 1,
		limit = 50,
	) {
		const conversation =
			await ConversationService.getConversationById(conversationId, userId);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		const messages = await Message.find({ conversation: conversationId })
			.populate("sender", senderFields)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		const ordered = messages.reverse();

		for (const message of ordered) {
			const senderId = ConversationService.resolveUserId(message.sender);

			if (senderId === userId) continue;

			const alreadyDelivered = message.deliveredTo.some(
				(entry) =>
					ConversationService.resolveUserId(entry.user) === userId,
			);

			if (!alreadyDelivered) {
				message.deliveredTo.push({ user: userId, deliveredAt: new Date() });
				await message.save();

				sendToUser(senderId, SOCKET_EVENTS.MESSAGE_DELIVERED, {
					conversationId,
					messageId: message._id,
					deliveredTo: message.deliveredTo,
				});
			}
		}

		return ordered;
	}

	static async sendMessage(
		conversationId: string,
		senderId: string,
		content: string,
	) {
		const conversation =
			await ConversationService.getConversationById(conversationId, senderId);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		if (!content?.trim()) {
			throw new Error("Message content is required.");
		}

		const otherUserId = ConversationService.getOtherUserId(
			conversation,
			senderId,
		);

		if (!otherUserId) {
			throw new Error("Invalid 1-on-1 conversation.");
		}

		const message = await Message.create({
			conversation: conversationId,
			sender: senderId,
			content: content.trim(),
			deliveredTo: [{ user: senderId, deliveredAt: new Date() }],
			readBy: [{ user: senderId, readAt: new Date() }],
		});

		if (isUserOnline(otherUserId)) {
			message.deliveredTo.push({ user: otherUserId, deliveredAt: new Date() });
			await message.save();
		}

		conversation.lastMessage = message._id;
		conversation.lastMessageAt = message.createdAt;
		await conversation.save();

		const populatedMessage = await Message.findById(message._id).populate(
			"sender",
			senderFields,
		);

		const populatedConversation =
			await ConversationService.getConversationById(conversationId, senderId);

		notifyChatPartners(senderId, otherUserId, SOCKET_EVENTS.MESSAGE_NEW, {
			conversationId,
			message: populatedMessage,
			conversation: populatedConversation,
		});

		return populatedMessage;
	}

	static async markMessageAsRead(messageId: string, userId: string) {
		const message = await Message.findById(messageId).populate("conversation");

		if (!message) {
			throw new Error("Message not found.");
		}

		const conversation = await Conversation.findById(message.conversation);
		if (
			!conversation ||
			!ConversationService.isInConversation(conversation, userId)
		) {
			throw new Error("Unauthorized to read this message.");
		}

		ConversationService.assertOneToOne(conversation);

		const senderId = ConversationService.resolveUserId(message.sender);

		if (senderId === userId) {
			return message.populate("sender", senderFields);
		}

		const alreadyRead = message.readBy.some(
			(entry) => ConversationService.resolveUserId(entry.user) === userId,
		);

		if (!alreadyRead) {
			message.readBy.push({ user: userId, readAt: new Date() });
			await message.save();

			sendToUser(senderId, SOCKET_EVENTS.MESSAGE_READ, {
				conversationId: conversation._id.toString(),
				messageId: message._id,
				readBy: message.readBy,
			});
		}

		return message.populate("sender", senderFields);
	}

	static async markConversationAsRead(conversationId: string, userId: string) {
		const conversation =
			await ConversationService.getConversationById(conversationId, userId);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		const unreadMessages = await Message.find({
			conversation: conversationId,
			sender: { $ne: userId },
			readBy: { $not: { $elemMatch: { user: userId } } },
		});

		await Promise.all(
			unreadMessages.map(async (message) => {
				message.readBy.push({ user: userId, readAt: new Date() });
				await message.save();

				sendToUser(
					ConversationService.resolveUserId(message.sender),
					SOCKET_EVENTS.MESSAGE_READ,
					{
					conversationId,
					messageId: message._id,
					readBy: message.readBy,
					},
				);
			}),
		);

		return { markedCount: unreadMessages.length };
	}
}
