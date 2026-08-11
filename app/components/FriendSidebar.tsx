import { Link } from "react-router";
import type { User } from "../../types";

export default function FriendSidebar({ friends }: { friends: User[] }) {
	return (
		<div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
			<h3 className="font-semibold text-green-400 mb-3">Friends</h3>
			{friends.length === 0 && (
				<p className="text-sm text-gray-500">No friends yet.</p>
			)}
			<ul className="space-y-2">
				{friends.map((friend) => (
					<li key={friend._id}>
						<Link
							to={`/profile/${friend._id}`}
							className="text-sm text-gray-200 hover:text-green-400"
						>
							{friend.name}{" "}
							<span className="text-gray-500">@{friend.gamertag}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
