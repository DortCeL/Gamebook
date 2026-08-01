import { Link } from "react-router";
import { Avatar } from "~/components/Avatar";
import {
	useAcceptFriendRequest,
	useDeclineFriendRequest,
	useFriends,
	useIncomingFriendRequests,
	useRemoveFriendship,
	useSentFriendRequests,
} from "~/hooks/useFriends";
import { timeAgo } from "~/utils/timeFormatter";

// a panel to display the friendships of the current user
export default function FriendshipPanel() {
	const { data: friends = [], isLoading: loadingFriends } = useFriends();
	const { data: incoming = [], isLoading: loadingIncoming } =
		useIncomingFriendRequests();
	const { data: sent = [], isLoading: loadingSent } = useSentFriendRequests();
	const { mutate: acceptRequest, isPending: accepting } =
		useAcceptFriendRequest();
	const { mutate: declineRequest, isPending: declining } =
		useDeclineFriendRequest();
	const { mutate: removeFriendship, isPending: removing } =
		useRemoveFriendship();

	// display the friendships of the current user
	return (
		<div className="mt-6 space-y-6">
			{/* display the incoming friend requests of the current user */}
			<section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="px-5 py-4 border-b border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900">
						Incoming Requests
						{incoming.length > 0 && (
							<span className="ml-2 text-sm font-normal text-gray-500">
								({incoming.length})
							</span>
						)}
					</h2>
				</div>
				<div className="p-5 space-y-3">
					{loadingIncoming && (
						<p className="text-sm text-gray-500">Loading requests...</p>
					)}
					{!loadingIncoming && incoming.length === 0 && (
						<p className="text-sm text-gray-500">No incoming friend requests.</p>
					)}
					{incoming.map((request) => (
						<div
							key={request._id}
							className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
						>
							<Link
								to={`/users/${request.requester._id}`}
								className="flex items-center gap-3 min-w-0 hover:opacity-80"
							>
								<Avatar
									src={request.requester.avatarUrl}
									alt={request.requester.name}
									fallback={request.requester.name}
									size="sm"
								/>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{request.requester.name}
									</p>
									<p className="text-xs text-gray-500">
										@{request.requester.gamertag} · {timeAgo(request.createdAt)}
									</p>
								</div>
							</Link>
							<div className="flex gap-2 shrink-0">
								<button
									type="button"
									disabled={accepting}
									onClick={() => acceptRequest(request._id)}
									className="btn-primary btn-sm"
								>
									Accept
								</button>
								<button
									type="button"
									disabled={declining}
									onClick={() => declineRequest(request._id)}
									className="btn-secondary btn-sm"
								>
									Decline
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* display the sent friend requests of the current user */}
			<section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="px-5 py-4 border-b border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900">
						Sent Requests
						{sent.length > 0 && (
							<span className="ml-2 text-sm font-normal text-gray-500">
								({sent.length})
							</span>
						)}
					</h2>
				</div>
				<div className="p-5 space-y-3">
					{loadingSent && (
						<p className="text-sm text-gray-500">Loading sent requests...</p>
					)}
					{!loadingSent && sent.length === 0 && (
						<p className="text-sm text-gray-500">No sent friend requests.</p>
					)}
					{sent.map((request) => (
						<div
							key={request._id}
							className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
						>
							<Link
								to={`/users/${request.recipient._id}`}
								className="flex items-center gap-3 min-w-0 hover:opacity-80"
							>
								<Avatar
									src={request.recipient.avatarUrl}
									alt={request.recipient.name}
									fallback={request.recipient.name}
									size="sm"
								/>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{request.recipient.name}
									</p>
									<p className="text-xs text-gray-500">
										@{request.recipient.gamertag} · Request Sent ·{" "}
										{timeAgo(request.createdAt)}
									</p>
								</div>
							</Link>
							<button
								type="button"
								disabled={removing}
								onClick={() => removeFriendship(request._id)}
								className="btn-ghost btn-sm shrink-0"
							>
								Cancel
							</button>
						</div>
					))}
				</div>
			</section>

			{/* display the friends of the current user */}
			<section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<div className="px-5 py-4 border-b border-gray-100">
					<h2 className="text-lg font-semibold text-gray-900">
						Friends
						{friends.length > 0 && (
							<span className="ml-2 text-sm font-normal text-gray-500">
								({friends.length})
							</span>
						)}
					</h2>
				</div>
				<div className="p-5 space-y-3">
					{loadingFriends && (
						<p className="text-sm text-gray-500">Loading friends...</p>
					)}
					{!loadingFriends && friends.length === 0 && (
						<p className="text-sm text-gray-500">No friends yet.</p>
					)}
					{friends.map((entry) => (
						<div
							key={entry._id}
							className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
						>
							<Link
								to={`/users/${entry.friend._id}`}
								className="flex items-center gap-3 min-w-0 hover:opacity-80"
							>
								<Avatar
									src={entry.friend.avatarUrl}
									alt={entry.friend.name}
									fallback={entry.friend.name}
									size="sm"
								/>
								<div className="min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{entry.friend.name}
									</p>
									<p className="text-xs text-gray-500">
										@{entry.friend.gamertag} · Friends since{" "}
										{timeAgo(entry.since)}
									</p>
								</div>
							</Link>
							<button
								type="button"
								disabled={removing}
								onClick={() => removeFriendship(entry._id)}
								className="btn-ghost btn-sm shrink-0"
							>
								Unfriend
							</button>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
