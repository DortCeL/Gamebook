import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
	friendRequestApi,
	postApi,
	userApi,
} from "~/api";
import { useAuth } from "~/context/AuthContext";
import FriendSidebar from "~/components/FriendSidebar";
import PostCard from "~/components/PostCard";
import type { FriendRequest, Post, ProfileData } from "../../types";

export default function ProfilePage({ profileUserId }: { profileUserId: string }) {
	const { user } = useAuth();
	const location = useLocation();
	const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [incoming, setIncoming] = useState<FriendRequest[]>([]);
	const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [friendStatus, setFriendStatus] = useState<
		"none" | "friends" | "sent" | "incoming"
	>("none");
	const [incomingRequestId, setIncomingRequestId] = useState<string | null>(
		null,
	);

	const isOwnProfile = user?._id === profileUserId;

	// load profile data on mount
	useEffect(() => {
		async function load() {
			setLoading(true);
			try {
				const [profileRes, postsRes] = await Promise.all([
					userApi.getProfile(profileUserId),
					postApi.getByUser(profileUserId),
				]);
				setProfile(profileRes.data);
				setPosts(postsRes.data);

				const friends = profileRes.data.user.friends || [];

				if (user && !isOwnProfile) {
					const isFriend = friends.some((f) => f._id === user._id);
					if (isFriend) {
						setFriendStatus("friends");
					} else {
						const [inc, out] = await Promise.all([
							friendRequestApi.incoming(),
							friendRequestApi.outgoing(),
						]);
						setIncoming(inc.data);
						setOutgoing(out.data);

						const fromThem = inc.data.find(
							(r) => r.from._id === profileUserId,
						);
						const fromMe = out.data.find((r) => r.to._id === profileUserId);

						if (fromThem) {
							setFriendStatus("incoming");
							setIncomingRequestId(fromThem._id);
						} else if (fromMe) {
							setFriendStatus("sent");
						}
					}
				} else if (user && isOwnProfile) {
					const inc = await friendRequestApi.incoming();
					setIncoming(inc.data);
				}
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [profileUserId, user?._id, isOwnProfile]);

	async function sendRequest() {
		await friendRequestApi.send(profileUserId);
		setFriendStatus("sent");
	}

	async function acceptRequest() {
		if (!incomingRequestId) return;
		await friendRequestApi.accept(incomingRequestId);
		setFriendStatus("friends");
		window.location.reload();
	}

	if (loading) {
		return <p className="text-gray-400 p-8">Loading profile...</p>;
	}

	if (!profile) {
		return <p className="text-gray-400 p-8">User not found.</p>;
	}

	const friends = profile.user.friends || [];

	return (
		<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_240px] gap-6">
			<div>
				<div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-2xl">
							{profile.user.name[0]}
						</div>
						<div>
							<h1 className="text-xl font-bold">{profile.user.name}</h1>
							<p className="text-gray-400">@{profile.user.gamertag}</p>
							<p className="text-sm text-gray-500 mt-1">
								{profile.postCount} posts
							</p>
						</div>
					</div>

					{/* friend actions when viewing someone else */}
					{!isOwnProfile && (
						<div className="mt-4">
							{!user && (
								<Link to={loginUrl} className="text-green-400 hover:underline">
									Log in to add friend
								</Link>
							)}
							{user && friendStatus === "none" && (
								<button
									type="button"
									onClick={sendRequest}
									className="bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-500"
								>
									Add Friend
								</button>
							)}
							{user && friendStatus === "sent" && (
								<span className="text-yellow-400 text-sm">
									Awaiting confirmation
								</span>
							)}
							{user && friendStatus === "incoming" && (
								<button
									type="button"
									onClick={acceptRequest}
									className="bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-500"
								>
									Accept Request
								</button>
							)}
							{user && friendStatus === "friends" && (
								<div className="flex gap-2">
									<span className="text-green-400 text-sm">Friends</span>
									<Link
										to={`/chat/${profileUserId}`}
										className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
									>
										Message
									</Link>
								</div>
							)}
						</div>
					)}

					{/* incoming requests on own profile */}
					{isOwnProfile && incoming.length > 0 && (
						<div className="mt-4 border-t border-gray-700 pt-4">
							<p className="text-sm font-medium text-yellow-400 mb-2">
								Friend Requests
							</p>
							{incoming.map((req) => (
								<div
									key={req._id}
									className="flex items-center justify-between text-sm mb-2"
								>
									<span>
										{req.from.name} (@{req.from.gamertag})
									</span>
									<button
										type="button"
										onClick={async () => {
											await friendRequestApi.accept(req._id);
											window.location.reload();
										}}
										className="bg-green-600 px-2 py-1 rounded text-xs"
									>
										Accept
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<h2 className="text-lg font-semibold mb-3">Posts</h2>
				<div className="space-y-4">
					{posts.map((post) => (
						<PostCard key={post._id} post={post} />
					))}
					{posts.length === 0 && (
						<p className="text-gray-500 text-sm">No posts yet.</p>
					)}
				</div>
			</div>

			<FriendSidebar friends={friends} />
		</div>
	);
}
