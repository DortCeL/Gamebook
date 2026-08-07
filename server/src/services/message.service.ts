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
	// get the chat history for a conversation.
	static async getConversationMessages(
		conversationId: string,
		userId: string,
		page = 1,
		limit = 50,
	) {
		// check if the conversation exists and USER A is part of it.
		const conversation = await ConversationService.getConversationById(
			conversationId,
			userId,
		);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		// get the messages for the conversation. SORT BY CREATED AT (newest first) for pagination.
		const messages = await Message.find({ conversation: conversationId })
			.populate("sender", senderFields)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit);

		// reverse to get OLDEST FIRST FOR CHAT UI.
		const ordered = messages.reverse();

		// loop through each message and mark them as "delivered" if they are not already. LASTLY notify the sender via socket event.
		for (const message of ordered) {
			// sender is populated in the find() above. So we need to extract the userId from the sender object.
			const senderId = ConversationService.resolveUserId(message.sender);

			// sender = user means the message is from the user themselves. So we don't need to mark them as "delivered".
			// message.deliveredAt = true means the message has already been marked as "delivered". So we don't need to mark it again.
			if (senderId === userId || message.deliveredAt) continue;

			message.deliveredAt = new Date();
			await message.save();

			// send a socket event to the sender. so that sender does not have to refresh the page to see the "delivered" receipt.
			sendToUser(senderId, SOCKET_EVENTS.MESSAGE_DELIVERED, {
				conversationId,
				messageId: message._id,
				deliveredAt: message.deliveredAt,
			});
		}

		return ordered;
	}

	// send a message to the conversation.
	static async sendMessage(
		conversationId: string,
		senderId: string,
		content: string,
	) {
		const conversation = await ConversationService.getConversationById(
			conversationId,
			senderId,
		);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		// validation: make sure the message content is not empty. this avoids a crash if content is NULL
		if (!content?.trim()) {
			throw new Error("Message content is required.");
		}

		// get the other user's ID from the conversation. This is used to send a "delivered" receipt to the other user.
		const otherUserId = ConversationService.getOtherUserId(
			conversation,
			senderId,
		);

		if (!otherUserId) {
			throw new Error("Conversation participant not found.");
		}

		const message = await Message.create({
			conversation: conversationId,
			sender: senderId,
			content: content.trim(),
			deliveredAt: isUserOnline(otherUserId) ? new Date() : null,
			readAt: null,
		});

		conversation.lastMessage = message._id;
		conversation.lastMessageAt = message.createdAt;
		await conversation.save();

		const populatedMessage = await Message.findById(message._id).populate(
			"sender",
			senderFields,
		);

		const populatedConversation = await ConversationService.getConversationById(conversationId, senderId);

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

		const senderId = ConversationService.resolveUserId(message.sender);

		if (senderId === userId || message.readAt) {
			return message.populate("sender", senderFields);
		}

		message.readAt = new Date();
		await message.save();

		sendToUser(senderId, SOCKET_EVENTS.MESSAGE_READ, {
			conversationId: conversation._id.toString(),
			messageId: message._id,
			readAt: message.readAt,
		});

		return message.populate("sender", senderFields);
	}

	static async markConversationAsRead(conversationId: string, userId: string) {
		const conversation = await ConversationService.getConversationById(
			conversationId,
			userId,
		);

		if (!conversation) {
			throw new Error("Conversation not found or unauthorized.");
		}

		const unreadMessages = await Message.find({
			conversation: conversationId,
			sender: { $ne: userId },
			readAt: null,
		});

		await Promise.all(
			unreadMessages.map(async (message) => {
				message.readAt = new Date();
				await message.save();

				sendToUser(
					ConversationService.resolveUserId(message.sender),
					SOCKET_EVENTS.MESSAGE_READ,
					{
						conversationId,
						messageId: message._id,
						readAt: message.readAt,
					},
				);
			}),
		);

		return { markedCount: unreadMessages.length };
	}
}
