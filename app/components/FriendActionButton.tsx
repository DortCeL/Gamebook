import {
	useAcceptFriendRequest,
	useDeclineFriendRequest,
	useFriendshipStatus,
	useRemoveFriendship,
	useSendFriendRequest,
} from "~/hooks/useFriends";

// a button to add or remove a friend
export default function FriendActionButton({
	targetUserId,
}: {
	targetUserId: string;
}) {
	const { status, friendshipId } = useFriendshipStatus(targetUserId);
	const { mutate: sendRequest, isPending: sending } = useSendFriendRequest();
	const { mutate: acceptRequest, isPending: accepting } =
		useAcceptFriendRequest();
	const { mutate: declineRequest, isPending: declining } =
		useDeclineFriendRequest();
	const { mutate: removeFriendship, isPending: removing } =
		useRemoveFriendship();

	// if the user is already friends with the target user, show the remove friend button
	if (status === "friends") {
		return (
			<div className="flex gap-2">
				<span className="btn-secondary cursor-default">Already Friends</span>
				{friendshipId && (
					<button
						type="button"
						disabled={removing}
						onClick={() => removeFriendship(friendshipId)}
						className="btn-ghost btn-sm"
					>
						{removing ? "..." : "Unfriend"}
					</button>
				)}
			</div>
		);
	}

	// if the user has sent a friend request to the target user, show the cancel button
	if (status === "sent") {
		return (
			<div className="flex gap-2">
				<span className="btn-secondary cursor-default">Request Pending</span>
				{friendshipId && (
					<button
						type="button"
						disabled={removing}
						onClick={() => removeFriendship(friendshipId)}
						className="btn-ghost btn-sm"
					>
						{removing ? "..." : "Cancel"}
					</button>
				)}
			</div>
		);
	}

	// if the user has received a friend request from the target user, show the accept and decline buttons
	if (status === "incoming" && friendshipId) {
		return (
			<div className="flex gap-2">
				<button
					type="button"
					disabled={accepting}
					onClick={() => acceptRequest(friendshipId)}
					className="btn-primary btn-sm"
				>
					{accepting ? "..." : "Accept"}
				</button>
				<button
					type="button"
					disabled={declining}
					onClick={() => declineRequest(friendshipId)}
					className="btn-secondary btn-sm"
				>
					{declining ? "..." : "Decline"}
				</button>
			</div>
		);
	}

	// if the user has not sent a friend request to the target user, show the add friend button
	return (
		<button
			type="button"
			disabled={sending}
			onClick={() => sendRequest(targetUserId)}
			className="btn-primary"
		>
			{sending ? "..." : "Add Friend"}
		</button>
	);
}
