import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import ChatBox from "~/components/ChatBox";
import { useAuth } from "~/context/AuthContext";
import type { User } from "../../types";
import { userApi } from "~/api";

export default function ChatPage() {
	const { user } = useAuth();
	const [friends, setFriends] = useState<User[]>([]);
	const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

	useEffect(() => {
		async function load() {
			if (!user) return;
			const res = await userApi.getProfile(user._id);
			setFriends(res.data.user.friends || []);
		}
		load();
	}, [user]);

	return (
		<>
			<Navbar />
			<div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-4 py-4 px-4">
				{/* friends list */}
				<div className="w-full md:w-60 shrink-0 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white">
					<p className="font-semibold mb-3">Your friends</p>
					{friends.length === 0 && (
						<p className="text-sm text-gray-500">No friends yet.</p>
					)}
					{friends.map((friend) => (
						<button
							key={friend._id}
							type="button"
							onClick={() => setSelectedFriend(friend)}
							className={`block w-full text-left text-sm py-1.5 hover:text-green-400 ${
								selectedFriend?._id === friend._id
									? "text-green-400"
									: "text-gray-200"
							}`}
						>
							{friend.name}
						</button>
					))}
				</div>

				{/* chat panel — stays on this page */}
				<div
					id="chatbox"
					className="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-white overflow-hidden"
				>
					{selectedFriend ? (
						<ChatBox friendId={selectedFriend._id} />
					) : (
						<p className="p-6 text-gray-400">
							Click on a friend to start a chat
						</p>
					)}
				</div>
			</div>
		</>
	);
}
