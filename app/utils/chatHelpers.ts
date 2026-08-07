import type { IAuthor, IMessage } from "../../types";

export function getUserId(user: string | IAuthor): string {
	return typeof user === "string" ? user : user._id;
}

export function getMessageStatus(message: IMessage): string | null {
	if (message.readAt) return "[seen]";
	if (message.deliveredAt) return "[delivered]";
	return "[sent]";
}

export function groupMessagesBySender(messages: IMessage[]) {
	const groups: {
		senderId: string;
		sender: IAuthor;
		messages: IMessage[];
	}[] = [];

	for (const message of messages) {
		const sender =
			typeof message.sender === "string"
				? { _id: message.sender, name: "Unknown", gamertag: "unknown" }
				: message.sender;
		const lastGroup = groups[groups.length - 1];

		if (lastGroup && lastGroup.senderId === sender._id) {
			lastGroup.messages.push(message);
		} else {
			groups.push({ senderId: sender._id, sender, messages: [message] });
		}
	}

	return groups;
}
