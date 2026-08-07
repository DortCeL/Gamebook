import { useEffect, useRef, useState } from "react";
import { Avatar } from "~/components/Avatar";
import {
	useChatMessages,
	useMarkChatRead,
	useSendChatMessage,
} from "~/hooks/useChat";
import {
	getMessageStatus,
	getUserId,
	groupMessagesBySender,
} from "~/utils/chatHelpers";
import { timeAgo } from "~/utils/timeFormatter";

export default function ChatWindow({
	conversationId,
	currentUserId,
	otherUser,
}: {
	conversationId: string;
	currentUserId: string;
	otherUser: { _id: string; name?: string; gamertag?: string; avatarUrl?: string };
}) {
	const { data: messages = [], isLoading, error } = useChatMessages(conversationId);
	const { mutate: sendMessage, isPending } = useSendChatMessage(conversationId);
	const { mutate: markRead } = useMarkChatRead();
	const [text, setText] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	const groups = groupMessagesBySender(messages);

	useEffect(() => {
		if (conversationId) markRead(conversationId);
	}, [conversationId, markRead]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		sendMessage(text.trim(), {
			onSuccess: () => setText(""),
		});
	};

	return (
		<div className="flex h-full flex-col min-h-[500px]">
			<div className="border-b border-gray-200 px-4 py-3">
				<p className="text-sm font-semibold text-gray-900">
					{otherUser.name}
				</p>
				{otherUser.gamertag && (
					<p className="text-xs text-gray-500">@{otherUser.gamertag}</p>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
				{isLoading && (
					<p className="text-sm text-gray-500">Loading messages...</p>
				)}
				{error && (
					<p className="text-sm text-red-600">{(error as Error).message}</p>
				)}

				{groups.map((group) => (
					<div key={`${group.senderId}-${group.messages[0]._id}`} className="flex gap-3">
						<Avatar
							src={group.sender.avatarUrl}
							alt={group.sender.name}
							fallback={group.sender.name}
							size="md"
						/>

						<div className="min-w-0 flex-1">
							<div className="flex items-baseline gap-2 mb-1">
								<span className="text-sm font-semibold text-gray-900">
									{group.sender.name}
								</span>
								<span className="text-xs text-gray-400">
									{timeAgo(group.messages[0].createdAt)}
								</span>
							</div>

							<div className="space-y-1">
								{group.messages.map((message) => {
									const status =
										getUserId(message.sender) === currentUserId
											? getMessageStatus(message)
											: null;

									return (
										<p
											key={message._id}
											className="text-sm text-gray-800 whitespace-pre-wrap break-words"
										>
											{message.content}
											{status && (
												<span className="text-xs text-gray-400 ml-2">
													{status}
												</span>
											)}
										</p>
									);
								})}
							</div>
						</div>
					</div>
				))}

				{!isLoading && messages.length === 0 && (
					<p className="text-sm text-gray-500 text-center py-8">
						No messages yet. Say hello!
					</p>
				)}

				<div ref={bottomRef} />
			</div>

			<form
				onSubmit={handleSubmit}
				className="border-t border-gray-200 bg-white p-4 flex gap-2"
			>
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder={`Message ${otherUser.name}`}
					className="flex-1"
				/>
				<button type="submit" disabled={isPending} className="btn-primary">
					{isPending ? "..." : "Send"}
				</button>
			</form>
		</div>
	);
}
