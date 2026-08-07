import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import type { IConversation, IMessage } from "../../types";
import { getToken } from "~/api/tokenHelpers";

type MessageDeliveredPayload = {
	conversationId: string;
	messageId: string;
	deliveredAt: string;
};

type MessageReadPayload = {
	conversationId: string;
	messageId: string;
	readAt: string;
};

type MessageNewPayload = {
	conversationId: string;
	message: IMessage;
	conversation: IConversation;
};

export function useChatSocket() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const token = getToken();
		if (!token) return;

		const socket = io(import.meta.env.VITE_API_URL as string, {
			auth: { token },
		});

		socket.on("message:new", (data: MessageNewPayload) => {
			const { conversationId, message, conversation } = data;

			queryClient.setQueryData<IMessage[]>(
				["chatMessages", conversationId],
				(old = []) => {
					if (old.some((item) => item._id === message._id)) return old;
					return [...old, message];
				},
			);

			queryClient.setQueryData<IConversation[]>(["conversations"], (old = []) => {
				const index = old.findIndex((item) => item._id === conversationId);
				if (index === -1 && conversation) return [conversation, ...old];

				const next = [...old];
				if (conversation) next[index] = conversation;
				return next.sort(
					(a, b) =>
						new Date(b.lastMessageAt || 0).getTime() -
						new Date(a.lastMessageAt || 0).getTime(),
				);
			});
		});

		socket.on("message:delivered", (data: MessageDeliveredPayload) => {
			queryClient.setQueryData<IMessage[]>(
				["chatMessages", data.conversationId],
				(old = []) =>
					old.map((message) =>
						message._id === data.messageId
							? { ...message, deliveredAt: data.deliveredAt }
							: message,
					),
			);
		});

		socket.on("message:read", (data: MessageReadPayload) => {
			queryClient.setQueryData<IMessage[]>(
				["chatMessages", data.conversationId],
				(old = []) =>
					old.map((message) =>
						message._id === data.messageId
							? { ...message, readAt: data.readAt }
							: message,
					),
			);
		});

		return () => {
			socket.disconnect();
		};
	}, [queryClient]);
}
