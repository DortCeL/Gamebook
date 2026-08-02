import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IConversation, IMessage } from "../../types";
import { conversationApi } from "~/api";

export function useConversations() {
	return useQuery<IConversation[]>({
		queryKey: ["conversations"],
		queryFn: () => conversationApi.list(),
	});
}

export function useChatMessages(conversationId: string) {
	return useQuery<IMessage[]>({
		queryKey: ["chatMessages", conversationId],
		queryFn: () => conversationApi.getMessages(conversationId),
		enabled: !!conversationId,
	});
}

export function useStartConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (recipientId: string) => conversationApi.create(recipientId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
	});
}

export function useSendChatMessage(conversationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) =>
			conversationApi.sendMessage(conversationId, content),
		onSuccess: (message) => {
			queryClient.setQueryData<IMessage[]>(
				["chatMessages", conversationId],
				(old = []) => {
					if (old.some((item) => item._id === message._id)) return old;
					return [...old, message];
				},
			);
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		},
	});
}

export function useMarkChatRead() {
	return useMutation({
		mutationFn: (conversationId: string) =>
			conversationApi.markRead(conversationId),
	});
}
