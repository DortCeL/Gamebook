import { Link } from "react-router";
import type { IAuthor, IConversation } from "../../types";
import { Avatar } from "~/components/Avatar";
import { useFriends } from "~/hooks/useFriends";
import { useConversations } from "~/hooks/useChat";

function getLastMessagePreview(
	friendId: string,
	conversations: IConversation[],
) {
	const conversation = conversations.find((item) =>
		item.participants.some((participant) => participant._id === friendId),
	);
	return conversation?.lastMessage?.content ?? "";
}

export default function ChatFriendList({
	activeFriendId,
}: {
	activeFriendId?: string;
}) {
	const { data: friends = [], isLoading: loadingFriends } = useFriends();
	const { data: conversations = [], isLoading: loadingConversations } =
		useConversations();

	if (loadingFriends || loadingConversations) {
		return <p className="text-sm text-gray-500 p-4">Loading friends...</p>;
	}

	if (friends.length === 0) {
		return (
			<p className="text-sm text-gray-500 p-4">
				No friends yet. Add friends from a profile page.
			</p>
		);
	}

	return (
		<div className="divide-y divide-gray-100">
			{friends.map(({ friend }: { friend: IAuthor }) => {
				const isActive = friend._id === activeFriendId;
				const preview = getLastMessagePreview(friend._id, conversations);

				return (
					<Link
						key={friend._id}
						to={`/chat/${friend._id}`}
						className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
							isActive ? "bg-indigo-50 border-l-4 border-indigo-600" : ""
						}`}
					>
						<Avatar
							src={friend.avatarUrl}
							alt={friend.name}
							fallback={friend.name}
							size="md"
						/>
						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{friend.name}
							</p>
							<p className="text-xs text-gray-500 truncate">
								{preview || "No messages yet"}
							</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
