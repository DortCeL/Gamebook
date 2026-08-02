import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import ChatFriendList from "~/components/ChatFriendList";
import ChatWindow from "~/components/ChatWindow";
import Navbar from "~/components/Navbar";
import { useStartConversation } from "~/hooks/useChat";
import { useChatSocket } from "~/hooks/useChatSocket";
import { useFriends } from "~/hooks/useFriends";
import { useProfile } from "~/hooks/useProfile";

export default function ChatPage() {
	const { friendId } = useParams();
	const { data: profile } = useProfile();
	const { data: friends = [] } = useFriends();
	const { mutate: startConversation } = useStartConversation();
	const [conversationId, setConversationId] = useState<string | null>(null);

	const currentUserId = profile?.user?._id ?? "";
	const activeFriend = friends.find((entry) => entry.friend._id === friendId);

	useChatSocket();

	useEffect(() => {
		if (!friendId || !currentUserId) {
			setConversationId(null);
			return;
		}

		startConversation(friendId, {
			onSuccess: (conversation) => setConversationId(conversation._id),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [friendId, currentUserId]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<main className="max-w-5xl mx-auto px-4 py-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>

				<div className="grid grid-cols-1 md:grid-cols-[280px_1fr] rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[560px]">
					<aside className="border-r border-gray-200 overflow-y-auto">
						<ChatFriendList activeFriendId={friendId} />
					</aside>

					<section className="flex flex-col">
						{friendId && activeFriend && conversationId ? (
							<ChatWindow
								conversationId={conversationId}
								currentUserId={currentUserId}
								otherUser={activeFriend.friend}
							/>
						) : (
							<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center min-h-[500px]">
								<p className="text-gray-500">
									Select a friend to start chatting.
								</p>
								{friends[0] && (
									<Link
										to={`/chat/${friends[0].friend._id}`}
										className="btn-secondary"
									>
										Open first friend
									</Link>
								)}
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}
