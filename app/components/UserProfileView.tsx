import { useState } from "react";
import { Link } from "react-router";
import type { IProfile, IUpdateProfile } from "../../types";
import EditProfileModal from "~/components/EditProfileModal";
import FriendActionButton from "~/components/FriendActionButton";
import FriendshipPanel from "~/components/FriendshipPanel";
import PostCard from "~/components/PostCard";
import { Avatar } from "~/components/Avatar";
import { useUserPosts } from "~/hooks/usePosts";

interface UserProfileViewProps {
	profile: IProfile;
	isOwnProfile: boolean;
	onUpdateProfile?: (
		variables: { targetId: string; payload: IUpdateProfile },
		options?: { onSuccess?: () => void },
	) => void;
	isUpdating?: boolean;
}

// a component to display the posts of a specific user
function UserPosts({ userId }: { userId: string }) {
	const { data: posts, isLoading, error } = useUserPosts(userId);

	return (
		<div className="mt-6">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">Posts</h2>
			{isLoading && <p className="text-sm text-gray-500">Loading posts...</p>}
			{error && (
				<p className="text-sm text-red-600">{(error as Error).message}</p>
			)}
			<div className="space-y-3">
				{posts?.map((post) => (
					<PostCard key={post._id} post={post} />
				))}
				{posts?.length === 0 && !isLoading && (
					<p className="text-sm text-gray-500">No posts yet.</p>
				)}
			</div>
		</div>
	);
}

// a component to display the profile of a specific user
export default function UserProfileView({
	profile,
	isOwnProfile,
	onUpdateProfile,
	isUpdating = false,
}: UserProfileViewProps) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { user, stats } = profile;

	return (
		<div className="max-w-3xl mx-auto">
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="h-32 bg-linear-to-r from-blue-500 to-purple-600" />

				<div className="px-6 pb-6 -mt-12">
					<div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
						<Avatar
							src={user.avatarUrl}
							alt={user.name}
							fallback={user.name}
							size="xl"
							className="border-4 border-white shadow-md"
						/>
						<div className="flex-1 text-center sm:text-left">
							<h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
							<p className="text-gray-600">@{user.gamertag}</p>
							<div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{user.role}
								</span>
								{user.bio && (
									<span className="text-sm text-gray-500">{user.bio}</span>
								)}
							</div>
						</div>
						{isOwnProfile ? (
							<button
								type="button"
								onClick={() => setIsEditModalOpen(true)}
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
							>
								Edit Profile
							</button>
						) : (
							<FriendActionButton targetUserId={user._id} />
						)}
					</div>
				</div>

				<div className="border-t border-gray-100 px-6 py-4">
					<div className="flex flex-wrap items-center gap-6">
						<div>
							<p className="text-sm text-gray-500">Total Posts</p>
							<p className="text-xl font-semibold text-gray-900">
								{stats?.totalPosts ?? 0}
							</p>
						</div>
						{isOwnProfile && user.email && (
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="text-sm text-gray-700">{user.email}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* display the posts of the user */}
			<UserPosts userId={user._id} />

			{/* display the friendships of the user */}
			{isOwnProfile && <FriendshipPanel />}

			<div className="mt-6 text-center">
				<Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
					← Back to home
				</Link>
			</div>

			{/* display the edit profile modal */}
			{isOwnProfile && onUpdateProfile && (
				<EditProfileModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					profile={profile}
					onUpdate={(variables) => {
						onUpdateProfile?.(variables, {
							onSuccess: () => setIsEditModalOpen(false),
						});
					}}
					isUpdating={isUpdating}
					userId={user._id}
				/>
			)}
		</div>
	);
}
